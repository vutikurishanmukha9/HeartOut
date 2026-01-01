"""
Pydantic v2 Schemas for Authentication
Converted from Marshmallow schemas
"""
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, Dict, Any
from datetime import datetime
import re


# Allowed email domains
ALLOWED_EMAIL_DOMAINS = [
    'gmail.com', 'outlook.com', 'hotmail.com', 'live.com',
    'yahoo.com', 'icloud.com', 'me.com', 'mac.com'
]


class UserRegistration(BaseModel):
    """Schema for user registration"""
    username: str = Field(..., min_length=3, max_length=80)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    display_name: Optional[str] = Field(None, max_length=100)
    age_range: Optional[str] = Field(None)
    
    @field_validator('username')
    @classmethod
    def validate_username(cls, v: str) -> str:
        if not re.match(r'^[a-zA-Z0-9_]+$', v):
            raise ValueError('Username can only contain letters, numbers, and underscores')
        return v
    
    @field_validator('email')
    @classmethod
    def validate_email_domain(cls, v: str) -> str:
        domain = v.split('@')[1].lower()
        if domain not in ALLOWED_EMAIL_DOMAINS:
            raise ValueError(
                'Please use a personal email from: Gmail, Outlook, Yahoo, or iCloud. '
                'Work/school emails are not allowed.'
            )
        return v
    
    @field_validator('age_range')
    @classmethod
    def validate_age_range(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in ['13-17', '18-24', '25-34', '35-44', '45-54', '55+']:
            raise ValueError('Invalid age range')
        return v


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]


class ProfileUpdate(BaseModel):
    """Schema for profile update"""
    display_name: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = Field(None, max_length=1000)
    age_range: Optional[str] = None
    preferred_anonymity: Optional[bool] = None
    author_bio: Optional[str] = Field(None, max_length=5000)
    website_url: Optional[str] = Field(None, max_length=200)
    social_links: Optional[Dict[str, str]] = None
    
    @field_validator('age_range')
    @classmethod
    def validate_age_range(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in ['13-17', '18-24', '25-34', '35-44', '45-54', '55+']:
            raise ValueError('Invalid age range')
        return v


class UserResponse(BaseModel):
    """Schema for user response"""
    id: str
    username: str
    display_name: Optional[str] = None
    email: Optional[str] = None
    role: str
    is_active: bool
    is_verified: Optional[bool] = None
    created_at: Optional[datetime] = None
    bio: Optional[str] = None
    age_range: Optional[str] = None
    preferred_anonymity: bool = True
    is_featured_author: bool = False
    author_bio: Optional[str] = None
    website_url: Optional[str] = None
    social_links: Optional[Dict[str, str]] = None
    total_stories: Optional[int] = None
    
    class Config:
        from_attributes = True


class RefreshToken(BaseModel):
    """Schema for token refresh"""
    refresh_token: str


class PasswordChange(BaseModel):
    """Schema for password change"""
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=128)


class DeleteAccount(BaseModel):
    """Schema for account deletion"""
    password: str = Field(..., description="User password for confirmation")

