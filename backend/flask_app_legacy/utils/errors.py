"""Centralized error handling utilities for the API"""
from flask import jsonify
from functools import wraps


class APIError(Exception):
    """Base API Error class for consistent error responses"""
    def __init__(self, message, status_code=400, payload=None):
        super().__init__()
        self.message = message
        self.status_code = status_code
        self.payload = payload or {}
    
    def to_dict(self):
        return {
            'error': self.message,
            **self.payload
        }


class NotFoundError(APIError):
    """Resource not found error (404)"""
    def __init__(self, resource='Resource'):
        super().__init__(f'{resource} not found', status_code=404)


class UnauthorizedError(APIError):
    """Unauthorized access error (401)"""
    def __init__(self, message='Unauthorized'):
        super().__init__(message, status_code=401)


class ForbiddenError(APIError):
    """Forbidden access error (403)"""
    def __init__(self, message='You do not have permission to perform this action'):
        super().__init__(message, status_code=403)


class ValidationError(APIError):
    """Validation error (400)"""
    def __init__(self, message, errors=None):
        super().__init__(message, status_code=400, payload={'errors': errors} if errors else None)


class ConflictError(APIError):
    """Conflict error for duplicate resources (409)"""
    def __init__(self, message='Resource already exists'):
        super().__init__(message, status_code=409)


class RateLimitError(APIError):
    """Rate limit exceeded error (429)"""
    def __init__(self, message='Rate limit exceeded. Please try again later.'):
        super().__init__(message, status_code=429)


def register_error_handlers(app):
    """Register error handlers with the Flask app"""
    
    @app.errorhandler(APIError)
    def handle_api_error(error):
        return jsonify(error.to_dict()), error.status_code
    
    @app.errorhandler(404)
    def handle_not_found(error):
        return jsonify({'error': 'Resource not found'}), 404
    
    @app.errorhandler(500)
    def handle_internal_error(error):
        app.logger.error(f"Internal error: {str(error)}")
        return jsonify({'error': 'An internal error occurred'}), 500
    
    @app.errorhandler(429)
    def handle_rate_limit(error):
        return jsonify({'error': 'Rate limit exceeded. Please try again later.'}), 429


def handle_exceptions(f):
    """Decorator to handle common exceptions in routes"""
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except APIError:
            raise  # Let the custom error handler deal with it
        except Exception as e:
            from flask import current_app
            current_app.logger.error(f"Unhandled exception in {f.__name__}: {str(e)}")
            raise APIError('An unexpected error occurred', status_code=500)
    return decorated
