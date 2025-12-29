"""
FastAPI Authentication Tests
"""
import pytest


# Use a strong password that meets requirements
VALID_PASSWORD = "SecureP@ss123!"


class TestRegistration:
    """Test user registration"""
    
    @pytest.mark.asyncio
    async def test_register_success(self, client):
        """Test successful user registration"""
        response = await client.post("/api/auth/register", json={
            "username": "newuser",
            "email": "newuser@gmail.com",
            "password": VALID_PASSWORD
        })
        
        assert response.status_code == 201
        data = response.json()
        assert "user" in data
        assert "access_token" in data
    
    @pytest.mark.asyncio
    async def test_register_duplicate_email(self, client):
        """Test registration with duplicate email"""
        # First registration
        await client.post("/api/auth/register", json={
            "username": "user1",
            "email": "duplicate@gmail.com",
            "password": VALID_PASSWORD
        })
        
        # Second registration with same email
        response = await client.post("/api/auth/register", json={
            "username": "user2",
            "email": "duplicate@gmail.com",
            "password": VALID_PASSWORD
        })
        
        assert response.status_code == 409
    
    @pytest.mark.asyncio
    async def test_register_duplicate_username(self, client):
        """Test registration with duplicate username"""
        # First registration
        await client.post("/api/auth/register", json={
            "username": "duplicateuser",
            "email": "user1@gmail.com",
            "password": VALID_PASSWORD
        })
        
        # Second registration with same username
        response = await client.post("/api/auth/register", json={
            "username": "duplicateuser",
            "email": "user2@gmail.com",
            "password": VALID_PASSWORD
        })
        
        assert response.status_code == 409
    
    @pytest.mark.asyncio
    async def test_register_invalid_email(self, client):
        """Test registration with invalid email format"""
        response = await client.post("/api/auth/register", json={
            "username": "testuser",
            "email": "invalid-email",
            "password": VALID_PASSWORD
        })
        
        assert response.status_code == 422  # Pydantic validation error
    
    @pytest.mark.asyncio
    async def test_register_weak_password(self, client):
        """Test registration with weak password"""
        response = await client.post("/api/auth/register", json={
            "username": "testuser",
            "email": "test@gmail.com",
            "password": "123"  # Weak password
        })
        
        # 400 for business logic validation, 422 for Pydantic validation
        assert response.status_code in [400, 422]


class TestLogin:
    """Test user login"""
    
    @pytest.mark.asyncio
    async def test_login_success(self, client):
        """Test successful login"""
        # Register first
        await client.post("/api/auth/register", json={
            "username": "loginuser",
            "email": "login@gmail.com",
            "password": VALID_PASSWORD
        })
        
        # Login
        response = await client.post("/api/auth/login", json={
            "email": "login@gmail.com",
            "password": VALID_PASSWORD
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert "user" in data
    
    @pytest.mark.asyncio
    async def test_login_wrong_password(self, client):
        """Test login with wrong password"""
        # Register first
        await client.post("/api/auth/register", json={
            "username": "testuser",
            "email": "test@gmail.com",
            "password": VALID_PASSWORD
        })
        
        # Login with wrong password
        response = await client.post("/api/auth/login", json={
            "email": "test@gmail.com",
            "password": "WrongPassword123!"
        })
        
        assert response.status_code == 401
    
    @pytest.mark.asyncio
    async def test_login_nonexistent_user(self, client):
        """Test login with non-existent email"""
        response = await client.post("/api/auth/login", json={
            "email": "nonexistent@gmail.com",
            "password": VALID_PASSWORD
        })
        
        assert response.status_code == 401


class TestProfile:
    """Test user profile endpoints"""
    
    @pytest.mark.asyncio
    async def test_get_profile(self, client, auth_headers):
        """Test getting current user's profile"""
        response = await client.get("/api/auth/profile", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert "user" in data
    
    @pytest.mark.asyncio
    async def test_get_profile_unauthorized(self, client):
        """Test getting profile without authentication"""
        response = await client.get("/api/auth/profile")
        
        assert response.status_code == 401
    
    @pytest.mark.asyncio
    async def test_update_profile(self, client, auth_headers):
        """Test updating user profile"""
        response = await client.put(
            "/api/auth/profile",
            headers=auth_headers,
            json={
                "display_name": "Updated Name",
                "bio": "This is my updated bio"
            }
        )
        
        assert response.status_code == 200


class TestLogout:
    """Test user logout"""
    
    @pytest.mark.asyncio
    async def test_logout_success(self, client, auth_headers):
        """Test successful logout"""
        response = await client.post("/api/auth/logout", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert "message" in data


class TestRefreshToken:
    """Test token refresh"""
    
    @pytest.mark.asyncio
    async def test_refresh_token(self, client):
        """Test refreshing access token"""
        # Register and login
        await client.post("/api/auth/register", json={
            "username": "refreshuser",
            "email": "refresh@gmail.com",
            "password": VALID_PASSWORD
        })
        
        login_response = await client.post("/api/auth/login", json={
            "email": "refresh@gmail.com",
            "password": VALID_PASSWORD
        })
        
        refresh_token = login_response.json().get("refresh_token")
        
        # Refresh the token
        response = await client.post("/api/auth/refresh", json={
            "refresh_token": refresh_token
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
