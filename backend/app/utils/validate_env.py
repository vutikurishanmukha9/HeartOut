"""
Environment Variable Validation Utility
Validates required environment variables on application startup.
"""
import os
import sys
import secrets


class EnvironmentError(Exception):
    """Raised when environment configuration is invalid."""
    pass


# Required environment variables for production
REQUIRED_VARS = {
    'SECRET_KEY': 'Flask secret key for session management',
    'JWT_SECRET_KEY': 'Secret key for JWT token signing',
}

# Optional but recommended variables
RECOMMENDED_VARS = {
    'DATABASE_URL': 'Production database connection string',
    'REDIS_URL': 'Redis URL for rate limiting and caching',
}

# Development fallback keys (only used when FLASK_ENV=development)
DEV_FALLBACKS = {
    'SECRET_KEY': lambda: secrets.token_hex(32),
    'JWT_SECRET_KEY': lambda: secrets.token_hex(32),
}


def validate_environment(app):
    """
    Validate environment variables on application startup.
    
    In development mode: Uses secure random fallbacks with warnings.
    In production mode: Fails if required variables are missing.
    """
    is_development = os.environ.get('FLASK_ENV', 'development') == 'development'
    is_testing = app.config.get('TESTING', False)
    
    # Skip validation in testing
    if is_testing:
        return
    
    missing_required = []
    warnings = []
    
    # Check required variables
    for var, description in REQUIRED_VARS.items():
        value = os.environ.get(var)
        
        if not value:
            if is_development and var in DEV_FALLBACKS:
                # Generate secure fallback for development
                fallback_value = DEV_FALLBACKS[var]()
                os.environ[var] = fallback_value
                app.config[var] = fallback_value
                warnings.append(f"⚠️  {var} not set. Using secure random value for development.")
            else:
                missing_required.append(f"  - {var}: {description}")
        else:
            # Validate key strength
            if var in ['SECRET_KEY', 'JWT_SECRET_KEY'] and len(value) < 32:
                if is_development:
                    warnings.append(f"⚠️  {var} is weak (< 32 chars). Consider using a stronger key.")
                else:
                    missing_required.append(f"  - {var}: Must be at least 32 characters for production")
    
    # Check recommended variables (warnings only)
    for var, description in RECOMMENDED_VARS.items():
        if not os.environ.get(var):
            warnings.append(f"💡 {var} not set: {description}")
    
    # Print warnings
    if warnings:
        print("\n" + "=" * 60)
        print("CONFIGURATION WARNINGS")
        print("=" * 60)
        for warning in warnings:
            print(warning)
        print("=" * 60 + "\n")
    
    # Fail in production if required vars missing
    if missing_required and not is_development:
        error_msg = "\n" + "=" * 60 + "\n"
        error_msg += "FATAL: Missing required environment variables\n"
        error_msg += "=" * 60 + "\n"
        error_msg += "\n".join(missing_required)
        error_msg += "\n\nPlease set these variables before running in production."
        error_msg += "\n" + "=" * 60
        
        print(error_msg, file=sys.stderr)
        raise EnvironmentError("Missing required environment variables for production")


def get_secret_key():
    """Get or generate SECRET_KEY."""
    key = os.environ.get('SECRET_KEY')
    if not key:
        key = secrets.token_hex(32)
        os.environ['SECRET_KEY'] = key
    return key


def get_jwt_secret_key():
    """Get or generate JWT_SECRET_KEY."""
    key = os.environ.get('JWT_SECRET_KEY')
    if not key:
        key = secrets.token_hex(32)
        os.environ['JWT_SECRET_KEY'] = key
    return key
