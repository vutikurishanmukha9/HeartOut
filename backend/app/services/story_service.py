"""Story service layer for business logic separation"""
from datetime import datetime, timezone
from sqlalchemy import desc, func, or_
from app.extensions import db
from app.models import Post, PostStatus, StoryType, Support, Comment, User
from app.utils.reading_time import calculate_reading_time
from app.utils.errors import NotFoundError, ForbiddenError, ValidationError


class StoryService:
    """Service class for story-related business logic"""
    
    @staticmethod
    def create_story(user, data):
        """Create a new story with the given data"""
        reading_time = calculate_reading_time(data['content'])
        
        story = Post(
            title=data['title'],
            content=data['content'],
            story_type=StoryType(data.get('story_type', 'other')),
            is_anonymous=data.get('is_anonymous', True),
            tags=data.get('tags', []),
            status=PostStatus(data.get('status', 'draft')),
            reading_time=reading_time,
            user_id=user.id
        )
        
        if story.status == PostStatus.PUBLISHED:
            story.published_at = datetime.now(timezone.utc)
        
        db.session.add(story)
        db.session.commit()
        
        return story
    
    @staticmethod
    def get_story_by_id(story_id, user=None):
        """Get a story by its public ID"""
        story = Post.query.filter_by(public_id=story_id).first()
        
        if not story:
            raise NotFoundError('Story')
        
        # Only allow author to view unpublished stories
        if story.status != PostStatus.PUBLISHED:
            if not user or story.user_id != user.id:
                raise NotFoundError('Story')
        
        return story
    
    @staticmethod
    def get_stories(filters=None, page=1, per_page=20, sort_by='latest'):
        """Get paginated list of published stories with optional filtering"""
        query = Post.query.filter_by(status=PostStatus.PUBLISHED)
        
        if filters:
            if filters.get('story_type'):
                try:
                    query = query.filter_by(story_type=StoryType(filters['story_type']))
                except ValueError:
                    raise ValidationError('Invalid story type')
            
            if filters.get('user_id'):
                user = User.query.filter_by(public_id=filters['user_id']).first()
                if user:
                    query = query.filter_by(user_id=user.id)
            
            if filters.get('is_featured'):
                query = query.filter_by(is_featured=True)
        
        # Sorting
        if sort_by == 'trending':
            query = query.outerjoin(Support).group_by(Post.id).order_by(
                desc(func.count(Support.id))
            )
        elif sort_by == 'most_viewed':
            query = query.order_by(desc(Post.view_count))
        else:  # latest
            query = query.order_by(desc(Post.published_at))
        
        return query.paginate(page=page, per_page=per_page, error_out=False)
    
    @staticmethod
    def get_user_drafts(user, page=1, per_page=20):
        """Get paginated list of user's draft stories"""
        return Post.query.filter_by(
            user_id=user.id,
            status=PostStatus.DRAFT
        ).order_by(desc(Post.updated_at)).paginate(
            page=page, per_page=per_page, error_out=False
        )
    
    @staticmethod
    def search_stories(query_text, page=1, per_page=20):
        """Search stories by title, content, or tags"""
        if not query_text or len(query_text) < 2:
            raise ValidationError('Search query must be at least 2 characters')
        
        search_pattern = f"%{query_text}%"
        
        query = Post.query.filter(
            Post.status == PostStatus.PUBLISHED,
            or_(
                Post.title.ilike(search_pattern),
                Post.content.ilike(search_pattern)
            )
        ).order_by(desc(Post.published_at))
        
        return query.paginate(page=page, per_page=per_page, error_out=False)
    
    @staticmethod
    def update_story(story, user, data):
        """Update a story"""
        if story.user_id != user.id:
            raise ForbiddenError()
        
        # Update fields
        if 'title' in data:
            story.title = data['title']
        if 'content' in data:
            story.content = data['content']
            story.reading_time = calculate_reading_time(data['content'])
        if 'story_type' in data:
            story.story_type = StoryType(data['story_type'])
        if 'is_anonymous' in data:
            story.is_anonymous = data['is_anonymous']
        if 'tags' in data:
            story.tags = data['tags']
        
        # Handle status change
        if 'status' in data:
            new_status = PostStatus(data['status'])
            if new_status == PostStatus.PUBLISHED and story.status != PostStatus.PUBLISHED:
                story.published_at = datetime.now(timezone.utc)
            story.status = new_status
        
        story.updated_at = datetime.now(timezone.utc)
        db.session.commit()
        
        return story
    
    @staticmethod
    def delete_story(story, user):
        """Delete a story"""
        if story.user_id != user.id:
            raise ForbiddenError()
        
        db.session.delete(story)
        db.session.commit()
    
    @staticmethod
    def increment_view_count(story):
        """Increment the view count of a story"""
        story.view_count += 1
        db.session.commit()
    
    @staticmethod
    def toggle_reaction(story, user, support_type='heart', message=None):
        """Toggle a reaction on a story - add if not exists, remove if exists"""
        existing = Support.query.filter_by(
            giver_id=user.id,
            post_id=story.id,
            support_type=support_type
        ).first()
        
        if existing:
            db.session.delete(existing)
            db.session.commit()
            return {'action': 'removed', 'support_count': story.supports.count()}
        else:
            reaction = Support(
                support_type=support_type,
                message=message,
                giver_id=user.id,
                receiver_id=story.user_id,
                post_id=story.id
            )
            db.session.add(reaction)
            db.session.commit()
            return {'action': 'added', 'reaction': reaction, 'support_count': story.supports.count()}
    
    @staticmethod
    def get_user_stats(user):
        """Get statistics for a user"""
        published_count = user.posts.filter_by(status=PostStatus.PUBLISHED).count()
        draft_count = user.posts.filter_by(status=PostStatus.DRAFT).count()
        
        total_views = db.session.query(func.sum(Post.view_count)).filter(
            Post.user_id == user.id,
            Post.status == PostStatus.PUBLISHED
        ).scalar() or 0
        
        total_reactions = user.support_received.count()
        
        total_comments = Comment.query.join(Post).filter(
            Post.user_id == user.id
        ).count()
        
        return {
            'total_stories': published_count,
            'total_drafts': draft_count,
            'total_views': total_views,
            'total_reactions': total_reactions,
            'total_comments': total_comments
        }
