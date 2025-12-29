"""
FastAPI Health Endpoint Tests
"""
import pytest
import time


class TestHealthEndpoint:
    """Test the /api/health endpoint for server warmup"""
    
    @pytest.mark.asyncio
    async def test_health_check_returns_200(self, client):
        """Test health endpoint returns 200 OK"""
        response = await client.get("/api/health")
        assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_health_check_returns_correct_json(self, client):
        """Test health endpoint returns correct JSON structure"""
        response = await client.get("/api/health")
        
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "message" in data
        assert data["status"] == "healthy"
        assert "running" in data["message"].lower()
    
    @pytest.mark.asyncio
    async def test_health_check_no_auth_required(self, client):
        """Test health endpoint works without authentication"""
        # No auth headers provided
        response = await client.get("/api/health")
        assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_health_check_response_time(self, client):
        """Test health endpoint responds quickly (should be lightweight)"""
        start = time.time()
        response = await client.get("/api/health")
        elapsed = time.time() - start
        
        assert response.status_code == 200
        assert elapsed < 1.0  # Should respond in under 1 second
    
    @pytest.mark.asyncio
    async def test_multiple_health_checks(self, client):
        """Test health endpoint can handle multiple rapid requests"""
        for _ in range(10):
            response = await client.get("/api/health")
            assert response.status_code == 200
            assert response.json()["status"] == "healthy"


class TestRootEndpoint:
    """Test the root endpoint"""
    
    @pytest.mark.asyncio
    async def test_root_returns_api_info(self, client):
        """Test root endpoint returns API information"""
        response = await client.get("/")
        
        assert response.status_code == 200
        data = response.json()
        assert "name" in data
        assert "version" in data
        assert data["name"] == "HeartOut API"
