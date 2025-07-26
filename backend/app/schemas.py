from marshmallow import Schema, fields, validate, post_load
from app.models import UserRole, PostStatus, SeverityLevel

class UserRegistrationSchema(Schema):
    username = fields.Str(required=True, validate=validate.Length(min=3, max=80))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=8))
    display_name = fields.Str(validate=validate.Length(max=100))
    age_range = fields.Str(validate=validate.OneOf(['13-17', '18-24', '25-34', '35-44', '45-54', '55+']))
    
class UserLoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)

class PostCreationSchema(Schema):
    title = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    content = fields.Str(required=True, validate=validate.Length(min=1))
    is_anonymous = fields.Bool(missing=True)
    is_seeking_help = fields.Bool(missing=False)
    severity_level = fields.Str(validate=validate.OneOf([level.value for level in SeverityLevel]), missing='low')
    tags = fields.List(fields.Str(), missing=[])
    status = fields.Str(validate=validate.OneOf([status.value for status in PostStatus]), missing='draft')

class CommentCreationSchema(Schema):
    content = fields.Str(required=True, validate=validate.Length(min=1))
    is_anonymous = fields.Bool(missing=True)
    parent_id = fields.Str(allow_none=True)

class SupportSchema(Schema):
    support_type = fields.Str(validate=validate.OneOf(['heart', 'hug', 'strength', 'hope']), missing='heart')
    message = fields.Str(validate=validate.Length(max=500))