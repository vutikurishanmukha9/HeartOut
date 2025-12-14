"""
Test configuration and fixtures for HeartOut backend tests.
"""
import pytest
import os
from app import create_app
from app.extensions import db
from app.models import User, Post, Comment, Support, PostStatus, StoryType, UserRole


class TestConfig:
    """Test configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'test-secret-key'
    JWT_SECRET_KEY = 'test-jwt-secret-key'
    WTF_CSRF_ENABLED = False
    RATELIMIT_ENABLED = False
    CORS_ORIGINS = ['http://localhost:5173']
    RATELIMIT_STORAGE_URL = 'memory://'


@pytest.fixture(scope='function')
def app():
    """Create application for testing"""
    app = create_app(TestConfig)
    
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    """Create a test client"""
    return app.test_client()


@pytest.fixture
def auth_headers(client):
    """Create a user and return auth headers"""
    # Use a strong password that meets all validation requirements
    strong_password = 'SecureP@ss123!'
    
    # Register a test user
    client.post('/api/auth/register', json={
        'username': 'testuser',
        'email': 'test@example.com',
        'password': strong_password
    })
    
    # Login to get token
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': strong_password
    })
    
    token = response.json.get('access_token')
    return {'Authorization': f'Bearer {token}'}


@pytest.fixture
def sample_user(app):
    """Create a sample user"""
    with app.app_context():
        user = User(
            username='sampleuser',
            email='sample@example.com',
            display_name='Sample User'
        )
        user.set_password('SamplePassword123!')
        db.session.add(user)
        db.session.commit()
        return user.public_id


@pytest.fixture
def sample_story(app, sample_user):
    """Create a sample published story"""
    with app.app_context():
        user = User.query.filter_by(public_id=sample_user).first()
        story = Post(
            title='Test Story',
            content='This is a test story content that is long enough.',
            story_type=StoryType.LIFE_STORY,
            status=PostStatus.PUBLISHED,
            user_id=user.id,
            is_anonymous=False
        )
        db.session.add(story)
        db.session.commit()
        return story.public_id
