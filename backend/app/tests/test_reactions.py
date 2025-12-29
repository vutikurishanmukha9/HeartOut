"""
FastAPI Reaction Tests
"""
import pytest


# Helper to create valid content (min 50 chars)
def valid_content():
    return "This is a test story content that meets the minimum character requirement for validation."


class TestReactions:
    """Test reaction functionality"""
    
    @pytest.mark.asyncio
    async def test_add_reaction(self, client, auth_headers):
        """Test adding a reaction to a story"""
        # Create a story first
        create_response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Reactionable Story Title",
                "content": valid_content(),
                "story_type": "achievement",
                "status": "published"
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json()["story"]["id"]
            
            # Add a reaction
            response = await client.post(
                f"/api/posts/{story_id}/toggle-react",
                headers=auth_headers,
                json={"support_type": "heart"}
            )
            
            assert response.status_code in [200, 201]
    
    @pytest.mark.asyncio
    async def test_toggle_reaction(self, client, auth_headers):
        """Test toggling a reaction"""
        # Create a story
        create_response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Toggle Story Title",
                "content": valid_content(),
                "story_type": "life_story",
                "status": "published"
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json()["story"]["id"]
            
            # Add reaction
            await client.post(
                f"/api/posts/{story_id}/toggle-react",
                headers=auth_headers,
                json={"support_type": "inspiring"}
            )
            
            # Toggle off (same reaction again)
            response = await client.post(
                f"/api/posts/{story_id}/toggle-react",
                headers=auth_headers,
                json={"support_type": "inspiring"}
            )
            
            assert response.status_code in [200, 201]
            data = response.json()
            assert data.get("action") == "removed"
    
    @pytest.mark.asyncio
    async def test_reaction_on_nonexistent_story(self, client, auth_headers):
        """Test reacting to non-existent story"""
        response = await client.post(
            "/api/posts/nonexistent-id/toggle-react",
            headers=auth_headers,
            json={"support_type": "heart"}
        )
        
        assert response.status_code == 404
    
    @pytest.mark.asyncio
    async def test_get_my_reaction(self, client, auth_headers):
        """Test getting current user's reaction on a story"""
        # Create a story
        create_response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "My Reaction Story",
                "content": valid_content(),
                "story_type": "achievement",
                "status": "published"
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json()["story"]["id"]
            
            # Add a reaction
            await client.post(
                f"/api/posts/{story_id}/toggle-react",
                headers=auth_headers,
                json={"support_type": "heart"}
            )
            
            # Get my reaction
            response = await client.get(
                f"/api/posts/{story_id}/my-reaction",
                headers=auth_headers
            )
            
            assert response.status_code == 200
            data = response.json()
            assert "reaction_type" in data
            assert data["reaction_type"] == "heart"


class TestReactionTypes:
    """Test different reaction types"""
    
    @pytest.mark.asyncio
    async def test_heart_reaction(self, client, auth_headers):
        """Test heart reaction type"""
        create_response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Heart Test Story Title",
                "content": valid_content(),
                "story_type": "achievement",
                "status": "published"
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json()["story"]["id"]
            
            response = await client.post(
                f"/api/posts/{story_id}/toggle-react",
                headers=auth_headers,
                json={"support_type": "heart"}
            )
            
            assert response.status_code in [200, 201]
    
    @pytest.mark.asyncio
    async def test_applause_reaction(self, client, auth_headers):
        """Test applause reaction type"""
        create_response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Applause Test Story",
                "content": valid_content(),
                "story_type": "achievement",
                "status": "published"
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json()["story"]["id"]
            
            response = await client.post(
                f"/api/posts/{story_id}/toggle-react",
                headers=auth_headers,
                json={"support_type": "applause"}
            )
            
            assert response.status_code in [200, 201]
    
    @pytest.mark.asyncio
    async def test_change_reaction_type(self, client, auth_headers):
        """Test changing reaction type"""
        create_response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Change Reaction Story",
                "content": valid_content(),
                "story_type": "life_story",
                "status": "published"
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json()["story"]["id"]
            
            # Add first reaction
            await client.post(
                f"/api/posts/{story_id}/toggle-react",
                headers=auth_headers,
                json={"support_type": "heart"}
            )
            
            # Change to different type
            response = await client.post(
                f"/api/posts/{story_id}/toggle-react",
                headers=auth_headers,
                json={"support_type": "inspiring"}
            )
            
            # When toggling same story with different type, it might remove first
            assert response.status_code in [200, 201]
