"""
Password Validation Utility for FastAPI
Validates password strength with configurable requirements
"""
from typing import Tuple
from app.core.config import settings


def validate_password(password: str) -> Tuple[bool, str]:
    """
    Validate password strength against configured requirements.
    
    Args:
        password: Password string to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if len(password) < settings.PASSWORD_MIN_LENGTH:
        return False, f"Password must be at least {settings.PASSWORD_MIN_LENGTH} characters"
    
    if settings.PASSWORD_REQUIRE_UPPERCASE and not any(c.isupper() for c in password):
        return False, "Password must contain at least one uppercase letter"
    
    if settings.PASSWORD_REQUIRE_LOWERCASE and not any(c.islower() for c in password):
        return False, "Password must contain at least one lowercase letter"
    
    if settings.PASSWORD_REQUIRE_DIGIT and not any(c.isdigit() for c in password):
        return False, "Password must contain at least one digit"
    
    if settings.PASSWORD_REQUIRE_SPECIAL:
        special_chars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
        if not any(c in special_chars for c in password):
            return False, "Password must contain at least one special character"
    
    return True, ""


def get_password_requirements() -> dict:
    """Get password requirements for user feedback"""
    return {
        "min_length": settings.PASSWORD_MIN_LENGTH,
        "require_uppercase": settings.PASSWORD_REQUIRE_UPPERCASE,
        "require_lowercase": settings.PASSWORD_REQUIRE_LOWERCASE,
        "require_digit": settings.PASSWORD_REQUIRE_DIGIT,
        "require_special": settings.PASSWORD_REQUIRE_SPECIAL,
        "special_chars": "!@#$%^&*()_+-=[]{}|;:,.<>?"
    }
