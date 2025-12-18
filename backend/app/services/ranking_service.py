"""Ranking service with category-specific algorithms for story ranking"""
from datetime import datetime, timezone, timedelta
from sqlalchemy import desc, func, case
from sqlalchemy.orm import joinedload
from app.extensions import db
from app.models import Post, PostStatus, StoryType, Support, Bookmark, ReadProgress
import math
import random


class RankingService:
    """
    Category-aware ranking using weighted formulas based on:
    - Resonance: How emotionally relevant the content is
    - Reaction: User engagement signals (saves, completions, etc.)
    - Recency: Time decay factors
    
    Golden Rule: Never use pure popularity ranking.
    Always rank by: resonance > reaction > recency
    """
    
    # Category-specific ranking weights
    CATEGORY_WEIGHTS = {
        StoryType.ACHIEVEMENT: {
            'name': 'Learning-to-Rank Style',
            'save_weight': 0.30,        # Saves indicate high value
            'completion_weight': 0.30,   # Finished reading = quality
            'view_weight': 0.15,         # Views matter but less
            'reaction_weight': 0.15,     # Positive reactions
            'freshness_weight': 0.10,    # Mild freshness preference
            'decay_days': 30,            # Slow decay
        },
        StoryType.REGRET: {
            'name': 'Emotion-Similarity Style',
            'save_weight': 0.10,         # Low - avoid popularity bias
            'completion_weight': 0.35,   # High - emotional resonance
            'view_weight': 0.05,         # Minimal view weight
            'reaction_weight': 0.10,     # Low comment weight
            'freshness_weight': 0.10,    # Time doesn't matter much
            'reread_weight': 0.30,       # Re-reads signal deep connection
            'decay_days': 90,            # Very slow decay
        },
        StoryType.UNSENT_LETTER: {
            'name': 'Pure Semantic (Random)',
            # Zero virality - pure chronological or random
            'use_random': True,
            'save_weight': 0.0,
            'completion_weight': 0.0,
            'view_weight': 0.0,
            'reaction_weight': 0.0,
            'freshness_weight': 1.0,     # Only freshness matters
            'decay_days': 7,             # Fresh content preferred
        },
        StoryType.SACRIFICE: {
            'name': 'Hybrid Ranker',
            'save_weight': 0.35,         # Saves = long-term value
            'completion_weight': 0.25,   # Quality reading
            'view_weight': 0.05,         # Low view weight
            'reaction_weight': 0.15,     # Emotion match
            'reread_weight': 0.15,       # Re-reads important
            'freshness_weight': 0.05,    # Gentle time decay
            'decay_days': 60,
        },
        StoryType.LIFE_STORY: {
            'name': 'Completion-Optimized',
            'save_weight': 0.20,         # Bookmarking
            'completion_weight': 0.40,   # Scroll depth, completion %
            'view_weight': 0.10,         # Session time proxy
            'reaction_weight': 0.15,     # Quality signals
            'freshness_weight': 0.15,
            'decay_days': 45,
        },
        StoryType.OTHER: {
            'name': 'Exploration-Based (Multi-Armed Bandit)',
            'use_exploration': True,
            'save_weight': 0.20,
            'completion_weight': 0.20,
            'view_weight': 0.20,
            'reaction_weight': 0.20,
            'freshness_weight': 0.20,
            'decay_days': 14,
            'exploration_rate': 0.3,     # 30% random exploration
        },
    }
    
    # Default weights for unknown categories
    DEFAULT_WEIGHTS = {
        'save_weight': 0.25,
        'completion_weight': 0.25,
        'view_weight': 0.15,
        'reaction_weight': 0.20,
        'freshness_weight': 0.15,
        'decay_days': 30,
    }
    
    @classmethod
    def get_ranked_stories(cls, story_type=None, page=1, per_page=20, user_id=None):
        """
        Get stories ranked using category-specific algorithms.
        
        Args:
            story_type: StoryType enum or string
            page: Page number
            per_page: Items per page
            user_id: Optional user ID for personalization
            
        Returns:
            Paginated query result with ranked stories
        """
        # Convert string to enum if needed
        if isinstance(story_type, str):
            try:
                story_type = StoryType(story_type)
            except ValueError:
                story_type = None
        
        # Get weights for this category
        weights = cls.CATEGORY_WEIGHTS.get(story_type, cls.DEFAULT_WEIGHTS)
        
        # Base query with eager loading
        query = Post.query.options(
            joinedload(Post.author)
        ).filter_by(status=PostStatus.PUBLISHED)
        
        # Filter by story type if specified
        if story_type:
            query = query.filter_by(story_type=story_type)
        
        # Apply category-specific ranking
        if weights.get('use_random'):
            # Unsent Letters: Pure random/chronological for privacy
            query = cls._apply_random_ranking(query)
        elif weights.get('use_exploration'):
            # Other: Multi-armed bandit exploration
            query = cls._apply_exploration_ranking(query, weights)
        else:
            # Standard weighted ranking
            query = cls._apply_weighted_ranking(query, weights)
        
        return query.paginate(page=page, per_page=per_page, error_out=False)
    
    @classmethod
    def _apply_weighted_ranking(cls, query, weights):
        """Apply weighted ranking formula to query"""
        now = datetime.now(timezone.utc)
        decay_days = weights.get('decay_days', 30)
        
        # Calculate component scores using SQL expressions
        # Freshness score: exponential decay based on age
        freshness_score = case(
            (Post.published_at.isnot(None),
             func.exp(-func.extract('epoch', now - Post.published_at) / (decay_days * 86400))),
            else_=0.0
        )
        
        # Normalize metrics to 0-1 range using logarithmic scaling
        # This prevents stories with massive view counts from dominating
        
        # View score (log normalized)
        view_score = case(
            (Post.view_count > 0, func.log(Post.view_count + 1) / 10),
            else_=0.0
        )
        
        # Save score (log normalized)
        save_score = case(
            (Post.save_count > 0, func.log(Post.save_count + 1) / 5),
            else_=0.0
        )
        
        # Completion score (already 0-1)
        completion_score = Post.completion_rate
        
        # Reaction score (support count, log normalized)
        reaction_subq = db.session.query(
            Support.post_id,
            func.count(Support.id).label('support_count')
        ).group_by(Support.post_id).subquery()
        
        query = query.outerjoin(reaction_subq, Post.id == reaction_subq.c.post_id)
        
        reaction_score = case(
            (reaction_subq.c.support_count.isnot(None),
             func.log(reaction_subq.c.support_count + 1) / 5),
            else_=0.0
        )
        
        # Reread score (if applicable)
        reread_score = case(
            (Post.reread_count > 0, func.log(Post.reread_count + 1) / 3),
            else_=0.0
        )
        
        # Combine scores with weights
        total_score = (
            weights.get('save_weight', 0) * save_score +
            weights.get('completion_weight', 0) * completion_score +
            weights.get('view_weight', 0) * view_score +
            weights.get('reaction_weight', 0) * reaction_score +
            weights.get('freshness_weight', 0) * freshness_score +
            weights.get('reread_weight', 0) * reread_score
        )
        
        # Order by total score descending
        return query.order_by(desc(total_score), desc(Post.published_at))
    
    @classmethod
    def _apply_random_ranking(cls, query):
        """
        Apply random ranking for sensitive categories like Unsent Letters.
        This ensures zero virality pressure and maximum privacy.
        """
        # Use database's random function for true randomness
        # Combined with mild recency preference
        return query.order_by(func.random())
    
    @classmethod
    def _apply_exploration_ranking(cls, query, weights):
        """
        Apply exploration-based ranking (Multi-Armed Bandit style).
        Mixes exploitation (ranked results) with exploration (random discovery).
        """
        exploration_rate = weights.get('exploration_rate', 0.3)
        
        # For exploration: we can't truly mix in SQL, so we apply
        # partial randomness by adding a random factor to the score
        now = datetime.now(timezone.utc)
        decay_days = weights.get('decay_days', 14)
        
        freshness_score = case(
            (Post.published_at.isnot(None),
             func.exp(-func.extract('epoch', now - Post.published_at) / (decay_days * 86400))),
            else_=0.0
        )
        
        # Add randomness to help discover new content
        # Less-viewed content gets a boost
        exploration_boost = case(
            (Post.view_count < 10, 0.5),  # New content boost
            (Post.view_count < 50, 0.2),  # Medium boost
            else_=0.0
        )
        
        score = freshness_score + exploration_boost + (func.random() * exploration_rate)
        
        return query.order_by(desc(score))
    
    @classmethod
    def update_story_metrics(cls, story_id, user_id=None, scroll_depth=None, time_spent=None):
        """
        Update engagement metrics for a story based on user interaction.
        Called when user reads a story.
        
        Args:
            story_id: Post public_id
            user_id: User internal id (optional)
            scroll_depth: 0.0-1.0 how far user scrolled
            time_spent: Seconds spent on page
        """
        story = Post.query.filter_by(public_id=story_id).first()
        if not story:
            return False
        
        # Update view count
        story.view_count += 1
        
        if user_id:
            # Track unique readers
            existing_progress = ReadProgress.query.filter_by(
                user_id=user_id,
                post_id=story.id
            ).first()
            
            if existing_progress:
                # Returning reader - update metrics
                existing_progress.read_count += 1
                existing_progress.last_read = datetime.now(timezone.utc)
                story.reread_count += 1
                
                if scroll_depth:
                    # Update scroll depth if higher
                    existing_progress.scroll_depth = max(
                        existing_progress.scroll_depth, scroll_depth
                    )
                
                if time_spent:
                    # Average the time spent
                    existing_progress.time_spent = (
                        existing_progress.time_spent + time_spent
                    ) // 2
                
                if scroll_depth and scroll_depth >= 0.9:
                    existing_progress.completed = True
            else:
                # New reader
                story.unique_readers += 1
                
                progress = ReadProgress(
                    user_id=user_id,
                    post_id=story.id,
                    scroll_depth=scroll_depth or 0.0,
                    time_spent=time_spent or 0,
                    completed=(scroll_depth or 0) >= 0.9
                )
                db.session.add(progress)
            
            # Update story's average completion rate
            cls._update_completion_rate(story)
        
        db.session.commit()
        return True
    
    @classmethod
    def _update_completion_rate(cls, story):
        """Recalculate story's average completion rate from ReadProgress"""
        avg_completion = db.session.query(
            func.avg(ReadProgress.scroll_depth)
        ).filter_by(post_id=story.id).scalar()
        
        story.completion_rate = avg_completion or 0.0
    
    @classmethod
    def toggle_bookmark(cls, story_id, user_id):
        """
        Toggle bookmark status for a story.
        Returns (is_bookmarked, total_saves)
        """
        story = Post.query.filter_by(public_id=story_id).first()
        if not story:
            return None, 0
        
        existing = Bookmark.query.filter_by(
            user_id=user_id,
            post_id=story.id
        ).first()
        
        if existing:
            # Remove bookmark
            db.session.delete(existing)
            story.save_count = max(0, story.save_count - 1)
            is_bookmarked = False
        else:
            # Add bookmark
            bookmark = Bookmark(user_id=user_id, post_id=story.id)
            db.session.add(bookmark)
            story.save_count += 1
            is_bookmarked = True
        
        db.session.commit()
        return is_bookmarked, story.save_count
    
    @classmethod
    def is_bookmarked(cls, story_id, user_id):
        """Check if a story is bookmarked by user"""
        story = Post.query.filter_by(public_id=story_id).first()
        if not story:
            return False
        
        return Bookmark.query.filter_by(
            user_id=user_id,
            post_id=story.id
        ).first() is not None
    
    @classmethod
    def get_user_bookmarks(cls, user_id, page=1, per_page=20):
        """Get all bookmarked stories for a user"""
        return Post.query.join(Bookmark).filter(
            Bookmark.user_id == user_id,
            Post.status == PostStatus.PUBLISHED
        ).order_by(desc(Bookmark.created_at)).paginate(
            page=page, per_page=per_page, error_out=False
        )
