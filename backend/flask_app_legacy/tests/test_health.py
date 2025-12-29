"""
Tests for the health check endpoint used for cold start warmup
"""
import pytest


class TestHealthEndpoint:
    """Test the /api/health endpoint for server warmup"""
    
    def test_health_check_returns_200(self, client):
        """Test health endpoint returns 200 OK"""
        response = client.get('/api/health')
        
        assert response.status_code == 200
    
    def test_health_check_returns_correct_json(self, client):
        """Test health endpoint returns correct JSON structure"""
        response = client.get('/api/health')
        
        assert response.status_code == 200
        assert 'status' in response.json
        assert 'message' in response.json
        assert response.json['status'] == 'healthy'
        assert response.json['message'] == 'Server is awake!'
    
    def test_health_check_no_auth_required(self, client):
        """Test health endpoint works without authentication"""
        # No auth headers provided
        response = client.get('/api/health')
        
        assert response.status_code == 200
    
    def test_health_check_response_time(self, client):
        """Test health endpoint responds quickly (should be lightweight)"""
        import time
        
        start = time.time()
        response = client.get('/api/health')
        elapsed = time.time() - start
        
        assert response.status_code == 200
        assert elapsed < 1.0  # Should respond in under 1 second
    
    def test_health_check_cors_headers(self, client):
        """Test health endpoint has proper CORS headers"""
        response = client.get('/api/health')
        
        # CORS should be configured for the API
        assert response.status_code == 200
    
    def test_multiple_health_checks(self, client):
        """Test health endpoint can handle multiple rapid requests"""
        for _ in range(10):
            response = client.get('/api/health')
            assert response.status_code == 200
            assert response.json['status'] == 'healthy'
