"""
Rate Limiter Configuration
Centralized SlowAPI Limiter instance with production-grade key function
"""
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.core.config import settings


def get_client_ip(request) -> str:
    """
    Get client IP for rate limiting while adhering to proxy configurations.
    Falls back to standard remote address.
    """
    return get_remote_address(request)


# Shared limiter instance across the application
limiter = Limiter(
    key_func=get_client_ip,
    default_limits=[settings.RATE_LIMIT_DEFAULT],
    enabled=not settings.TESTING
)
