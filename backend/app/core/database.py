"""
Async Database Configuration with SQLAlchemy 2.0
Supports both SQLite (development) and PostgreSQL (production)
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import StaticPool
from typing import AsyncGenerator

from app.core.config import settings


# Create async engine with appropriate settings for database type
if settings.IS_SQLITE:
    # SQLite: use StaticPool for in-memory/file databases
    engine = create_async_engine(
        settings.ASYNC_DATABASE_URL,
        echo=settings.DEBUG,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
else:
    # PostgreSQL: use connection pooling with SSL for Neon
    # Use 'require' SSL mode - enforces encryption but allows self-signed certs
    # This is the recommended approach for Neon and similar serverless Postgres
    engine = create_async_engine(
        settings.ASYNC_DATABASE_URL,
        echo=settings.DEBUG,
        pool_size=5,
        max_overflow=10,
        pool_recycle=300,
        pool_pre_ping=True,
        connect_args={"ssl": "require"},  # Require SSL but skip cert verification (Neon compatible)
    )


# Async session factory
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


# Base class for models
class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency injection for database sessions"""
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


from sqlalchemy import text


async def auto_migrate_schema(conn=None):
    """
    Ensure schema is fully synchronized with models, adding any missing columns
    to existing tables without data loss. Works for both PostgreSQL and SQLite.
    """
    if settings.IS_SQLITE:
        # SQLite migration check
        try:
            async def _run_sqlite(c):
                result = await c.execute(text("PRAGMA table_info(posts)"))
                post_cols = result.fetchall()
                existing_post_cols = {row[1] for row in post_cols}
                
                # Check if user_id is marked NOT NULL (row[3] == 1)
                user_id_col = next((row for row in post_cols if row[1] == 'user_id'), None)
                if user_id_col and user_id_col[3] == 1:
                    # Migrate SQLite posts table to make user_id nullable without data loss
                    await c.execute(text("PRAGMA foreign_keys=OFF"))
                    await c.execute(text("ALTER TABLE posts RENAME TO _posts_old"))
                    await c.execute(text("""
                        CREATE TABLE posts (
                            id INTEGER NOT NULL PRIMARY KEY, 
                            public_id VARCHAR(36) NOT NULL UNIQUE, 
                            title VARCHAR(200) NOT NULL, 
                            content TEXT NOT NULL, 
                            status VARCHAR(20) NOT NULL, 
                            story_type VARCHAR(20) NOT NULL, 
                            is_anonymous BOOLEAN NOT NULL, 
                            tags JSON, 
                            reading_time INTEGER NOT NULL DEFAULT 0, 
                            view_count INTEGER NOT NULL DEFAULT 0, 
                            is_featured BOOLEAN NOT NULL DEFAULT 0, 
                            featured_at DATETIME, 
                            created_at DATETIME NOT NULL, 
                            updated_at DATETIME NOT NULL, 
                            published_at DATETIME, 
                            flagged_count INTEGER NOT NULL DEFAULT 0, 
                            save_count INTEGER NOT NULL DEFAULT 0, 
                            completion_rate FLOAT NOT NULL DEFAULT 0.0, 
                            avg_read_time INTEGER NOT NULL DEFAULT 0, 
                            reread_count INTEGER NOT NULL DEFAULT 0, 
                            unique_readers INTEGER NOT NULL DEFAULT 0, 
                            rank_score FLOAT NOT NULL DEFAULT 0.0, 
                            last_ranked_at DATETIME, 
                            support_count INTEGER NOT NULL DEFAULT 0, 
                            comment_count INTEGER NOT NULL DEFAULT 0, 
                            user_id INTEGER, 
                            author_token VARCHAR(64),
                            FOREIGN KEY(user_id) REFERENCES users (id)
                        )
                    """))
                    old_info = await c.execute(text("PRAGMA table_info(_posts_old)"))
                    old_cols = [r[1] for r in old_info.fetchall()]
                    col_list_str = ", ".join(f'"{col}"' for col in old_cols)
                    await c.execute(text(f"INSERT INTO posts ({col_list_str}) SELECT {col_list_str} FROM _posts_old"))
                    await c.execute(text("DROP TABLE _posts_old"))
                    
                    # Recreate indexes
                    await c.execute(text("CREATE INDEX IF NOT EXISTS idx_post_public_id ON posts(public_id)"))
                    await c.execute(text("CREATE INDEX IF NOT EXISTS idx_post_author_token ON posts(author_token)"))
                    await c.execute(text("CREATE INDEX IF NOT EXISTS idx_post_status ON posts(status)"))
                    await c.execute(text("CREATE INDEX IF NOT EXISTS idx_post_story_type ON posts(story_type)"))
                    await c.execute(text("CREATE INDEX IF NOT EXISTS idx_post_user_id ON posts(user_id)"))
                    await c.execute(text("CREATE INDEX IF NOT EXISTS idx_post_published_at ON posts(published_at)"))
                    await c.execute(text("CREATE INDEX IF NOT EXISTS idx_post_is_featured ON posts(is_featured)"))
                    await c.execute(text("CREATE INDEX IF NOT EXISTS idx_post_view_count ON posts(view_count)"))
                    await c.execute(text("CREATE INDEX IF NOT EXISTS idx_post_status_story_type ON posts(status, story_type)"))
                    await c.execute(text("PRAGMA foreign_keys=ON"))
                elif existing_post_cols and "author_token" not in existing_post_cols:
                    await c.execute(text("ALTER TABLE posts ADD COLUMN author_token VARCHAR(64)"))
                    await c.execute(text("CREATE INDEX IF NOT EXISTS idx_post_author_token ON posts(author_token)"))
                    
                result_users = await c.execute(text("PRAGMA table_info(users)"))
                existing_user_cols = {row[1] for row in result_users.fetchall()}
                if existing_user_cols:
                    if "author_bio" not in existing_user_cols:
                        await c.execute(text("ALTER TABLE users ADD COLUMN author_bio TEXT"))
                    if "website_url" not in existing_user_cols:
                        await c.execute(text("ALTER TABLE users ADD COLUMN website_url VARCHAR(200)"))
                    if "social_links" not in existing_user_cols:
                        await c.execute(text("ALTER TABLE users ADD COLUMN social_links JSON"))
                    if "is_featured_author" not in existing_user_cols:
                        await c.execute(text("ALTER TABLE users ADD COLUMN is_featured_author BOOLEAN DEFAULT 0"))
                    if "display_name" not in existing_user_cols:
                        await c.execute(text("ALTER TABLE users ADD COLUMN display_name VARCHAR(100)"))
                    if "bio" not in existing_user_cols:
                        await c.execute(text("ALTER TABLE users ADD COLUMN bio TEXT"))
                    if "age_range" not in existing_user_cols:
                        await c.execute(text("ALTER TABLE users ADD COLUMN age_range VARCHAR(20)"))
                    if "preferred_anonymity" not in existing_user_cols:
                        await c.execute(text("ALTER TABLE users ADD COLUMN preferred_anonymity BOOLEAN DEFAULT 1"))

            if conn is not None:
                await _run_sqlite(conn)
            else:
                async with engine.begin() as local_conn:
                    await _run_sqlite(local_conn)
        except Exception as e:
            print(f"SQLite migration note: {e}")
    else:
        # PostgreSQL migration (Render, Neon, Supabase, etc.)
        # Each DDL statement runs in its own dedicated transaction so one failure cannot abort the rest
        pg_migrations = [
            "ALTER TABLE posts ADD COLUMN IF NOT EXISTS author_token VARCHAR(64);",
            "CREATE INDEX IF NOT EXISTS idx_post_author_token ON posts(author_token);",
            "ALTER TABLE posts ALTER COLUMN user_id DROP NOT NULL;",
            "ALTER TABLE comments ALTER COLUMN user_id DROP NOT NULL;",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS author_bio TEXT;",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS website_url VARCHAR(200);",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS social_links JSONB;",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_featured_author BOOLEAN DEFAULT FALSE;",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name VARCHAR(100);",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS age_range VARCHAR(20);",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_anonymity BOOLEAN DEFAULT TRUE;",
        ]
        for sql in pg_migrations:
            try:
                async with engine.begin() as pg_conn:
                    await pg_conn.execute(text(sql))
                print(f"[Schema Migration] Executed: {sql}")
            except Exception as e:
                print(f"[Schema Migration Note] ({sql}): {e}")


async def create_tables():
    """Create all tables in the database and synchronize schema"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await auto_migrate_schema()

