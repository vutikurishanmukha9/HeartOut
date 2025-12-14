"""
Security Tests - Penetration Testing
Tests for common security vulnerabilities.
"""
import pytest
import re


class TestXSSPrevention:
    """
    Test XSS attack prevention.
    
    Note: XSS sanitization is performed on the FRONTEND using DOMPurify.
    The backend stores raw content, and the frontend sanitizes before rendering.
    These tests verify that:
    1. Backend doesn't crash with XSS payloads
    2. Content is stored correctly
    3. SQL-like injections don't work
    """
    
    def test_xss_payloads_dont_crash_server(self, client, auth_headers):
        """Test that XSS payloads don't crash the server"""
        xss_payloads = [
            '<script>alert("XSS")</script>',
            '<img src=x onerror=alert("XSS")>',
            '<svg onload=alert("XSS")>',
            'javascript:alert("XSS")',
            '<iframe src="javascript:alert(1)">',
        ]
        
        for payload in xss_payloads:
            response = client.post('/api/posts', headers=auth_headers, json={
                'title': f'Story with XSS Test',
                'content': f'Normal content with {payload} embedded. ' * 3,
                'story_type': 'life_story',
                'status': 'draft'
            })
            
            # Server should not crash (not 500)
            assert response.status_code in [201, 400]
    
    def test_content_stored_for_frontend_sanitization(self, client, auth_headers):
        """Test that content is stored and can be retrieved (frontend will sanitize)"""
        content = 'This is normal story content with enough characters. ' * 3
        
        response = client.post('/api/posts', headers=auth_headers, json={
            'title': 'Normal Story Title',
            'content': content,
            'story_type': 'life_story',
            'status': 'published'
        })
        
        assert response.status_code == 201
        assert 'story' in response.json
        # Content should be stored successfully
        assert response.json['story']['content'] is not None
    
    def test_comment_with_special_chars_handled(self, client, auth_headers):
        """Test comments with special characters don't crash"""
        # Create a story first
        story_response = client.post('/api/posts', headers=auth_headers, json={
            'title': 'Story for Comment Test',
            'content': 'This is a normal story with enough content for validation. ' * 3,
            'story_type': 'life_story',
            'status': 'published'
        })
        
        if story_response.status_code == 201:
            story_id = story_response.json['story']['id']
            
            special_comment = 'Great story! <3 Thanks for sharing! :)'
            response = client.post(f'/api/posts/{story_id}/comments',
                headers=auth_headers,
                json={'content': special_comment, 'is_anonymous': False}
            )
            
            # Should succeed or reject, but not crash
            assert response.status_code in [201, 400]


class TestSQLInjection:
    """Test SQL injection prevention"""
    
    def test_sql_injection_in_login(self, client):
        """Test SQL injection in login is prevented"""
        sql_payloads = [
            "' OR '1'='1",
            "'; DROP TABLE users; --",
            "1' OR '1'='1'/*",
            "admin'--",
        ]
        
        for payload in sql_payloads:
            response = client.post('/api/auth/login', json={
                'email': f'{payload}@example.com',
                'password': payload
            })
            
            # Should not succeed with SQL injection
            assert response.status_code in [400, 401]
    
    def test_sql_injection_in_search(self, client):
        """Test SQL injection in search is prevented"""
        sql_payloads = [
            "'; DROP TABLE posts; --",
            "1 OR 1=1",
            "1; SELECT * FROM users",
        ]
        
        for payload in sql_payloads:
            response = client.get('/api/posts/search', query_string={'q': payload})
            
            # Should not cause server error
            assert response.status_code != 500
    
    def test_sql_injection_in_story_id(self, client):
        """Test SQL injection in story ID path"""
        sql_payloads = [
            "1 OR 1=1",
            "'; DROP TABLE posts; --",
            "1; DELETE FROM posts WHERE 1=1",
        ]
        
        for payload in sql_payloads:
            response = client.get(f'/api/posts/{payload}')
            
            # Should return 404, not 500
            assert response.status_code in [400, 404]


class TestAuthentication:
    """Test authentication security"""
    
    def test_jwt_required_endpoints(self, client):
        """Test that protected endpoints require authentication"""
        protected_endpoints = [
            ('POST', '/api/posts'),
            ('GET', '/api/auth/profile'),
            ('PUT', '/api/auth/profile'),
            ('GET', '/api/posts/drafts'),
            ('POST', '/api/auth/logout'),
        ]
        
        for method, endpoint in protected_endpoints:
            if method == 'GET':
                response = client.get(endpoint)
            elif method == 'POST':
                response = client.post(endpoint, json={})
            elif method == 'PUT':
                response = client.put(endpoint, json={})
            
            assert response.status_code == 401, f"{method} {endpoint} should require auth"
    
    def test_invalid_jwt_token(self, client):
        """Test that invalid JWT tokens are rejected"""
        invalid_tokens = [
            'invalid_token',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            'Bearer token',
        ]
        
        for token in invalid_tokens:
            response = client.get('/api/auth/profile', 
                headers={'Authorization': f'Bearer {token}'}
            )
            assert response.status_code in [401, 422]
    
    def test_password_strength_validation(self, client):
        """Test weak passwords are rejected"""
        weak_passwords = [
            '123',
            'password',
            '12345678',
            'abcdefgh',
        ]
        
        for password in weak_passwords:
            response = client.post('/api/auth/register', json={
                'username': 'testuser',
                'email': 'test@example.com',
                'password': password
            })
            
            assert response.status_code == 400, f"Password '{password}' should be rejected"


class TestAuthorization:
    """Test authorization and access control"""
    
    def test_cannot_edit_others_story(self, client):
        """Test that users cannot edit other users' stories"""
        # Create user 1
        client.post('/api/auth/register', json={
            'username': 'user1_auth',
            'email': 'user1_auth@example.com',
            'password': 'SecureP@ss123!'
        })
        login1 = client.post('/api/auth/login', json={
            'email': 'user1_auth@example.com',
            'password': 'SecureP@ss123!'
        })
        token1 = login1.json['access_token']
        headers1 = {'Authorization': f'Bearer {token1}'}
        
        # Create user 2
        client.post('/api/auth/register', json={
            'username': 'user2_auth',
            'email': 'user2_auth@example.com',
            'password': 'SecureP@ss123!'
        })
        login2 = client.post('/api/auth/login', json={
            'email': 'user2_auth@example.com',
            'password': 'SecureP@ss123!'
        })
        token2 = login2.json['access_token']
        headers2 = {'Authorization': f'Bearer {token2}'}
        
        # User 1 creates a story
        story_response = client.post('/api/posts', headers=headers1, json={
            'title': 'User 1 Story',
            'content': 'This is user 1 story with enough content for validation. ' * 3,
            'story_type': 'life_story',
            'status': 'published'
        })
        
        if story_response.status_code == 201:
            story_id = story_response.json['story']['id']
            
            # User 2 tries to edit user 1's story
            edit_response = client.put(f'/api/posts/{story_id}', headers=headers2, json={
                'title': 'Hacked Title',
                'content': 'Hacked content that is long enough. ' * 3,
                'story_type': 'life_story'
            })
            
            # Should be forbidden
            assert edit_response.status_code == 403
    
    def test_cannot_delete_others_story(self, client):
        """Test that users cannot delete other users' stories"""
        # Create user 1
        client.post('/api/auth/register', json={
            'username': 'user1_del',
            'email': 'user1_del@example.com',
            'password': 'SecureP@ss123!'
        })
        login1 = client.post('/api/auth/login', json={
            'email': 'user1_del@example.com',
            'password': 'SecureP@ss123!'
        })
        token1 = login1.json['access_token']
        headers1 = {'Authorization': f'Bearer {token1}'}
        
        # Create user 2
        client.post('/api/auth/register', json={
            'username': 'user2_del',
            'email': 'user2_del@example.com',
            'password': 'SecureP@ss123!'
        })
        login2 = client.post('/api/auth/login', json={
            'email': 'user2_del@example.com',
            'password': 'SecureP@ss123!'
        })
        token2 = login2.json['access_token']
        headers2 = {'Authorization': f'Bearer {token2}'}
        
        # User 1 creates a story
        story_response = client.post('/api/posts', headers=headers1, json={
            'title': 'User 1 Story to Delete',
            'content': 'This is user 1 story with enough content for validation. ' * 3,
            'story_type': 'life_story',
            'status': 'published'
        })
        
        if story_response.status_code == 201:
            story_id = story_response.json['story']['id']
            
            # User 2 tries to delete user 1's story
            delete_response = client.delete(f'/api/posts/{story_id}', headers=headers2)
            
            # Should be forbidden
            assert delete_response.status_code == 403


class TestInputValidation:
    """Test input validation and sanitization"""
    
    def test_oversized_content_rejected(self, client, auth_headers):
        """Test that oversized content is rejected"""
        large_content = 'x' * 100001  # Over 50k limit
        
        response = client.post('/api/posts', headers=auth_headers, json={
            'title': 'Oversized Story',
            'content': large_content,
            'story_type': 'life_story'
        })
        
        assert response.status_code == 400
    
    def test_invalid_story_type_rejected(self, client, auth_headers):
        """Test that invalid story types are rejected"""
        response = client.post('/api/posts', headers=auth_headers, json={
            'title': 'Invalid Type Story',
            'content': 'Normal content that is long enough for validation. ' * 3,
            'story_type': 'invalid_type'
        })
        
        assert response.status_code == 400
    
    def test_special_characters_in_username(self, client):
        """Test that special characters in username are handled"""
        special_usernames = [
            'user<script>',
            'user;DROP TABLE',
            '../../../etc/passwd',
            'user\x00null',
        ]
        
        for username in special_usernames:
            response = client.post('/api/auth/register', json={
                'username': username,
                'email': f'{username}@example.com',
                'password': 'SecureP@ss123!'
            })
            
            # Should either reject or sanitize
            if response.status_code == 201:
                user = response.json.get('user', {})
                assert '<script>' not in user.get('username', '')
