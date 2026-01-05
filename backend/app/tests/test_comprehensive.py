"""
Comprehensive Backend Tests - Covers ALL Routes and Edge Cases
"""
import pytest


# ============================================================================
# HELPERS
# ============================================================================

def valid_content():
    """Generate valid story content (50+ chars)"""
    return "This is a test story content that meets the minimum length requirement for validation."

def valid_title():
    """Generate valid story title (5+ chars)"""
    return "Test Story Title"


VALID_PASSWORD = "SecureP@ss123!"
# Valid story types from schema
VALID_STORY_TYPES = ['achievement', 'regret', 'unsent_letter', 'sacrifice', 'life_story', 'other']
# Valid support types from schema  
VALID_SUPPORT_TYPES = ['felt_this', 'holding_space', 'moved', 'brave', 'grateful']


# ============================================================================
# HEALTH ENDPOINTS
# ============================================================================

class TestHealthEndpoints:
    """Test health endpoints"""
    
    @pytest.mark.asyncio
    async def test_health_check(self, client):
        """Test health endpoint"""
        response = await client.get("/api/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
    
    @pytest.mark.asyncio
    async def test_root_endpoint(self, client):
        """Test root endpoint"""
        response = await client.get("/")
        assert response.status_code == 200
        assert "HeartOut" in response.json()["name"]
    
    @pytest.mark.asyncio
    async def test_docs_available(self, client):
        """Test docs are available"""
        response = await client.get("/api/docs")
        assert response.status_code == 200


# ============================================================================
# AUTH REGISTRATION
# ============================================================================

class TestAuthRegistration:
    """Test user registration"""
    
    @pytest.mark.asyncio
    async def test_register_success(self, client):
        """Test successful registration"""
        response = await client.post("/api/auth/register", json={
            "username": "newuser",
            "email": "new@gmail.com",
            "password": VALID_PASSWORD
        })
        assert response.status_code == 201
        assert "access_token" in response.json()
    
    @pytest.mark.asyncio
    async def test_register_duplicate_email(self, client):
        """Test duplicate email rejected"""
        await client.post("/api/auth/register", json={
            "username": "userone", "email": "dup@gmail.com", "password": VALID_PASSWORD
        })
        response = await client.post("/api/auth/register", json={
            "username": "usertwo", "email": "dup@gmail.com", "password": VALID_PASSWORD
        })
        assert response.status_code == 409
    
    @pytest.mark.asyncio
    async def test_register_duplicate_username(self, client):
        """Test duplicate username rejected"""
        await client.post("/api/auth/register", json={
            "username": "dupname", "email": "a@gmail.com", "password": VALID_PASSWORD
        })
        response = await client.post("/api/auth/register", json={
            "username": "dupname", "email": "b@gmail.com", "password": VALID_PASSWORD
        })
        assert response.status_code == 409
    
    @pytest.mark.asyncio
    async def test_register_invalid_email(self, client):
        """Test invalid email rejected"""
        response = await client.post("/api/auth/register", json={
            "username": "test", "email": "not-email", "password": VALID_PASSWORD
        })
        assert response.status_code == 422
    
    @pytest.mark.asyncio
    async def test_register_weak_password(self, client):
        """Test weak password rejected"""
        response = await client.post("/api/auth/register", json={
            "username": "test", "email": "test@gmail.com", "password": "weak"
        })
        # Password validation can return 400 or 422
        assert response.status_code in [400, 422]


# ============================================================================
# AUTH LOGIN
# ============================================================================

class TestAuthLogin:
    """Test user login"""
    
    @pytest.mark.asyncio
    async def test_login_success(self, client):
        """Test successful login"""
        await client.post("/api/auth/register", json={
            "username": "loginuser", "email": "login@gmail.com", "password": VALID_PASSWORD
        })
        response = await client.post("/api/auth/login", json={
            "email": "login@gmail.com", "password": VALID_PASSWORD
        })
        assert response.status_code == 200
        assert "access_token" in response.json()
    
    @pytest.mark.asyncio
    async def test_login_wrong_password(self, client):
        """Test wrong password rejected"""
        await client.post("/api/auth/register", json={
            "username": "wrongpw", "email": "wp@gmail.com", "password": VALID_PASSWORD
        })
        response = await client.post("/api/auth/login", json={
            "email": "wp@gmail.com", "password": "WrongP@ss99!"
        })
        assert response.status_code == 401
    
    @pytest.mark.asyncio
    async def test_login_nonexistent(self, client):
        """Test nonexistent user rejected"""
        response = await client.post("/api/auth/login", json={
            "email": "noexist@gmail.com", "password": VALID_PASSWORD
        })
        assert response.status_code == 401


# ============================================================================
# AUTH TOKENS
# ============================================================================

class TestAuthTokens:
    """Test token operations"""
    
    @pytest.mark.asyncio
    async def test_refresh_token(self, client):
        """Test token refresh"""
        await client.post("/api/auth/register", json={
            "username": "refuser", "email": "ref@gmail.com", "password": VALID_PASSWORD
        })
        login = await client.post("/api/auth/login", json={
            "email": "ref@gmail.com", "password": VALID_PASSWORD
        })
        response = await client.post("/api/auth/refresh", json={
            "refresh_token": login.json()["refresh_token"]
        })
        assert response.status_code == 200
        assert "access_token" in response.json()
    
    @pytest.mark.asyncio
    async def test_protected_without_token(self, client):
        """Test protected route without token"""
        response = await client.get("/api/auth/profile")
        assert response.status_code == 401
    
    @pytest.mark.asyncio
    async def test_get_profile(self, client, auth_headers):
        """Test getting profile"""
        response = await client.get("/api/auth/profile", headers=auth_headers)
        assert response.status_code == 200
        assert "user" in response.json()
    
    @pytest.mark.asyncio
    async def test_logout(self, client, auth_headers):
        """Test logout"""
        response = await client.post("/api/auth/logout", headers=auth_headers)
        assert response.status_code == 200


# ============================================================================
# STORY CRUD
# ============================================================================

class TestStoryCreate:
    """Test story creation"""
    
    @pytest.mark.asyncio
    async def test_create_story(self, client, auth_headers):
        """Test creating a story"""
        response = await client.post("/api/posts", json={
            "title": valid_title(),
            "content": valid_content(),
            "story_type": "life_story",
            "status": "published"
        }, headers=auth_headers)
        assert response.status_code == 201
        assert "story" in response.json()
    
    @pytest.mark.asyncio
    async def test_create_anonymous(self, client, auth_headers):
        """Test creating anonymous story"""
        response = await client.post("/api/posts", json={
            "title": "Anonymous",
            "content": valid_content(),
            "story_type": "life_story",
            "is_anonymous": True,
            "status": "published"
        }, headers=auth_headers)
        assert response.status_code == 201
    
    @pytest.mark.asyncio
    async def test_create_draft(self, client, auth_headers):
        """Test creating draft"""
        response = await client.post("/api/posts", json={
            "title": "Draft",
            "content": valid_content(),
            "story_type": "life_story",
            "status": "draft"
        }, headers=auth_headers)
        assert response.status_code == 201
        assert response.json()["story"]["status"] == "draft"
    
    @pytest.mark.asyncio
    async def test_create_unauthorized(self, client):
        """Test create without auth fails"""
        response = await client.post("/api/posts", json={
            "title": "Test",
            "content": valid_content(),
            "story_type": "life_story",
            "status": "published"
        })
        assert response.status_code == 401
    
    @pytest.mark.asyncio
    async def test_create_all_valid_types(self, client, auth_headers):
        """Test all valid story types"""
        for story_type in VALID_STORY_TYPES:
            response = await client.post("/api/posts", json={
                "title": f"Story {story_type}",
                "content": valid_content(),
                "story_type": story_type,
                "status": "published"
            }, headers=auth_headers)
            assert response.status_code == 201, f"Failed for: {story_type}"


class TestStoryRead:
    """Test story retrieval"""
    
    @pytest.mark.asyncio
    async def test_get_all_stories(self, client):
        """Test getting all stories"""
        response = await client.get("/api/posts")
        assert response.status_code == 200
        assert "stories" in response.json()
    
    @pytest.mark.asyncio
    async def test_get_story_by_id(self, client, auth_headers):
        """Test getting single story"""
        create = await client.post("/api/posts", json={
            "title": "Get Test",
            "content": valid_content(),
            "story_type": "life_story",
            "status": "published"
        }, headers=auth_headers)
        story_id = create.json()["story"]["id"]
        response = await client.get(f"/api/posts/{story_id}")
        assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_get_nonexistent(self, client):
        """Test getting nonexistent story"""
        response = await client.get("/api/posts/fake-id-xyz")
        assert response.status_code == 404
    
    @pytest.mark.asyncio
    async def test_get_featured(self, client):
        """Test getting featured stories"""
        response = await client.get("/api/posts/featured")
        assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_get_drafts(self, client, auth_headers):
        """Test getting user drafts"""
        response = await client.get("/api/posts/drafts", headers=auth_headers)
        assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_search(self, client, auth_headers):
        """Test story search"""
        await client.post("/api/posts", json={
            "title": "UniqueSearchable123",
            "content": valid_content(),
            "story_type": "life_story",
            "status": "published"
        }, headers=auth_headers)
        response = await client.get("/api/posts/search?q=UniqueSearchable")
        assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_category(self, client):
        """Test by category"""
        response = await client.get("/api/posts/category/life_story")
        assert response.status_code == 200


class TestStoryUpdate:
    """Test story updates"""
    
    @pytest.mark.asyncio
    async def test_update_story(self, client, auth_headers):
        """Test updating a story"""
        create = await client.post("/api/posts", json={
            "title": "Original",
            "content": valid_content(),
            "story_type": "life_story",
            "status": "published"
        }, headers=auth_headers)
        story_id = create.json()["story"]["id"]
        
        response = await client.put(f"/api/posts/{story_id}", json={
            "title": "Updated Title",
            "content": valid_content() + " More content here.",
            "story_type": "achievement",  # Valid type
            "status": "published"
        }, headers=auth_headers)
        assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_update_other_user(self, client, auth_headers, second_user_headers):
        """Test updating another's story fails"""
        create = await client.post("/api/posts", json={
            "title": "Owner",
            "content": valid_content(),
            "story_type": "life_story",
            "status": "published"
        }, headers=auth_headers)
        story_id = create.json()["story"]["id"]
        
        response = await client.put(f"/api/posts/{story_id}", json={
            "title": "Hijack",
            "content": valid_content(),
            "story_type": "life_story",
            "status": "published"
        }, headers=second_user_headers)
        assert response.status_code == 403


class TestStoryDelete:
    """Test story deletion"""
    
    @pytest.mark.asyncio
    async def test_delete_story(self, client, auth_headers):
        """Test deleting a story"""
        create = await client.post("/api/posts", json={
            "title": "ToDelete",
            "content": valid_content(),
            "story_type": "life_story",
            "status": "published"
        }, headers=auth_headers)
        story_id = create.json()["story"]["id"]
        
        response = await client.delete(f"/api/posts/{story_id}", headers=auth_headers)
        assert response.status_code == 200
        
        get = await client.get(f"/api/posts/{story_id}")
        assert get.status_code == 404


# ============================================================================
# COMMENTS
# ============================================================================

class TestComments:
    """Test comments"""
    
    @pytest.mark.asyncio
    async def test_add_comment(self, client, auth_headers):
        """Test adding a comment"""
        create = await client.post("/api/posts", json={
            "title": "ForComment",
            "content": valid_content(),
            "story_type": "life_story",
            "status": "published"
        }, headers=auth_headers)
        story_id = create.json()["story"]["id"]
        
        response = await client.post(f"/api/posts/{story_id}/comments", json={
            "content": "Test comment"
        }, headers=auth_headers)
        assert response.status_code == 201
    
    @pytest.mark.asyncio
    async def test_get_comments(self, client, auth_headers):
        """Test getting comments"""
        create = await client.post("/api/posts", json={
            "title": "GetComments",
            "content": valid_content(),
            "story_type": "life_story",
            "status": "published"
        }, headers=auth_headers)
        story_id = create.json()["story"]["id"]
        
        response = await client.get(f"/api/posts/{story_id}/comments")
        assert response.status_code == 200


# ============================================================================
# REACTIONS
# ============================================================================

class TestReactions:
    """Test reactions"""
    
    @pytest.mark.asyncio
    async def test_toggle_reaction(self, client, auth_headers, second_user_headers):
        """Test toggle reaction"""
        create = await client.post("/api/posts", json={
            "title": "ForReact",
            "content": valid_content(),
            "story_type": "life_story",
            "status": "published"
        }, headers=auth_headers)
        story_id = create.json()["story"]["id"]
        
        # Add reaction with valid type
        response = await client.post(f"/api/posts/{story_id}/toggle-react", json={
            "support_type": "felt_this"
        }, headers=second_user_headers)
        assert response.status_code == 200
        assert response.json()["action"] == "added"
        
        # Remove reaction
        response = await client.post(f"/api/posts/{story_id}/toggle-react", json={
            "support_type": "felt_this"
        }, headers=second_user_headers)
        assert response.json()["action"] == "removed"
    
    @pytest.mark.asyncio
    async def test_get_my_reaction(self, client, auth_headers, second_user_headers):
        """Test getting my reaction"""
        create = await client.post("/api/posts", json={
            "title": "MyReact",
            "content": valid_content(),
            "story_type": "life_story",
            "status": "published"
        }, headers=auth_headers)
        story_id = create.json()["story"]["id"]
        
        await client.post(f"/api/posts/{story_id}/toggle-react", json={
            "support_type": "moved"
        }, headers=second_user_headers)
        
        response = await client.get(f"/api/posts/{story_id}/my-reaction", headers=second_user_headers)
        assert response.status_code == 200
        assert response.json()["reaction_type"] == "moved"


# ============================================================================
# BOOKMARKS
# ============================================================================

class TestBookmarks:
    """Test bookmarks"""
    
    @pytest.mark.asyncio
    async def test_toggle_bookmark(self, client, auth_headers):
        """Test toggle bookmark"""
        create = await client.post("/api/posts", json={
            "title": "Bookmark",
            "content": valid_content(),
            "story_type": "life_story",
            "status": "published"
        }, headers=auth_headers)
        story_id = create.json()["story"]["id"]
        
        response = await client.post(f"/api/posts/{story_id}/bookmark", headers=auth_headers)
        assert response.json()["is_bookmarked"] == True
        
        response = await client.post(f"/api/posts/{story_id}/bookmark", headers=auth_headers)
        assert response.json()["is_bookmarked"] == False
    
    @pytest.mark.asyncio
    async def test_get_bookmarks(self, client, auth_headers):
        """Test getting bookmarks"""
        response = await client.get("/api/posts/bookmarks", headers=auth_headers)
        assert response.status_code == 200


# ============================================================================
# PAGINATION
# ============================================================================

class TestPagination:
    """Test pagination"""
    
    @pytest.mark.asyncio
    async def test_page_zero_rejected(self, client):
        """Test page=0 rejected"""
        response = await client.get("/api/posts?page=0")
        assert response.status_code == 422
    
    @pytest.mark.asyncio
    async def test_negative_page(self, client):
        """Test negative page rejected"""
        response = await client.get("/api/posts?page=-1")
        assert response.status_code == 422
    
    @pytest.mark.asyncio
    async def test_per_page_too_large(self, client):
        """Test per_page > 100 rejected"""
        response = await client.get("/api/posts?per_page=200")
        assert response.status_code == 422


# ============================================================================
# ADMIN
# ============================================================================

class TestAdmin:
    """Test admin endpoints"""
    
    @pytest.mark.asyncio
    async def test_admin_unauthorized(self, client, auth_headers):
        """Test admin endpoint without admin role"""
        response = await client.get("/api/admin/stats", headers=auth_headers)
        # Should be 403 or 404 depending on whether route exists
        assert response.status_code in [403, 404]
