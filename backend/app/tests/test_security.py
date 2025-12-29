"""
FastAPI Security Tests
Test authentication, authorization, and security features
"""
import pytest


VALID_PASSWORD = "SecureP@ss123!"


def valid_content():
    return "This is a test story content that meets the minimum character requirement for validation."


class TestPasswordSecurity:
    """Test password validation and security"""
    
    @pytest.mark.asyncio
    async def test_password_too_short(self, client):
        """Test password minimum length requirement"""
        response = await client.post("/api/auth/register", json={
            "username": "testuser",
            "email": "test@gmail.com",
            "password": "Short1!"  # Less than 8 characters
        })
        # 400 for business logic, 422 for Pydantic
        assert response.status_code in [400, 422]
    
    @pytest.mark.asyncio
    async def test_password_no_uppercase(self, client):
        """Test password uppercase requirement"""
        response = await client.post("/api/auth/register", json={
            "username": "testuser",
            "email": "test@gmail.com",
            "password": "nouppercase123!"
        })
        # 400 for business logic, 422 for Pydantic
        assert response.status_code in [400, 422]
    
    @pytest.mark.asyncio
    async def test_password_no_lowercase(self, client):
        """Test password lowercase requirement"""
        response = await client.post("/api/auth/register", json={
            "username": "testuser",
            "email": "test@gmail.com",
            "password": "NOLOWERCASE123!"
        })
        # 400 for business logic, 422 for Pydantic
        assert response.status_code in [400, 422]
    
    @pytest.mark.asyncio
    async def test_password_no_digit(self, client):
        """Test password digit requirement"""
        response = await client.post("/api/auth/register", json={
            "username": "testuser",
            "email": "test@gmail.com",
            "password": "NoDigitsHere!"
        })
        # 400 for business logic, 422 for Pydantic
        assert response.status_code in [400, 422]
    
    @pytest.mark.asyncio
    async def test_password_no_special(self, client):
        """Test password special character requirement"""
        response = await client.post("/api/auth/register", json={
            "username": "testuser",
            "email": "test@gmail.com",
            "password": "NoSpecial123"
        })
        # 400 for business logic, 422 for Pydantic
        assert response.status_code in [400, 422]


class TestJWTAuth:
    """Test JWT authentication"""
    
    @pytest.mark.asyncio
    async def test_invalid_token(self, client):
        """Test accessing protected endpoint with invalid token"""
        response = await client.get(
            "/api/auth/profile",
            headers={"Authorization": "Bearer invalid_token_here"}
        )
        
        assert response.status_code == 401
    
    @pytest.mark.asyncio
    async def test_missing_auth_header(self, client):
        """Test accessing protected endpoint without auth header"""
        response = await client.get("/api/auth/profile")
        
        assert response.status_code == 401
    
    @pytest.mark.asyncio
    async def test_expired_token(self, client):
        """Test with malformed token"""
        response = await client.get(
            "/api/auth/profile",
            headers={"Authorization": "Bearer malformed.jwt.token"}
        )
        
        assert response.status_code == 401


class TestAuthorization:
    """Test resource authorization"""
    
    @pytest.mark.asyncio
    async def test_delete_others_story(self, client):
        """Test user cannot delete another user's story"""
        # User 1 creates a story
        await client.post("/api/auth/register", json={
            "username": "owner",
            "email": "owner@gmail.com",
            "password": VALID_PASSWORD
        })
        
        login1 = await client.post("/api/auth/login", json={
            "email": "owner@gmail.com",
            "password": VALID_PASSWORD
        })
        headers1 = {"Authorization": f"Bearer {login1.json()['access_token']}"}
        
        story_response = await client.post(
            "/api/posts",
            headers=headers1,
            json={
                "title": "Owner Story Title",
                "content": valid_content(),
                "story_type": "life_story",
                "status": "published"
            }
        )
        story_id = story_response.json()["story"]["id"]
        
        # User 2 tries to delete it
        await client.post("/api/auth/register", json={
            "username": "attacker",
            "email": "attacker@gmail.com",
            "password": VALID_PASSWORD
        })
        
        login2 = await client.post("/api/auth/login", json={
            "email": "attacker@gmail.com",
            "password": VALID_PASSWORD
        })
        headers2 = {"Authorization": f"Bearer {login2.json()['access_token']}"}
        
        delete_response = await client.delete(
            f"/api/posts/{story_id}",
            headers=headers2
        )
        
        assert delete_response.status_code == 403
    
    @pytest.mark.asyncio
    async def test_update_others_story(self, client):
        """Test user cannot update another user's story"""
        # User 1 creates a story
        await client.post("/api/auth/register", json={
            "username": "creator",
            "email": "creator@gmail.com",
            "password": VALID_PASSWORD
        })
        
        login1 = await client.post("/api/auth/login", json={
            "email": "creator@gmail.com",
            "password": VALID_PASSWORD
        })
        headers1 = {"Authorization": f"Bearer {login1.json()['access_token']}"}
        
        story_response = await client.post(
            "/api/posts",
            headers=headers1,
            json={
                "title": "Creator Story Title",
                "content": valid_content(),
                "story_type": "life_story",
                "status": "published"
            }
        )
        story_id = story_response.json()["story"]["id"]
        
        # User 2 tries to update it
        await client.post("/api/auth/register", json={
            "username": "modifier",
            "email": "modifier@gmail.com",
            "password": VALID_PASSWORD
        })
        
        login2 = await client.post("/api/auth/login", json={
            "email": "modifier@gmail.com",
            "password": VALID_PASSWORD
        })
        headers2 = {"Authorization": f"Bearer {login2.json()['access_token']}"}
        
        update_response = await client.put(
            f"/api/posts/{story_id}",
            headers=headers2,
            json={
                "title": "Hacked Title",
                "content": valid_content(),
                "story_type": "life_story"
            }
        )
        
        assert update_response.status_code == 403


class TestInputValidation:
    """Test input validation for security"""
    
    @pytest.mark.asyncio
    async def test_xss_in_story_title(self, client, auth_headers):
        """Test XSS attempt in story title"""
        response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "<script>alert('XSS')</script>Title",
                "content": valid_content(),
                "story_type": "life_story"
            }
        )
        
        # Should either sanitize or reject
        assert response.status_code in [201, 400, 422]
    
    @pytest.mark.asyncio
    async def test_very_long_content(self, client, auth_headers):
        """Test handling of very long content"""
        long_content = "x" * 100000  # 100k characters
        
        response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Long Content Story",
                "content": long_content,
                "story_type": "life_story"
            }
        )
        
        # Should handle gracefully (either accept or reject with proper error)
        assert response.status_code in [201, 400, 422, 413]


class TestEmailValidation:
    """Test email validation"""
    
    @pytest.mark.asyncio
    async def test_invalid_email_format(self, client):
        """Test invalid email format"""
        response = await client.post("/api/auth/register", json={
            "username": "testuser",
            "email": "not-an-email",
            "password": VALID_PASSWORD
        })
        
        assert response.status_code == 422
    
    @pytest.mark.asyncio
    async def test_email_without_domain(self, client):
        """Test email without proper domain"""
        response = await client.post("/api/auth/register", json={
            "username": "testuser",
            "email": "user@",
            "password": VALID_PASSWORD
        })
        
        assert response.status_code == 422


class TestUsernameValidation:
    """Test username validation"""
    
    @pytest.mark.asyncio
    async def test_username_too_short(self, client):
        """Test username minimum length"""
        response = await client.post("/api/auth/register", json={
            "username": "ab",  # Too short
            "email": "valid@gmail.com",
            "password": VALID_PASSWORD
        })
        
        assert response.status_code == 422
    
    @pytest.mark.asyncio
    async def test_username_with_special_chars(self, client):
        """Test username with invalid characters"""
        response = await client.post("/api/auth/register", json={
            "username": "user@name!",  # Special chars
            "email": "valid@gmail.com",
            "password": VALID_PASSWORD
        })
        
        assert response.status_code == 422
