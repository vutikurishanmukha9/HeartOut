from app.extensions import db
from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from enum import Enum
import uuid

class UserRole(Enum):
    USER = "user"
    ADMIN = "admin"
    MODERATOR = "moderator"
    AUTHOR = "author"

class PostStatus(Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    FLAGGED = "flagged"
    REMOVED = "removed"

class StoryType(Enum):
    ACHIEVEMENT = "achievement"
    REGRET = "regret"
    UNSENT_LETTER = "unsent_letter"
    SACRIFICE = "sacrifice"
    LIFE_STORY = "life_story"
    OTHER = "other"


# JWT Blocklist table for persistent token revocation
class TokenBlocklist(db.Model):
    """Store revoked JWT tokens for logout functionality"""
    __tablename__ = 'token_blocklist'
    
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, unique=True, index=True)
    token_type = db.Column(db.String(10), nullable=False)  # 'access' or 'refresh'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    revoked_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    expires_at = db.Column(db.DateTime, nullable=False)
    
    __table_args__ = (
        db.Index('idx_token_jti', 'jti'),
        db.Index('idx_token_expires', 'expires_at'),
    )


class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.Enum(UserRole), default=UserRole.USER, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    last_login = db.Column(db.DateTime)
    
    # Profile fields
    display_name = db.Column(db.String(100))
    bio = db.Column(db.Text)
    age_range = db.Column(db.String(20))
    preferred_anonymity = db.Column(db.Boolean, default=True)
    
    # Author/Storytelling specific fields
    author_bio = db.Column(db.Text)
    website_url = db.Column(db.String(200))
    social_links = db.Column(db.JSON)
    is_featured_author = db.Column(db.Boolean, default=False)
    
    # Database indexes for performance
    __table_args__ = (
        db.Index('idx_user_public_id', 'public_id'),
        db.Index('idx_user_email', 'email'),
        db.Index('idx_user_username', 'username'),
        db.Index('idx_user_is_active', 'is_active'),
    )
    
    # Relationships
    posts = db.relationship('Post', backref='author', lazy='dynamic', cascade='all, delete-orphan')
    comments = db.relationship('Comment', backref='author', lazy='dynamic', cascade='all, delete-orphan')
    support_given = db.relationship('Support', foreign_keys='Support.giver_id', backref='giver', lazy='dynamic')
    support_received = db.relationship('Support', foreign_keys='Support.receiver_id', backref='receiver', lazy='dynamic')
    revoked_tokens = db.relationship('TokenBlocklist', backref='user', lazy='dynamic')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self, include_sensitive=False):
        data = {
            'id': self.public_id,
            'username': self.username,
            'display_name': self.display_name,
            'role': self.role.value,
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
                'total_stories': self.posts.filter_by(status=PostStatus.PUBLISHED).count()
            })
        
        return data


class Post(db.Model):
    __tablename__ = 'posts'
    
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    status = db.Column(db.Enum(PostStatus), default=PostStatus.DRAFT, nullable=False)
    story_type = db.Column(db.Enum(StoryType), default=StoryType.OTHER, nullable=False)
    is_anonymous = db.Column(db.Boolean, default=True)
    tags = db.Column(db.JSON)
    
    # Storytelling specific fields
    reading_time = db.Column(db.Integer, default=0)
    view_count = db.Column(db.Integer, default=0)
    is_featured = db.Column(db.Boolean, default=False)
    featured_at = db.Column(db.DateTime)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    published_at = db.Column(db.DateTime)
    
    # Moderation fields
    flagged_count = db.Column(db.Integer, default=0)
    
    # Engagement tracking for ranking algorithms
    save_count = db.Column(db.Integer, default=0)           # Bookmark saves (distinct from reactions)
    completion_rate = db.Column(db.Float, default=0.0)      # Average read completion (0.0 - 1.0)
    avg_read_time = db.Column(db.Integer, default=0)        # Average time spent reading (seconds)
    reread_count = db.Column(db.Integer, default=0)         # Number of re-reads (same user)
    unique_readers = db.Column(db.Integer, default=0)       # Distinct user views
    
    # Ranking cache (periodically updated)
    rank_score = db.Column(db.Float, default=0.0)
    last_ranked_at = db.Column(db.DateTime)
    
    # Denormalized counts (updated on write, avoids N+1 on read)
    support_count = db.Column(db.Integer, default=0)      # Cached count of supports
    comment_count = db.Column(db.Integer, default=0)      # Cached count of comments

    
    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Database indexes for performance
    __table_args__ = (
        db.Index('idx_post_public_id', 'public_id'),
        db.Index('idx_post_status', 'status'),
        db.Index('idx_post_story_type', 'story_type'),
        db.Index('idx_post_user_id', 'user_id'),
        db.Index('idx_post_published_at', 'published_at'),
        db.Index('idx_post_is_featured', 'is_featured'),
        db.Index('idx_post_view_count', 'view_count'),
        # Composite indexes for common query patterns
        db.Index('idx_post_status_story_type', 'status', 'story_type'),
        db.Index('idx_post_status_published', 'status', 'published_at'),
        db.Index('idx_post_user_status', 'user_id', 'status'),
    )
    
    # Relationships
    comments = db.relationship('Comment', backref='post', lazy='dynamic', cascade='all, delete-orphan')
    supports = db.relationship('Support', backref='post', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self, include_author=True):
        data = {
            'id': self.public_id,
            'title': self.title,
            'content': self.content,
            'status': self.status.value,
            'story_type': self.story_type.value,
            'is_anonymous': self.is_anonymous,
            'tags': self.tags or [],
            'reading_time': self.reading_time,
            'view_count': self.view_count,
            'is_featured': self.is_featured,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'published_at': self.published_at.isoformat() if self.published_at else None,
            # Use cached counts (no N+1 queries)
            'support_count': self.support_count,
            'comment_count': self.comment_count
        }
        
        if include_author and not self.is_anonymous:
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


class Comment(db.Model):
    __tablename__ = 'comments'
    
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    content = db.Column(db.Text, nullable=False)
    is_anonymous = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('comments.id'))
    
    # Database indexes
    __table_args__ = (
        db.Index('idx_comment_post_id', 'post_id'),
        db.Index('idx_comment_user_id', 'user_id'),
        db.Index('idx_comment_parent_id', 'parent_id'),
    )
    
    # Self-referential relationship for nested comments
    replies = db.relationship('Comment', backref=db.backref('parent', remote_side=[id]), lazy='dynamic')
    
    def to_dict(self):
        data = {
            'id': self.public_id,
            'content': self.content,
            'is_anonymous': self.is_anonymous,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'reply_count': self.replies.count()
        }
        
        if not self.is_anonymous:
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


class Support(db.Model):
    __tablename__ = 'supports'
    
    id = db.Column(db.Integer, primary_key=True)
    support_type = db.Column(db.String(50), default='heart')
    message = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Foreign keys
    giver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    
    # Database indexes and constraints
    __table_args__ = (
        db.Index('idx_support_giver_id', 'giver_id'),
        db.Index('idx_support_post_id', 'post_id'),
        db.UniqueConstraint('giver_id', 'post_id', 'support_type', name='unique_user_post_reaction'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'support_type': self.support_type,
            'message': self.message,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'giver': {
                'id': self.giver.public_id,
                'username': self.giver.username,
                'display_name': self.giver.display_name
            }
        }


class Bookmark(db.Model):
    """User bookmarks/saves for stories (distinct from reactions)"""
    __tablename__ = 'bookmarks'
    
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    
    # Relationships
    user = db.relationship('User', backref=db.backref('bookmarks', lazy='dynamic'))
    post = db.relationship('Post', backref=db.backref('bookmarks', lazy='dynamic'))
    
    # Constraints
    __table_args__ = (
        db.UniqueConstraint('user_id', 'post_id', name='unique_user_bookmark'),
        db.Index('idx_bookmark_user', 'user_id'),
        db.Index('idx_bookmark_post', 'post_id'),
    )


class ReadProgress(db.Model):
    """Track user reading engagement with stories"""
    __tablename__ = 'read_progress'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Reading metrics
    scroll_depth = db.Column(db.Float, default=0.0)     # 0.0 - 1.0 (how far scrolled)
    time_spent = db.Column(db.Integer, default=0)       # seconds spent on page
    completed = db.Column(db.Boolean, default=False)    # finished reading
    read_count = db.Column(db.Integer, default=1)       # number of visits to this story
    
    # Timestamps
    first_read = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    last_read = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    
    # Relationships
    user = db.relationship('User', backref=db.backref('read_progress', lazy='dynamic'))
    post = db.relationship('Post', backref=db.backref('read_progress', lazy='dynamic'))
    
    # Constraints
    __table_args__ = (
        db.UniqueConstraint('user_id', 'post_id', name='unique_user_read_progress'),
        db.Index('idx_read_progress_user', 'user_id'),
        db.Index('idx_read_progress_post', 'post_id'),
    )
