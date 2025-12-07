from marshmallow import Schema, fields, validate, validates, ValidationError
from app.models import UserRole, PostStatus, StoryType
import re


class UserRegistrationSchema(Schema):
    """Schema for user registration validation"""
    username = fields.Str(
        required=True, 
        validate=[
            validate.Length(min=3, max=80),
            validate.Regexp(
                r'^[a-zA-Z0-9_]+$',
                error='Username can only contain letters, numbers, and underscores'
            )
        ]
    )
    email = fields.Email(required=True, error_messages={'invalid': 'Please enter a valid email address'})
    password = fields.Str(required=True, validate=validate.Length(min=8, max=128))
    display_name = fields.Str(validate=validate.Length(max=100))
    age_range = fields.Str(validate=validate.OneOf(['13-17', '18-24', '25-34', '35-44', '45-54', '55+']))
    
    @validates('email')
    def validate_email_domain(self, value):
        """Additional email validation"""
        # Block common disposable email domains
        disposable_domains = ['tempmail.com', 'throwaway.com', '10minutemail.com']
        domain = value.split('@')[1].lower()
        if domain in disposable_domains:
            raise ValidationError('Please use a valid email address')


class UserLoginSchema(Schema):
    """Schema for user login validation"""
    email = fields.Email(required=True)
    password = fields.Str(required=True)


class PostCreationSchema(Schema):
    """Schema for story/post creation validation"""
    title = fields.Str(
        required=True, 
        validate=validate.Length(min=5, max=200, error='Title must be between 5 and 200 characters')
    )
    content = fields.Str(
        required=True, 
        validate=validate.Length(min=50, max=50000, error='Content must be between 50 and 50,000 characters')
    )
    is_anonymous = fields.Bool(load_default=True)
    story_type = fields.Str(
        validate=validate.OneOf(
            [st.value for st in StoryType],
            error='Invalid story type'
        ), 
        load_default='other'
    )
    tags = fields.List(
        fields.Str(validate=validate.Length(min=1, max=30)),
        validate=validate.Length(max=10, error='Maximum 10 tags allowed'),
        load_default=[]
    )
    status = fields.Str(
        validate=validate.OneOf(
            [status.value for status in PostStatus],
            error='Invalid status'
        ), 
        load_default='draft'
    )
    
    @validates('tags')
    def validate_tags(self, value):
        """Validate each tag format"""
        for tag in value:
            if not re.match(r'^[a-zA-Z0-9_-]+$', tag):
                raise ValidationError(f'Tag "{tag}" contains invalid characters. Use only letters, numbers, underscores, and hyphens.')


class CommentCreationSchema(Schema):
    """Schema for comment creation validation"""
    content = fields.Str(
        required=True, 
        validate=validate.Length(min=1, max=2000, error='Comment must be between 1 and 2,000 characters')
    )
    is_anonymous = fields.Bool(load_default=True)
    parent_id = fields.Str(allow_none=True)


class SupportSchema(Schema):
    """Schema for reaction/support validation"""
    support_type = fields.Str(
        validate=validate.OneOf(['heart', 'applause', 'bookmark', 'hug', 'inspiring']), 
        load_default='heart'
    )
    message = fields.Str(validate=validate.Length(max=500))


class ProfileUpdateSchema(Schema):
    """Schema for profile update validation"""
    display_name = fields.Str(validate=validate.Length(max=100))
    bio = fields.Str(validate=validate.Length(max=1000))
    age_range = fields.Str(validate=validate.OneOf(['13-17', '18-24', '25-34', '35-44', '45-54', '55+']))
    preferred_anonymity = fields.Bool()
    author_bio = fields.Str(validate=validate.Length(max=5000))
    website_url = fields.Url(allow_none=True)
    social_links = fields.Dict(allow_none=True)


class PaginationSchema(Schema):
    """Schema for pagination parameters"""
    page = fields.Int(load_default=1, validate=validate.Range(min=1))
    per_page = fields.Int(load_default=20, validate=validate.Range(min=1, max=100))
    sort_by = fields.Str(validate=validate.OneOf(['latest', 'trending', 'most_viewed']), load_default='latest')