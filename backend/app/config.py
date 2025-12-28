import os
import secrets

class Config:
    """Base configuration"""
    # Security
    SECRET_KEY = os.environ.get('SECRET_KEY')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    
    # Validate secrets in production
    if os.environ.get('FLASK_ENV') == 'production':
        if not SECRET_KEY or not JWT_SECRET_KEY:
            raise ValueError("SECRET_KEY and JWT_SECRET_KEY must be set in production!")
    
    # Development fallbacks with warnings
    if not SECRET_KEY:
        SECRET_KEY = secrets.token_hex(32)
        print("WARNING: Using generated SECRET_KEY for development. Set SECRET_KEY in production!")
    
    if not JWT_SECRET_KEY:
        JWT_SECRET_KEY = secrets.token_hex(32)
        print("WARNING: Using generated JWT_SECRET_KEY for development. Set JWT_SECRET_KEY in production!")
    
    # CSRF Protection
    WTF_CSRF_ENABLED = True
    WTF_CSRF_TIME_LIMIT = None  # No time limit for CSRF tokens
    WTF_CSRF_SSL_STRICT = os.environ.get('FLASK_ENV') == 'production'  # Require HTTPS in production
    
    # Database - Handle Render/Railway postgres:// URL format
    database_url = os.environ.get('DATABASE_URL', 'sqlite:///heartout.db')
    # Fix for SQLAlchemy 1.4+ which requires postgresql:// instead of postgres://
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    SQLALCHEMY_DATABASE_URI = database_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Connection Pooling for Production Performance
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_size': 5,           # Number of connections to keep open
        'pool_recycle': 300,      # Recycle connections after 5 minutes
        'pool_pre_ping': True,    # Verify connections before use (prevents stale connections)
        'max_overflow': 10,       # Allow 10 extra connections under load
    }
    
    # JWT Configuration
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour
    JWT_REFRESH_TOKEN_EXPIRES = 2592000  # 30 days
    
    # CORS
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:5173').split(',')
    
    # Rate Limiting (with memory fallback)
    RATELIMIT_STORAGE_URL = os.environ.get('REDIS_URL', 'memory://')
    RATELIMIT_ENABLED = True
    
    # Application
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    
    # Password Requirements
    PASSWORD_MIN_LENGTH = 8
    PASSWORD_REQUIRE_UPPERCASE = True
    PASSWORD_REQUIRE_LOWERCASE = True
    PASSWORD_REQUIRE_DIGIT = True
    PASSWORD_REQUIRE_SPECIAL = True
    PASSWORD_SPECIAL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?"


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False
    

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False
    RATELIMIT_ENABLED = False