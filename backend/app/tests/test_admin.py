"""
FastAPI Admin Tests
Test admin dashboard and moderation endpoints
"""
import pytest


VALID_PASSWORD = "SecureP@ss123!"


def valid_content():
    return "This is a test story content that meets the minimum character requirement for validation."


class TestAdminAccess:
    """Test admin endpoint access control"""
    
    @pytest.mark.asyncio
    async def test_admin_dashboard_unauthorized(self, client):
        """Test admin dashboard without authentication"""
        response = await client.get("/api/admin/dashboard")
        
        assert response.status_code == 401
    
    @pytest.mark.asyncio
    async def test_admin_dashboard_non_admin(self, client, auth_headers):
        """Test regular user cannot access admin dashboard"""
        response = await client.get("/api/admin/dashboard", headers=auth_headers)
        
        assert response.status_code == 403
    
    @pytest.mark.asyncio
    async def test_admin_users_unauthorized(self, client):
        """Test admin users list without authentication"""
        response = await client.get("/api/admin/users")
        
        assert response.status_code == 401
    
    @pytest.mark.asyncio
    async def test_admin_users_non_admin(self, client, auth_headers):
        """Test regular user cannot access admin users list"""
        response = await client.get("/api/admin/users", headers=auth_headers)
        
        assert response.status_code == 403


class TestAdminPosts:
    """Test admin post moderation endpoints"""
    
    @pytest.mark.asyncio
    async def test_flagged_posts_unauthorized(self, client):
        """Test getting flagged posts without auth"""
        response = await client.get("/api/admin/posts/flagged")
        
        assert response.status_code == 401
    
    @pytest.mark.asyncio
    async def test_flagged_posts_non_admin(self, client, auth_headers):
        """Test regular user cannot access flagged posts"""
        response = await client.get("/api/admin/posts/flagged", headers=auth_headers)
        
        assert response.status_code == 403
    
    @pytest.mark.asyncio
    async def test_moderate_post_unauthorized(self, client):
        """Test post moderation without auth"""
        response = await client.post(
            "/api/admin/posts/some-id/moderate",
            params={"action": "approve"}
        )
        
        assert response.status_code == 401


class TestAdminComments:
    """Test admin comment moderation"""
    
    @pytest.mark.asyncio
    async def test_flagged_comments_unauthorized(self, client):
        """Test getting flagged comments without auth"""
        response = await client.get("/api/admin/comments/flagged")
        
        assert response.status_code == 401
    
    @pytest.mark.asyncio
    async def test_delete_comment_unauthorized(self, client):
        """Test deleting comment without auth"""
        response = await client.delete("/api/admin/comments/some-id")
        
        assert response.status_code == 401
