from app.extensions import db
from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from enum import Enum
import uuid

class UserRole(Enum):
    USER = "user"
    ADMIN = "admin"
    MODERATOR = "moderator"
    COUNSELOR = "counselor"

class PostStatus(Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    FLAGGED = "flagged"
    REMOVED = "removed"

class SeverityLevel(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

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
    
    # Mental health specific fields
    crisis_contact_number = db.Column(db.String(20))
    emergency_contact_name = db.Column(db.String(100))
    emergency_contact_number = db.Column(db.String(20))
    
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
            'preferred_anonymity': self.preferred_anonymity
        }
        
        if include_sensitive:
            data.update({
                'email': self.email,
                'is_verified': self.is_verified,
                'last_login': self.last_login.isoformat() if self.last_login else None,
                'crisis_contact_number': self.crisis_contact_number,
                'emergency_contact_name': self.emergency_contact_name,
                'emergency_contact_number': self.emergency_contact_number
            })
        
        return data

class Post(db.Model):
    __tablename__ = 'posts'
    
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    status = db.Column(db.Enum(PostStatus), default=PostStatus.DRAFT, nullable=False)
    severity_level = db.Column(db.Enum(SeverityLevel), default=SeverityLevel.LOW)
    is_anonymous = db.Column(db.Boolean, default=True)
    is_seeking_help = db.Column(db.Boolean, default=False)
    tags = db.Column(db.JSON)  # Store as JSON array
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    published_at = db.Column(db.DateTime)
    
    # Moderation fields
    moderation_score = db.Column(db.Float)
    flagged_count = db.Column(db.Integer, default=0)
    auto_flagged = db.Column(db.Boolean, default=False)
    
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
            'severity_level': self.severity_level.value,
            'is_anonymous': self.is_anonymous,
            'is_seeking_help': self.is_seeking_help,
            'tags': self.tags or [],
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
    support_type = db.Column(db.String(50), default='heart')  # heart, hug, etc.
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

class CallSession(db.Model):
    __tablename__ = 'call_sessions'
    
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    room_id = db.Column(db.String(100), unique=True, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    is_emergency = db.Column(db.Boolean, default=False)
    max_participants = db.Column(db.Integer, default=2)
    
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    ended_at = db.Column(db.DateTime)
    
    # Foreign keys
    creator_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Relationship
    creator = db.relationship('User', backref='created_calls')
    participants = db.relationship('CallParticipant', backref='session', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.public_id,
            'room_id': self.room_id,
            'is_active': self.is_active,
            'is_emergency': self.is_emergency,
            'max_participants': self.max_participants,
            'participant_count': self.participants.count(),
            'created_at': self.created_at.isoformat(),
            'creator': {
                'id': self.creator.public_id,
                'username': self.creator.username
            }
        }

class CallParticipant(db.Model):
    __tablename__ = 'call_participants'
    
    id = db.Column(db.Integer, primary_key=True)
    joined_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    left_at = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)
    
    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    session_id = db.Column(db.Integer, db.ForeignKey('call_sessions.id'), nullable=False)
    
    # Relationships
    user = db.relationship('User', backref='call_participations')