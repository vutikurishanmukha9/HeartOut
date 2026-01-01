"""
FastAPI Authentication Routes
Complete migration from Flask auth blueprint
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from slowapi import Limiter
from slowapi.util import get_remote_address
from datetime import datetime, timezone
from typing import Optional

from app.core.database import get_db
from app.core.security import (
    get_password_hash, verify_password, create_access_token, 
    create_refresh_token, get_current_user, decode_token, validate_password
)
from app.models.models import User, TokenBlocklist, PostStatus
from app.schemas.auth import (
    UserRegistration, UserLogin, TokenResponse, ProfileUpdate, 
    UserResponse, PasswordChange, RefreshToken, DeleteAccount
)


router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


# JWT blocklist (in-memory for quick checks)
jwt_blocklist = set()


def get_password_requirements() -> dict:
    """Get password requirements for user feedback"""
    return {
        "min_length": 8,
        "require_uppercase": True,
        "require_lowercase": True,
        "require_digit": True,
        "require_special": True,
        "special_chars": "!@#$%^&*()_+-=[]{}|;:,.<>?"
    }


# Health check
@router.get("/health")
async def health_check():
    """Health check endpoint for deployment platforms"""
    return {
        "status": "healthy",
        "service": "heartout-api",
        "version": "3.0.0",
        "framework": "FastAPI"
    }


# Register
@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserRegistration,
    db: AsyncSession = Depends(get_db)
):
    """Register a new user"""
    # Validate password strength
    is_valid, error_message = validate_password(user_data.password)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": error_message, "requirements": get_password_requirements()}
        )
    
    # Check if email already exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    
    # Check if username already exists
    result = await db.execute(select(User).where(User.username == user_data.username))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already taken"
        )
    
    # Create new user
    user = User(
        username=user_data.username,
        email=user_data.email,
        display_name=user_data.display_name or user_data.username,
        age_range=user_data.age_range
    )
    user.set_password(user_data.password)
    
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    # Create tokens
    access_token = create_access_token(data={"sub": user.public_id})
    refresh_token = create_refresh_token(data={"sub": user.public_id})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": user.to_dict()
    }


# Login
@router.post("/login")
async def login(
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    """Authenticate user and return tokens"""
    # Find user by email
    result = await db.execute(select(User).where(User.email == credentials.email))
    user = result.scalar_one_or_none()
    
    if not user or not user.check_password(credentials.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated"
        )
    
    # Update last login (use naive UTC datetime for PostgreSQL compatibility)
    user.last_login = datetime.utcnow()
    await db.commit()
    
    # Create tokens
    access_token = create_access_token(data={"sub": user.public_id})
    refresh_token = create_refresh_token(data={"sub": user.public_id})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": user.to_dict(include_sensitive=True)
    }


# Refresh token
@router.post("/refresh")
async def refresh_access_token(
    token_data: RefreshToken,
    db: AsyncSession = Depends(get_db)
):
    """Refresh access token using refresh token"""
    payload = decode_token(token_data.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    user_id = payload.get("sub")
    result = await db.execute(select(User).where(User.public_id == user_id))
    user = result.scalar_one_or_none()
    
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found or inactive"
        )
    
    new_access_token = create_access_token(data={"sub": user.public_id})
    return {"access_token": new_access_token, "token_type": "bearer"}


# Logout
@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """Logout user (invalidate token)"""
    # In production, add token JTI to blocklist
    return {"message": "Successfully logged out"}


# Get profile
@router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    """Get current user's profile"""
    return {"user": current_user.to_dict(include_sensitive=True)}


# Update profile
@router.put("/profile")
async def update_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update current user's profile"""
    # Update allowed fields
    update_fields = ['display_name', 'bio', 'age_range', 'preferred_anonymity', 
                     'author_bio', 'website_url', 'social_links']
    
    update_data = profile_data.model_dump(exclude_unset=True)
    for field in update_fields:
        if field in update_data:
            setattr(current_user, field, update_data[field])
    
    await db.commit()
    await db.refresh(current_user)
    
    return {
        "message": "Profile updated successfully",
        "user": current_user.to_dict(include_sensitive=True)
    }


# Change password
@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change user's password"""
    if not current_user.check_password(password_data.current_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password is incorrect"
        )
    
    # Validate new password
    is_valid, error_message = validate_password(password_data.new_password)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": error_message, "requirements": get_password_requirements()}
        )
    
    current_user.set_password(password_data.new_password)
    await db.commit()
    
    return {"message": "Password changed successfully"}


# Get user stats
@router.get("/stats")
async def get_user_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user's statistics"""
    from app.services.story_service import StoryService
    stats = await StoryService.get_user_stats(db, current_user)
    return {"stats": stats}


# Get public profile
@router.get("/user/{user_id}")
async def get_public_profile(
    user_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get a user's public profile"""
    result = await db.execute(select(User).where(User.public_id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"user": user.to_dict()}


# Delete account
@router.delete("/account")
async def delete_account(
    delete_data: DeleteAccount,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete user's account permanently"""
    # Verify password
    if not current_user.check_password(delete_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Password is incorrect"
        )
    
    # Import models for deletion
    from app.models.models import Post, Comment, Bookmark, Support, ReadProgress
    
    user_id = current_user.id
    
    # Delete user's bookmarks
    await db.execute(
        Bookmark.__table__.delete().where(Bookmark.user_id == user_id)
    )
    
    # Delete user's read progress
    await db.execute(
        ReadProgress.__table__.delete().where(ReadProgress.user_id == user_id)
    )
    
    # Delete user's supports
    await db.execute(
        Support.__table__.delete().where(Support.user_id == user_id)
    )
    
    # Delete comments on user's posts and by user
    await db.execute(
        Comment.__table__.delete().where(Comment.user_id == user_id)
    )
    
    # Delete user's posts (this will cascade delete related comments/supports)
    await db.execute(
        Post.__table__.delete().where(Post.author_id == user_id)
    )
    
    # Finally delete the user
    await db.delete(current_user)
    await db.commit()
    
    return {"message": "Account deleted successfully"}

