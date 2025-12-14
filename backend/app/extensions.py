"""
Flask Extensions Initialization
Configures all Flask extensions with production-ready defaults.
"""
import os
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address


db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


def get_limiter_storage_uri():
    """
    Get rate limiter storage URI.
    
    Production: Use Redis for distributed rate limiting across instances.
    Development: Fall back to memory-based storage.
    
    Set REDIS_URL environment variable for production use:
        REDIS_URL=redis://localhost:6379/0
    """
    redis_url = os.environ.get('REDIS_URL')
    
    if redis_url:
        return redis_url
    
    # Memory fallback for development
    # Note: Memory storage doesn't work across multiple server instances
    return "memory://"


# Rate limiter with Redis support for production
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri=get_limiter_storage_uri(),
    strategy="fixed-window",  # Use fixed-window for Redis compatibility
)