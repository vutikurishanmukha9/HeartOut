"""
FastAPI Admin Routes
Admin and moderator endpoints for content moderation and dashboard
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func
from datetime import datetime, timezone, timedelta
from typing import Optional
from functools import wraps

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import User, Post, Comment, Support, UserRole, PostStatus


router = APIRouter()


async def get_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Dependency that requires admin or moderator role"""
    if current_user.role not in [UserRole.ADMIN.value, UserRole.MODERATOR.value]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


# ========== DASHBOARD ==========

@router.get("/dashboard")
async def get_dashboard_stats(
    days: int = Query(30, ge=1, le=365),
    admin_user: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Get admin dashboard statistics"""
    start_date = datetime.now(timezone.utc) - timedelta(days=days)
    
    # User statistics
    total_users_result = await db.execute(select(func.count()).select_from(User))
    total_users = total_users_result.scalar() or 0
    
    new_users_result = await db.execute(
        select(func.count()).select_from(User).where(User.created_at >= start_date)
    )
    new_users = new_users_result.scalar() or 0
    
    active_users_result = await db.execute(
        select(func.count()).select_from(User).where(User.is_active == True)
    )
    active_users = active_users_result.scalar() or 0
    
    # Story statistics
    total_stories_result = await db.execute(select(func.count()).select_from(Post))
    total_stories = total_stories_result.scalar() or 0
    
    published_stories_result = await db.execute(
        select(func.count()).select_from(Post).where(Post.status == PostStatus.PUBLISHED.value)
    )
    published_stories = published_stories_result.scalar() or 0
    
    flagged_stories_result = await db.execute(
        select(func.count()).select_from(Post).where(Post.flagged_count > 0)
    )
    flagged_stories = flagged_stories_result.scalar() or 0
    
    # Reaction statistics
    total_reactions_result = await db.execute(select(func.count()).select_from(Support))
    total_reactions = total_reactions_result.scalar() or 0
    
    recent_reactions_result = await db.execute(
        select(func.count()).select_from(Support).where(Support.created_at >= start_date)
    )
    recent_reactions = recent_reactions_result.scalar() or 0
    
    return {
        "users": {
            "total": total_users,
            "new": new_users,
            "active": active_users
        },
        "stories": {
            "total": total_stories,
            "published": published_stories,
            "flagged": flagged_stories
        },
        "reactions": {
            "total": total_reactions,
            "recent": recent_reactions
        },
        "period_days": days
    }


# ========== USER MANAGEMENT ==========

@router.get("/users")
async def get_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    admin_user: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Get paginated list of all users"""
    query = select(User).order_by(desc(User.created_at))
    
    # Count total
    count_result = await db.execute(select(func.count()).select_from(User))
    total = count_result.scalar() or 0
    
    # Paginate
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)
    
    result = await db.execute(query)
    users = result.scalars().all()
    
    total_pages = (total + per_page - 1) // per_page
    
    return {
        "users": [u.to_dict(include_email=True) for u in users],
        "pagination": {
            "page": page,
            "pages": total_pages,
            "per_page": per_page,
            "total": total
        }
    }


@router.get("/users/{user_id}")
async def get_user_details(
    user_id: str,
    admin_user: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Get detailed user information"""
    result = await db.execute(select(User).where(User.public_id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get user story count
    story_count_result = await db.execute(
        select(func.count()).select_from(Post).where(Post.user_id == user.id)
    )
    story_count = story_count_result.scalar() or 0
    
    # Get user reaction count
    reaction_count_result = await db.execute(
        select(func.count()).select_from(Support).where(Support.giver_id == user.id)
    )
    reaction_count = reaction_count_result.scalar() or 0
    
    return {
        "user": user.to_dict(include_email=True),
        "stats": {
            "story_count": story_count,
            "reaction_count": reaction_count
        }
    }


@router.put("/users/{user_id}/role")
async def update_user_role(
    user_id: str,
    role: str = Query(..., description="New role: user, moderator, admin"),
    admin_user: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Update user role (admin only)"""
    if admin_user.role != UserRole.ADMIN.value:
        raise HTTPException(status_code=403, detail="Only admins can change roles")
    
    valid_roles = [r.value for r in UserRole]
    if role not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {valid_roles}")
    
    result = await db.execute(select(User).where(User.public_id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.role = role
    await db.commit()
    
    return {"message": f"User role updated to {role}", "user": user.to_dict()}


@router.put("/users/{user_id}/suspend")
async def suspend_user(
    user_id: str,
    admin_user: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Suspend/activate a user account"""
    result = await db.execute(select(User).where(User.public_id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = not user.is_active
    await db.commit()
    
    status = "activated" if user.is_active else "suspended"
    return {"message": f"User {status}", "user": user.to_dict()}


# ========== CONTENT MODERATION ==========

@router.get("/posts/flagged")
async def get_flagged_posts(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    admin_user: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Get flagged posts for moderation"""
    query = select(Post).where(Post.flagged_count > 0).order_by(desc(Post.created_at))
    
    # Count total
    count_result = await db.execute(
        select(func.count()).select_from(Post).where(Post.flagged_count > 0)
    )
    total = count_result.scalar() or 0
    
    # Paginate
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)
    
    result = await db.execute(query)
    posts = result.scalars().all()
    
    return {
        "posts": [p.to_dict() for p in posts],
        "pagination": {
            "page": page,
            "pages": (total + per_page - 1) // per_page,
            "per_page": per_page,
            "total": total
        }
    }


@router.get("/posts/pending")
async def get_pending_posts(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    admin_user: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Get posts pending moderation"""
    query = select(Post).where(
        Post.status == PostStatus.PENDING.value
    ).order_by(desc(Post.created_at))
    
    # Count total
    count_result = await db.execute(
        select(func.count()).select_from(Post).where(Post.status == PostStatus.PENDING.value)
    )
    total = count_result.scalar() or 0
    
    # Paginate
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)
    
    result = await db.execute(query)
    posts = result.scalars().all()
    
    return {
        "posts": [p.to_dict() for p in posts],
        "pagination": {
            "page": page,
            "pages": (total + per_page - 1) // per_page,
            "per_page": per_page,
            "total": total
        }
    }


@router.post("/posts/{post_id}/moderate")
async def moderate_post(
    post_id: str,
    action: str = Query(..., description="Action: approve, remove, flag"),
    admin_user: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Moderate a post (approve, remove, or flag)"""
    result = await db.execute(select(Post).where(Post.public_id == post_id))
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if action == 'approve':
        post.status = PostStatus.PUBLISHED.value
        post.flagged_count = 0
        if not post.published_at:
            post.published_at = datetime.now(timezone.utc)
    elif action == 'remove':
        post.status = PostStatus.REMOVED.value
    elif action == 'flag':
        post.status = PostStatus.FLAGGED.value
    else:
        raise HTTPException(status_code=400, detail="Invalid action. Use: approve, remove, flag")
    
    await db.commit()
    await db.refresh(post)
    
    return {
        "message": f"Post {action}d successfully",
        "post": post.to_dict()
    }


@router.post("/posts/{post_id}/feature")
async def feature_post(
    post_id: str,
    admin_user: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Toggle featured status of a post"""
    result = await db.execute(select(Post).where(Post.public_id == post_id))
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    post.is_featured = not post.is_featured
    if post.is_featured:
        post.featured_at = datetime.now(timezone.utc)
    
    await db.commit()
    
    status = "featured" if post.is_featured else "unfeatured"
    return {
        "message": f"Post {status}",
        "post": post.to_dict()
    }


# ========== COMMENTS MODERATION ==========

@router.get("/comments/flagged")
async def get_flagged_comments(
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    admin_user: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Get flagged comments for moderation"""
    query = select(Comment).where(Comment.flagged_count > 0).order_by(desc(Comment.created_at))
    
    # Count total
    count_result = await db.execute(
        select(func.count()).select_from(Comment).where(Comment.flagged_count > 0)
    )
    total = count_result.scalar() or 0
    
    # Paginate
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)
    
    result = await db.execute(query)
    comments = result.scalars().all()
    
    return {
        "comments": [c.to_dict() for c in comments],
        "pagination": {
            "page": page,
            "pages": (total + per_page - 1) // per_page,
            "per_page": per_page,
            "total": total
        }
    }


@router.delete("/comments/{comment_id}")
async def delete_comment(
    comment_id: str,
    admin_user: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a comment (admin moderation)"""
    result = await db.execute(select(Comment).where(Comment.public_id == comment_id))
    comment = result.scalar_one_or_none()
    
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    await db.delete(comment)
    await db.commit()
    
    return {"message": "Comment deleted successfully"}
