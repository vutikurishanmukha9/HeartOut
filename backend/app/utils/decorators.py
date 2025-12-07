"""Custom decorators to reduce code duplication in routes"""
from functools import wraps
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User
from app.utils.errors import NotFoundError, ForbiddenError


def get_current_user(f):
    """
    Decorator that provides the current authenticated user to the route.
    Replaces the common pattern of:
        current_user_id = get_jwt_identity()
        user = User.query.filter_by(public_id=current_user_id).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
    
    Usage:
        @bp.route('/endpoint')
        @get_current_user
        def my_route(current_user):
            # current_user is now available
            pass
    """
    @wraps(f)
    @jwt_required()
    def decorated(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.filter_by(public_id=current_user_id).first()
        
        if not user:
            raise NotFoundError('User')
        
        if not user.is_active:
            raise ForbiddenError('Account is deactivated')
        
        return f(user, *args, **kwargs)
    return decorated


def get_current_user_optional(f):
    """
    Decorator that provides the current user if authenticated, None otherwise.
    Useful for routes that behave differently for logged in vs anonymous users.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            from flask_jwt_extended import verify_jwt_in_request
            verify_jwt_in_request(optional=True)
            current_user_id = get_jwt_identity()
            if current_user_id:
                user = User.query.filter_by(public_id=current_user_id).first()
                return f(user, *args, **kwargs)
        except:
            pass
        return f(None, *args, **kwargs)
    return decorated


def admin_required(f):
    """
    Decorator that requires the user to have admin role.
    Must be used after @get_current_user or @jwt_required.
    """
    @wraps(f)
    @jwt_required()
    def decorated(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.filter_by(public_id=current_user_id).first()
        
        if not user:
            raise NotFoundError('User')
        
        from app.models import UserRole
        if user.role != UserRole.ADMIN:
            raise ForbiddenError('Admin access required')
        
        return f(user, *args, **kwargs)
    return decorated


def author_or_admin_required(get_resource_user_id):
    """
    Decorator factory that checks if the current user is the author or an admin.
    
    Usage:
        @author_or_admin_required(lambda story: story.user_id)
        def update_story(current_user, story):
            pass
    """
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user = User.query.filter_by(public_id=current_user_id).first()
            
            if not user:
                raise NotFoundError('User')
            
            # Get the resource from kwargs or first arg
            resource = kwargs.get('resource') or (args[0] if args else None)
            
            if resource:
                from app.models import UserRole
                resource_user_id = get_resource_user_id(resource)
                if user.id != resource_user_id and user.role != UserRole.ADMIN:
                    raise ForbiddenError()
            
            return f(user, *args, **kwargs)
        return decorated
    return decorator
