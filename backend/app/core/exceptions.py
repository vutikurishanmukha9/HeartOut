"""
Custom Exception Classes for HeartOut API

Provides structured error handling with consistent response formats.
"""
from fastapi import HTTPException, status
from typing import Optional, Any, Dict


class AppException(HTTPException):
    """Base exception for all application errors"""
    def __init__(
        self, 
        status_code: int, 
        detail: str,
        headers: Optional[Dict[str, str]] = None
    ):
        super().__init__(status_code=status_code, detail=detail, headers=headers)


class NotFoundError(AppException):
    """Resource not found (404)"""
    def __init__(self, resource: str = "Resource", detail: Optional[str] = None):
        message = detail or f"{resource} not found"
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=message)


class UnauthorizedError(AppException):
    """Authentication required (401)"""
    def __init__(self, detail: str = "Not authenticated"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"}
        )


class ForbiddenError(AppException):
    """Permission denied (403)"""
    def __init__(self, detail: str = "Permission denied"):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


class ValidationError(AppException):
    """Validation failed (400)"""
    def __init__(self, detail: str = "Validation error"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)


class ConflictError(AppException):
    """Resource conflict (409)"""
    def __init__(self, detail: str = "Resource already exists"):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)


class RateLimitError(AppException):
    """Rate limit exceeded (429)"""
    def __init__(self, detail: str = "Too many requests"):
        super().__init__(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=detail)
