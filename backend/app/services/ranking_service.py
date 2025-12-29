"""
Async Ranking Service with Gravity Sort algorithm (Hacker News style).
FastAPI version of Flask ranking_service.

Formula: score = points / (age_hours + 2) ^ gravity
- points = save_count + support_count + (view_count / 10)
- age_hours = hours since published
- gravity = 1.8 (decay factor)
"""
from datetime import datetime, timezone
from typing import Optional, Tuple, List, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func
from sqlalchemy.orm import selectinload

from app.models.models import Post, Support, Bookmark, ReadProgress, PostStatus, StoryType


class RankingService:
    """
    Unified ranking service using Gravity Sort algorithm.
    Balances Recency vs Engagement with SQL-optimized queries.
    Industry-standard approach used by Hacker News, Reddit, etc.
    """
    
    # Gravity decay factor (higher = faster decay for old content)
    GRAVITY = 1.8
    
    # Special handling for privacy-sensitive categories
    RANDOM_CATEGORIES = {StoryType.UNSENT_LETTER}
    
    @classmethod
    async def get_ranked_stories(
        cls,
        db: AsyncSession,
        story_type: Optional[str] = None,
        page: int = 1,
        per_page: int = 20,
        user_id: Optional[int] = None
    ) -> dict:
        """
        Get stories ranked using Gravity Sort algorithm.
        
        Args:
            db: Async database session
            story_type: StoryType string (optional filter)
            page: Page number
            per_page: Items per page
            user_id: Optional user ID (for future personalization)
            
        Returns:
            Dict with stories, pagination info, and algorithm used
        """
        # Build base query with eager loading
        query = select(Post).options(selectinload(Post.author)).where(
            Post.status == PostStatus.PUBLISHED.value
        )
        
        # Filter by story type if specified
        if story_type:
            query = query.where(Post.story_type == story_type)
        
        # Apply ranking based on category
        if story_type and story_type == StoryType.UNSENT_LETTER.value:
            # Unsent Letters: Pure random for privacy
            query = query.order_by(func.random())
            algorithm = "random"
        else:
            # All other categories: Gravity Sort
            query = cls._apply_gravity_ranking(query)
            algorithm = "gravity"
        
        # Count total
        count_query = select(func.count()).select_from(Post).where(
            Post.status == PostStatus.PUBLISHED.value
        )
        if story_type:
            count_query = count_query.where(Post.story_type == story_type)
        
        total_result = await db.execute(count_query)
        total = total_result.scalar() or 0
        
        # Paginate
        offset = (page - 1) * per_page
        query = query.offset(offset).limit(per_page)
        
        result = await db.execute(query)
        stories = result.scalars().all()
        
        total_pages = (total + per_page - 1) // per_page
        
        return {
            "stories": [s.to_dict() for s in stories],
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1,
            "ranking_algorithm": algorithm
        }
    
    @classmethod
    def _apply_gravity_ranking(cls, query):
        """
        Apply Gravity Sort ranking (Hacker News style).
        
        Formula: score = points / (age_hours + 2) ^ gravity
        
        This balances:
        - Recency: New content gets visibility
        - Engagement: Popular content stays visible longer
        """
        # Order by rank_score (pre-calculated) with fallback to published_at
        return query.order_by(desc(Post.rank_score), desc(Post.published_at))
    
    @classmethod
    async def update_story_metrics(
        cls,
        db: AsyncSession,
        story_id: str,
        user_id: Optional[int] = None,
        scroll_depth: Optional[float] = None,
        time_spent: Optional[int] = None
    ) -> bool:
        """
        Update engagement metrics for a story based on user interaction.
        
        Args:
            db: Async database session
            story_id: Post public_id
            user_id: User internal id (optional)
            scroll_depth: 0.0-1.0 how far user scrolled
            time_spent: Seconds spent on page
        """
        # Find story
        result = await db.execute(select(Post).where(Post.public_id == story_id))
        story = result.scalar_one_or_none()
        
        if not story:
            return False
        
        # Update view count
        story.view_count += 1
        
        if user_id:
            # Track reading progress
            progress_result = await db.execute(
                select(ReadProgress).where(
                    ReadProgress.user_id == user_id,
                    ReadProgress.post_id == story.id
                )
            )
            existing_progress = progress_result.scalar_one_or_none()
            
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
                db.add(progress)
            
            # Update completion rate
            await cls._update_completion_rate(db, story)
        
        await db.commit()
        return True
    
    @classmethod
    async def _update_completion_rate(cls, db: AsyncSession, story: Post):
        """Recalculate story's average completion rate from ReadProgress"""
        result = await db.execute(
            select(func.avg(ReadProgress.scroll_depth)).where(
                ReadProgress.post_id == story.id
            )
        )
        avg_completion = result.scalar()
        story.completion_rate = avg_completion or 0.0
    
    @classmethod
    async def toggle_bookmark(
        cls,
        db: AsyncSession,
        story_id: str,
        user_id: int
    ) -> Tuple[Optional[bool], int]:
        """
        Toggle bookmark status for a story.
        Returns (is_bookmarked, total_saves)
        """
        # Find story
        result = await db.execute(select(Post).where(Post.public_id == story_id))
        story = result.scalar_one_or_none()
        
        if not story:
            return None, 0
        
        # Check existing bookmark
        bookmark_result = await db.execute(
            select(Bookmark).where(
                Bookmark.user_id == user_id,
                Bookmark.post_id == story.id
            )
        )
        existing = bookmark_result.scalar_one_or_none()
        
        if existing:
            await db.delete(existing)
            story.save_count = max(0, (story.save_count or 0) - 1)
            is_bookmarked = False
        else:
            bookmark = Bookmark(user_id=user_id, post_id=story.id)
            db.add(bookmark)
            story.save_count = (story.save_count or 0) + 1
            is_bookmarked = True
        
        await db.commit()
        return is_bookmarked, story.save_count
    
    @classmethod
    async def is_bookmarked(
        cls,
        db: AsyncSession,
        story_id: str,
        user_id: int
    ) -> bool:
        """Check if a story is bookmarked by user"""
        # Find story
        result = await db.execute(select(Post).where(Post.public_id == story_id))
        story = result.scalar_one_or_none()
        
        if not story:
            return False
        
        # Check bookmark
        bookmark_result = await db.execute(
            select(Bookmark).where(
                Bookmark.user_id == user_id,
                Bookmark.post_id == story.id
            )
        )
        return bookmark_result.scalar_one_or_none() is not None
    
    @classmethod
    async def get_user_bookmarks(
        cls,
        db: AsyncSession,
        user_id: int,
        page: int = 1,
        per_page: int = 20
    ) -> dict:
        """Get all bookmarked stories for a user with eager loading"""
        query = select(Post).options(selectinload(Post.author)).join(Bookmark).where(
            Bookmark.user_id == user_id,
            Post.status == PostStatus.PUBLISHED.value
        ).order_by(desc(Bookmark.created_at))
        
        # Count
        count_query = select(func.count()).select_from(Post).join(Bookmark).where(
            Bookmark.user_id == user_id,
            Post.status == PostStatus.PUBLISHED.value
        )
        total_result = await db.execute(count_query)
        total = total_result.scalar() or 0
        
        # Paginate
        offset = (page - 1) * per_page
        query = query.offset(offset).limit(per_page)
        
        result = await db.execute(query)
        stories = result.scalars().all()
        
        return {
            "stories": [s.to_dict() for s in stories],
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": (total + per_page - 1) // per_page
        }
    
    @classmethod
    async def recalculate_rank_scores(cls, db: AsyncSession):
        """Batch recalculate all story rank scores (for cron job)"""
        now = datetime.now(timezone.utc)
        
        # Get all published posts
        result = await db.execute(
            select(Post).where(Post.status == PostStatus.PUBLISHED.value)
        )
        stories = result.scalars().all()
        
        for story in stories:
            # Calculate points
            points = (
                (story.save_count or 0) + 
                (story.support_count or 0) + 
                ((story.view_count or 0) / 10.0)
            )
            
            # Calculate age in hours
            if story.published_at:
                age_hours = (now - story.published_at).total_seconds() / 3600
            else:
                age_hours = 0
            
            # Calculate gravity score
            story.rank_score = (points + 1) / pow(age_hours + 2, cls.GRAVITY)
            story.last_ranked_at = now
        
        await db.commit()
