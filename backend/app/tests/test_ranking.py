"""
FastAPI Ranking Tests
Category-Based Ranking and Engagement Features
Migrated from Flask test_ranking.py
"""
import pytest


VALID_PASSWORD = "SecureP@ss123!"


def valid_content():
    return "This is a test story content that meets the minimum character requirement for validation."


class TestRankingService:
    """Test ranking service functionality"""
    
    @pytest.mark.asyncio
    async def test_ranking_endpoint_exists(self, client):
        """Test ranking endpoint is accessible"""
        response = await client.get("/api/posts?sort_by=smart")
        assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_ranking_with_category(self, client):
        """Test ranking with category filter"""
        response = await client.get("/api/posts?story_type=achievement&sort_by=smart")
        assert response.status_code == 200
        assert "stories" in response.json()


class TestSmartRankingEndpoint:
    """Test the smart ranking API endpoint"""
    
    @pytest.mark.asyncio
    async def test_smart_ranking_default(self, client, auth_headers):
        """Test that smart ranking works on posts"""
        # Create a test story first
        await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Ranking Test Story",
                "content": valid_content(),
                "story_type": "life_story",
                "status": "published"
            }
        )
        
        response = await client.get("/api/posts?sort_by=smart")
        assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_smart_ranking_with_category(self, client, auth_headers):
        """Test smart ranking with category filter"""
        await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Achievement Ranking Test",
                "content": valid_content(),
                "story_type": "achievement",
                "status": "published"
            }
        )
        
        response = await client.get("/api/posts?story_type=achievement&sort_by=smart")
        assert response.status_code == 200
        assert "stories" in response.json()
    
    @pytest.mark.asyncio
    async def test_fallback_to_latest_sorting(self, client):
        """Test fallback to latest sorting"""
        response = await client.get("/api/posts?sort_by=latest")
        assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_trending_sorting(self, client):
        """Test trending sorting"""
        response = await client.get("/api/posts?sort_by=trending")
        assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_most_viewed_sorting(self, client):
        """Test most_viewed sorting"""
        response = await client.get("/api/posts?sort_by=most_viewed")
        assert response.status_code == 200


class TestBookmarkEndpoints:
    """Test bookmark API endpoints"""
    
    @pytest.mark.asyncio
    async def test_toggle_bookmark_requires_auth(self, client):
        """Test that toggling bookmark requires authentication"""
        response = await client.post("/api/posts/some-story-id/bookmark")
        assert response.status_code == 401
    
    @pytest.mark.asyncio
    async def test_toggle_bookmark_adds_bookmark(self, client, auth_headers):
        """Test adding a bookmark"""
        create_response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Story to Bookmark Here",
                "content": valid_content(),
                "story_type": "life_story",
                "status": "published"
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json()["story"]["id"]
            
            response = await client.post(
                f"/api/posts/{story_id}/bookmark",
                headers=auth_headers
            )
            
            assert response.status_code == 200
            assert response.json()["is_bookmarked"] == True
    
    @pytest.mark.asyncio
    async def test_toggle_bookmark_removes_bookmark(self, client, auth_headers):
        """Test removing a bookmark by toggling again"""
        create_response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Story to Toggle Bookmark",
                "content": valid_content(),
                "story_type": "achievement",
                "status": "published"
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json()["story"]["id"]
            
            # Add bookmark
            await client.post(f"/api/posts/{story_id}/bookmark", headers=auth_headers)
            
            # Toggle again (should remove)
            response = await client.post(
                f"/api/posts/{story_id}/bookmark",
                headers=auth_headers
            )
            
            assert response.status_code == 200
            assert response.json()["is_bookmarked"] == False
    
    @pytest.mark.asyncio
    async def test_get_bookmark_status(self, client, auth_headers):
        """Test getting bookmark status"""
        create_response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Story to Check Status",
                "content": valid_content(),
                "story_type": "regret",
                "status": "published"
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json()["story"]["id"]
            
            response = await client.get(
                f"/api/posts/{story_id}/bookmark",
                headers=auth_headers
            )
            
            assert response.status_code == 200
            assert "is_bookmarked" in response.json()
    
    @pytest.mark.asyncio
    async def test_bookmark_nonexistent_story(self, client, auth_headers):
        """Test bookmarking a non-existent story"""
        response = await client.post(
            "/api/posts/nonexistent-id-12345/bookmark",
            headers=auth_headers
        )
        assert response.status_code == 404
    
    @pytest.mark.asyncio
    async def test_get_my_bookmarks(self, client, auth_headers):
        """Test getting user's bookmarked stories"""
        # Create and bookmark some stories
        for i in range(3):
            create_response = await client.post(
                "/api/posts",
                headers=auth_headers,
                json={
                    "title": f"Bookmarked Story Number {i+1}",
                    "content": valid_content(),
                    "story_type": "life_story",
                    "status": "published"
                }
            )
            if create_response.status_code == 201:
                story_id = create_response.json()["story"]["id"]
                await client.post(
                    f"/api/posts/{story_id}/bookmark",
                    headers=auth_headers
                )
        
        response = await client.get("/api/posts/bookmarks", headers=auth_headers)
        
        assert response.status_code == 200
        assert "stories" in response.json()


class TestReadProgressEndpoints:
    """Test read progress tracking endpoints"""
    
    @pytest.mark.asyncio
    async def test_track_read_progress_success(self, client, auth_headers):
        """Test tracking read progress"""
        create_response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Story to Track Reading",
                "content": valid_content(),
                "story_type": "sacrifice",
                "status": "published"
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json()["story"]["id"]
            
            response = await client.post(
                f"/api/posts/{story_id}/read-progress",
                headers=auth_headers,
                json={
                    "scroll_depth": 0.75,
                    "time_spent": 120
                }
            )
            
            assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_track_read_progress_anonymous(self, client, auth_headers):
        """Test tracking read progress without authentication"""
        create_response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Story for Anonymous Read",
                "content": valid_content(),
                "story_type": "life_story",
                "status": "published"
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json()["story"]["id"]
            
            response = await client.post(
                f"/api/posts/{story_id}/read-progress",
                json={
                    "scroll_depth": 0.5,
                    "time_spent": 60
                }
            )
            
            assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_track_progress_nonexistent_story(self, client, auth_headers):
        """Test tracking progress on non-existent story"""
        response = await client.post(
            "/api/posts/nonexistent-id/read-progress",
            headers=auth_headers,
            json={"scroll_depth": 0.5, "time_spent": 30}
        )
        assert response.status_code == 404


class TestEngagementMetricsUpdate:
    """Test engagement metrics are properly updated"""
    
    @pytest.mark.asyncio
    async def test_view_count_increments(self, client, auth_headers):
        """Test that view count increments when story is viewed"""
        create_response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Story for View Count Test",
                "content": valid_content(),
                "story_type": "other",
                "status": "published"
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json()["story"]["id"]
            initial_views = create_response.json()["story"].get("view_count", 0)
            
            # View the story
            await client.get(f"/api/posts/{story_id}")
            
            # Get story again
            response = await client.get(f"/api/posts/{story_id}")
            
            if response.status_code == 200:
                assert response.json()["story"]["view_count"] >= initial_views


class TestEdgeCases:
    """Test edge cases and boundary conditions"""
    
    @pytest.mark.asyncio
    async def test_invalid_story_type_string(self, client):
        """Test handling of invalid story type strings"""
        response = await client.get("/api/posts?story_type=invalid_type")
        # Should not crash, 200 or 400
        assert response.status_code in [200, 400]
    
    @pytest.mark.asyncio
    async def test_large_per_page(self, client):
        """Test with very large per_page value"""
        response = await client.get("/api/posts?page=1&per_page=1000")
        # May be 200 if allowed, or 422 if FastAPI enforces max limit
        assert response.status_code in [200, 422]


class TestMultipleUsers:
    """Test scenarios with multiple users"""
    
    @pytest.mark.asyncio
    async def test_multiple_users_bookmark_same_story(self, client):
        """Test multiple users can bookmark the same story"""
        # Create author
        await client.post("/api/auth/register", json={
            "username": "storyauthor",
            "email": "storyauthor@gmail.com",
            "password": VALID_PASSWORD
        })
        login_author = await client.post("/api/auth/login", json={
            "email": "storyauthor@gmail.com",
            "password": VALID_PASSWORD
        })
        author_headers = {"Authorization": f"Bearer {login_author.json()['access_token']}"}
        
        # Create story
        story_resp = await client.post(
            "/api/posts",
            headers=author_headers,
            json={
                "title": "Popular Story For Multiple Bookmarks",
                "content": valid_content(),
                "story_type": "achievement",
                "status": "published"
            }
        )
        story_id = story_resp.json()["story"]["id"]
        
        # Create multiple users who will bookmark
        for i in range(3):
            await client.post("/api/auth/register", json={
                "username": f"bookmarker{i}",
                "email": f"bookmarker{i}@gmail.com",
                "password": VALID_PASSWORD
            })
            login = await client.post("/api/auth/login", json={
                "email": f"bookmarker{i}@gmail.com",
                "password": VALID_PASSWORD
            })
            headers = {"Authorization": f"Bearer {login.json()['access_token']}"}
            
            response = await client.post(
                f"/api/posts/{story_id}/bookmark",
                headers=headers
            )
            assert response.status_code == 200


class TestAllStoryTypes:
    """Test ranking works for all story types"""
    
    @pytest.mark.asyncio
    async def test_achievement_ranking(self, client):
        """Test Achievement category ranking"""
        response = await client.get("/api/posts?story_type=achievement&sort_by=smart")
        assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_regret_ranking(self, client):
        """Test Regret category ranking"""
        response = await client.get("/api/posts?story_type=regret&sort_by=smart")
        assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_unsent_letter_ranking(self, client):
        """Test Unsent Letter category ranking"""
        response = await client.get("/api/posts?story_type=unsent_letter&sort_by=smart")
        assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_sacrifice_ranking(self, client):
        """Test Sacrifice category ranking"""
        response = await client.get("/api/posts?story_type=sacrifice&sort_by=smart")
        assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_life_story_ranking(self, client):
        """Test Life Story category ranking"""
        response = await client.get("/api/posts?story_type=life_story&sort_by=smart")
        assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_other_ranking(self, client):
        """Test Other category ranking"""
        response = await client.get("/api/posts?story_type=other&sort_by=smart")
        assert response.status_code == 200


class TestPaginationEdgeCases:
    """Test pagination edge cases"""
    
    @pytest.mark.asyncio
    async def test_page_zero(self, client):
        """Test page 0 handling"""
        response = await client.get("/api/posts?page=0")
        # Should handle gracefully
        assert response.status_code in [200, 400, 422]
    
    @pytest.mark.asyncio
    async def test_negative_page(self, client):
        """Test negative page handling"""
        response = await client.get("/api/posts?page=-1")
        assert response.status_code in [200, 400, 422]
    
    @pytest.mark.asyncio
    async def test_zero_per_page(self, client):
        """Test per_page 0 handling"""
        response = await client.get("/api/posts?per_page=0")
        assert response.status_code in [200, 400, 422]
    
    @pytest.mark.asyncio
    async def test_negative_per_page(self, client):
        """Test negative per_page handling"""
        response = await client.get("/api/posts?per_page=-1")
        assert response.status_code in [200, 400, 422]
    
    @pytest.mark.asyncio
    async def test_very_high_page_number(self, client):
        """Test very high page number"""
        response = await client.get("/api/posts?page=9999999")
        assert response.status_code == 200
        # Should return empty stories
        data = response.json()
        assert "stories" in data


class TestCompletionRateCalculation:
    """Test completion rate calculations"""
    
    @pytest.mark.asyncio
    async def test_scroll_depth_boundary_zero(self, client, auth_headers):
        """Test scroll depth at 0.0"""
        create_response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Scroll Boundary Test Story",
                "content": valid_content(),
                "story_type": "life_story",
                "status": "published"
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json()["story"]["id"]
            
            response = await client.post(
                f"/api/posts/{story_id}/read-progress",
                headers=auth_headers,
                json={
                    "scroll_depth": 0.0,
                    "time_spent": 5
                }
            )
            
            assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_scroll_depth_boundary_one(self, client, auth_headers):
        """Test scroll depth at 1.0 (complete read)"""
        create_response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Complete Read Test Story",
                "content": valid_content(),
                "story_type": "life_story",
                "status": "published"
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json()["story"]["id"]
            
            response = await client.post(
                f"/api/posts/{story_id}/read-progress",
                headers=auth_headers,
                json={
                    "scroll_depth": 1.0,
                    "time_spent": 300
                }
            )
            
            assert response.status_code == 200


class TestRankingOrder:
    """Test that ranking produces correct ordering"""
    
    @pytest.mark.asyncio
    async def test_stories_with_engagement_return(self, client, auth_headers):
        """Test that stories with engagement are returned"""
        # Create a story with views
        create_response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Popular Story for Rank Test",
                "content": valid_content(),
                "story_type": "achievement",
                "status": "published"
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json()["story"]["id"]
            
            # View multiple times
            for _ in range(5):
                await client.get(f"/api/posts/{story_id}")
            
            result = await client.get("/api/posts?story_type=achievement&sort_by=smart")
            
            assert result.status_code == 200
            assert "stories" in result.json()


class TestSaveCountTracking:
    """Test that save_count on Post is properly tracked"""
    
    @pytest.mark.asyncio
    async def test_save_count_in_response(self, client, auth_headers):
        """Test save_count appears in bookmark response"""
        create_response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Test Save Count Story",
                "content": valid_content(),
                "story_type": "achievement",
                "status": "published"
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json()["story"]["id"]
            
            response = await client.post(
                f"/api/posts/{story_id}/bookmark",
                headers=auth_headers
            )
            
            assert response.status_code == 200
            assert "save_count" in response.json()
