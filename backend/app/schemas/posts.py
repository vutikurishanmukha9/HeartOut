"""
Pydantic v2 Schemas for Posts/Stories
Converted from Marshmallow schemas
"""
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Dict, Any
from datetime import datetime
import re


# Valid story types and statuses
VALID_STORY_TYPES = ['achievement', 'regret', 'unsent_letter', 'sacrifice', 'life_story', 'other']
VALID_STATUSES = ['draft', 'published', 'flagged', 'removed']
VALID_SUPPORT_TYPES = ['heart', 'applause', 'bookmark', 'hug', 'inspiring']


class PostCreate(BaseModel):
    """Schema for story/post creation"""
    title: str = Field(..., min_length=5, max_length=200)
    content: str = Field(..., min_length=50, max_length=50000)
    is_anonymous: bool = True
    story_type: str = Field(default='other')
    tags: List[str] = Field(default_factory=list, max_length=10)
    status: str = Field(default='draft')
    
    @field_validator('story_type')
    @classmethod
    def validate_story_type(cls, v: str) -> str:
        if v not in VALID_STORY_TYPES:
            raise ValueError(f'Invalid story type. Must be one of: {VALID_STORY_TYPES}')
        return v
    
    @field_validator('status')
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v not in VALID_STATUSES:
            raise ValueError(f'Invalid status. Must be one of: {VALID_STATUSES}')
        return v
    
    @field_validator('tags')
    @classmethod
    def validate_tags(cls, v: List[str]) -> List[str]:
        for tag in v:
            if len(tag) < 1 or len(tag) > 30:
                raise ValueError('Each tag must be between 1 and 30 characters')
            if not re.match(r'^[a-zA-Z0-9_-]+$', tag):
                raise ValueError(f'Tag "{tag}" contains invalid characters. Use only letters, numbers, underscores, and hyphens.')
        return v


class PostUpdate(BaseModel):
    """Schema for story/post update"""
    title: Optional[str] = Field(None, min_length=5, max_length=200)
    content: Optional[str] = Field(None, min_length=50, max_length=50000)
    is_anonymous: Optional[bool] = None
    story_type: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[str] = None
    
    @field_validator('story_type')
    @classmethod
    def validate_story_type(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in VALID_STORY_TYPES:
            raise ValueError(f'Invalid story type. Must be one of: {VALID_STORY_TYPES}')
        return v


class AuthorInfo(BaseModel):
    """Schema for author information"""
    id: Optional[str] = None
    username: str
    display_name: Optional[str] = None


class PostResponse(BaseModel):
    """Schema for post response"""
    id: str
    title: str
    content: str
    status: str
    story_type: str
    is_anonymous: bool
    tags: List[str] = []
    reading_time: int = 0
    view_count: int = 0
    is_featured: bool = False
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    published_at: Optional[str] = None
    support_count: int = 0
    comment_count: int = 0
    author: Optional[AuthorInfo] = None
    
    class Config:
        from_attributes = True


class PostListResponse(BaseModel):
    """Schema for paginated post list"""
    stories: List[PostResponse]
    total: int
    page: int
    per_page: int
    total_pages: int
    has_next: bool = False
    has_prev: bool = False
    next_page: Optional[int] = None
    prev_page: Optional[int] = None
    ranking_algorithm: Optional[str] = None


class CommentCreate(BaseModel):
    """Schema for comment creation"""
    content: str = Field(..., min_length=1, max_length=2000)
    is_anonymous: bool = True
    parent_id: Optional[str] = None


class CommentResponse(BaseModel):
    """Schema for comment response"""
    id: str
    content: str
    is_anonymous: bool
    created_at: Optional[str] = None
    reply_count: int = 0
    author: AuthorInfo
    
    class Config:
        from_attributes = True


class SupportCreate(BaseModel):
    """Schema for reaction/support creation"""
    support_type: str = Field(default='heart')
    message: Optional[str] = Field(None, max_length=500)
    
    @field_validator('support_type')
    @classmethod
    def validate_support_type(cls, v: str) -> str:
        if v not in VALID_SUPPORT_TYPES:
            raise ValueError(f'Invalid support type. Must be one of: {VALID_SUPPORT_TYPES}')
        return v


class SupportResponse(BaseModel):
    """Schema for support response"""
    id: int
    support_type: str
    message: Optional[str] = None
    created_at: Optional[str] = None
    giver: Optional[AuthorInfo] = None
    
    class Config:
        from_attributes = True


class BookmarkResponse(BaseModel):
    """Schema for bookmark status"""
    is_bookmarked: bool
    save_count: int
    message: Optional[str] = None


class ReadProgressUpdate(BaseModel):
    """Schema for reading progress update"""
    scroll_depth: Optional[float] = Field(None, ge=0.0, le=1.0)
    time_spent: Optional[int] = Field(None, ge=0)


class PaginationParams(BaseModel):
    """Schema for pagination parameters"""
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=20, ge=1, le=100)
    sort_by: str = Field(default='smart')
    
    @field_validator('sort_by')
    @classmethod
    def validate_sort_by(cls, v: str) -> str:
        if v not in ['smart', 'latest', 'trending', 'most_viewed']:
            raise ValueError('Invalid sort_by value')
        return v


class SearchParams(BaseModel):
    """Schema for search parameters"""
    q: str = Field(..., min_length=2)
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=20, ge=1, le=100)
