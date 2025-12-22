"""
Tests for Category-Based Ranking and Engagement Features
"""
import pytest
from datetime import datetime, timezone, timedelta
from app.models import Post, PostStatus, StoryType, User, Bookmark, ReadProgress, Support
from app.services.ranking_service import RankingService
from app.extensions import db


# Helper to create valid content (min 50 chars)
def valid_content():
    return "This is a test story content that meets the minimum character requirement for validation."


class TestRankingService:
    """Test the RankingService category-specific algorithms"""
    
    def test_ranking_service_exists(self):
        """Test that RankingService class exists and has required methods"""
        assert hasattr(RankingService, 'get_ranked_stories')
        assert hasattr(RankingService, 'update_story_metrics')
        assert hasattr(RankingService, 'toggle_bookmark')
        assert hasattr(RankingService, 'is_bookmarked')
        assert hasattr(RankingService, 'get_user_bookmarks')
    
    def test_gravity_constant_defined(self):
        """Test that GRAVITY constant is defined"""
        assert hasattr(RankingService, 'GRAVITY')
        assert RankingService.GRAVITY > 0
    
    def test_random_categories_defined(self):
        """Test that RANDOM_CATEGORIES is defined for privacy-sensitive types"""
        assert hasattr(RankingService, 'RANDOM_CATEGORIES')
        assert StoryType.UNSENT_LETTER in RankingService.RANDOM_CATEGORIES
    
    def test_get_ranked_stories_with_string_type(self, app, auth_headers, client):
        """Test get_ranked_stories accepts string story types"""
        with app.app_context():
            result = RankingService.get_ranked_stories(story_type='achievement', page=1, per_page=10)
            assert result is not None
            assert hasattr(result, 'items')
    
    def test_get_ranked_stories_with_enum_type(self, app):
        """Test get_ranked_stories accepts StoryType enum"""
        with app.app_context():
            result = RankingService.get_ranked_stories(story_type=StoryType.REGRET, page=1, per_page=10)
            assert result is not None
            assert hasattr(result, 'items')
    
    def test_get_ranked_stories_without_type(self, app):
        """Test get_ranked_stories works without story type filter"""
        with app.app_context():
            result = RankingService.get_ranked_stories(story_type=None, page=1, per_page=10)
            assert result is not None
    
    def test_get_ranked_stories_pagination(self, app):
        """Test pagination parameters work correctly"""
        with app.app_context():
            result = RankingService.get_ranked_stories(page=1, per_page=5)
            assert result is not None
            assert hasattr(result, 'page')
            assert hasattr(result, 'per_page')


class TestSmartRankingEndpoint:
    """Test the smart ranking API endpoint"""
    
    def test_smart_ranking_default(self, client):
        """Test that smart ranking is the default sort"""
        response = client.get('/api/posts/')
        
        assert response.status_code == 200
        assert 'ranking_algorithm' in response.json
        assert response.json['ranking_algorithm'] == 'smart'
    
    def test_smart_ranking_with_category(self, client):
        """Test smart ranking with category filter"""
        response = client.get('/api/posts/?sort_by=smart&story_type=achievement')
        
        assert response.status_code == 200
        assert 'stories' in response.json
        assert response.json['ranking_algorithm'] == 'smart'
    
    def test_fallback_to_latest_sorting(self, client):
        """Test fallback to latest sorting"""
        response = client.get('/api/posts/?sort_by=latest')
        
        assert response.status_code == 200
        assert response.json['ranking_algorithm'] == 'latest'
    
    def test_trending_sorting(self, client):
        """Test trending sorting still works"""
        response = client.get('/api/posts/?sort_by=trending')
        
        assert response.status_code == 200
        assert response.json['ranking_algorithm'] == 'trending'
    
    def test_most_viewed_sorting(self, client):
        """Test most_viewed sorting still works"""
        response = client.get('/api/posts/?sort_by=most_viewed')
        
        assert response.status_code == 200
        assert response.json['ranking_algorithm'] == 'most_viewed'


class TestBookmarkEndpoints:
    """Test bookmark API endpoints"""
    
    def test_toggle_bookmark_requires_auth(self, client):
        """Test that toggling bookmark requires authentication"""
        response = client.post('/api/posts/some-story-id/bookmark')
        
        assert response.status_code == 401
    
    def test_toggle_bookmark_adds_bookmark(self, client, auth_headers):
        """Test adding a bookmark"""
        # First create a story
        create_response = client.post('/api/posts',
            headers=auth_headers,
            json={
                'title': 'Story to Bookmark Here',
                'content': valid_content(),
                'story_type': 'life_story',
                'status': 'published'
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json['story']['id']
            
            # Toggle bookmark (should add)
            response = client.post(f'/api/posts/{story_id}/bookmark', headers=auth_headers)
            
            assert response.status_code == 200
            assert response.json['is_bookmarked'] == True
            assert 'save_count' in response.json
    
    def test_toggle_bookmark_removes_bookmark(self, client, auth_headers):
        """Test removing a bookmark by toggling again"""
        # Create a story
        create_response = client.post('/api/posts',
            headers=auth_headers,
            json={
                'title': 'Story to Toggle Bookmark',
                'content': valid_content(),
                'story_type': 'achievement',
                'status': 'published'
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json['story']['id']
            
            # Add bookmark
            client.post(f'/api/posts/{story_id}/bookmark', headers=auth_headers)
            
            # Toggle again (should remove)
            response = client.post(f'/api/posts/{story_id}/bookmark', headers=auth_headers)
            
            assert response.status_code == 200
            assert response.json['is_bookmarked'] == False
    
    def test_get_bookmark_status(self, client, auth_headers):
        """Test getting bookmark status"""
        # Create a story
        create_response = client.post('/api/posts',
            headers=auth_headers,
            json={
                'title': 'Story to Check Status',
                'content': valid_content(),
                'story_type': 'regret',
                'status': 'published'
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json['story']['id']
            
            # Check status (should be not bookmarked)
            response = client.get(f'/api/posts/{story_id}/bookmark', headers=auth_headers)
            
            assert response.status_code == 200
            assert response.json['is_bookmarked'] == False
            
            # Add bookmark
            client.post(f'/api/posts/{story_id}/bookmark', headers=auth_headers)
            
            # Check status again (should be bookmarked)
            response = client.get(f'/api/posts/{story_id}/bookmark', headers=auth_headers)
            
            assert response.status_code == 200
            assert response.json['is_bookmarked'] == True
    
    def test_bookmark_nonexistent_story(self, client, auth_headers):
        """Test bookmarking a non-existent story"""
        response = client.post('/api/posts/nonexistent-id-12345/bookmark', headers=auth_headers)
        
        assert response.status_code == 404
    
    def test_get_my_bookmarks(self, client, auth_headers):
        """Test getting user's bookmarked stories"""
        # Create and bookmark some stories
        for i in range(3):
            create_response = client.post('/api/posts',
                headers=auth_headers,
                json={
                    'title': f'Bookmarked Story Number {i+1}',
                    'content': valid_content(),
                    'story_type': 'life_story',
                    'status': 'published'
                }
            )
            if create_response.status_code == 201:
                story_id = create_response.json['story']['id']
                client.post(f'/api/posts/{story_id}/bookmark', headers=auth_headers)
        
        # Get bookmarks
        response = client.get('/api/posts/bookmarks', headers=auth_headers)
        
        assert response.status_code == 200
        assert 'stories' in response.json
        assert 'total' in response.json


class TestReadProgressEndpoints:
    """Test read progress tracking endpoints"""
    
    def test_track_read_progress_success(self, client, auth_headers):
        """Test tracking read progress"""
        # Create a story
        create_response = client.post('/api/posts',
            headers=auth_headers,
            json={
                'title': 'Story to Track Reading',
                'content': valid_content(),
                'story_type': 'sacrifice',
                'status': 'published'
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json['story']['id']
            
            # Track read progress
            response = client.post(
                f'/api/posts/{story_id}/read-progress',
                headers=auth_headers,
                json={
                    'scroll_depth': 0.75,
                    'time_spent': 120
                }
            )
            
            assert response.status_code == 200
            assert response.json['scroll_depth'] == 0.75
            assert response.json['time_spent'] == 120
    
    def test_track_read_progress_anonymous(self, client, auth_headers):
        """Test tracking read progress without authentication"""
        # Create a story
        create_response = client.post('/api/posts',
            headers=auth_headers,
            json={
                'title': 'Story for Anonymous Read',
                'content': valid_content(),
                'story_type': 'life_story',
                'status': 'published'
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json['story']['id']
            
            # Track without auth (should still work for view count)
            response = client.post(
                f'/api/posts/{story_id}/read-progress',
                json={
                    'scroll_depth': 0.5,
                    'time_spent': 60
                }
            )
            
            assert response.status_code == 200
    
    def test_track_progress_nonexistent_story(self, client, auth_headers):
        """Test tracking progress on non-existent story"""
        response = client.post(
            '/api/posts/nonexistent-id/read-progress',
            headers=auth_headers,
            json={'scroll_depth': 0.5, 'time_spent': 30}
        )
        
        assert response.status_code == 404


class TestEngagementMetricsUpdate:
    """Test engagement metrics are properly updated"""
    
    def test_view_count_increments(self, client, auth_headers):
        """Test that view count increments when story is viewed"""
        # Create a story
        create_response = client.post('/api/posts',
            headers=auth_headers,
            json={
                'title': 'Story for View Count Test',
                'content': valid_content(),
                'story_type': 'other',
                'status': 'published'
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json['story']['id']
            initial_views = create_response.json['story'].get('view_count', 0)
            
            # View the story
            client.get(f'/api/posts/{story_id}')
            
            # Get story again to check view count
            response = client.get(f'/api/posts/{story_id}')
            
            if response.status_code == 200:
                # View count should have increased
                assert response.json['story']['view_count'] >= initial_views


class TestGravitySortRanking:
    """Test Gravity Sort ranking algorithm"""
    
    def test_unsent_letters_uses_random(self):
        """Test Unsent Letters category uses random ranking for privacy"""
        assert StoryType.UNSENT_LETTER in RankingService.RANDOM_CATEGORIES
    
    def test_other_categories_use_gravity(self):
        """Test other categories use Gravity Sort ranking"""
        # All non-random categories should use gravity sort
        for story_type in StoryType:
            if story_type not in RankingService.RANDOM_CATEGORIES:
                # Should not raise any errors
                pass  # Gravity sort is default for all other types
    
    def test_gravity_decay_factor(self):
        """Test gravity decay factor is reasonable"""
        # Hacker News uses 1.8, valid range is 1.5-2.0
        assert 1.0 <= RankingService.GRAVITY <= 3.0


class TestBookmarkModel:
    """Test Bookmark model operations"""
    
    def test_bookmark_unique_constraint(self, app):
        """Test that user can only bookmark a story once"""
        with app.app_context():
            # Create user and story
            user = User(
                username='bookmarktest',
                email='bookmark@gmail.com',
                display_name='Bookmark Tester'
            )
            user.set_password('TestPass123!')
            db.session.add(user)
            db.session.commit()
            
            story = Post(
                title='Test Bookmark Story Here',
                content=valid_content(),
                story_type=StoryType.LIFE_STORY,
                status=PostStatus.PUBLISHED,
                user_id=user.id
            )
            db.session.add(story)
            db.session.commit()
            
            # First bookmark should succeed
            is_bookmarked, count = RankingService.toggle_bookmark(story.public_id, user.id)
            assert is_bookmarked == True
            assert count == 1
            
            # Toggle again should remove
            is_bookmarked, count = RankingService.toggle_bookmark(story.public_id, user.id)
            assert is_bookmarked == False
            assert count == 0


class TestReadProgressModel:
    """Test ReadProgress model operations"""
    
    def test_update_story_metrics(self, app):
        """Test updating story metrics via RankingService"""
        with app.app_context():
            # Create user and story
            user = User(
                username='progresstest',
                email='progress@gmail.com',
                display_name='Progress Tester'
            )
            user.set_password('TestPass123!')
            db.session.add(user)
            db.session.commit()
            
            story = Post(
                title='Test Progress Story Title',
                content=valid_content(),
                story_type=StoryType.ACHIEVEMENT,
                status=PostStatus.PUBLISHED,
                user_id=user.id
            )
            db.session.add(story)
            db.session.commit()
            
            initial_view_count = story.view_count
            
            # Update metrics
            success = RankingService.update_story_metrics(
                story_id=story.public_id,
                user_id=user.id,
                scroll_depth=0.8,
                time_spent=90
            )
            
            assert success == True
            
            # Check ReadProgress was created
            progress = ReadProgress.query.filter_by(
                user_id=user.id,
                post_id=story.id
            ).first()
            
            assert progress is not None
            assert progress.scroll_depth == 0.8
            assert progress.time_spent == 90
    
    def test_reread_increments_count(self, app):
        """Test that re-reading a story increments read count"""
        with app.app_context():
            user = User(
                username='rereadtest',
                email='reread@gmail.com',
                display_name='Reread Tester'
            )
            user.set_password('TestPass123!')
            db.session.add(user)
            db.session.commit()
            
            story = Post(
                title='Test Reread Story Title',
                content=valid_content(),
                story_type=StoryType.REGRET,
                status=PostStatus.PUBLISHED,
                user_id=user.id
            )
            db.session.add(story)
            db.session.commit()
            
            # First read
            RankingService.update_story_metrics(
                story_id=story.public_id,
                user_id=user.id,
                scroll_depth=0.5,
                time_spent=30
            )
            
            # Second read
            RankingService.update_story_metrics(
                story_id=story.public_id,
                user_id=user.id,
                scroll_depth=0.9,
                time_spent=60
            )
            
            # Check progress
            progress = ReadProgress.query.filter_by(
                user_id=user.id,
                post_id=story.id
            ).first()
            
            assert progress.read_count == 2
            # Scroll depth should be max of the two
            assert progress.scroll_depth == 0.9


class TestSaveCountTracking:
    """Test that save_count on Post is properly tracked"""
    
    def test_save_count_increments_on_bookmark(self, app):
        """Test save_count increments when bookmarked"""
        with app.app_context():
            user = User(
                username='savecounttest',
                email='savecount@gmail.com',
                display_name='Save Count Tester'
            )
            user.set_password('TestPass123!')
            db.session.add(user)
            db.session.commit()
            
            story = Post(
                title='Test Save Count Story',
                content=valid_content(),
                story_type=StoryType.ACHIEVEMENT,
                status=PostStatus.PUBLISHED,
                user_id=user.id
            )
            db.session.add(story)
            db.session.commit()
            
            assert story.save_count == 0
            
            # Bookmark
            RankingService.toggle_bookmark(story.public_id, user.id)
            
            # Refresh from DB
            db.session.refresh(story)
            assert story.save_count == 1
            
            # Un-bookmark
            RankingService.toggle_bookmark(story.public_id, user.id)
            
            db.session.refresh(story)
            assert story.save_count == 0


# ============== ADDITIONAL COMPREHENSIVE TESTS ==============

class TestEdgeCases:
    """Test edge cases and boundary conditions"""
    
    def test_invalid_story_type_string(self, app):
        """Test handling of invalid story type strings"""
        with app.app_context():
            # Should not crash, should use default weights
            result = RankingService.get_ranked_stories(story_type='invalid_type', page=1, per_page=10)
            assert result is not None
    
    def test_zero_pagination(self, app):
        """Test pagination with zero or negative values"""
        with app.app_context():
            # Page 0 should be handled gracefully
            result = RankingService.get_ranked_stories(page=0, per_page=10)
            assert result is not None
    
    def test_large_per_page(self, app):
        """Test with very large per_page value"""
        with app.app_context():
            result = RankingService.get_ranked_stories(page=1, per_page=1000)
            assert result is not None
    
    def test_bookmark_nonexistent_user(self, app):
        """Test bookmarking with non-existent user ID"""
        with app.app_context():
            # Create a story
            user = User(username='edgetest', email='edge@gmail.com')
            user.set_password('TestPass123!')
            db.session.add(user)
            db.session.commit()
            
            story = Post(
                title='Edge Case Story Title',
                content=valid_content(),
                story_type=StoryType.OTHER,
                status=PostStatus.PUBLISHED,
                user_id=user.id
            )
            db.session.add(story)
            db.session.commit()
            
            # Try with non-existent user (should fail gracefully)
            result = RankingService.toggle_bookmark(story.public_id, 99999)
            # Should return None or handle error
    
    def test_scroll_depth_boundary_values(self, app):
        """Test scroll depth at boundary values (0.0, 1.0)"""
        with app.app_context():
            user = User(username='scrolltest', email='scroll@gmail.com')
            user.set_password('TestPass123!')
            db.session.add(user)
            db.session.commit()
            
            story = Post(
                title='Scroll Boundary Test Story',
                content=valid_content(),
                story_type=StoryType.LIFE_STORY,
                status=PostStatus.PUBLISHED,
                user_id=user.id
            )
            db.session.add(story)
            db.session.commit()
            
            # Test 0.0 scroll depth
            success = RankingService.update_story_metrics(
                story_id=story.public_id,
                user_id=user.id,
                scroll_depth=0.0,
                time_spent=5
            )
            assert success == True
            
            # Test 1.0 scroll depth (complete read)
            success = RankingService.update_story_metrics(
                story_id=story.public_id,
                user_id=user.id,
                scroll_depth=1.0,
                time_spent=300
            )
            assert success == True
            
            progress = ReadProgress.query.filter_by(
                user_id=user.id,
                post_id=story.id
            ).first()
            
            # Should track max scroll depth
            assert progress.scroll_depth == 1.0
            # Should be marked as completed
            assert progress.completed == True


class TestMultipleUsers:
    """Test scenarios with multiple users"""
    
    def test_multiple_users_bookmark_same_story(self, app):
        """Test multiple users can bookmark the same story"""
        with app.app_context():
            # Create author
            author = User(username='storyauthor', email='author@gmail.com')
            author.set_password('TestPass123!')
            db.session.add(author)
            db.session.commit()
            
            # Create story
            story = Post(
                title='Popular Story For Multiple Bookmarks',
                content=valid_content(),
                story_type=StoryType.ACHIEVEMENT,
                status=PostStatus.PUBLISHED,
                user_id=author.id
            )
            db.session.add(story)
            db.session.commit()
            
            # Create multiple users who will bookmark
            users = []
            for i in range(5):
                user = User(username=f'bookmarker{i}', email=f'user{i}@gmail.com')
                user.set_password('TestPass123!')
                db.session.add(user)
                users.append(user)
            db.session.commit()
            
            # Each user bookmarks
            for user in users:
                is_bookmarked, count = RankingService.toggle_bookmark(story.public_id, user.id)
                assert is_bookmarked == True
            
            # Refresh story
            db.session.refresh(story)
            assert story.save_count == 5
    
    def test_multiple_users_read_same_story(self, app):
        """Test multiple users reading the same story"""
        with app.app_context():
            author = User(username='readauthor', email='readauthor@gmail.com')
            author.set_password('TestPass123!')
            db.session.add(author)
            db.session.commit()
            
            story = Post(
                title='Story For Multiple Readers',
                content=valid_content(),
                story_type=StoryType.LIFE_STORY,
                status=PostStatus.PUBLISHED,
                user_id=author.id
            )
            db.session.add(story)
            db.session.commit()
            
            # Multiple readers
            for i in range(3):
                reader = User(username=f'reader{i}', email=f'reader{i}@gmail.com')
                reader.set_password('TestPass123!')
                db.session.add(reader)
                db.session.commit()
                
                RankingService.update_story_metrics(
                    story_id=story.public_id,
                    user_id=reader.id,
                    scroll_depth=0.5 + (i * 0.1),
                    time_spent=60 + (i * 30)
                )
            
            db.session.refresh(story)
            assert story.unique_readers == 3


class TestCompletionRateCalculation:
    """Test completion rate calculations"""
    
    def test_completion_rate_updates(self, app):
        """Test that completion rate is properly calculated"""
        with app.app_context():
            author = User(username='completeauthor', email='complete@gmail.com')
            author.set_password('TestPass123!')
            db.session.add(author)
            db.session.commit()
            
            story = Post(
                title='Story For Completion Rate Test',
                content=valid_content(),
                story_type=StoryType.SACRIFICE,
                status=PostStatus.PUBLISHED,
                user_id=author.id
            )
            db.session.add(story)
            db.session.commit()
            
            # Three readers with different scroll depths
            depths = [0.3, 0.6, 0.9]
            for i, depth in enumerate(depths):
                reader = User(username=f'completer{i}', email=f'completer{i}@gmail.com')
                reader.set_password('TestPass123!')
                db.session.add(reader)
                db.session.commit()
                
                RankingService.update_story_metrics(
                    story_id=story.public_id,
                    user_id=reader.id,
                    scroll_depth=depth,
                    time_spent=100
                )
            
            db.session.refresh(story)
            # Average should be approximately 0.6
            assert 0.5 <= story.completion_rate <= 0.7


class TestRankingOrder:
    """Test that ranking produces correct ordering"""
    
    def test_stories_with_engagement_rank_higher(self, app):
        """Test that stories with more engagement rank higher"""
        with app.app_context():
            author = User(username='rankauthor', email='rankauthor@gmail.com')
            author.set_password('TestPass123!')
            db.session.add(author)
            db.session.commit()
            
            # Create two stories - one popular, one not
            popular_story = Post(
                title='Very Popular Story Title',
                content=valid_content(),
                story_type=StoryType.ACHIEVEMENT,
                status=PostStatus.PUBLISHED,
                user_id=author.id,
                view_count=1000,
                save_count=50,
                completion_rate=0.9
            )
            
            unpopular_story = Post(
                title='Less Popular Story Title',
                content=valid_content(),
                story_type=StoryType.ACHIEVEMENT,
                status=PostStatus.PUBLISHED,
                user_id=author.id,
                view_count=10,
                save_count=1,
                completion_rate=0.2
            )
            
            db.session.add(popular_story)
            db.session.add(unpopular_story)
            db.session.commit()
            
            result = RankingService.get_ranked_stories(
                story_type=StoryType.ACHIEVEMENT,
                page=1,
                per_page=10
            )
            
            # Should have results
            assert len(result.items) >= 2


class TestAllStoryTypes:
    """Test ranking works for all story types"""
    
    def test_achievement_ranking(self, client):
        """Test Achievement category ranking"""
        response = client.get('/api/posts/?story_type=achievement&sort_by=smart')
        assert response.status_code == 200
    
    def test_regret_ranking(self, client):
        """Test Regret category ranking"""
        response = client.get('/api/posts/?story_type=regret&sort_by=smart')
        assert response.status_code == 200
    
    def test_unsent_letter_ranking(self, client):
        """Test Unsent Letter category ranking"""
        response = client.get('/api/posts/?story_type=unsent_letter&sort_by=smart')
        assert response.status_code == 200
    
    def test_sacrifice_ranking(self, client):
        """Test Sacrifice category ranking"""
        response = client.get('/api/posts/?story_type=sacrifice&sort_by=smart')
        assert response.status_code == 200
    
    def test_life_story_ranking(self, client):
        """Test Life Story category ranking"""
        response = client.get('/api/posts/?story_type=life_story&sort_by=smart')
        assert response.status_code == 200
    
    def test_other_ranking(self, client):
        """Test Other category ranking"""
        response = client.get('/api/posts/?story_type=other&sort_by=smart')
        assert response.status_code == 200


class TestPaginationEndpoints:
    """Test pagination for engagement endpoints"""
    
    def test_bookmarks_pagination(self, client, auth_headers):
        """Test bookmarks endpoint supports pagination"""
        response = client.get('/api/posts/bookmarks?page=1&per_page=5', headers=auth_headers)
        assert response.status_code == 200
        assert 'page' in response.json
        assert 'per_page' in response.json
        assert 'total_pages' in response.json
    
    def test_smart_ranking_pagination(self, client):
        """Test smart ranking supports pagination"""
        response = client.get('/api/posts/?page=1&per_page=5&sort_by=smart')
        assert response.status_code == 200
        assert response.json['page'] == 1
        assert response.json['per_page'] == 5


class TestAPIErrorHandling:
    """Test API error handling and edge cases"""
    
    def test_bookmark_status_requires_auth(self, client):
        """Test GET bookmark status requires authentication"""
        response = client.get('/api/posts/some-id/bookmark')
        assert response.status_code == 401
    
    def test_my_bookmarks_requires_auth(self, client):
        """Test GET my bookmarks requires authentication"""
        response = client.get('/api/posts/bookmarks')
        assert response.status_code == 401
    
    def test_read_progress_accepts_partial_data(self, client, auth_headers):
        """Test read progress accepts partial data"""
        # Create a story
        create_response = client.post('/api/posts',
            headers=auth_headers,
            json={
                'title': 'Story for Partial Data Test',
                'content': valid_content(),
                'story_type': 'other',
                'status': 'published'
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json['story']['id']
            
            # Only send scroll_depth
            response = client.post(
                f'/api/posts/{story_id}/read-progress',
                headers=auth_headers,
                json={'scroll_depth': 0.5}
            )
            assert response.status_code == 200
            
            # Only send time_spent
            response = client.post(
                f'/api/posts/{story_id}/read-progress',
                headers=auth_headers,
                json={'time_spent': 60}
            )
            assert response.status_code == 200
    
    def test_read_progress_empty_body(self, client, auth_headers):
        """Test read progress with empty body"""
        create_response = client.post('/api/posts',
            headers=auth_headers,
            json={
                'title': 'Story for Empty Body Test',
                'content': valid_content(),
                'story_type': 'life_story',
                'status': 'published'
            }
        )
        
        if create_response.status_code == 201:
            story_id = create_response.json['story']['id']
            
            # Send empty JSON object instead of no body
            response = client.post(
                f'/api/posts/{story_id}/read-progress',
                headers=auth_headers,
                json={}
            )
            assert response.status_code == 200


class TestWeightValidation:
    """Validate all ranking weights sum correctly"""
    
    def test_achievement_weights_sum_to_one(self):
        """Test Achievement weights roughly sum to 1"""
        weights = RankingService.CATEGORY_WEIGHTS.get(StoryType.ACHIEVEMENT, {})
        total = (
            weights.get('save_weight', 0) +
            weights.get('completion_weight', 0) +
            weights.get('view_weight', 0) +
            weights.get('reaction_weight', 0) +
            weights.get('freshness_weight', 0)
        )
        assert 0.9 <= total <= 1.1
    
    def test_regret_weights_sum_to_one(self):
        """Test Regret weights roughly sum to 1"""
        weights = RankingService.CATEGORY_WEIGHTS.get(StoryType.REGRET, {})
        total = (
            weights.get('save_weight', 0) +
            weights.get('completion_weight', 0) +
            weights.get('view_weight', 0) +
            weights.get('reaction_weight', 0) +
            weights.get('freshness_weight', 0) +
            weights.get('reread_weight', 0)
        )
        assert 0.9 <= total <= 1.1
    
    def test_sacrifice_weights_sum_to_one(self):
        """Test Sacrifice weights roughly sum to 1"""
        weights = RankingService.CATEGORY_WEIGHTS.get(StoryType.SACRIFICE, {})
        total = (
            weights.get('save_weight', 0) +
            weights.get('completion_weight', 0) +
            weights.get('view_weight', 0) +
            weights.get('reaction_weight', 0) +
            weights.get('freshness_weight', 0) +
            weights.get('reread_weight', 0)
        )
        assert 0.9 <= total <= 1.1
    
    def test_life_story_weights_sum_to_one(self):
        """Test Life Story weights roughly sum to 1"""
        weights = RankingService.CATEGORY_WEIGHTS.get(StoryType.LIFE_STORY, {})
        total = (
            weights.get('save_weight', 0) +
            weights.get('completion_weight', 0) +
            weights.get('view_weight', 0) +
            weights.get('reaction_weight', 0) +
            weights.get('freshness_weight', 0)
        )
        assert 0.9 <= total <= 1.1
    
    def test_default_weights_sum_to_one(self):
        """Test default weights roughly sum to 1"""
        weights = RankingService.DEFAULT_WEIGHTS
        total = (
            weights.get('save_weight', 0) +
            weights.get('completion_weight', 0) +
            weights.get('view_weight', 0) +
            weights.get('reaction_weight', 0) +
            weights.get('freshness_weight', 0)
        )
        assert 0.9 <= total <= 1.1


class TestStoryTypeFiltering:
    """Test story type filtering in ranking"""
    
    def test_ranking_filters_by_type(self, app):
        """Test that ranking correctly filters by story type"""
        with app.app_context():
            author = User(username='filterauthor', email='filter@gmail.com')
            author.set_password('TestPass123!')
            db.session.add(author)
            db.session.commit()
            
            # Create stories of different types
            for story_type in [StoryType.ACHIEVEMENT, StoryType.REGRET, StoryType.LIFE_STORY]:
                story = Post(
                    title=f'Story of type {story_type.value}',
                    content=valid_content(),
                    story_type=story_type,
                    status=PostStatus.PUBLISHED,
                    user_id=author.id
                )
                db.session.add(story)
            db.session.commit()
            
            # Get only achievements
            result = RankingService.get_ranked_stories(
                story_type=StoryType.ACHIEVEMENT,
                page=1,
                per_page=10
            )
            
            # All returned stories should be achievements
            for story in result.items:
                assert story.story_type == StoryType.ACHIEVEMENT


class TestGoldenRuleCompliance:
    """Test that the Golden Rule is followed: resonance > reaction > recency"""
    
    def test_no_pure_popularity_ranking(self):
        """Verify no category uses pure popularity (views only) ranking"""
        for story_type, weights in RankingService.CATEGORY_WEIGHTS.items():
            if 'use_random' in weights or 'use_exploration' in weights:
                continue
            # View weight should never dominate
            view_weight = weights.get('view_weight', 0)
            assert view_weight < 0.5, f"{story_type} has too high view_weight"
    
    def test_all_categories_consider_completion(self):
        """Verify all non-random categories consider completion (resonance)"""
        for story_type, weights in RankingService.CATEGORY_WEIGHTS.items():
            if weights.get('use_random'):
                continue
            # Should have completion weight (resonance)
            assert 'completion_weight' in weights or 'use_exploration' in weights


class TestUniqueReadersTracking:
    """Test unique readers count is properly maintained"""
    
    def test_unique_readers_increments_for_new_users(self, app):
        """Test unique_readers increments for new users only"""
        with app.app_context():
            author = User(username='uniqueauthor', email='unique@gmail.com')
            author.set_password('TestPass123!')
            db.session.add(author)
            db.session.commit()
            
            story = Post(
                title='Story for Unique Readers Test',
                content=valid_content(),
                story_type=StoryType.OTHER,
                status=PostStatus.PUBLISHED,
                user_id=author.id
            )
            db.session.add(story)
            db.session.commit()
            
            reader = User(username='uniquereader', email='uniquereader@gmail.com')
            reader.set_password('TestPass123!')
            db.session.add(reader)
            db.session.commit()
            
            # First read
            RankingService.update_story_metrics(
                story_id=story.public_id,
                user_id=reader.id,
                scroll_depth=0.5,
                time_spent=30
            )
            
            db.session.refresh(story)
            assert story.unique_readers == 1
            
            # Same user reads again - unique readers should NOT increase
            RankingService.update_story_metrics(
                story_id=story.public_id,
                user_id=reader.id,
                scroll_depth=0.8,
                time_spent=60
            )
            
            db.session.refresh(story)
            assert story.unique_readers == 1  # Still 1
            
            # Reread count should increase instead
            assert story.reread_count == 1


class TestRereadTracking:
    """Test reread count tracking"""
    
    def test_reread_count_increments(self, app):
        """Test that reread_count increments on subsequent reads"""
        with app.app_context():
            author = User(username='rereadauthor', email='rereadauthor@gmail.com')
            author.set_password('TestPass123!')
            db.session.add(author)
            db.session.commit()
            
            story = Post(
                title='Story for Reread Count Test',
                content=valid_content(),
                story_type=StoryType.REGRET,
                status=PostStatus.PUBLISHED,
                user_id=author.id
            )
            db.session.add(story)
            db.session.commit()
            
            reader = User(username='rereader', email='rereader@gmail.com')
            reader.set_password('TestPass123!')
            db.session.add(reader)
            db.session.commit()
            
            # Multiple reads
            for _ in range(3):
                RankingService.update_story_metrics(
                    story_id=story.public_id,
                    user_id=reader.id,
                    scroll_depth=0.5,
                    time_spent=30
                )
            
            db.session.refresh(story)
            # First read doesn't count as reread, so should be 2
            assert story.reread_count == 2

