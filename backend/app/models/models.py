"""
SQLAlchemy 2.0 Async Models for FastAPI
Complete migration from Flask-SQLAlchemy
"""
from datetime import datetime, timezone
from typing import Optional, List
from enum import Enum
import uuid

from sqlalchemy import String, Text, Integer, Float, Boolean, DateTime, JSON, ForeignKey, Index, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
import bcrypt

from app.core.database import Base


# Enums
class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"
    MODERATOR = "moderator"
    AUTHOR = "author"


class PostStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    FLAGGED = "flagged"
    REMOVED = "removed"


class StoryType(str, Enum):
    ACHIEVEMENT = "achievement"
    REGRET = "regret"
    UNSENT_LETTER = "unsent_letter"
    SACRIFICE = "sacrifice"
    LIFE_STORY = "life_story"
    OTHER = "other"


# JWT Blocklist table
class TokenBlocklist(Base):
    """Store revoked JWT tokens for logout functionality"""
    __tablename__ = 'token_blocklist'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    jti: Mapped[str] = mapped_column(String(36), nullable=False, unique=True, index=True)
    token_type: Mapped[str] = mapped_column(String(10), nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    revoked_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    
    __table_args__ = (
        Index('idx_token_jti', 'jti'),
        Index('idx_token_expires', 'expires_at'),
    )


class User(Base):
    """User model with authentication and profile"""
    __tablename__ = 'users'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    public_id: Mapped[str] = mapped_column(String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    username: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(200), nullable=False)
    role: Mapped[str] = mapped_column(String(20), default=UserRole.USER.value, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    last_login: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    # Profile fields
    display_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    age_range: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    preferred_anonymity: Mapped[bool] = mapped_column(Boolean, default=True)
    
    # Author fields
    author_bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    website_url: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    social_links: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    is_featured_author: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Relationships
    posts: Mapped[List["Post"]] = relationship("Post", back_populates="author", cascade="all, delete-orphan")
    comments: Mapped[List["Comment"]] = relationship("Comment", back_populates="author", cascade="all, delete-orphan")
    bookmarks: Mapped[List["Bookmark"]] = relationship("Bookmark", back_populates="user", cascade="all, delete-orphan")
    read_progress: Mapped[List["ReadProgress"]] = relationship("ReadProgress", back_populates="user", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('idx_user_public_id', 'public_id'),
        Index('idx_user_email', 'email'),
        Index('idx_user_username', 'username'),
        Index('idx_user_is_active', 'is_active'),
    )
    
    def set_password(self, password: str):
        self.password_hash = bcrypt.hashpw(
            password.encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')
    
    def check_password(self, password: str) -> bool:
        return bcrypt.checkpw(
            password.encode('utf-8'),
            self.password_hash.encode('utf-8')
        )
    
    def to_dict(self, include_sensitive: bool = False) -> dict:
        data = {
            'id': self.public_id,
            'username': self.username,
            'display_name': self.display_name,
            'role': self.role,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'bio': self.bio,
            'age_range': self.age_range,
            'preferred_anonymity': self.preferred_anonymity,
            'is_featured_author': self.is_featured_author
        }
        
        if include_sensitive:
            data.update({
                'email': self.email,
                'is_verified': self.is_verified,
                'last_login': self.last_login.isoformat() if self.last_login else None,
                'author_bio': self.author_bio,
                'website_url': self.website_url,
                'social_links': self.social_links or {},
            })
        
        return data


class Post(Base):
    """Post/Story model with engagement tracking"""
    __tablename__ = 'posts'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    public_id: Mapped[str] = mapped_column(String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default=PostStatus.DRAFT.value, nullable=False)
    story_type: Mapped[str] = mapped_column(String(20), default=StoryType.OTHER.value, nullable=False)
    is_anonymous: Mapped[bool] = mapped_column(Boolean, default=True)
    tags: Mapped[Optional[list]] = mapped_column(JSON, nullable=True)
    
    # Storytelling fields
    reading_time: Mapped[int] = mapped_column(Integer, default=0)
    view_count: Mapped[int] = mapped_column(Integer, default=0)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    featured_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    published_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    # Moderation
    flagged_count: Mapped[int] = mapped_column(Integer, default=0)
    
    # Engagement tracking
    save_count: Mapped[int] = mapped_column(Integer, default=0)
    completion_rate: Mapped[float] = mapped_column(Float, default=0.0)
    avg_read_time: Mapped[int] = mapped_column(Integer, default=0)
    reread_count: Mapped[int] = mapped_column(Integer, default=0)
    unique_readers: Mapped[int] = mapped_column(Integer, default=0)
    
    # Ranking cache
    rank_score: Mapped[float] = mapped_column(Float, default=0.0)
    last_ranked_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    # Denormalized counts
    support_count: Mapped[int] = mapped_column(Integer, default=0)
    comment_count: Mapped[int] = mapped_column(Integer, default=0)
    
    # Foreign key
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Relationships
    author: Mapped["User"] = relationship("User", back_populates="posts")
    comments: Mapped[List["Comment"]] = relationship("Comment", back_populates="post", cascade="all, delete-orphan")
    supports: Mapped[List["Support"]] = relationship("Support", back_populates="post", cascade="all, delete-orphan")
    bookmarks: Mapped[List["Bookmark"]] = relationship("Bookmark", back_populates="post", cascade="all, delete-orphan")
    read_progress: Mapped[List["ReadProgress"]] = relationship("ReadProgress", back_populates="post", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('idx_post_public_id', 'public_id'),
        Index('idx_post_status', 'status'),
        Index('idx_post_story_type', 'story_type'),
        Index('idx_post_user_id', 'user_id'),
        Index('idx_post_published_at', 'published_at'),
        Index('idx_post_is_featured', 'is_featured'),
        Index('idx_post_view_count', 'view_count'),
        Index('idx_post_status_story_type', 'status', 'story_type'),
        Index('idx_post_status_published', 'status', 'published_at'),
        Index('idx_post_user_status', 'user_id', 'status'),
    )
    
    def to_dict(self, include_author: bool = True) -> dict:
        data = {
            'id': self.public_id,
            'title': self.title,
            'content': self.content,
            'status': self.status,
            'story_type': self.story_type,
            'is_anonymous': self.is_anonymous,
            'tags': self.tags or [],
            'reading_time': self.reading_time,
            'view_count': self.view_count,
            'is_featured': self.is_featured,
            'created_at': (self.created_at.isoformat() + 'Z') if self.created_at else None,
            'updated_at': (self.updated_at.isoformat() + 'Z') if self.updated_at else None,
            'published_at': (self.published_at.isoformat() + 'Z') if self.published_at else None,
            'support_count': self.support_count or 0,
            'comment_count': self.comment_count or 0
        }
        
        if include_author and not self.is_anonymous and self.author:
            data['author'] = {
                'id': self.author.public_id,
                'username': self.author.username,
                'display_name': self.author.display_name
            }
        elif self.is_anonymous:
            data['author'] = {
                'username': 'Anonymous',
                'display_name': 'Anonymous User'
            }
        
        return data


class Comment(Base):
    """Comment model with nested replies support"""
    __tablename__ = 'comments'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    public_id: Mapped[str] = mapped_column(String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    content: Mapped[str] = mapped_column(Text, nullable=False)
    is_anonymous: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Foreign keys
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    post_id: Mapped[int] = mapped_column(Integer, ForeignKey('posts.id'), nullable=False)
    parent_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey('comments.id'), nullable=True)
    
    # Relationships
    author: Mapped["User"] = relationship("User", back_populates="comments")
    post: Mapped["Post"] = relationship("Post", back_populates="comments")
    parent: Mapped[Optional["Comment"]] = relationship("Comment", remote_side=[id], back_populates="replies")
    replies: Mapped[List["Comment"]] = relationship("Comment", back_populates="parent")
    
    __table_args__ = (
        Index('idx_comment_post_id', 'post_id'),
        Index('idx_comment_user_id', 'user_id'),
        Index('idx_comment_parent_id', 'parent_id'),
    )
    
    def to_dict(self) -> dict:
        data = {
            'id': self.public_id,
            'content': self.content,
            'is_anonymous': self.is_anonymous,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'reply_count': len(self.replies) if self.replies else 0
        }
        
        if not self.is_anonymous and self.author:
            data['author'] = {
                'id': self.author.public_id,
                'username': self.author.username,
                'display_name': self.author.display_name
            }
        else:
            data['author'] = {
                'username': 'Anonymous',
                'display_name': 'Anonymous User'
            }
        
        return data


class Support(Base):
    """Reaction/Support model for stories"""
    __tablename__ = 'supports'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    support_type: Mapped[str] = mapped_column(String(50), default='heart')
    message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Foreign keys
    giver_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    receiver_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    post_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey('posts.id'), nullable=True)
    
    # Relationships
    giver: Mapped["User"] = relationship("User", foreign_keys=[giver_id])
    receiver: Mapped["User"] = relationship("User", foreign_keys=[receiver_id])
    post: Mapped[Optional["Post"]] = relationship("Post", back_populates="supports")
    
    __table_args__ = (
        Index('idx_support_giver_id', 'giver_id'),
        Index('idx_support_post_id', 'post_id'),
        UniqueConstraint('giver_id', 'post_id', 'support_type', name='unique_user_post_reaction'),
    )
    
    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'support_type': self.support_type,
            'message': self.message,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'giver': {
                'id': self.giver.public_id,
                'username': self.giver.username,
                'display_name': self.giver.display_name
            } if self.giver else None
        }


class Bookmark(Base):
    """User bookmarks/saves for stories"""
    __tablename__ = 'bookmarks'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Foreign keys
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    post_id: Mapped[int] = mapped_column(Integer, ForeignKey('posts.id'), nullable=False)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="bookmarks")
    post: Mapped["Post"] = relationship("Post", back_populates="bookmarks")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'post_id', name='unique_user_bookmark'),
        Index('idx_bookmark_user', 'user_id'),
        Index('idx_bookmark_post', 'post_id'),
    )


class ReadProgress(Base):
    """Track user reading engagement with stories"""
    __tablename__ = 'read_progress'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    
    # Reading metrics
    scroll_depth: Mapped[float] = mapped_column(Float, default=0.0)
    time_spent: Mapped[int] = mapped_column(Integer, default=0)
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    read_count: Mapped[int] = mapped_column(Integer, default=1)
    
    # Timestamps
    first_read: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    last_read: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Foreign keys
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    post_id: Mapped[int] = mapped_column(Integer, ForeignKey('posts.id'), nullable=False)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="read_progress")
    post: Mapped["Post"] = relationship("Post", back_populates="read_progress")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'post_id', name='unique_user_read_progress'),
        Index('idx_read_progress_user', 'user_id'),
        Index('idx_read_progress_post', 'post_id'),
    )
