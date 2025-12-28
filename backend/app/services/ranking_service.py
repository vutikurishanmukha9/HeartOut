"""
Ranking service with Gravity Sort algorithm (Hacker News style).

Consolidates ranking from multiple complex algorithms to a single 
SQL-optimized query that balances Recency vs Engagement.

Formula: score = points / (age_hours + 2) ^ gravity
- points = save_count + support_count + (view_count / 10)
- age_hours = hours since published
- gravity = 1.8 (decay factor)
"""
from datetime import datetime, timezone
from sqlalchemy import desc, func, case
from sqlalchemy.orm import joinedload
from app.extensions import db
from app.models import Post, PostStatus, StoryType, Support, Bookmark, ReadProgress
from app.utils.cache import cache


class RankingService:
    """
    Unified ranking service using Gravity Sort algorithm.
    
    Balances Recency vs Engagement with a single SQL-optimized query.
    Industry-standard approach used by Hacker News, Reddit, etc.
    """
    
    # Gravity decay factor (higher = faster decay for old content)
    GRAVITY = 1.8
    
    # Special handling for privacy-sensitive categories
    RANDOM_CATEGORIES = {StoryType.UNSENT_LETTER}
    
    @classmethod
    def get_ranked_stories(cls, story_type=None, page=1, per_page=20, user_id=None):
        """
        Get stories ranked using Gravity Sort algorithm.
        
        Args:
            story_type: StoryType enum or string (optional filter)
            page: Page number
            per_page: Items per page
            user_id: Optional user ID (for future personalization)
            
        Returns:
            Paginated query result with ranked stories
        """
        # Convert string to enum if needed
        if isinstance(story_type, str):
            try:
                story_type = StoryType(story_type)
            except ValueError:
                story_type = None
        
        # Base query with eager loading
        query = Post.query.options(
            joinedload(Post.author)
        ).filter_by(status=PostStatus.PUBLISHED)
        
        # Filter by story type if specified
        if story_type:
            query = query.filter_by(story_type=story_type)
        
        # Apply ranking
        if story_type in cls.RANDOM_CATEGORIES:
            # Unsent Letters: Pure random for privacy
            query = cls._apply_random_ranking(query)
        else:
            # All other categories: Gravity Sort
            query = cls._apply_gravity_ranking(query)
        
        return query.paginate(page=page, per_page=per_page, error_out=False)
    
    @classmethod
    def _apply_gravity_ranking(cls, query):
        """
        Apply Gravity Sort ranking (Hacker News style).
        
        Formula: score = points / (age_hours + 2) ^ gravity
        
        This balances:
        - Recency: New content gets visibility
        - Engagement: Popular content stays visible longer
        """
        now = datetime.now(timezone.utc)
        
        # Calculate age in hours
        age_hours = func.extract('epoch', now - Post.published_at) / 3600
        
        # Calculate engagement points
        # Subquery for support count
        support_subq = db.session.query(
            Support.post_id,
            func.count(Support.id).label('support_count')
        ).group_by(Support.post_id).subquery()
        
        query = query.outerjoin(support_subq, Post.id == support_subq.c.post_id)
        
        # Points = saves + reactions + (views / 10)
        support_count = func.coalesce(support_subq.c.support_count, 0)
        points = (
            Post.save_count + 
            support_count + 
            (Post.view_count / 10.0)
        )
        
        # Gravity Sort score
        # Adding small constant to points prevents division issues for new posts
        gravity_score = (points + 1) / func.pow(age_hours + 2, cls.GRAVITY)
        
        return query.order_by(desc(gravity_score), desc(Post.published_at))
    
    @classmethod
    def _apply_random_ranking(cls, query):
        """
        Apply random ranking for privacy-sensitive categories.
        Used for Unsent Letters to prevent virality pressure.
        """
        return query.order_by(func.random())
    
    @classmethod
    def update_story_metrics(cls, story_id, user_id=None, scroll_depth=None, time_spent=None):
        """
        Update engagement metrics for a story based on user interaction.
        
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
                # Returning reader
                existing_progress.read_count += 1
                existing_progress.last_read = datetime.now(timezone.utc)
                story.reread_count += 1
                
                if scroll_depth:
                    existing_progress.scroll_depth = max(
                        existing_progress.scroll_depth, scroll_depth
                    )
                
                if time_spent:
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
            
            # Update completion rate
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
            db.session.delete(existing)
            story.save_count = max(0, story.save_count - 1)
            is_bookmarked = False
        else:
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
        """Get all bookmarked stories for a user with eager loading"""
        return Post.query.options(
            joinedload(Post.author)
        ).join(Bookmark).filter(
            Bookmark.user_id == user_id,
            Post.status == PostStatus.PUBLISHED
        ).order_by(desc(Bookmark.created_at)).paginate(
            page=page, per_page=per_page, error_out=False
        )
    
    @classmethod
    def invalidate_feed_cache(cls):
        """Invalidate feed cache when stories are created/updated/deleted"""
        cache.clear_pattern('feed:*')

