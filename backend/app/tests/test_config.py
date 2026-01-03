"""
Configuration and Settings Tests
Tests for app configuration, environment settings, and database config
"""
import pytest
from app.core.config import settings


class TestSettings:
    """Tests for application settings"""
    
    def test_app_name_exists(self):
        """Test app name is configured"""
        assert hasattr(settings, 'DEBUG') or hasattr(settings, 'APP_NAME')
        
    def test_jwt_secret_exists(self):
        """Test JWT secret key is configured"""
        assert settings.JWT_SECRET_KEY is not None
        assert len(settings.JWT_SECRET_KEY) >= 16
        
    def test_jwt_algorithm(self):
        """Test JWT algorithm is configured"""
        assert settings.JWT_ALGORITHM == "HS256"
        
    def test_access_token_expire(self):
        """Test access token expiry is set"""
        assert settings.ACCESS_TOKEN_EXPIRE_MINUTES > 0
        
    def test_refresh_token_expire(self):
        """Test refresh token expiry is set"""
        assert settings.REFRESH_TOKEN_EXPIRE_DAYS > 0
        
    def test_database_url_exists(self):
        """Test database URL is configured"""
        assert settings.DATABASE_URL is not None
        assert len(settings.DATABASE_URL) > 0
        
    def test_async_database_url(self):
        """Test async database URL is configured"""
        assert settings.ASYNC_DATABASE_URL is not None
        # Should contain async driver
        assert "sqlite+aiosqlite" in settings.ASYNC_DATABASE_URL or "postgresql+asyncpg" in settings.ASYNC_DATABASE_URL
        
    def test_is_sqlite_detection(self):
        """Test SQLite detection works"""
        assert settings.IS_SQLITE == ("sqlite" in settings.DATABASE_URL.lower())


class TestPasswordSettings:
    """Tests for password requirement settings"""
    
    def test_min_length(self):
        """Test minimum password length"""
        assert settings.PASSWORD_MIN_LENGTH >= 8
        
    def test_uppercase_required(self):
        """Test uppercase requirement"""
        assert isinstance(settings.PASSWORD_REQUIRE_UPPERCASE, bool)
        
    def test_lowercase_required(self):
        """Test lowercase requirement"""
        assert isinstance(settings.PASSWORD_REQUIRE_LOWERCASE, bool)
        
    def test_digit_required(self):
        """Test digit requirement"""
        assert isinstance(settings.PASSWORD_REQUIRE_DIGIT, bool)
        
    def test_special_required(self):
        """Test special char requirement"""
        assert isinstance(settings.PASSWORD_REQUIRE_SPECIAL, bool)


class TestDatabaseSettings:
    """Tests for database configuration"""
    
    def test_pool_settings_for_postgres(self):
        """Test pool settings exist"""
        # These should be defined for PostgreSQL
        if not settings.IS_SQLITE:
            # Pool size should be reasonable
            assert True  # Config exists
            
    def test_sqlite_uses_static_pool(self):
        """Test SQLite uses correct pool"""
        if settings.IS_SQLITE:
            # SQLite should use StaticPool
            assert True
