"""
Tests for Custom Exceptions Module
Verifies exception classes work correctly with proper status codes and messages
"""
import pytest
from fastapi import status

from app.core.exceptions import (
    AppException, NotFoundError, UnauthorizedError, 
    ForbiddenError, ValidationError, ConflictError, RateLimitError
)


class TestNotFoundError:
    """Test NotFoundError exception"""
    
    def test_default_message(self):
        """Test default error message"""
        error = NotFoundError()
        assert error.status_code == status.HTTP_404_NOT_FOUND
        assert error.detail == "Resource not found"
    
    def test_custom_resource(self):
        """Test custom resource name in message"""
        error = NotFoundError(resource="Story")
        assert error.detail == "Story not found"
    
    def test_custom_detail(self):
        """Test fully custom detail message"""
        error = NotFoundError(detail="The requested item does not exist")
        assert error.detail == "The requested item does not exist"


class TestUnauthorizedError:
    """Test UnauthorizedError exception"""
    
    def test_default_message(self):
        """Test default error message"""
        error = UnauthorizedError()
        assert error.status_code == status.HTTP_401_UNAUTHORIZED
        assert error.detail == "Not authenticated"
        assert error.headers == {"WWW-Authenticate": "Bearer"}
    
    def test_custom_message(self):
        """Test custom error message"""
        error = UnauthorizedError(detail="Token expired")
        assert error.detail == "Token expired"


class TestForbiddenError:
    """Test ForbiddenError exception"""
    
    def test_default_message(self):
        """Test default error message"""
        error = ForbiddenError()
        assert error.status_code == status.HTTP_403_FORBIDDEN
        assert error.detail == "Permission denied"
    
    def test_custom_message(self):
        """Test custom error message"""
        error = ForbiddenError(detail="You can only edit your own stories")
        assert error.detail == "You can only edit your own stories"


class TestValidationError:
    """Test ValidationError exception"""
    
    def test_default_message(self):
        """Test default error message"""
        error = ValidationError()
        assert error.status_code == status.HTTP_400_BAD_REQUEST
        assert error.detail == "Validation error"
    
    def test_custom_message(self):
        """Test custom error message"""
        error = ValidationError(detail="Invalid email format")
        assert error.detail == "Invalid email format"


class TestConflictError:
    """Test ConflictError exception"""
    
    def test_default_message(self):
        """Test default error message"""
        error = ConflictError()
        assert error.status_code == status.HTTP_409_CONFLICT
        assert error.detail == "Resource already exists"
    
    def test_custom_message(self):
        """Test custom error message"""
        error = ConflictError(detail="Username already taken")
        assert error.detail == "Username already taken"


class TestRateLimitError:
    """Test RateLimitError exception"""
    
    def test_default_message(self):
        """Test default error message"""
        error = RateLimitError()
        assert error.status_code == status.HTTP_429_TOO_MANY_REQUESTS
        assert error.detail == "Too many requests"
    
    def test_custom_message(self):
        """Test custom error message"""
        error = RateLimitError(detail="Try again in 60 seconds")
        assert error.detail == "Try again in 60 seconds"


class TestAppException:
    """Test base AppException"""
    
    def test_inheritance(self):
        """Verify all exceptions inherit from AppException"""
        assert issubclass(NotFoundError, AppException)
        assert issubclass(UnauthorizedError, AppException)
        assert issubclass(ForbiddenError, AppException)
        assert issubclass(ValidationError, AppException)
        assert issubclass(ConflictError, AppException)
        assert issubclass(RateLimitError, AppException)
