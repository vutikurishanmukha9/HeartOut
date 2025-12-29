"""
Custom Exceptions for FastAPI Application
Converted from Flask errors.py with HTTPException integration
"""
from fastapi import HTTPException, status
from typing import Optional, Dict, Any


class APIError(HTTPException):
    """Base API Error class for consistent error responses"""
    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        detail: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            status_code=status_code,
            detail={"error": message, **(detail or {})}
        )
        self.message = message


class NotFoundError(APIError):
    """Resource not found error (404)"""
    def __init__(self, resource: str = 'Resource'):
        super().__init__(
            f'{resource} not found',
            status_code=status.HTTP_404_NOT_FOUND
        )


class UnauthorizedError(APIError):
    """Unauthorized access error (401)"""
    def __init__(self, message: str = 'Unauthorized'):
        super().__init__(
            message,
            status_code=status.HTTP_401_UNAUTHORIZED
        )


class ForbiddenError(APIError):
    """Forbidden access error (403)"""
    def __init__(self, message: str = 'You do not have permission to perform this action'):
        super().__init__(
            message,
            status_code=status.HTTP_403_FORBIDDEN
        )


class ValidationError(APIError):
    """Validation error (400)"""
    def __init__(self, message: str, errors: Optional[Dict] = None):
        super().__init__(
            message,
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={'errors': errors} if errors else None
        )


class ConflictError(APIError):
    """Conflict error for duplicate resources (409)"""
    def __init__(self, message: str = 'Resource already exists'):
        super().__init__(
            message,
            status_code=status.HTTP_409_CONFLICT
        )


class RateLimitError(APIError):
    """Rate limit exceeded error (429)"""
    def __init__(self, message: str = 'Rate limit exceeded. Please try again later.'):
        super().__init__(
            message,
            status_code=status.HTTP_429_TOO_MANY_REQUESTS
        )


class InternalServerError(APIError):
    """Internal server error (500)"""
    def __init__(self, message: str = 'An internal error occurred'):
        super().__init__(
            message,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
