"""
FastAPI Test Configuration and Fixtures
Async test setup for HeartOut FastAPI backend
"""
import pytest
import pytest_asyncio
from typing import AsyncGenerator, Dict
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import Base, get_db
from app.models.models import User, Post, PostStatus, StoryType


# Test database URL (in-memory SQLite)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

# Create test engine
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

# Test session factory
TestSessionLocal = async_sessionmaker(
    test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


# Valid password for tests
VALID_PASSWORD = "SecureP@ss123!"


async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
    """Override database dependency for testing"""
    async with TestSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


@pytest_asyncio.fixture(scope="function")
async def setup_database():
    """Create database tables for each test"""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def db_session(setup_database) -> AsyncGenerator[AsyncSession, None]:
    """Get a test database session"""
    async with TestSessionLocal() as session:
        yield session


@pytest_asyncio.fixture
async def client(setup_database) -> AsyncGenerator[AsyncClient, None]:
    """Create an async test client"""
    app.dependency_overrides[get_db] = override_get_db
    
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac
    
    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def auth_headers(client: AsyncClient) -> Dict[str, str]:
    """Create a user and return auth headers"""
    # Register a test user
    await client.post("/api/auth/register", json={
        "username": "testuser",
        "email": "test@gmail.com",
        "password": VALID_PASSWORD
    })
    
    # Login to get token
    response = await client.post("/api/auth/login", json={
        "email": "test@gmail.com",
        "password": VALID_PASSWORD
    })
    
    data = response.json()
    token = data.get("access_token")
    return {"Authorization": f"Bearer {token}"}


@pytest_asyncio.fixture
async def sample_user(db_session: AsyncSession) -> str:
    """Create a sample user and return public_id"""
    from app.core.security import get_password_hash
    
    user = User(
        username="sampleuser",
        email="sample@gmail.com",
        display_name="Sample User",
        password_hash=get_password_hash(VALID_PASSWORD)
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user.public_id


@pytest_asyncio.fixture
async def sample_story(db_session: AsyncSession, sample_user: str) -> str:
    """Create a sample published story"""
    from sqlalchemy import select
    
    # Get user
    result = await db_session.execute(
        select(User).where(User.public_id == sample_user)
    )
    user = result.scalar_one()
    
    story = Post(
        title="Test Story Title",
        content="This is a test story content that is long enough to pass validation requirements.",
        story_type=StoryType.LIFE_STORY.value,
        status=PostStatus.PUBLISHED.value,
        user_id=user.id,
        is_anonymous=False
    )
    db_session.add(story)
    await db_session.commit()
    await db_session.refresh(story)
    return story.public_id


@pytest_asyncio.fixture
async def second_user_headers(client: AsyncClient) -> Dict[str, str]:
    """Create a second user for testing multi-user scenarios"""
    await client.post("/api/auth/register", json={
        "username": "seconduser",
        "email": "second@gmail.com",
        "password": VALID_PASSWORD
    })
    
    response = await client.post("/api/auth/login", json={
        "email": "second@gmail.com",
        "password": VALID_PASSWORD
    })
    
    data = response.json()
    token = data.get("access_token")
    return {"Authorization": f"Bearer {token}"}
