"""
FastAPI Application Configuration
Using Pydantic Settings for type-safe configuration
"""
import os
from typing import List, Any
from pydantic import field_validator
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # Application
    APP_NAME: str = "HeartOut API"
    DEBUG: bool = os.getenv("FLASK_ENV", "development") != "production"
    
    # Database - get from environment, same as Flask app
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///heartout.db")
    
    @property
    def ASYNC_DATABASE_URL(self) -> str:
        """Convert sync database URL to async format"""
        url = self.DATABASE_URL
        
        # Handle SQLite (use aiosqlite)
        if url.startswith("sqlite"):
            return url.replace("sqlite:///", "sqlite+aiosqlite:///")
        
        # Handle PostgreSQL (use asyncpg)
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        
        # asyncpg doesn't support 'sslmode', it uses 'ssl' instead
        # Remove sslmode parameter as asyncpg handles SSL differently
        if "sslmode=" in url:
            # Remove sslmode parameter from URL
            import re
            url = re.sub(r'[?&]sslmode=[^&]*', '', url)
            # Clean up any leftover ? or & at the end
            url = re.sub(r'\?$', '', url)
            url = re.sub(r'\?&', '?', url)
        
        return url
    
    @property
    def IS_SQLITE(self) -> bool:
        """Check if using SQLite database"""
        return self.DATABASE_URL.startswith("sqlite")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "jwt-secret-key-change-in-production")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60  # 1 hour
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://heartout.vercel.app",
        "https://heart-out.vercel.app",
        "https://heartout.onrender.com"
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Any) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        if isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_HOUR: int = 500
    
    # Redis (optional)
    REDIS_URL: str = os.getenv("REDIS_URL", "")
    
    # Password Requirements
    PASSWORD_MIN_LENGTH: int = 8
    PASSWORD_REQUIRE_UPPERCASE: bool = True
    PASSWORD_REQUIRE_LOWERCASE: bool = True
    PASSWORD_REQUIRE_DIGIT: bool = True
    PASSWORD_REQUIRE_SPECIAL: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance"""
    return Settings()


settings = get_settings()
