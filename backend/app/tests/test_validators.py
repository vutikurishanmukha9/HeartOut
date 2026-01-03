"""
Validator and Security Tests
Tests for password validation, email validation, security utilities
"""
import pytest
from app.core.security import (
    verify_password, get_password_hash, create_access_token,
    create_refresh_token, decode_token, validate_password
)
from datetime import timedelta


class TestPasswordHashing:
    """Tests for password hashing functions"""
    
    def test_hash_password_creates_hash(self):
        """Test that hashing creates a bcrypt hash"""
        hashed = get_password_hash("TestPassword123!")
        assert hashed.startswith("$2")
        assert len(hashed) > 50
        
    def test_hash_password_different_each_time(self):
        """Test that same password creates different hashes"""
        hash1 = get_password_hash("SamePassword!")
        hash2 = get_password_hash("SamePassword!")
        assert hash1 != hash2  # Salt makes them different
        
    def test_verify_password_correct(self):
        """Test verifying correct password"""
        password = "MySecurePass123!"
        hashed = get_password_hash(password)
        assert verify_password(password, hashed) == True
        
    def test_verify_password_incorrect(self):
        """Test verifying incorrect password"""
        hashed = get_password_hash("CorrectPassword!")
        assert verify_password("WrongPassword!", hashed) == False
        
    def test_verify_password_case_sensitive(self):
        """Test password verification is case sensitive"""
        hashed = get_password_hash("CaseSensitive!")
        assert verify_password("casesensitive!", hashed) == False
        
    def test_verify_password_empty(self):
        """Test empty password verification"""
        hashed = get_password_hash("SomePassword!")
        assert verify_password("", hashed) == False


class TestPasswordValidation:
    """Tests for password strength validation"""
    
    def test_password_too_short(self):
        """Test password length validation"""
        is_valid, error = validate_password("Short1!")
        assert is_valid == False
        assert "8 characters" in error
        
    def test_password_no_uppercase(self):
        """Test uppercase requirement"""
        is_valid, error = validate_password("lowercase123!")
        assert is_valid == False
        assert "uppercase" in error.lower()
        
    def test_password_no_lowercase(self):
        """Test lowercase requirement"""
        is_valid, error = validate_password("UPPERCASE123!")
        assert is_valid == False
        assert "lowercase" in error.lower()
        
    def test_password_no_digit(self):
        """Test digit requirement"""
        is_valid, error = validate_password("NoDigitsHere!")
        assert is_valid == False
        assert "digit" in error.lower()
        
    def test_password_no_special(self):
        """Test special character requirement"""
        is_valid, error = validate_password("NoSpecial123")
        assert is_valid == False
        assert "special" in error.lower()
        
    def test_password_valid(self):
        """Test valid password passes all checks"""
        is_valid, error = validate_password("ValidPass123!")
        assert is_valid == True
        assert error == ""
        
    def test_password_all_requirements(self):
        """Test password with all requirements"""
        is_valid, _ = validate_password("Abc123!@#xyz")
        assert is_valid == True


class TestJWTTokens:
    """Tests for JWT token creation and validation"""
    
    def test_create_access_token(self):
        """Test access token creation"""
        token = create_access_token(data={"sub": "user123"})
        assert isinstance(token, str)
        assert len(token) > 50
        
    def test_create_access_token_with_expiry(self):
        """Test access token with custom expiry"""
        token = create_access_token(
            data={"sub": "user123"}, 
            expires_delta=timedelta(hours=1)
        )
        assert isinstance(token, str)
        
    def test_create_refresh_token(self):
        """Test refresh token creation"""
        token = create_refresh_token(data={"sub": "user123"})
        assert isinstance(token, str)
        assert len(token) > 50
        
    def test_decode_token_valid(self):
        """Test decoding valid token"""
        token = create_access_token(data={"sub": "user123"})
        payload = decode_token(token)
        assert payload is not None
        assert payload["sub"] == "user123"
        assert payload["type"] == "access"
        
    def test_decode_token_has_jti(self):
        """Test token has JTI for revocation"""
        token = create_access_token(data={"sub": "user123"})
        payload = decode_token(token)
        assert "jti" in payload
        assert len(payload["jti"]) == 36  # UUID format
        
    def test_decode_refresh_token(self):
        """Test decoding refresh token"""
        token = create_refresh_token(data={"sub": "user456"})
        payload = decode_token(token)
        assert payload["sub"] == "user456"
        assert payload["type"] == "refresh"
        
    def test_decode_token_invalid(self):
        """Test decoding invalid token"""
        payload = decode_token("invalid.token.here")
        assert payload is None
        
    def test_decode_token_expired(self):
        """Test that expired tokens return None"""
        # Create token with negative expiry (already expired)
        token = create_access_token(
            data={"sub": "user123"},
            expires_delta=timedelta(seconds=-10)
        )
        payload = decode_token(token)
        assert payload is None
        
    def test_tokens_are_different(self):
        """Test that each token is unique"""
        token1 = create_access_token(data={"sub": "user123"})
        token2 = create_access_token(data={"sub": "user123"})
        assert token1 != token2  # JTI makes them different


class TestTokenPayload:
    """Tests for token payload contents"""
    
    def test_access_token_has_expiry(self):
        """Test access token has expiry claim"""
        token = create_access_token(data={"sub": "user"})
        payload = decode_token(token)
        assert "exp" in payload
        
    def test_refresh_token_has_expiry(self):
        """Test refresh token has expiry claim"""
        token = create_refresh_token(data={"sub": "user"})
        payload = decode_token(token)
        assert "exp" in payload
        
    def test_custom_claims_preserved(self):
        """Test custom claims are preserved in token"""
        token = create_access_token(data={
            "sub": "user123",
            "role": "admin"
        })
        payload = decode_token(token)
        assert payload["role"] == "admin"
