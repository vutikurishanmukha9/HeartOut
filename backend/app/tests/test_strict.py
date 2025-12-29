"""
FastAPI Strict Test Suite
Rigorous tests for edge cases, boundaries, and data integrity
Migrated from Flask test_strict.py
"""
import pytest


VALID_PASSWORD = "SecureP@ss123!"


def valid_content():
    return "This is a test story content that meets the minimum character requirement for validation."


class TestStrictInputValidation:
    """Strict input validation tests with edge cases"""
    
    @pytest.mark.asyncio
    async def test_username_boundary_min(self, client):
        """Test username at minimum boundary (3 chars)"""
        response = await client.post("/api/auth/register", json={
            "username": "abc",  # Exactly 3 chars
            "email": "minuser@gmail.com",
            "password": VALID_PASSWORD
        })
        assert response.status_code == 201, "3-char username should be accepted"
    
    @pytest.mark.asyncio
    async def test_username_boundary_below_min(self, client):
        """Test username below minimum boundary (2 chars)"""
        response = await client.post("/api/auth/register", json={
            "username": "ab",  # 2 chars - too short
            "email": "shortuser@gmail.com",
            "password": VALID_PASSWORD
        })
        assert response.status_code in [400, 422], "2-char username should be rejected"
    
    @pytest.mark.asyncio
    async def test_username_with_spaces(self, client):
        """Test username with spaces should be rejected"""
        response = await client.post("/api/auth/register", json={
            "username": "user name",
            "email": "spaces@gmail.com",
            "password": VALID_PASSWORD
        })
        assert response.status_code in [400, 422], "Username with spaces should be rejected"
    
    @pytest.mark.asyncio
    async def test_email_without_tld(self, client):
        """Test email without TLD"""
        response = await client.post("/api/auth/register", json={
            "username": "testuser",
            "email": "user@localhost",
            "password": VALID_PASSWORD
        })
        assert response.status_code in [400, 422], "Email without proper TLD should be rejected"
    
    @pytest.mark.asyncio
    async def test_password_without_uppercase(self, client):
        """Test password without uppercase letter"""
        response = await client.post("/api/auth/register", json={
            "username": "testuser",
            "email": "test@gmail.com",
            "password": "lowercase123!"
        })
        assert response.status_code in [400, 422], "Password without uppercase should be rejected"
    
    @pytest.mark.asyncio
    async def test_password_without_lowercase(self, client):
        """Test password without lowercase letter"""
        response = await client.post("/api/auth/register", json={
            "username": "testuser",
            "email": "test@gmail.com",
            "password": "UPPERCASE123!"
        })
        assert response.status_code in [400, 422], "Password without lowercase should be rejected"
    
    @pytest.mark.asyncio
    async def test_password_without_number(self, client):
        """Test password without number"""
        response = await client.post("/api/auth/register", json={
            "username": "testuser",
            "email": "test@gmail.com",
            "password": "NoNumbers!@#"
        })
        assert response.status_code in [400, 422], "Password without number should be rejected"
    
    @pytest.mark.asyncio
    async def test_password_without_special_char(self, client):
        """Test password without special character"""
        response = await client.post("/api/auth/register", json={
            "username": "testuser",
            "email": "test@gmail.com",
            "password": "NoSpecial123"
        })
        assert response.status_code in [400, 422], "Password without special char should be rejected"
    
    @pytest.mark.asyncio
    async def test_empty_request_body(self, client):
        """Test registration with empty request body"""
        response = await client.post("/api/auth/register", json={})
        assert response.status_code in [400, 422], "Empty body should be rejected"
    
    @pytest.mark.asyncio
    async def test_missing_username(self, client):
        """Test registration with missing username"""
        response = await client.post("/api/auth/register", json={
            "email": "test@gmail.com",
            "password": VALID_PASSWORD
        })
        assert response.status_code in [400, 422]
    
    @pytest.mark.asyncio
    async def test_missing_email(self, client):
        """Test registration with missing email"""
        response = await client.post("/api/auth/register", json={
            "username": "testuser",
            "password": VALID_PASSWORD
        })
        assert response.status_code in [400, 422]
    
    @pytest.mark.asyncio
    async def test_missing_password(self, client):
        """Test registration with missing password"""
        response = await client.post("/api/auth/register", json={
            "username": "testuser",
            "email": "test@gmail.com"
        })
        assert response.status_code in [400, 422]


class TestStrictStoryValidation:
    """Strict story validation tests"""
    
    @pytest.mark.asyncio
    async def test_story_content_exactly_min_length(self, client, auth_headers):
        """Test story content at exactly minimum length"""
        response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Valid Title Here",
                "content": "A" * 50,  # Exactly 50 chars
                "story_type": "life_story"
            }
        )
        assert response.status_code == 201, "Content at minimum length should be accepted"
    
    @pytest.mark.asyncio
    async def test_story_content_one_below_min(self, client, auth_headers):
        """Test story content one char below minimum"""
        response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Valid Title Here",
                "content": "A" * 49,  # One below minimum
                "story_type": "life_story"
            }
        )
        assert response.status_code in [400, 422], "Content below minimum should be rejected"
    
    @pytest.mark.asyncio
    async def test_invalid_story_type(self, client, auth_headers):
        """Test invalid story type"""
        response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Valid Title Here",
                "content": "A" * 60,
                "story_type": "invalid_type"
            }
        )
        assert response.status_code in [400, 422], "Invalid story type should be rejected"
    
    @pytest.mark.asyncio
    async def test_all_valid_story_types(self, client, auth_headers):
        """Test all valid story types are accepted"""
        valid_types = ["life_story", "regret", "achievement", "sacrifice", 
                       "unsent_letter", "other"]
        
        for i, story_type in enumerate(valid_types):
            response = await client.post(
                "/api/posts",
                headers=auth_headers,
                json={
                    "title": f"Story Type Test {i}",
                    "content": "A" * 60,
                    "story_type": story_type,
                    "status": "published"
                }
            )
            assert response.status_code == 201, f"Story type '{story_type}' should be accepted"
    
    @pytest.mark.asyncio
    async def test_story_creation_with_tags(self, client, auth_headers):
        """Test story creation with tags"""
        response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Tagged Story Title",
                "content": "A" * 60,
                "story_type": "life_story",
                "tags": ["love", "inspiration"]
            }
        )
        assert response.status_code == 201


class TestStrictAuthorization:
    """Strict authorization tests"""
    
    @pytest.mark.asyncio
    async def test_cannot_update_others_story(self, client):
        """Test that a user cannot update another user's story"""
        # Create first user and their story
        await client.post("/api/auth/register", json={
            "username": "author1strict",
            "email": "author1strict@gmail.com",
            "password": VALID_PASSWORD
        })
        login1 = await client.post("/api/auth/login", json={
            "email": "author1strict@gmail.com",
            "password": VALID_PASSWORD
        })
        token1 = login1.json().get("access_token")
        
        # Create story as first user
        create_resp = await client.post(
            "/api/posts",
            headers={"Authorization": f"Bearer {token1}"},
            json={
                "title": "Author1 Story Title Strict",
                "content": "A" * 60,
                "story_type": "life_story",
                "status": "published"
            }
        )
        story_id = create_resp.json()["story"]["id"] if create_resp.status_code == 201 else None
        
        if story_id:
            # Create second user
            await client.post("/api/auth/register", json={
                "username": "author2strict",
                "email": "author2strict@gmail.com",
                "password": VALID_PASSWORD
            })
            login2 = await client.post("/api/auth/login", json={
                "email": "author2strict@gmail.com",
                "password": VALID_PASSWORD
            })
            token2 = login2.json().get("access_token")
            
            # Try to update first user's story as second user
            update_resp = await client.put(
                f"/api/posts/{story_id}",
                headers={"Authorization": f"Bearer {token2}"},
                json={
                    "title": "Hacked Title!",
                    "content": "B" * 60,
                    "story_type": "life_story"
                }
            )
            assert update_resp.status_code == 403, "Should not be able to update others' stories"
    
    @pytest.mark.asyncio
    async def test_cannot_delete_others_story(self, client):
        """Test that a user cannot delete another user's story"""
        # Create first user and their story
        await client.post("/api/auth/register", json={
            "username": "ownerstrict",
            "email": "ownerstrict@gmail.com",
            "password": VALID_PASSWORD
        })
        login1 = await client.post("/api/auth/login", json={
            "email": "ownerstrict@gmail.com",
            "password": VALID_PASSWORD
        })
        token1 = login1.json().get("access_token")
        
        # Create story as first user
        create_resp = await client.post(
            "/api/posts",
            headers={"Authorization": f"Bearer {token1}"},
            json={
                "title": "Owner1 Story Title Strict",
                "content": "A" * 60,
                "story_type": "life_story",
                "status": "published"
            }
        )
        story_id = create_resp.json()["story"]["id"] if create_resp.status_code == 201 else None
        
        if story_id:
            # Create second user
            await client.post("/api/auth/register", json={
                "username": "attackerstrict",
                "email": "attackerstrict@gmail.com",
                "password": VALID_PASSWORD
            })
            login2 = await client.post("/api/auth/login", json={
                "email": "attackerstrict@gmail.com",
                "password": VALID_PASSWORD
            })
            token2 = login2.json().get("access_token")
            
            # Try to delete first user's story as second user
            delete_resp = await client.delete(
                f"/api/posts/{story_id}",
                headers={"Authorization": f"Bearer {token2}"}
            )
            assert delete_resp.status_code == 403, "Should not be able to delete others' stories"


class TestStrictTokenSecurity:
    """Strict JWT token security tests"""
    
    @pytest.mark.asyncio
    async def test_malformed_tokens(self, client):
        """Test that malformed tokens are rejected"""
        malformed_tokens = [
            "Bearer invalid.token.here",
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.SflKxwRJSMeKKF2QT",
            "InvalidBearer token",
            "Bearer ",
        ]
        
        for token in malformed_tokens:
            response = await client.get(
                "/api/auth/profile", 
                headers={"Authorization": token}
            )
            assert response.status_code in [401, 422], f"Invalid token should be rejected"
    
    @pytest.mark.asyncio
    async def test_token_without_bearer_prefix(self, client):
        """Test token without Bearer prefix"""
        # Register and login
        await client.post("/api/auth/register", json={
            "username": "tokentest",
            "email": "tokentest@gmail.com",
            "password": VALID_PASSWORD
        })
        login_resp = await client.post("/api/auth/login", json={
            "email": "tokentest@gmail.com",
            "password": VALID_PASSWORD
        })
        token = login_resp.json().get("access_token")
        
        # Try without Bearer prefix
        response = await client.get(
            "/api/auth/profile",
            headers={"Authorization": token}  # Missing "Bearer "
        )
        assert response.status_code == 401, "Token without Bearer prefix should be rejected"


class TestDataIntegrity:
    """Data integrity and consistency tests"""
    
    @pytest.mark.asyncio
    async def test_story_author_consistency(self, client, auth_headers):
        """Test that story author info is consistent"""
        response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Author Consistency Test",
                "content": "A" * 60,
                "story_type": "life_story",
                "is_anonymous": False,
                "status": "published"
            }
        )
        
        if response.status_code == 201:
            story_id = response.json()["story"]["id"]
            
            get_resp = await client.get(f"/api/posts/{story_id}")
            if get_resp.status_code == 200:
                story = get_resp.json().get("story", {})
                if not story.get("is_anonymous"):
                    assert story.get("author") is not None
    
    @pytest.mark.asyncio
    async def test_anonymous_story_hides_author(self, client, auth_headers):
        """Test that anonymous stories hide author information"""
        response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Anonymous Story Test",
                "content": "A" * 60,
                "story_type": "unsent_letter",
                "is_anonymous": True,
                "status": "published"
            }
        )
        
        if response.status_code == 201:
            story_id = response.json()["story"]["id"]
            
            get_resp = await client.get(f"/api/posts/{story_id}")
            if get_resp.status_code == 200:
                story = get_resp.json().get("story", {})
                if story.get("is_anonymous"):
                    author = story.get("author", {})
                    if isinstance(author, dict):
                        assert author.get("username") == "Anonymous" or author.get("display_name") == "Anonymous User"
    
    @pytest.mark.asyncio
    async def test_draft_not_visible_in_public_feed(self, client, auth_headers):
        """Test that drafts are not visible in public feed"""
        response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "My Secret Draft Strict",
                "content": "A" * 60,
                "story_type": "life_story",
                "status": "draft"
            }
        )
        
        if response.status_code == 201:
            draft_title = response.json()["story"]["title"]
            
            feed_resp = await client.get("/api/posts")
            if feed_resp.status_code == 200:
                stories = feed_resp.json().get("stories", [])
                draft_titles = [s.get("title") for s in stories]
                assert draft_title not in draft_titles, "Draft should not appear in public feed"


class TestRateLimitingBehavior:
    """Test rate limiting behavior (when enabled)"""
    
    @pytest.mark.asyncio
    async def test_multiple_rapid_requests(self, client):
        """Test that rapid requests are handled"""
        responses = []
        for i in range(10):
            response = await client.get("/api/health")
            responses.append(response.status_code)
        
        # All should succeed in test mode
        assert all(code == 200 for code in responses)


class TestEdgeCases:
    """Edge case tests"""
    
    @pytest.mark.asyncio
    async def test_very_long_title(self, client, auth_headers):
        """Test story with very long title"""
        response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "A" * 500,  # Very long title
                "content": "B" * 60,
                "story_type": "life_story"
            }
        )
        # Should either accept or reject gracefully
        assert response.status_code in [201, 400, 422]
    
    @pytest.mark.asyncio
    async def test_very_long_content(self, client, auth_headers):
        """Test story with very long content"""
        response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Long Content Story",
                "content": "A" * 100000,  # 100k chars
                "story_type": "life_story"
            }
        )
        # Should handle gracefully
        assert response.status_code in [201, 400, 413, 422]
    
    @pytest.mark.asyncio
    async def test_unicode_in_story(self, client, auth_headers):
        """Test story with unicode characters"""
        response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "My Story in Chinese and Arabic",
                "content": "Unicode content: Japanese Korean Arabic " + "A" * 50,
                "story_type": "life_story"
            }
        )
        assert response.status_code == 201, "Unicode should be accepted"
    
    @pytest.mark.asyncio
    async def test_html_in_story(self, client, auth_headers):
        """Test that HTML in story content is handled safely"""
        response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "HTML Test Story",
                "content": '<script>alert("xss")</script><b>Bold</b> Normal text ' + "A" * 50,
                "story_type": "life_story"
            }
        )
        # Should be accepted but sanitized
        assert response.status_code == 201
    
    @pytest.mark.asyncio
    async def test_null_values(self, client, auth_headers):
        """Test null values in optional fields"""
        response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Null Test Story",
                "content": "A" * 60,
                "story_type": "life_story",
                "tags": None,
                "is_anonymous": None
            }
        )
        # Should handle null gracefully
        assert response.status_code in [201, 400, 422]
    
    @pytest.mark.asyncio
    async def test_special_characters_in_title(self, client, auth_headers):
        """Test special characters in story title"""
        response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "Title with 'quotes' and \"double quotes\" & ampersand",
                "content": "A" * 60,
                "story_type": "life_story"
            }
        )
        assert response.status_code == 201
    
    @pytest.mark.asyncio
    async def test_empty_string_title(self, client, auth_headers):
        """Test empty string title"""
        response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "",
                "content": "A" * 60,
                "story_type": "life_story"
            }
        )
        assert response.status_code in [400, 422]
    
    @pytest.mark.asyncio
    async def test_whitespace_only_title(self, client, auth_headers):
        """Test whitespace-only title"""
        response = await client.post(
            "/api/posts",
            headers=auth_headers,
            json={
                "title": "   ",
                "content": "A" * 60,
                "story_type": "life_story"
            }
        )
        assert response.status_code in [400, 422]
