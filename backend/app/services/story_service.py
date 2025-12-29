"""
Async Story Service for FastAPI
Complete migration of Flask story_service with CRUD, reactions, stats
"""
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func, or_
from sqlalchemy.orm import selectinload

from app.models.models import (
    Post, User, Comment, Support, PostStatus, StoryType
)


def calculate_reading_time(content: str) -> int:
    """Calculate reading time in minutes based on word count"""
    words = len(content.split())
    return max(1, words // 225)  # 225 words per minute average


class StoryService:
    """Async service class for story-related business logic"""
    
    @staticmethod
    async def create_story(
        db: AsyncSession,
        user: User,
        data: Dict[str, Any]
    ) -> Post:
        """Create a new story with the given data"""
        reading_time = calculate_reading_time(data['content'])
        
        story = Post(
            title=data['title'],
            content=data['content'],
            story_type=data.get('story_type', 'other'),
            is_anonymous=data.get('is_anonymous', True),
            tags=data.get('tags', []),
            status=data.get('status', 'draft'),
            reading_time=reading_time,
            user_id=user.id
        )
        
        if story.status == PostStatus.PUBLISHED.value:
            story.published_at = datetime.now(timezone.utc)
        
        db.add(story)
        await db.commit()
        await db.refresh(story)
        
        return story
    
    @staticmethod
    async def get_story_by_id(
        db: AsyncSession,
        story_id: str,
        user: Optional[User] = None
    ) -> Optional[Post]:
        """Get a story by its public ID with eager loading"""
        result = await db.execute(
            select(Post).options(
                selectinload(Post.author),
                selectinload(Post.supports),
                selectinload(Post.comments)
            ).where(Post.public_id == story_id)
        )
        story = result.scalar_one_or_none()
        
        if not story:
            return None
        
        # Only allow author to view unpublished stories
        if story.status != PostStatus.PUBLISHED.value:
            if not user or story.user_id != user.id:
                return None
        
        return story
    
    @staticmethod
    async def get_stories(
        db: AsyncSession,
        filters: Optional[Dict] = None,
        page: int = 1,
        per_page: int = 20,
        sort_by: str = 'latest'
    ) -> Dict[str, Any]:
        """Get paginated list of published stories with optional filtering"""
        query = select(Post).options(
            selectinload(Post.author)
        ).where(Post.status == PostStatus.PUBLISHED.value)
        
        if filters:
            if filters.get('story_type'):
                query = query.where(Post.story_type == filters['story_type'])
            
            if filters.get('user_id'):
                # Find user by public_id
                user_result = await db.execute(
                    select(User).where(User.public_id == filters['user_id'])
                )
                user = user_result.scalar_one_or_none()
                if user:
                    query = query.where(Post.user_id == user.id)
            
            if filters.get('is_featured'):
                query = query.where(Post.is_featured == True)
        
        # Apply sorting
        if sort_by == 'trending':
            query = query.order_by(desc(Post.support_count), desc(Post.published_at))
        elif sort_by == 'most_viewed':
            query = query.order_by(desc(Post.view_count))
        elif sort_by == 'smart':
            query = query.order_by(desc(Post.rank_score), desc(Post.published_at))
        else:  # latest
            query = query.order_by(desc(Post.published_at))
        
        # Count total
        count_query = select(func.count()).select_from(Post).where(
            Post.status == PostStatus.PUBLISHED.value
        )
        if filters and filters.get('story_type'):
            count_query = count_query.where(Post.story_type == filters['story_type'])
        
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
            "has_prev": page > 1
        }
    
    @staticmethod
    async def get_user_drafts(
        db: AsyncSession,
        user: User,
        page: int = 1,
        per_page: int = 20
    ) -> Dict[str, Any]:
        """Get paginated list of user's draft stories"""
        query = select(Post).where(
            Post.user_id == user.id,
            Post.status == PostStatus.DRAFT.value
        ).order_by(desc(Post.updated_at))
        
        # Count
        count_query = select(func.count()).select_from(Post).where(
            Post.user_id == user.id,
            Post.status == PostStatus.DRAFT.value
        )
        total_result = await db.execute(count_query)
        total = total_result.scalar() or 0
        
        # Paginate
        offset = (page - 1) * per_page
        query = query.offset(offset).limit(per_page)
        
        result = await db.execute(query)
        drafts = result.scalars().all()
        
        return {
            "drafts": [d.to_dict() for d in drafts],
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": (total + per_page - 1) // per_page
        }
    
    @staticmethod
    async def search_stories(
        db: AsyncSession,
        query_text: str,
        page: int = 1,
        per_page: int = 20
    ) -> Dict[str, Any]:
        """Search stories by title or content"""
        if not query_text or len(query_text) < 2:
            return {"error": "Search query must be at least 2 characters"}
        
        search_pattern = f"%{query_text}%"
        
        query = select(Post).options(selectinload(Post.author)).where(
            Post.status == PostStatus.PUBLISHED.value,
            or_(
                Post.title.ilike(search_pattern),
                Post.content.ilike(search_pattern)
            )
        ).order_by(desc(Post.published_at))
        
        # Count
        count_query = select(func.count()).select_from(Post).where(
            Post.status == PostStatus.PUBLISHED.value,
            or_(
                Post.title.ilike(search_pattern),
                Post.content.ilike(search_pattern)
            )
        )
        total_result = await db.execute(count_query)
        total = total_result.scalar() or 0
        
        # Paginate
        offset = (page - 1) * per_page
        query = query.offset(offset).limit(per_page)
        
        result = await db.execute(query)
        stories = result.scalars().all()
        
        return {
            "results": [s.to_dict() for s in stories],
            "query": query_text,
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": (total + per_page - 1) // per_page
        }
    
    @staticmethod
    async def update_story(
        db: AsyncSession,
        story: Post,
        user: User,
        data: Dict[str, Any]
    ) -> Optional[Post]:
        """Update a story"""
        if story.user_id != user.id:
            return None
        
        # Update fields
        if 'title' in data:
            story.title = data['title']
        if 'content' in data:
            story.content = data['content']
            story.reading_time = calculate_reading_time(data['content'])
        if 'story_type' in data:
            story.story_type = data['story_type']
        if 'is_anonymous' in data:
            story.is_anonymous = data['is_anonymous']
        if 'tags' in data:
            story.tags = data['tags']
        
        # Handle status change
        if 'status' in data:
            new_status = data['status']
            if new_status == PostStatus.PUBLISHED.value and story.status != PostStatus.PUBLISHED.value:
                story.published_at = datetime.now(timezone.utc)
            story.status = new_status
        
        story.updated_at = datetime.now(timezone.utc)
        await db.commit()
        await db.refresh(story)
        
        return story
    
    @staticmethod
    async def delete_story(
        db: AsyncSession,
        story: Post,
        user: User
    ) -> bool:
        """Delete a story"""
        if story.user_id != user.id:
            return False
        
        await db.delete(story)
        await db.commit()
        return True
    
    @staticmethod
    async def increment_view_count(
        db: AsyncSession,
        story: Post
    ):
        """Increment the view count of a story"""
        story.view_count += 1
        await db.commit()
    
    @staticmethod
    async def toggle_reaction(
        db: AsyncSession,
        story: Post,
        user: User,
        support_type: str = 'heart',
        message: Optional[str] = None
    ) -> Dict[str, Any]:
        """Toggle a reaction on a story - each user can only have ONE reaction per story"""
        # Check if user already has a reaction on this story
        result = await db.execute(
            select(Support).where(
                Support.giver_id == user.id,
                Support.post_id == story.id
            )
        )
        existing = result.scalar_one_or_none()
        
        if existing:
            if existing.support_type == support_type:
                # Same reaction type - remove it (toggle off)
                await db.delete(existing)
                current_count = story.support_count or 0
                story.support_count = max(0, current_count - 1)
                await db.commit()
                return {
                    'action': 'removed',
                    'support_count': story.support_count,
                    'user_reaction': None
                }
            else:
                # Different reaction type - update it (count stays same)
                existing.support_type = support_type
                existing.message = message
                await db.commit()
                return {
                    'action': 'changed',
                    'support_count': story.support_count,
                    'user_reaction': support_type
                }
        else:
            # No existing reaction - add new one
            reaction = Support(
                support_type=support_type,
                message=message,
                giver_id=user.id,
                receiver_id=story.user_id,
                post_id=story.id
            )
            db.add(reaction)
            story.support_count = (story.support_count or 0) + 1
            await db.commit()
            return {
                'action': 'added',
                'support_count': story.support_count,
                'user_reaction': support_type
            }
    
    @staticmethod
    async def get_user_reaction(
        db: AsyncSession,
        story: Post,
        user: User
    ) -> Optional[str]:
        """Get user's current reaction type on a story"""
        result = await db.execute(
            select(Support).where(
                Support.giver_id == user.id,
                Support.post_id == story.id
            )
        )
        reaction = result.scalar_one_or_none()
        return reaction.support_type if reaction else None
    
    @staticmethod
    async def get_user_stats(
        db: AsyncSession,
        user: User
    ) -> Dict[str, Any]:
        """Get statistics for a user"""
        # Published count
        published_result = await db.execute(
            select(func.count()).select_from(Post).where(
                Post.user_id == user.id,
                Post.status == PostStatus.PUBLISHED.value
            )
        )
        published_count = published_result.scalar() or 0
        
        # Draft count
        draft_result = await db.execute(
            select(func.count()).select_from(Post).where(
                Post.user_id == user.id,
                Post.status == PostStatus.DRAFT.value
            )
        )
        draft_count = draft_result.scalar() or 0
        
        # Total views
        views_result = await db.execute(
            select(func.sum(Post.view_count)).where(
                Post.user_id == user.id,
                Post.status == PostStatus.PUBLISHED.value
            )
        )
        total_views = views_result.scalar() or 0
        
        # Total reactions received
        reactions_result = await db.execute(
            select(func.count()).select_from(Support).where(
                Support.receiver_id == user.id
            )
        )
        total_reactions = reactions_result.scalar() or 0
        
        # Total comments on user's stories
        comments_result = await db.execute(
            select(func.count()).select_from(Comment).join(Post).where(
                Post.user_id == user.id
            )
        )
        total_comments = comments_result.scalar() or 0
        
        return {
            'total_stories': published_count,
            'total_drafts': draft_count,
            'total_views': total_views,
            'total_reactions': total_reactions,
            'total_comments': total_comments,
            'member_since': user.created_at.isoformat() if user.created_at else None
        }
    
    @staticmethod
    async def get_featured_stories(
        db: AsyncSession,
        limit: int = 10
    ) -> List[Dict]:
        """Get featured stories"""
        result = await db.execute(
            select(Post).options(selectinload(Post.author)).where(
                Post.status == PostStatus.PUBLISHED.value,
                Post.is_featured == True
            ).order_by(desc(Post.featured_at)).limit(limit)
        )
        stories = result.scalars().all()
        return [s.to_dict() for s in stories]
    
    @staticmethod
    async def add_comment(
        db: AsyncSession,
        story: Post,
        user: User,
        content: str,
        is_anonymous: bool = True,
        parent_id: Optional[int] = None
    ) -> Comment:
        """Add a comment to a story"""
        comment = Comment(
            content=content,
            is_anonymous=is_anonymous,
            user_id=user.id,
            post_id=story.id,
            parent_id=parent_id
        )
        db.add(comment)
        
        # Update comment count
        story.comment_count = (story.comment_count or 0) + 1
        
        await db.commit()
        await db.refresh(comment)
        return comment
    
    @staticmethod
    async def get_comments(
        db: AsyncSession,
        story: Post,
        page: int = 1,
        per_page: int = 50
    ) -> Dict[str, Any]:
        """Get comments for a story"""
        query = select(Comment).options(
            selectinload(Comment.author),
            selectinload(Comment.replies)
        ).where(
            Comment.post_id == story.id,
            Comment.parent_id == None
        ).order_by(Comment.created_at)
        
        # Count
        count_result = await db.execute(
            select(func.count()).select_from(Comment).where(
                Comment.post_id == story.id,
                Comment.parent_id == None
            )
        )
        total = count_result.scalar() or 0
        
        # Paginate
        offset = (page - 1) * per_page
        query = query.offset(offset).limit(per_page)
        
        result = await db.execute(query)
        comments = result.scalars().all()
        
        return {
            "comments": [c.to_dict() for c in comments],
            "total": total,
            "page": page,
            "per_page": per_page
        }
