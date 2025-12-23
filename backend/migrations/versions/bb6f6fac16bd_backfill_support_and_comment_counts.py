"""Backfill support and comment counts

Revision ID: bb6f6fac16bd
Revises: 3b3c640bb720
Create Date: 2025-12-23 12:35:09.710551

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bb6f6fac16bd'
down_revision = '3b3c640bb720'
branch_labels = None
depends_on = None


def upgrade():
    """Backfill NULL values in support_count and comment_count to 0"""
    op.execute("UPDATE posts SET support_count = 0 WHERE support_count IS NULL")
    op.execute("UPDATE posts SET comment_count = 0 WHERE comment_count IS NULL")


def downgrade():
    # No downgrade needed - we're just fixing NULL values
    pass
