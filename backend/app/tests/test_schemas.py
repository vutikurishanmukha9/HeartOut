"""
Pydantic Schema Tests
Tests for all Pydantic schemas - validation, serialization, edge cases
"""
import pytest
from pydantic import ValidationError
from app.schemas.auth import (
    UserRegistration, UserLogin, ProfileUpdate, PasswordChange, RefreshToken
)
from app.schemas.posts import PostCreate, PostUpdate, CommentCreate


class TestUserRegistrationSchema:
    """Tests for UserRegistration schema"""
    
    def test_valid_registration(self):
        """Test valid registration data"""
        data = UserRegistration(
            username="testuser",
            email="test@gmail.com",
            password="SecurePass123!"
        )
        assert data.username == "testuser"
        assert data.email == "test@gmail.com"
        
    def test_email_required(self):
        """Test email is required"""
        with pytest.raises(ValidationError):
            UserRegistration(username="test", password="SecurePass123!")
            
    def test_password_required(self):
        """Test password is required"""
        with pytest.raises(ValidationError):
            UserRegistration(username="test", email="test@gmail.com")
            
    def test_username_required(self):
        """Test username is required"""
        with pytest.raises(ValidationError):
            UserRegistration(email="test@gmail.com", password="SecurePass123!")
            
    def test_display_name_optional(self):
        """Test display_name is optional"""
        data = UserRegistration(
            username="test",
            email="test@gmail.com",
            password="SecurePass123!",
            display_name="Test User"
        )
        assert data.display_name == "Test User"
        
    def test_username_alphanumeric_only(self):
        """Test username validation (alphanumeric only)"""
        with pytest.raises(ValidationError):
            UserRegistration(
                username="test user",  # space not allowed
                email="test@gmail.com",
                password="SecurePass123!"
            )


class TestUserLoginSchema:
    """Tests for UserLogin schema"""
    
    def test_valid_login(self):
        """Test valid login data"""
        data = UserLogin(email="test@gmail.com", password="password123")
        assert data.email == "test@gmail.com"
        
    def test_email_required(self):
        """Test email is required for login"""
        with pytest.raises(ValidationError):
            UserLogin(password="password123")
            
    def test_password_required(self):
        """Test password is required for login"""
        with pytest.raises(ValidationError):
            UserLogin(email="test@gmail.com")


class TestProfileUpdateSchema:
    """Tests for ProfileUpdate schema"""
    
    def test_all_optional(self):
        """Test all fields are optional"""
        data = ProfileUpdate()
        assert data is not None
        
    def test_display_name_update(self):
        """Test display_name can be updated"""
        data = ProfileUpdate(display_name="New Name")
        assert data.display_name == "New Name"
        
    def test_bio_update(self):
        """Test bio can be updated"""
        data = ProfileUpdate(bio="My new bio text")
        assert data.bio == "My new bio text"


class TestPasswordChangeSchema:
    """Tests for PasswordChange schema"""
    
    def test_valid_password_change(self):
        """Test valid password change"""
        data = PasswordChange(
            current_password="OldPass123!",
            new_password="NewPass456!"
        )
        assert data.current_password == "OldPass123!"
        assert data.new_password == "NewPass456!"
        
    def test_both_passwords_required(self):
        """Test both passwords are required"""
        with pytest.raises(ValidationError):
            PasswordChange(current_password="OldPass123!")


class TestRefreshTokenSchema:
    """Tests for RefreshToken schema"""
    
    def test_valid_refresh(self):
        """Test valid refresh token"""
        data = RefreshToken(refresh_token="some.jwt.token")
        assert data.refresh_token == "some.jwt.token"
        
    def test_token_required(self):
        """Test refresh_token is required"""
        with pytest.raises(ValidationError):
            RefreshToken()


class TestPostCreateSchema:
    """Tests for PostCreate schema"""
    
    def test_valid_post(self):
        """Test valid post creation"""
        data = PostCreate(
            title="My Story Title",
            content="This is my story content that needs to be at least fifty characters long to pass validation.",
            story_type="life_story"
        )
        assert data.title == "My Story Title"
        
    def test_title_required(self):
        """Test title is required"""
        with pytest.raises(ValidationError):
            PostCreate(content="Some content that is long enough to pass validation check")
            
    def test_content_required(self):
        """Test content is required"""
        with pytest.raises(ValidationError):
            PostCreate(title="Title Only")
            
    def test_default_anonymous(self):
        """Test is_anonymous defaults to True"""
        data = PostCreate(
            title="Test Title",
            content="This is test content that needs to be at least fifty characters for validation."
        )
        assert data.is_anonymous == True
        
    def test_default_status(self):
        """Test default status is draft"""
        data = PostCreate(
            title="Test Title",
            content="This is test content that needs to be at least fifty characters for validation."
        )
        assert data.status == "draft"
        
    def test_story_type_validation(self):
        """Test invalid story type rejected"""
        with pytest.raises(ValidationError):
            PostCreate(
                title="Test Title",
                content="This is test content that needs to be at least fifty characters for validation.",
                story_type="invalid_type"
            )


class TestPostUpdateSchema:
    """Tests for PostUpdate schema"""
    
    def test_all_optional(self):
        """Test all fields are optional for update"""
        data = PostUpdate()
        assert data is not None
        
    def test_title_update(self):
        """Test title can be updated"""
        data = PostUpdate(title="Updated Title Here")
        assert data.title == "Updated Title Here"
        
    def test_status_update(self):
        """Test status can be updated"""
        data = PostUpdate(status="published")
        assert data.status == "published"


class TestCommentCreateSchema:
    """Tests for CommentCreate schema"""
    
    def test_valid_comment(self):
        """Test valid comment creation"""
        data = CommentCreate(content="This is my comment")
        assert data.content == "This is my comment"
        
    def test_content_required(self):
        """Test content is required"""
        with pytest.raises(ValidationError):
            CommentCreate()
            
    def test_anonymous_default(self):
        """Test is_anonymous defaults to True"""
        data = CommentCreate(content="Comment text")
        assert data.is_anonymous == True
