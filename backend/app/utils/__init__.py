"""
FastAPI Utils Module
Contains utility functions and helpers
"""

from app.utils.exceptions import (
    APIError, NotFoundError, UnauthorizedError, ForbiddenError,
    ValidationError, ConflictError, RateLimitError, InternalServerError
)
from app.utils.cache import cache, async_cached, AsyncCache
from app.utils.password_validator import validate_password, get_password_requirements
from app.utils.reading_time import calculate_reading_time, calculate_reading_time_detailed

__all__ = [
    # Exceptions
    "APIError", "NotFoundError", "UnauthorizedError", "ForbiddenError",
    "ValidationError", "ConflictError", "RateLimitError", "InternalServerError",
    # Cache
    "cache", "async_cached", "AsyncCache",
    # Password
    "validate_password", "get_password_requirements",
    # Reading time
    "calculate_reading_time", "calculate_reading_time_detailed",
]

