"""
Reaction Tests for HeartOut Backend
"""
import pytest


# Helper to create valid content (min 50 chars)
def valid_content():
    return "This is a test story content that meets the minimum character requirement for validation."


class TestReactions:
    """Test reaction functionality"""
    
    def test_add_reaction(self, client, auth_headers):
        """Test adding a reaction to a story"""
        # Create a story first
        create_response = client.post('/api/posts',
            headers=auth_headers,
            json={
                'title': 'Reactionable Story Title',
                'content': valid_content(),
                'story_type': 'achievement',
                'status': 'published'
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json['story']['id']
            
            # Add a reaction
            response = client.post(f'/api/posts/{story_id}/toggle-react',
                headers=auth_headers,
                json={'support_type': 'heart'}
            )
            
            assert response.status_code in [200, 201]
    
    def test_toggle_reaction(self, client, auth_headers):
        """Test toggling a reaction"""
        # Create a story
        create_response = client.post('/api/posts',
            headers=auth_headers,
            json={
                'title': 'Toggle Story Title',
                'content': valid_content(),
                'story_type': 'life_story',
                'status': 'published'
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json['story']['id']
            
            # Add reaction
            client.post(f'/api/posts/{story_id}/toggle-react',
                headers=auth_headers,
                json={'support_type': 'inspiring'}
            )
            
            # Toggle off (same reaction again)
            response = client.post(f'/api/posts/{story_id}/toggle-react',
                headers=auth_headers,
                json={'support_type': 'inspiring'}
            )
            
            assert response.status_code in [200, 201]
    
    def test_reaction_on_nonexistent_story(self, client, auth_headers):
        """Test reacting to non-existent story"""
        response = client.post('/api/posts/nonexistent-id/toggle-react',
            headers=auth_headers,
            json={'support_type': 'heart'}
        )
        
        assert response.status_code == 404


class TestReactionTypes:
    """Test different reaction types"""
    
    def test_heart_reaction(self, client, auth_headers):
        """Test heart reaction type"""
        create_response = client.post('/api/posts',
            headers=auth_headers,
            json={
                'title': 'Heart Test Story Title',
                'content': valid_content(),
                'story_type': 'achievement',
                'status': 'published'
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json['story']['id']
            
            response = client.post(f'/api/posts/{story_id}/toggle-react',
                headers=auth_headers,
                json={'support_type': 'heart'}
            )
            
            assert response.status_code in [200, 201]
    
    def test_applause_reaction(self, client, auth_headers):
        """Test applause reaction type"""
        create_response = client.post('/api/posts',
            headers=auth_headers,
            json={
                'title': 'Applause Test Story',
                'content': valid_content(),
                'story_type': 'achievement',
                'status': 'published'
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json['story']['id']
            
            response = client.post(f'/api/posts/{story_id}/toggle-react',
                headers=auth_headers,
                json={'support_type': 'applause'}
            )
            
            assert response.status_code in [200, 201]
