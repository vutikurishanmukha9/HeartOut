from app.extensions import db
from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from enum import Enum
import uuid

class UserRole(Enum):
    USER = "user"
    ADMIN = "admin"
    MODERATOR = "moderator"
    AUTHOR = "author"  # Changed from COUNSELOR to AUTHOR for storytelling platform

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
    author_bio = db.Column(db.Text)  # Detailed author biography
    website_url = db.Column(db.String(200))  # Author's website
    social_links = db.Column(db.JSON)  # Social media links
    is_featured_author = db.Column(db.Boolean, default=False)
    
    # Relationships
    posts = db.relationship('Post', backref='author', lazy='dynamic', cascade='all, delete-orphan')
    comments = db.relationship('Comment', backref='author', lazy='dynamic', cascade='all, delete-orphan')
    support_given = db.relationship('Support', foreign_keys='Support.giver_id', backref='giver', lazy='dynamic')
    support_received = db.relationship('Support', foreign_keys='Support.receiver_id', backref='receiver', lazy='dynamic')
    
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
            'created_at': self.created_at.isoformat(),
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
    tags = db.Column(db.JSON)  # Store as JSON array
    
    # Storytelling specific fields
    reading_time = db.Column(db.Integer, default=0)  # Estimated reading time in minutes
    view_count = db.Column(db.Integer, default=0)
    is_featured = db.Column(db.Boolean, default=False)
    featured_at = db.Column(db.DateTime)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    published_at = db.Column(db.DateTime)
    
    # Moderation fields (lighter moderation for storytelling)
    flagged_count = db.Column(db.Integer, default=0)
    
    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
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
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'published_at': self.published_at.isoformat() if self.published_at else None,
            'support_count': self.supports.count(),
            'comment_count': self.comments.count()
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
    parent_id = db.Column(db.Integer, db.ForeignKey('comments.id'))  # For nested comments
    
    # Self-referential relationship for nested comments
    replies = db.relationship('Comment', backref=db.backref('parent', remote_side=[id]), lazy='dynamic')
    
    def to_dict(self):
        data = {
            'id': self.public_id,
            'content': self.content,
            'is_anonymous': self.is_anonymous,
            'created_at': self.created_at.isoformat(),
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
    support_type = db.Column(db.String(50), default='heart')  # heart, applause, bookmark
    message = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Foreign keys
    giver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    
    def to_dict(self):
        return {
            'id': self.id,
            'support_type': self.support_type,
            'message': self.message,
            'created_at': self.created_at.isoformat(),
            'giver': {
                'id': self.giver.public_id,
                'username': self.giver.username,
                'display_name': self.giver.display_name
            }
        }