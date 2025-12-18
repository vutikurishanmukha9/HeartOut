"""Add engagement tracking tables and fields

Revision ID: add_engagement_tracking
Revises: 
Create Date: 2024-12-18
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_engagement_tracking'
down_revision = None  # Update this to your latest migration
branch_labels = None
depends_on = None


def upgrade():
    # Add engagement tracking columns to posts table
    op.add_column('posts', sa.Column('save_count', sa.Integer(), nullable=True, server_default='0'))
    op.add_column('posts', sa.Column('completion_rate', sa.Float(), nullable=True, server_default='0.0'))
    op.add_column('posts', sa.Column('avg_read_time', sa.Integer(), nullable=True, server_default='0'))
    op.add_column('posts', sa.Column('reread_count', sa.Integer(), nullable=True, server_default='0'))
    op.add_column('posts', sa.Column('unique_readers', sa.Integer(), nullable=True, server_default='0'))
    op.add_column('posts', sa.Column('rank_score', sa.Float(), nullable=True, server_default='0.0'))
    op.add_column('posts', sa.Column('last_ranked_at', sa.DateTime(), nullable=True))

    # Create bookmarks table
    op.create_table('bookmarks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('post_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['post_id'], ['posts.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'post_id', name='unique_user_bookmark')
    )
    op.create_index('idx_bookmark_user', 'bookmarks', ['user_id'], unique=False)
    op.create_index('idx_bookmark_post', 'bookmarks', ['post_id'], unique=False)

    # Create read_progress table
    op.create_table('read_progress',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('scroll_depth', sa.Float(), nullable=True, server_default='0.0'),
        sa.Column('time_spent', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('completed', sa.Boolean(), nullable=True, server_default='false'),
        sa.Column('read_count', sa.Integer(), nullable=True, server_default='1'),
        sa.Column('first_read', sa.DateTime(), nullable=True),
        sa.Column('last_read', sa.DateTime(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('post_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['post_id'], ['posts.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'post_id', name='unique_user_read_progress')
    )
    op.create_index('idx_read_progress_user', 'read_progress', ['user_id'], unique=False)
    op.create_index('idx_read_progress_post', 'read_progress', ['post_id'], unique=False)


def downgrade():
    # Drop read_progress table
    op.drop_index('idx_read_progress_post', table_name='read_progress')
    op.drop_index('idx_read_progress_user', table_name='read_progress')
    op.drop_table('read_progress')
    
    # Drop bookmarks table
    op.drop_index('idx_bookmark_post', table_name='bookmarks')
    op.drop_index('idx_bookmark_user', table_name='bookmarks')
    op.drop_table('bookmarks')
    
    # Remove columns from posts
    op.drop_column('posts', 'last_ranked_at')
    op.drop_column('posts', 'rank_score')
    op.drop_column('posts', 'unique_readers')
    op.drop_column('posts', 'reread_count')
    op.drop_column('posts', 'avg_read_time')
    op.drop_column('posts', 'completion_rate')
    op.drop_column('posts', 'save_count')
