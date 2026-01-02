"""
FastAPI Posts/Stories Routes
Refactored to use StoryService and common dependencies
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func, or_
from sqlalchemy.orm import selectinload
from datetime import datetime
from typing import Optional, List

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.exceptions import NotFoundError, ForbiddenError, ValidationError
from app.api.dependencies import (
    get_story_or_404, get_published_story_or_404, 
    PaginationDep, Pagination, DbSession
)
from app.models.models import User, Post, Comment, Support, Bookmark, ReadProgress, PostStatus, StoryType
from app.schemas.posts import (
    PostCreate, PostUpdate, PostResponse, PostListResponse,
    CommentCreate, CommentResponse, SupportCreate, SupportResponse,
    BookmarkResponse, ReadProgressUpdate
)
from app.services.story_service import StoryService, calculate_reading_time
from app.api.v1.websockets import notify_reaction, notify_comment


router = APIRouter()


# ========== STORY CRUD ==========

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_story(
    post_data: PostCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new story"""
    # Create post
    post = Post(
        title=post_data.title,
        content=post_data.content,
        story_type=post_data.story_type,
        is_anonymous=post_data.is_anonymous,
        tags=post_data.tags,
        status=post_data.status,
        reading_time=calculate_reading_time(post_data.content),
        user_id=current_user.id
    )
    
    # Set published_at if publishing
    if post_data.status == 'published':
        post.published_at = datetime.utcnow()
    
    db.add(post)
    await db.commit()
    await db.refresh(post)
    
    return {"message": "Story created successfully", "story": post.to_dict()}


@router.get("")
async def get_stories(
    story_type: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    sort_by: str = Query("smart"),
    db: AsyncSession = Depends(get_db)
):
    """Get list of published stories with optional filtering and smart ranking"""
    # Base query with eager loading
    query = select(Post).options(selectinload(Post.author)).where(
        Post.status == PostStatus.PUBLISHED.value
    )
    
    # Filter by story type
    if story_type:
        query = query.where(Post.story_type == story_type)
    
    # Apply sorting
    if sort_by == 'latest':
        query = query.order_by(desc(Post.published_at))
    elif sort_by == 'most_viewed':
        query = query.order_by(desc(Post.view_count))
    elif sort_by == 'trending':
        query = query.order_by(desc(Post.support_count), desc(Post.published_at))
    else:  # smart/gravity sort
        # Simple gravity sort for now
        query = query.order_by(desc(Post.rank_score), desc(Post.published_at))
    
    # Count total
    count_query = select(func.count()).select_from(Post).where(Post.status == PostStatus.PUBLISHED.value)
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
        "next_page": page + 1 if page < total_pages else None,
        "prev_page": page - 1 if page > 1 else None,
        "ranking_algorithm": sort_by
    }


@router.get("/featured")
async def get_featured_stories(db: AsyncSession = Depends(get_db)):
    """Get featured stories"""
    query = select(Post).options(selectinload(Post.author)).where(
        Post.status == PostStatus.PUBLISHED.value,
        Post.is_featured == True
    ).order_by(desc(Post.featured_at)).limit(10)
    
    result = await db.execute(query)
    stories = result.scalars().all()
    
    return {"featured_stories": [s.to_dict() for s in stories]}


@router.get("/drafts")
async def get_user_drafts(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user's draft stories"""
    query = select(Post).where(
        Post.user_id == current_user.id,
        Post.status == PostStatus.DRAFT.value
    ).order_by(desc(Post.updated_at))
    
    # Count
    count_query = select(func.count()).select_from(Post).where(
        Post.user_id == current_user.id,
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


# ========== BOOKMARKS (must be before /{story_id} route) ==========

@router.get("/bookmarks")
async def get_bookmarked_stories(
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all stories bookmarked by the current user"""
    offset = (page - 1) * per_page
    
    # Query bookmarks with joined posts
    query = select(Post).options(selectinload(Post.author)).join(Bookmark).where(
        Bookmark.user_id == current_user.id,
        Post.status == PostStatus.PUBLISHED.value
    )
    
    # Calculate total count before pagination
    count_query = select(func.count()).select_from(Post).join(Bookmark).where(
        Bookmark.user_id == current_user.id,
        Post.status == PostStatus.PUBLISHED.value
    )
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0
    
    # Apply pagination and ordering
    query = query.order_by(desc(Bookmark.created_at)).offset(offset).limit(per_page)
    
    # Execute query
    result = await db.execute(query)
    posts = result.scalars().all()
    
    return {
        "items": [post.to_dict() for post in posts],
        "total": total,
        "page": page,
        "size": per_page,
        "pages": (total + per_page - 1) // per_page if total > 0 else 0
    }


@router.get("/search")
async def search_stories(
    q: str = Query(..., min_length=2),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Search stories by title or content"""
    search_term = f"%{q}%"
    
    query = select(Post).options(selectinload(Post.author)).where(
        Post.status == PostStatus.PUBLISHED.value,
        or_(
            Post.title.ilike(search_term),
            Post.content.ilike(search_term)
        )
    ).order_by(desc(Post.published_at))
    
    # Count
    count_query = select(func.count()).select_from(Post).where(
        Post.status == PostStatus.PUBLISHED.value,
        or_(
            Post.title.ilike(search_term),
            Post.content.ilike(search_term)
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
        "query": q,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page
    }


@router.get("/category/{story_type}")
async def get_stories_by_category(
    story_type: str,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get stories filtered by category"""
    # Validate story type
    valid_types = [st.value for st in StoryType]
    if story_type not in valid_types:
        raise HTTPException(status_code=400, detail="Invalid story type")
    
    query = select(Post).options(selectinload(Post.author)).where(
        Post.status == PostStatus.PUBLISHED.value,
        Post.story_type == story_type
    ).order_by(desc(Post.published_at))
    
    # Count
    count_query = select(func.count()).select_from(Post).where(
        Post.status == PostStatus.PUBLISHED.value,
        Post.story_type == story_type
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
        "category": story_type,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page
    }



@router.get("/user/{user_id}/stories")
async def get_user_stories(
    user_id: str,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get all published stories by a specific user"""
    # Find user
    user_result = await db.execute(select(User).where(User.public_id == user_id))
    user = user_result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    query = select(Post).where(
        Post.user_id == user.id,
        Post.status == PostStatus.PUBLISHED.value,
        Post.is_anonymous == False
    ).order_by(desc(Post.published_at))
    
    # Count
    count_query = select(func.count()).select_from(Post).where(
        Post.user_id == user.id,
        Post.status == PostStatus.PUBLISHED.value,
        Post.is_anonymous == False
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
        "author": {
            "id": user.public_id,
            "username": user.username,
            "display_name": user.display_name,
            "author_bio": user.author_bio,
            "is_featured_author": user.is_featured_author
        },
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page
    }


@router.get("/{story_id}")
async def get_story(
    story_id: str,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Get a single story by ID and increment view count"""
    from app.core.security import get_current_user_optional
    
    query = select(Post).options(selectinload(Post.author)).where(Post.public_id == story_id)
    result = await db.execute(query)
    story = result.scalar_one_or_none()
    
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    # For non-published stories, only the author can view (for drafts)
    if story.status != PostStatus.PUBLISHED.value:
        # Try to get current user from JWT (if token provided)
        authorization = request.headers.get("Authorization")
        current_user = await get_current_user_optional(db, authorization)
        if not current_user or story.user_id != current_user.id:
            raise HTTPException(status_code=404, detail="Story not found")
        # Don't increment view count for drafts
        return {"story": story.to_dict()}
    
    # Increment view count only for published stories
    story.view_count += 1
    await db.commit()
    
    return {"story": story.to_dict()}


@router.put("/{story_id}")
async def update_story(
    story_id: str,
    post_data: PostCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a story (only by author)"""
    # Get story or 404
    story = await get_story_or_404(story_id, db, include_author=False)
    
    # Check ownership
    if story.user_id != current_user.id:
        raise ForbiddenError("You can only edit your own stories")
    
    # Update fields
    story.title = post_data.title
    story.content = post_data.content
    story.story_type = post_data.story_type
    story.is_anonymous = post_data.is_anonymous
    story.tags = post_data.tags
    story.status = post_data.status
    story.reading_time = calculate_reading_time(post_data.content)
    story.updated_at = datetime.utcnow()
    
    # Set published_at if publishing for first time
    if post_data.status == 'published' and not story.published_at:
        story.published_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(story)
    
    return {"message": "Story updated successfully", "story": story.to_dict()}


@router.delete("/{story_id}")
async def delete_story(
    story_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a story (only by author)"""
    story = await get_story_or_404(story_id, db, include_author=False)
    
    if story.user_id != current_user.id:
        raise ForbiddenError("You can only delete your own stories")
    
    await db.delete(story)
    await db.commit()
    
    return {"message": "Story deleted successfully"}


# ========== COMMENTS ==========

@router.post("/{story_id}/comments", status_code=status.HTTP_201_CREATED)
async def add_comment(
    story_id: str,
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Add a comment to a story"""
    # Find story
    story_query = select(Post).where(
        Post.public_id == story_id,
        Post.status == PostStatus.PUBLISHED.value
    )
    result = await db.execute(story_query)
    story = result.scalar_one_or_none()
    
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    # Handle parent comment
    parent_id = None
    if comment_data.parent_id:
        parent_query = select(Comment).where(Comment.public_id == comment_data.parent_id)
        parent_result = await db.execute(parent_query)
        parent = parent_result.scalar_one_or_none()
        if parent and parent.post_id == story.id:
            parent_id = parent.id
    
    # Create comment
    comment = Comment(
        content=comment_data.content,
        is_anonymous=comment_data.is_anonymous,
        user_id=current_user.id,
        post_id=story.id,
        parent_id=parent_id
    )
    
    db.add(comment)
    
    # Update comment count
    story.comment_count = (story.comment_count or 0) + 1
    
    await db.commit()
    await db.refresh(comment)
    
    # Return inline dict to avoid lazy loading issues
    comment_author = {'username': 'Anonymous', 'display_name': 'Anonymous User'}
    if not comment.is_anonymous and current_user:
        comment_author = {
            'id': current_user.public_id,
            'username': current_user.username,
            'display_name': current_user.display_name
        }
    
    # Send real-time notification to story author (if not commenting on own story)
    if story.user_id != current_user.id:
        commenter_name = "Anonymous" if comment_data.is_anonymous else current_user.username
        await notify_comment(
            story_author_id=story.user_id,
            story_id=story.public_id,
            story_title=story.title,
            commenter_username=commenter_name,
            comment_preview=comment_data.content
        )
    
    return {
        "message": "Comment added successfully",
        "comment": {
            "id": comment.public_id,
            "content": comment.content,
            "is_anonymous": comment.is_anonymous,
            "created_at": comment.created_at.isoformat() if comment.created_at else None,
            "reply_count": 0,
            "author": comment_author
        }
    }


@router.get("/{story_id}/comments")
async def get_comments(
    story_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get comments for a story"""
    # Find story
    story_query = select(Post).where(
        Post.public_id == story_id,
        Post.status == PostStatus.PUBLISHED.value
    )
    result = await db.execute(story_query)
    story = result.scalar_one_or_none()
    
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    # Get top-level comments
    comments_query = select(Comment).options(
        selectinload(Comment.author),
        selectinload(Comment.replies)
    ).where(
        Comment.post_id == story.id,
        Comment.parent_id == None
    ).order_by(Comment.created_at)
    
    result = await db.execute(comments_query)
    comments = result.scalars().all()
    
    return {"comments": [c.to_dict() for c in comments], "total": len(comments)}


# ========== REACTIONS/SUPPORT ==========

@router.post("/{story_id}/react", status_code=status.HTTP_201_CREATED)
async def react_to_story(
    story_id: str,
    support_data: SupportCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Add a reaction to a story"""
    # Find story
    story_query = select(Post).where(
        Post.public_id == story_id,
        Post.status == PostStatus.PUBLISHED.value
    )
    result = await db.execute(story_query)
    story = result.scalar_one_or_none()
    
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    # Check if already reacted with this type
    existing_query = select(Support).where(
        Support.giver_id == current_user.id,
        Support.post_id == story.id,
        Support.support_type == support_data.support_type
    )
    result = await db.execute(existing_query)
    existing = result.scalar_one_or_none()
    
    if existing:
        raise HTTPException(status_code=409, detail="Already reacted with this type")
    
    # Create reaction
    reaction = Support(
        support_type=support_data.support_type,
        message=support_data.message,
        giver_id=current_user.id,
        receiver_id=story.user_id,
        post_id=story.id
    )
    
    db.add(reaction)
    
    # Update support count
    story.support_count = (story.support_count or 0) + 1
    
    await db.commit()
    await db.refresh(reaction)
    
    return {"message": "Reaction added successfully", "reaction": reaction.to_dict()}


@router.post("/{story_id}/toggle-react")
async def toggle_reaction(
    story_id: str,
    support_data: SupportCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Toggle reaction - add if not exists, remove if same type, change if different type"""
    # Find story
    story_query = select(Post).where(
        Post.public_id == story_id,
        Post.status == PostStatus.PUBLISHED.value
    )
    result = await db.execute(story_query)
    story = result.scalar_one_or_none()
    
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    # Check if user already has ANY reaction on this story
    existing_query = select(Support).where(
        Support.giver_id == current_user.id,
        Support.post_id == story.id
    )
    result = await db.execute(existing_query)
    existing = result.scalar_one_or_none()
    
    if existing:
        if existing.support_type == support_data.support_type:
            # Same reaction type - remove it (toggle off)
            await db.delete(existing)
            story.support_count = max(0, (story.support_count or 0) - 1)
            await db.commit()
            return {
                "message": "Reaction removed",
                "action": "removed",
                "support_count": story.support_count,
                "user_reaction": None
            }
        else:
            # Different reaction type - update it (count stays same)
            existing.support_type = support_data.support_type
            existing.message = support_data.message
            await db.commit()
            await db.refresh(existing)
            return {
                "message": "Reaction changed",
                "action": "changed",
                "reaction": existing.to_dict(),
                "support_count": story.support_count,
                "user_reaction": support_data.support_type
            }
    else:
        # No existing reaction - add new one
        reaction = Support(
            support_type=support_data.support_type,
            message=support_data.message,
            giver_id=current_user.id,
            receiver_id=story.user_id,
            post_id=story.id
        )
        db.add(reaction)
        story.support_count = (story.support_count or 0) + 1
        await db.commit()
        await db.refresh(reaction)
        
        # Send real-time notification to story author (if not reacting to own story)
        if story.user_id != current_user.id:
            await notify_reaction(
                story_author_id=story.user_id,
                story_id=story.public_id,
                story_title=story.title,
                reactor_username=current_user.username,
                reaction_type=support_data.support_type
            )
        
        return {
            "message": "Reaction added",
            "action": "added",
            "reaction": reaction.to_dict(),
            "support_count": story.support_count,
            "user_reaction": support_data.support_type
        }


@router.get("/{story_id}/my-reaction")
async def get_my_reaction(
    story_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user's reaction on a story"""
    # Find story
    story_query = select(Post).where(Post.public_id == story_id)
    result = await db.execute(story_query)
    story = result.scalar_one_or_none()
    
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    # Find reaction
    reaction_query = select(Support).where(
        Support.giver_id == current_user.id,
        Support.post_id == story.id
    )
    result = await db.execute(reaction_query)
    reaction = result.scalar_one_or_none()
    
    return {
        "reaction_type": reaction.support_type if reaction else None,
        "has_reacted": reaction is not None
    }



@router.post("/{story_id}/bookmark")
async def toggle_bookmark(
    story_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Toggle bookmark/save status for a story"""
    # Find story
    story_query = select(Post).where(Post.public_id == story_id)
    result = await db.execute(story_query)
    story = result.scalar_one_or_none()
    
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    # Check if already bookmarked
    bookmark_query = select(Bookmark).where(
        Bookmark.user_id == current_user.id,
        Bookmark.post_id == story.id
    )
    result = await db.execute(bookmark_query)
    existing = result.scalar_one_or_none()
    
    if existing:
        # Remove bookmark
        await db.delete(existing)
        story.save_count = max(0, (story.save_count or 0) - 1)
        is_bookmarked = False
    else:
        # Add bookmark
        bookmark = Bookmark(user_id=current_user.id, post_id=story.id)
        db.add(bookmark)
        story.save_count = (story.save_count or 0) + 1
        is_bookmarked = True
    
    await db.commit()
    
    return {
        "is_bookmarked": is_bookmarked,
        "save_count": story.save_count,
        "message": "Bookmark added" if is_bookmarked else "Bookmark removed"
    }


@router.get("/{story_id}/bookmark")
async def get_bookmark_status(
    story_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Check if story is bookmarked by current user"""
    # Find story
    story_query = select(Post).where(Post.public_id == story_id)
    result = await db.execute(story_query)
    story = result.scalar_one_or_none()
    
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    # Check bookmark
    bookmark_query = select(Bookmark).where(
        Bookmark.user_id == current_user.id,
        Bookmark.post_id == story.id
    )
    result = await db.execute(bookmark_query)
    bookmark = result.scalar_one_or_none()
    
    return {
        "is_bookmarked": bookmark is not None,
        "save_count": story.save_count or 0
    }


# ========== READ PROGRESS ==========

@router.post("/{story_id}/read-progress")
async def track_read_progress(
    story_id: str,
    progress_data: ReadProgressUpdate,
    db: AsyncSession = Depends(get_db),
    authorization: Optional[str] = Query(None, include_in_schema=False)
):
    """Track reading progress for engagement metrics (works with or without auth)"""
    from app.core.security import get_current_user_optional
    
    # Get optional current user
    current_user = await get_current_user_optional(db, authorization)
    
    # Find story
    story_query = select(Post).where(Post.public_id == story_id)
    result = await db.execute(story_query)
    story = result.scalar_one_or_none()
    
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    # Update view count
    story.view_count += 1
    
    if current_user:
        # Check existing progress
        progress_query = select(ReadProgress).where(
            ReadProgress.user_id == current_user.id,
            ReadProgress.post_id == story.id
        )
        result = await db.execute(progress_query)
        existing = result.scalar_one_or_none()
        
        if existing:
            # Update existing progress
            existing.read_count += 1
            existing.last_read = datetime.utcnow()
            story.reread_count += 1
            
            if progress_data.scroll_depth:
                existing.scroll_depth = max(existing.scroll_depth, progress_data.scroll_depth)
            if progress_data.time_spent:
                existing.time_spent = (existing.time_spent + progress_data.time_spent) // 2
            if progress_data.scroll_depth and progress_data.scroll_depth >= 0.9:
                existing.completed = True
        else:
            # Create new progress record
            story.unique_readers += 1
            progress = ReadProgress(
                user_id=current_user.id,
                post_id=story.id,
                scroll_depth=progress_data.scroll_depth or 0.0,
                time_spent=progress_data.time_spent or 0,
                completed=(progress_data.scroll_depth or 0) >= 0.9
            )
            db.add(progress)
    
    await db.commit()
    
    return {
        "message": "Progress tracked",
        "scroll_depth": progress_data.scroll_depth,
        "time_spent": progress_data.time_spent
    }

