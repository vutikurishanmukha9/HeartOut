"""
Common API Dependencies

Reusable dependencies for route handlers to reduce code duplication.
"""
from typing import Optional, Annotated
from fastapi import Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.exceptions import NotFoundError
from app.models.models import Post, User, PostStatus


async def get_story_or_404(
    story_id: str,
    db: AsyncSession = Depends(get_db),
    include_author: bool = True
) -> Post:
    """
    Fetch a story by public_id or raise 404.
    
    Args:
        story_id: Public ID of the story
        db: Database session
        include_author: Whether to eagerly load author relationship
    
    Returns:
        Post model instance
    
    Raises:
        NotFoundError: If story doesn't exist
    """
    query = select(Post).where(Post.public_id == story_id)
    if include_author:
        query = query.options(selectinload(Post.author))
    
    result = await db.execute(query)
    story = result.scalar_one_or_none()
    
    if not story:
        raise NotFoundError("Story")
    
    return story


async def get_published_story_or_404(
    story_id: str,
    db: AsyncSession = Depends(get_db)
) -> Post:
    """
    Fetch a published story by public_id or raise 404.
    
    Args:
        story_id: Public ID of the story
        db: Database session
    
    Returns:
        Post model instance (must be published)
    
    Raises:
        NotFoundError: If story doesn't exist or is not published
    """
    query = select(Post).options(selectinload(Post.author)).where(
        Post.public_id == story_id,
        Post.status == PostStatus.PUBLISHED.value
    )
    
    result = await db.execute(query)
    story = result.scalar_one_or_none()
    
    if not story:
        raise NotFoundError("Story")
    
    return story


async def get_user_or_404(
    user_id: str,
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Fetch a user by public_id or raise 404.
    
    Args:
        user_id: Public ID of the user
        db: Database session
    
    Returns:
        User model instance
    
    Raises:
        NotFoundError: If user doesn't exist
    """
    result = await db.execute(
        select(User).where(User.public_id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise NotFoundError("User")
    
    return user


class PaginationDep:
    """Pagination parameters dependency"""
    
    def __init__(
        self,
        page: int = Query(1, ge=1, description="Page number"),
        per_page: int = Query(20, ge=1, le=100, description="Items per page")
    ):
        self.page = page
        self.per_page = per_page
        self.offset = (page - 1) * per_page
    
    def get_pagination_info(self, total: int) -> dict:
        """Get pagination metadata"""
        total_pages = (total + self.per_page - 1) // self.per_page if total > 0 else 0
        return {
            "total": total,
            "page": self.page,
            "per_page": self.per_page,
            "total_pages": total_pages,
            "has_next": self.page < total_pages,
            "has_prev": self.page > 1,
            "next_page": self.page + 1 if self.page < total_pages else None,
            "prev_page": self.page - 1 if self.page > 1 else None
        }


# Type aliases for cleaner dependency injection
Pagination = Annotated[PaginationDep, Depends()]
DbSession = Annotated[AsyncSession, Depends(get_db)]
