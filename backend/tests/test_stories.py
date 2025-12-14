"""
Story/Post Tests for HeartOut Backend
"""
import pytest
from app.models import Post, PostStatus, StoryType


# Helper to create valid content (min 50 chars)
def valid_content():
    return "This is a test story content that meets the minimum character requirement for validation."


class TestCreateStory:
    """Test story creation"""
    
    def test_create_story_success(self, client, auth_headers):
        """Test successful story creation"""
        response = client.post('/api/posts', 
            headers=auth_headers,
            json={
                'title': 'My First Story Title',
                'content': valid_content(),
                'story_type': 'life_story',
                'is_anonymous': False
            }
        )
        
        assert response.status_code == 201
        assert 'story' in response.json
        assert response.json['story']['title'] == 'My First Story Title'
    
    def test_create_story_anonymous(self, client, auth_headers):
        """Test creating an anonymous story"""
        response = client.post('/api/posts',
            headers=auth_headers,
            json={
                'title': 'Anonymous Story Title',
                'content': valid_content(),
                'story_type': 'regret',
                'is_anonymous': True
            }
        )
        
        assert response.status_code == 201
        assert 'story' in response.json
    
    def test_create_story_unauthorized(self, client):
        """Test story creation without authentication"""
        response = client.post('/api/posts', json={
            'title': 'Unauthorized Story Title',
            'content': valid_content(),
            'story_type': 'achievement'
        })
        
        assert response.status_code == 401
    
    def test_create_story_short_title(self, client, auth_headers):
        """Test story creation with too short title"""
        response = client.post('/api/posts',
            headers=auth_headers,
            json={
                'title': 'Hi',  # Too short
                'content': valid_content(),
                'story_type': 'life_story'
            }
        )
        
        assert response.status_code == 400
    
    def test_create_story_short_content(self, client, auth_headers):
        """Test story creation with too short content"""
        response = client.post('/api/posts',
            headers=auth_headers,
            json={
                'title': 'Valid Story Title',
                'content': 'Short',  # Too short
                'story_type': 'life_story'
            }
        )
        
        assert response.status_code == 400
    
    def test_create_draft(self, client, auth_headers):
        """Test creating a draft story"""
        response = client.post('/api/posts',
            headers=auth_headers,
            json={
                'title': 'Draft Story Title Here',
                'content': valid_content(),
                'story_type': 'life_story',
                'status': 'draft'
            }
        )
        
        assert response.status_code == 201
        assert response.json['story']['status'] == 'draft'


class TestGetStories:
    """Test story retrieval"""
    
    def test_get_all_stories(self, client, auth_headers):
        """Test getting all published stories"""
        response = client.get('/api/posts/')
        
        assert response.status_code == 200
        assert 'stories' in response.json
        assert 'total' in response.json
        assert 'page' in response.json
    
    def test_get_story_by_id(self, client, auth_headers):
        """Test getting a specific story by ID"""
        # Create a story first
        create_response = client.post('/api/posts',
            headers=auth_headers,
            json={
                'title': 'Specific Story Title',
                'content': valid_content(),
                'story_type': 'sacrifice',
                'status': 'published'
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json['story']['id']
            
            # Get the story
            response = client.get(f'/api/posts/{story_id}')
            
            assert response.status_code == 200
            assert 'story' in response.json
    
    def test_get_nonexistent_story(self, client):
        """Test getting a non-existent story"""
        response = client.get('/api/posts/nonexistent-id-12345')
        
        assert response.status_code == 404


class TestUpdateStory:
    """Test story updates"""
    
    def test_update_story_success(self, client, auth_headers):
        """Test successful story update"""
        # Create a story
        create_response = client.post('/api/posts',
            headers=auth_headers,
            json={
                'title': 'Original Title Here',
                'content': valid_content(),
                'story_type': 'life_story'
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json['story']['id']
            
            # Update the story
            response = client.put(f'/api/posts/{story_id}',
                headers=auth_headers,
                json={
                    'title': 'Updated Title Here',
                    'content': valid_content(),
                    'story_type': 'life_story'
                }
            )
            
            assert response.status_code == 200


class TestDeleteStory:
    """Test story deletion"""
    
    def test_delete_story_success(self, client, auth_headers):
        """Test successful story deletion"""
        # Create a story
        create_response = client.post('/api/posts',
            headers=auth_headers,
            json={
                'title': 'To Be Deleted Title',
                'content': valid_content(),
                'story_type': 'other'
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json['story']['id']
            
            # Delete the story
            response = client.delete(f'/api/posts/{story_id}', headers=auth_headers)
            
            assert response.status_code == 200


class TestDrafts:
    """Test draft functionality"""
    
    def test_get_user_drafts(self, client, auth_headers):
        """Test getting user's drafts"""
        # Create a draft
        client.post('/api/posts',
            headers=auth_headers,
            json={
                'title': 'My Draft Story Title',
                'content': valid_content(),
                'story_type': 'unsent_letter',
                'status': 'draft'
            }
        )
        
        # Get drafts
        response = client.get('/api/posts/drafts', headers=auth_headers)
        
        assert response.status_code == 200
        assert 'drafts' in response.json
