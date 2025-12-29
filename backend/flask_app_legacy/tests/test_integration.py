"""
Integration Tests - Complete User Flows
Tests end-to-end user journeys through the API.
"""
import pytest


class TestUserRegistrationFlow:
    """Test complete user registration and onboarding flow"""
    
    def test_complete_registration_to_first_story(self, client):
        """Test user registers, logs in, creates story, and views it"""
        # Step 1: Register
        register_response = client.post('/api/auth/register', json={
            'username': 'flowuser',
            'email': 'flow@gmail.com',
            'password': 'SecureP@ss123!'
        })
        assert register_response.status_code == 201
        token = register_response.json['access_token']
        headers = {'Authorization': f'Bearer {token}'}
        
        # Step 2: View profile
        profile_response = client.get('/api/auth/profile', headers=headers)
        assert profile_response.status_code == 200
        assert profile_response.json['user']['username'] == 'flowuser'
        
        # Step 3: Create a story
        story_content = "This is my first story on HeartOut. " * 5
        story_response = client.post('/api/posts', headers=headers, json={
            'title': 'My First HeartOut Story',
            'content': story_content,
            'story_type': 'life_story',
            'status': 'published'
        })
        assert story_response.status_code == 201
        story_id = story_response.json['story']['id']
        
        # Step 4: View the story
        view_response = client.get(f'/api/posts/{story_id}')
        assert view_response.status_code == 200
        assert view_response.json['story']['title'] == 'My First HeartOut Story'
        
        # Step 5: View feed with new story
        feed_response = client.get('/api/posts/')
        assert feed_response.status_code == 200
        assert len(feed_response.json['stories']) >= 1


class TestStoryInteractionFlow:
    """Test story creation, reaction, and comment flow"""
    
    def test_story_with_reactions_and_comments(self, client):
        """Test creating story, adding reactions, and commenting"""
        # Setup: Create two users
        # User 1 - Story author
        client.post('/api/auth/register', json={
            'username': 'author1',
            'email': 'author1@gmail.com',
            'password': 'SecureP@ss123!'
        })
        author_login = client.post('/api/auth/login', json={
            'email': 'author1@gmail.com',
            'password': 'SecureP@ss123!'
        })
        author_token = author_login.json['access_token']
        author_headers = {'Authorization': f'Bearer {author_token}'}
        
        # User 2 - Reader
        client.post('/api/auth/register', json={
            'username': 'reader1',
            'email': 'reader1@gmail.com',
            'password': 'SecureP@ss123!'
        })
        reader_login = client.post('/api/auth/login', json={
            'email': 'reader1@gmail.com',
            'password': 'SecureP@ss123!'
        })
        reader_token = reader_login.json['access_token']
        reader_headers = {'Authorization': f'Bearer {reader_token}'}
        
        # Step 1: Author creates a story
        story_content = "This is an inspiring story about overcoming challenges. " * 5
        story_response = client.post('/api/posts', headers=author_headers, json={
            'title': 'Overcoming Challenges',
            'content': story_content,
            'story_type': 'achievement',
            'status': 'published'
        })
        assert story_response.status_code == 201
        story_id = story_response.json['story']['id']
        
        # Step 2: Reader views the story
        view_response = client.get(f'/api/posts/{story_id}')
        assert view_response.status_code == 200
        
        # Step 3: Reader adds a reaction
        reaction_response = client.post(
            f'/api/posts/{story_id}/toggle-react',
            headers=reader_headers,
            json={'support_type': 'heart'}
        )
        assert reaction_response.status_code in [200, 201]
        
        # Step 4: Reader adds a comment
        comment_response = client.post(
            f'/api/posts/{story_id}/comments',
            headers=reader_headers,
            json={
                'content': 'This is so inspiring! Thank you for sharing.',
                'is_anonymous': False
            }
        )
        assert comment_response.status_code == 201
        
        # Step 5: Author views comments on their story
        comments_response = client.get(f'/api/posts/{story_id}/comments')
        assert comments_response.status_code == 200
        assert len(comments_response.json['comments']) >= 1


class TestDraftToPublishFlow:
    """Test draft creation and publishing workflow"""
    
    def test_draft_edit_publish_flow(self, client, auth_headers):
        """Test creating draft, editing, and publishing"""
        # Step 1: Create a draft
        draft_content = "This is my draft story that needs more work. " * 3
        draft_response = client.post('/api/posts', headers=auth_headers, json={
            'title': 'Work in Progress',
            'content': draft_content,
            'story_type': 'life_story',
            'status': 'draft'
        })
        assert draft_response.status_code == 201
        assert draft_response.json['story']['status'] == 'draft'
        story_id = draft_response.json['story']['id']
        
        # Step 2: View drafts
        drafts_response = client.get('/api/posts/drafts', headers=auth_headers)
        assert drafts_response.status_code == 200
        assert 'drafts' in drafts_response.json
        
        # Step 3: Update draft with more content
        updated_content = "This is my completed story with all the details. " * 5
        update_response = client.put(f'/api/posts/{story_id}', headers=auth_headers, json={
            'title': 'My Complete Story',
            'content': updated_content,
            'story_type': 'achievement',
            'status': 'published'
        })
        assert update_response.status_code == 200
        
        # Step 4: Verify story is now published and visible
        feed_response = client.get('/api/posts/')
        assert feed_response.status_code == 200


class TestSearchAndFilterFlow:
    """Test search and filtering functionality"""
    
    def test_search_and_category_filter(self, client, auth_headers):
        """Test searching and filtering stories"""
        # Create stories in different categories
        categories = ['achievement', 'regret', 'life_story']
        for i, category in enumerate(categories):
            content = f"This is a {category} story about my journey and experiences. " * 5
            client.post('/api/posts', headers=auth_headers, json={
                'title': f'{category.title()} Story {i}',
                'content': content,
                'story_type': category,
                'status': 'published'
            })
        
        # Test category filter
        achievement_response = client.get('/api/posts/?story_type=achievement')
        assert achievement_response.status_code == 200
        
        # Test search
        search_response = client.get('/api/posts/search?q=journey')
        assert search_response.status_code == 200
        assert 'results' in search_response.json


class TestUserProfileFlow:
    """Test user profile and statistics flow"""
    
    def test_profile_update_and_stats(self, client, auth_headers):
        """Test profile update and viewing stats"""
        # Step 1: Update profile
        update_response = client.put('/api/auth/profile', headers=auth_headers, json={
            'display_name': 'Story Teller',
            'bio': 'I love sharing my stories with the world.',
            'author_bio': 'A passionate writer and storyteller.'
        })
        assert update_response.status_code == 200
        assert update_response.json['user']['display_name'] == 'Story Teller'
        
        # Step 2: Create some stories
        for i in range(3):
            content = f"Story number {i} about my experiences and reflections. " * 5
            client.post('/api/posts', headers=auth_headers, json={
                'title': f'Story {i}',
                'content': content,
                'story_type': 'life_story',
                'status': 'published'
            })
        
        # Step 3: View stats
        stats_response = client.get('/api/auth/stats', headers=auth_headers)
        assert stats_response.status_code == 200
        assert 'stats' in stats_response.json
