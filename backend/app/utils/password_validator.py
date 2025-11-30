"""Password validation utilities"""
import re
from flask import current_app


def validate_password(password):
    """
    Validate password against security requirements.
    
    Returns:
        tuple: (is_valid, error_message)
    """
    config = current_app.config
    
    # Check minimum length
    min_length = config.get('PASSWORD_MIN_LENGTH', 8)
    if len(password) < min_length:
        return False, f"Password must be at least {min_length} characters long"
    
    # Check for uppercase letter
    if config.get('PASSWORD_REQUIRE_UPPERCASE', True):
        if not re.search(r'[A-Z]', password):
            return False, "Password must contain at least one uppercase letter"
    
    # Check for lowercase letter
    if config.get('PASSWORD_REQUIRE_LOWERCASE', True):
        if not re.search(r'[a-z]', password):
            return False, "Password must contain at least one lowercase letter"
    
    # Check for digit
    if config.get('PASSWORD_REQUIRE_DIGIT', True):
        if not re.search(r'\d', password):
            return False, "Password must contain at least one number"
    
    # Check for special character
    if config.get('PASSWORD_REQUIRE_SPECIAL', True):
        special_chars = config.get('PASSWORD_SPECIAL_CHARS', "!@#$%^&*()_+-=[]{}|;:,.<>?")
        if not any(char in special_chars for char in password):
            return False, f"Password must contain at least one special character ({special_chars})"
    
    return True, None


def get_password_requirements():
    """
    Get password requirements as a human-readable string.
    
    Returns:
        str: Password requirements description
    """
    config = current_app.config
    requirements = []
    
    min_length = config.get('PASSWORD_MIN_LENGTH', 8)
    requirements.append(f"at least {min_length} characters")
    
    if config.get('PASSWORD_REQUIRE_UPPERCASE', True):
        requirements.append("one uppercase letter")
    
    if config.get('PASSWORD_REQUIRE_LOWERCASE', True):
        requirements.append("one lowercase letter")
    
    if config.get('PASSWORD_REQUIRE_DIGIT', True):
        requirements.append("one number")
    
    if config.get('PASSWORD_REQUIRE_SPECIAL', True):
        requirements.append("one special character")
    
    return "Password must contain: " + ", ".join(requirements)
