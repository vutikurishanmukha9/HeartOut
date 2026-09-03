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


class TestAdminPrivilegeHardening:
    """Test role hierarchy and self-action protections"""

    @pytest.mark.asyncio
    async def test_admin_cannot_suspend_self(self, client, db_session):
        """Verify an admin cannot deactivate their own account"""
        from app.models.models import User, UserRole
        from app.core.security import create_access_token
        
        admin = User(username="superadmin", email="super@gmail.com", role=UserRole.ADMIN.value)
        admin.set_password(VALID_PASSWORD)
        db_session.add(admin)
        await db_session.commit()
        await db_session.refresh(admin)
        
        token = create_access_token(data={"sub": admin.public_id})
        headers = {"Authorization": f"Bearer {token}"}
        
        res = await client.put(f"/api/admin/users/{admin.public_id}/suspend", headers=headers)
        assert res.status_code == 400
        assert "Cannot suspend your own account" in res.json().get("error", "")

    @pytest.mark.asyncio
    async def test_moderator_cannot_suspend_admin(self, client, db_session):
        """Verify a moderator cannot suspend an administrator"""
        from app.models.models import User, UserRole
        from app.core.security import create_access_token
        
        admin = User(username="targetadmin", email="target@gmail.com", role=UserRole.ADMIN.value)
        admin.set_password(VALID_PASSWORD)
        
        mod = User(username="moderator1", email="mod@gmail.com", role=UserRole.MODERATOR.value)
        mod.set_password(VALID_PASSWORD)
        
        db_session.add_all([admin, mod])
        await db_session.commit()
        await db_session.refresh(admin)
        await db_session.refresh(mod)
        
        mod_token = create_access_token(data={"sub": mod.public_id})
        headers = {"Authorization": f"Bearer {mod_token}"}
        
        res = await client.put(f"/api/admin/users/{admin.public_id}/suspend", headers=headers)
        assert res.status_code == 403
        assert "Moderators cannot suspend administrators" in res.json().get("error", "")
