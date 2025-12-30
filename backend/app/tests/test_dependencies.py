"""
Tests for Common Dependencies Module
Tests reusable dependencies like get_story_or_404, PaginationDep
"""
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport

from app.main import app
from app.core.database import get_db
from app.api.dependencies import PaginationDep
from app.tests.conftest import override_get_db, setup_database


class TestPaginationDep:
    """Test PaginationDep dependency class"""
    
    def test_default_values(self):
        """Test default pagination values (passing explicit defaults since Query() doesn't work outside FastAPI)"""
        pagination = PaginationDep(page=1, per_page=20)
        assert pagination.page == 1
        assert pagination.per_page == 20
        assert pagination.offset == 0
    
    def test_custom_values(self):
        """Test custom pagination values"""
        pagination = PaginationDep(page=3, per_page=50)
        assert pagination.page == 3
        assert pagination.per_page == 50
        assert pagination.offset == 100  # (3-1) * 50
    
    def test_get_pagination_info_first_page(self):
        """Test pagination info for first page"""
        pagination = PaginationDep(page=1, per_page=10)
        info = pagination.get_pagination_info(total=25)
        
        assert info["total"] == 25
        assert info["page"] == 1
        assert info["per_page"] == 10
        assert info["total_pages"] == 3
        assert info["has_next"] == True
        assert info["has_prev"] == False
        assert info["next_page"] == 2
        assert info["prev_page"] == None
    
    def test_get_pagination_info_middle_page(self):
        """Test pagination info for middle page"""
        pagination = PaginationDep(page=2, per_page=10)
        info = pagination.get_pagination_info(total=25)
        
        assert info["has_next"] == True
        assert info["has_prev"] == True
        assert info["next_page"] == 3
        assert info["prev_page"] == 1
    
    def test_get_pagination_info_last_page(self):
        """Test pagination info for last page"""
        pagination = PaginationDep(page=3, per_page=10)
        info = pagination.get_pagination_info(total=25)
        
        assert info["has_next"] == False
        assert info["has_prev"] == True
        assert info["next_page"] == None
        assert info["prev_page"] == 2
    
    def test_get_pagination_info_empty(self):
        """Test pagination info with no results"""
        pagination = PaginationDep(page=1, per_page=10)
        info = pagination.get_pagination_info(total=0)
        
        assert info["total"] == 0
        assert info["total_pages"] == 0
        assert info["has_next"] == False
        assert info["has_prev"] == False
    
    def test_offset_calculation(self):
        """Test offset calculations for different pages"""
        assert PaginationDep(page=1, per_page=20).offset == 0
        assert PaginationDep(page=2, per_page=20).offset == 20
        assert PaginationDep(page=5, per_page=10).offset == 40
        assert PaginationDep(page=10, per_page=100).offset == 900


class TestGetStoryOr404Integration:
    """Integration tests for get_story_or_404 dependency"""
    
    @pytest_asyncio.fixture
    async def client(self, setup_database):
        """Create test client"""
        app.dependency_overrides[get_db] = override_get_db
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test"
        ) as ac:
            yield ac
        app.dependency_overrides.clear()
    
    async def test_story_not_found_returns_404(self, client):
        """Test that non-existent story returns 404"""
        response = await client.get("/api/posts/non-existent-id")
        assert response.status_code == 404
        assert "not found" in response.json()["error"].lower()
    
    async def test_invalid_story_id_format(self, client):
        """Test invalid story ID format"""
        response = await client.get("/api/posts/invalid-uuid-format")
        assert response.status_code == 404
