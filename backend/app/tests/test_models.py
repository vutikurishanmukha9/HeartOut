"""
Comprehensive Model Tests
Tests for all SQLAlchemy models - enums, relationships, and basic structures
"""
import pytest
from datetime import datetime, timezone
from app.models.models import (
    User, Post, Comment, Support, Bookmark, ReadProgress, TokenBlocklist,
    UserRole, PostStatus, StoryType
)


class TestUserRole:
    """Tests for UserRole enum"""
    
    def test_user_role(self):
        assert UserRole.USER.value == "user"
        
    def test_admin_role(self):
        assert UserRole.ADMIN.value == "admin"
        
    def test_moderator_role(self):
        assert UserRole.MODERATOR.value == "moderator"
        
    def test_author_role(self):
        assert UserRole.AUTHOR.value == "author"


class TestPostStatus:
    """Tests for PostStatus enum"""
    
    def test_draft_status(self):
        assert PostStatus.DRAFT.value == "draft"
        
    def test_published_status(self):
        assert PostStatus.PUBLISHED.value == "published"
        
    def test_flagged_status(self):
        assert PostStatus.FLAGGED.value == "flagged"
        
    def test_removed_status(self):
        assert PostStatus.REMOVED.value == "removed"


class TestStoryType:
    """Tests for StoryType enum"""
    
    def test_achievement_type(self):
        assert StoryType.ACHIEVEMENT.value == "achievement"
        
    def test_regret_type(self):
        assert StoryType.REGRET.value == "regret"
        
    def test_unsent_letter_type(self):
        assert StoryType.UNSENT_LETTER.value == "unsent_letter"
        
    def test_sacrifice_type(self):
        assert StoryType.SACRIFICE.value == "sacrifice"
        
    def test_life_story_type(self):
        assert StoryType.LIFE_STORY.value == "life_story"
        
    def test_other_type(self):
        assert StoryType.OTHER.value == "other"


class TestUserModel:
    """Tests for User model structure"""
    
    def test_user_has_required_fields(self):
        """Test user model has required fields"""
        user = User(username="test", email="test@test.com", password_hash="hash")
        assert hasattr(user, 'username')
        assert hasattr(user, 'email')
        assert hasattr(user, 'password_hash')
        
    def test_user_set_password(self):
        """Test password hashing"""
        user = User(username="test", email="test@test.com", password_hash="temp")
        user.set_password("SecurePass123!")
        assert user.password_hash != "SecurePass123!"
        assert user.password_hash.startswith("$2")
        
    def test_user_check_password_correct(self):
        """Test correct password verification"""
        user = User(username="test", email="test@test.com", password_hash="temp")
        user.set_password("SecurePass123!")
        assert user.check_password("SecurePass123!") == True
        
    def test_user_check_password_incorrect(self):
        """Test incorrect password verification"""
        user = User(username="test", email="test@test.com", password_hash="temp")
        user.set_password("SecurePass123!")
        assert user.check_password("WrongPassword") == False
        
    def test_user_to_dict_excludes_sensitive(self):
        """Test to_dict excludes email by default"""
        user = User(username="test", email="secret@test.com", password_hash="h")
        data = user.to_dict()
        assert "email" not in data
        assert "username" in data
        
    def test_user_to_dict_with_sensitive(self):
        """Test to_dict includes email when requested"""
        user = User(username="test", email="secret@test.com", password_hash="h")
        data = user.to_dict(include_sensitive=True)
        assert "email" in data


class TestPostModel:
    """Tests for Post model structure"""
    
    def test_post_has_required_fields(self):
        """Test post has required fields"""
        post = Post(title="Test", content="Content", user_id=1)
        assert hasattr(post, 'title')
        assert hasattr(post, 'content')
        assert hasattr(post, 'user_id')
        
    def test_post_has_engagement_fields(self):
        """Test post has engagement tracking fields"""
        post = Post(title="Test", content="Content", user_id=1)
        assert hasattr(post, 'view_count')
        assert hasattr(post, 'support_count')
        assert hasattr(post, 'comment_count')
        
    def test_post_has_ranking_fields(self):
        """Test post has ranking fields"""
        post = Post(title="Test", content="Content", user_id=1)
        assert hasattr(post, 'rank_score')
        assert hasattr(post, 'is_featured')


class TestCommentModel:
    """Tests for Comment model structure"""
    
    def test_comment_has_required_fields(self):
        """Test comment has required fields"""
        comment = Comment(content="Test", user_id=1, post_id=1)
        assert hasattr(comment, 'content')
        assert hasattr(comment, 'user_id')
        assert hasattr(comment, 'post_id')
        
    def test_comment_has_parent_field(self):
        """Test comment has parent for nested replies"""
        comment = Comment(content="Test", user_id=1, post_id=1)
        assert hasattr(comment, 'parent_id')


class TestSupportModel:
    """Tests for Support/Reaction model structure"""
    
    def test_support_has_required_fields(self):
        """Test support has required fields"""
        support = Support(giver_id=1, receiver_id=2, post_id=1)
        assert hasattr(support, 'giver_id')
        assert hasattr(support, 'receiver_id')
        assert hasattr(support, 'support_type')


class TestBookmarkModel:
    """Tests for Bookmark model structure"""
    
    def test_bookmark_has_required_fields(self):
        """Test bookmark has required fields"""
        bookmark = Bookmark(user_id=1, post_id=1)
        assert hasattr(bookmark, 'user_id')
        assert hasattr(bookmark, 'post_id')


class TestReadProgressModel:
    """Tests for ReadProgress model structure"""
    
    def test_read_progress_has_tracking_fields(self):
        """Test read progress has tracking fields"""
        progress = ReadProgress(user_id=1, post_id=1)
        assert hasattr(progress, 'scroll_depth')
        assert hasattr(progress, 'time_spent')
        assert hasattr(progress, 'completed')


class TestTokenBlocklistModel:
    """Tests for TokenBlocklist model"""
    
    def test_blocklist_has_required_fields(self):
        """Test blocklist has required fields"""
        entry = TokenBlocklist(
            jti="test-jti-12345",
            token_type="access",
            user_id=1,
            expires_at=datetime.now(timezone.utc)
        )
        assert entry.jti == "test-jti-12345"
        assert entry.token_type == "access"
