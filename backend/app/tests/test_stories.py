"""
FastAPI Story/Post Tests
"""
import pytest


# Helper to create valid content (min 50 chars)
def valid_content():
    return "This is a test story content that meets the minimum character requirement for validation."


class TestCreateStory:
    """Test story creation"""
    
    @pytest.mark.asyncio
    async def test_create_story_success(self, client, auth_headers):
        """Test successful story creation"""
        response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "My First Story Title",
                "content": valid_content(),
                "story_type": "life_story",
                "is_anonymous": False
            }
        )
        
        assert response.status_code == 201
        data = response.json()
        assert "story" in data
        assert data["story"]["title"] == "My First Story Title"
    
    @pytest.mark.asyncio
    async def test_create_story_anonymous(self, client, auth_headers):
        """Test creating an anonymous story"""
        response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Anonymous Story Title",
                "content": valid_content(),
                "story_type": "regret",
                "is_anonymous": True
            }
        )
        
        assert response.status_code == 201
        data = response.json()
        assert "story" in data
    
    @pytest.mark.asyncio
    async def test_create_story_unauthorized(self, client):
        """Test story creation without authentication"""
        response = await client.post("/api/posts", json={
            "title": "Unauthorized Story Title",
            "content": valid_content(),
            "story_type": "achievement"
        })
        
        assert response.status_code == 401
    
    @pytest.mark.asyncio
    async def test_create_story_short_title(self, client, auth_headers):
        """Test story creation with too short title"""
        response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Hi",  # Too short
                "content": valid_content(),
                "story_type": "life_story"
            }
        )
        
        assert response.status_code == 422  # Pydantic validation error
    
    @pytest.mark.asyncio
    async def test_create_story_short_content(self, client, auth_headers):
        """Test story creation with too short content"""
        response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Valid Story Title",
                "content": "Short",  # Too short
                "story_type": "life_story"
            }
        )
        
        assert response.status_code == 422
    
    @pytest.mark.asyncio
    async def test_create_draft(self, client, auth_headers):
        """Test creating a draft story"""
        response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Draft Story Title Here",
                "content": valid_content(),
                "story_type": "life_story",
                "status": "draft"
            }
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["story"]["status"] == "draft"


class TestGetStories:
    """Test story retrieval"""
    
    @pytest.mark.asyncio
    async def test_get_all_stories(self, client):
        """Test getting all published stories"""
        response = await client.get("/api/posts")
        
        assert response.status_code == 200
        data = response.json()
        assert "stories" in data
        assert "total" in data
        assert "page" in data
    
    @pytest.mark.asyncio
    async def test_get_story_by_id(self, client, auth_headers):
        """Test getting a specific story by ID"""
        # Create a story first
        create_response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Specific Story Title",
                "content": valid_content(),
                "story_type": "sacrifice",
                "status": "published"
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json()["story"]["id"]
            
            # Get the story
            response = await client.get(f"/api/posts/{story_id}")
            
            assert response.status_code == 200
            data = response.json()
            assert "story" in data
    
    @pytest.mark.asyncio
    async def test_get_nonexistent_story(self, client):
        """Test getting a non-existent story"""
        response = await client.get("/api/posts/nonexistent-id-12345")
        
        assert response.status_code == 404
    
    @pytest.mark.asyncio
    async def test_get_featured_stories(self, client):
        """Test getting featured stories"""
        response = await client.get("/api/posts/featured")
        
        assert response.status_code == 200
        data = response.json()
        assert "featured_stories" in data
    
    @pytest.mark.asyncio
    async def test_search_stories(self, client, auth_headers):
        """Test searching stories"""
        # Create a story
        await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Searchable Unique Story",
                "content": valid_content(),
                "story_type": "life_story",
                "status": "published"
            }
        )
        
        # Search for it
        response = await client.get("/api/posts/search?q=Searchable")
        
        assert response.status_code == 200
        data = response.json()
        assert "results" in data


class TestUpdateStory:
    """Test story updates"""
    
    @pytest.mark.asyncio
    async def test_update_story_success(self, client, auth_headers):
        """Test successful story update"""
        # Create a story
        create_response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Original Title Here",
                "content": valid_content(),
                "story_type": "life_story"
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json()["story"]["id"]
            
            # Update the story
            response = await client.put(
                f"/api/posts/{story_id}",
                headers=auth_headers,
                json={
                    "title": "Updated Title Here",
                    "content": valid_content(),
                    "story_type": "life_story"
                }
            )
            
            assert response.status_code == 200


class TestDeleteStory:
    """Test story deletion"""
    
    @pytest.mark.asyncio
    async def test_delete_story_success(self, client, auth_headers):
        """Test successful story deletion"""
        # Create a story
        create_response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "To Be Deleted Title",
                "content": valid_content(),
                "story_type": "other"
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json()["story"]["id"]
            
            # Delete the story
            response = await client.delete(f"/api/posts/{story_id}", headers=auth_headers)
            
            assert response.status_code == 200


class TestDrafts:
    """Test draft functionality"""
    
    @pytest.mark.asyncio
    async def test_get_user_drafts(self, client, auth_headers):
        """Test getting user's drafts"""
        # Create a draft
        await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "My Draft Story Title",
                "content": valid_content(),
                "story_type": "unsent_letter",
                "status": "draft"
            }
        )
        
        # Get drafts
        response = await client.get("/api/posts/drafts", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert "drafts" in data


class TestBookmarks:
    """Test bookmark functionality"""
    
    @pytest.mark.asyncio
    async def test_toggle_bookmark(self, client, auth_headers):
        """Test toggling a bookmark"""
        # Create a story
        create_response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Bookmarkable Story",
                "content": valid_content(),
                "story_type": "life_story",
                "status": "published"
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json()["story"]["id"]
            
            # Toggle bookmark
            response = await client.post(
                f"/api/posts/{story_id}/bookmark",
                headers=auth_headers
            )
            
            assert response.status_code == 200
            data = response.json()
            assert "is_bookmarked" in data
    
    @pytest.mark.asyncio
    async def test_get_bookmarks(self, client, auth_headers):
        """Test getting user's bookmarks"""
        response = await client.get("/api/posts/bookmarks", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert "stories" in data
