"""
Authentication Tests for HeartOut Backend
"""
import pytest
from app.models import User


# Use a strong password that meets requirements
VALID_PASSWORD = 'SecureP@ss123!'


class TestRegistration:
    """Test user registration"""
    
    def test_register_success(self, client):
        """Test successful user registration"""
        response = client.post('/api/auth/register', json={
            'username': 'newuser',
            'email': 'newuser@gmail.com',
            'password': VALID_PASSWORD
        })
        
        assert response.status_code == 201
        assert 'user' in response.json
        assert 'access_token' in response.json
    
    def test_register_duplicate_email(self, client):
        """Test registration with duplicate email"""
        # First registration
        client.post('/api/auth/register', json={
            'username': 'user1',
            'email': 'duplicate@gmail.com',
            'password': VALID_PASSWORD
        })
        
        # Second registration with same email
        response = client.post('/api/auth/register', json={
            'username': 'user2',
            'email': 'duplicate@gmail.com',
            'password': VALID_PASSWORD
        })
        
        assert response.status_code == 409
    
    def test_register_duplicate_username(self, client):
        """Test registration with duplicate username"""
        # First registration
        client.post('/api/auth/register', json={
            'username': 'duplicateuser',
            'email': 'user1@gmail.com',
            'password': VALID_PASSWORD
        })
        
        # Second registration with same username
        response = client.post('/api/auth/register', json={
            'username': 'duplicateuser',
            'email': 'user2@gmail.com',
            'password': VALID_PASSWORD
        })
        
        assert response.status_code == 409
    
    def test_register_invalid_email(self, client):
        """Test registration with invalid email format"""
        response = client.post('/api/auth/register', json={
            'username': 'testuser',
            'email': 'invalid-email',
            'password': VALID_PASSWORD
        })
        
        assert response.status_code == 400
    
    def test_register_weak_password(self, client):
        """Test registration with weak password"""
        response = client.post('/api/auth/register', json={
            'username': 'testuser',
            'email': 'test@gmail.com',
            'password': '123'  # Weak password
        })
        
        assert response.status_code == 400


class TestLogin:
    """Test user login"""
    
    def test_login_success(self, client):
        """Test successful login"""
        # Register first
        client.post('/api/auth/register', json={
            'username': 'loginuser',
            'email': 'login@gmail.com',
            'password': VALID_PASSWORD
        })
        
        # Login
        response = client.post('/api/auth/login', json={
            'email': 'login@gmail.com',
            'password': VALID_PASSWORD
        })
        
        assert response.status_code == 200
        assert 'access_token' in response.json
        assert 'refresh_token' in response.json
        assert 'user' in response.json
    
    def test_login_wrong_password(self, client):
        """Test login with wrong password"""
        # Register first
        client.post('/api/auth/register', json={
            'username': 'testuser',
            'email': 'test@gmail.com',
            'password': VALID_PASSWORD
        })
        
        # Login with wrong password
        response = client.post('/api/auth/login', json={
            'email': 'test@gmail.com',
            'password': 'WrongPassword123!'
        })
        
        assert response.status_code == 401
    
    def test_login_nonexistent_user(self, client):
        """Test login with non-existent email"""
        response = client.post('/api/auth/login', json={
            'email': 'nonexistent@gmail.com',
            'password': VALID_PASSWORD
        })
        
        assert response.status_code == 401


class TestProfile:
    """Test user profile endpoints"""
    
    def test_get_profile(self, client, auth_headers):
        """Test getting current user's profile"""
        response = client.get('/api/auth/profile', headers=auth_headers)
        
        assert response.status_code == 200
        assert 'user' in response.json
    
    def test_get_profile_unauthorized(self, client):
        """Test getting profile without authentication"""
        response = client.get('/api/auth/profile')
        
        assert response.status_code == 401
    
    def test_update_profile(self, client, auth_headers):
        """Test updating user profile"""
        response = client.put('/api/auth/profile', 
            headers=auth_headers,
            json={
                'display_name': 'Updated Name',
                'bio': 'This is my updated bio'
            }
        )
        
        assert response.status_code == 200


class TestLogout:
    """Test user logout"""
    
    def test_logout_success(self, client, auth_headers):
        """Test successful logout"""
        response = client.post('/api/auth/logout', headers=auth_headers)
        
        assert response.status_code == 200
        assert 'message' in response.json
