from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.blueprints.posts import bp
from app.extensions import db, limiter
from app.models import User, Post, Comment, Support, PostStatus, StoryType
from app.schemas import PostCreationSchema, CommentCreationSchema, SupportSchema
from app.utils.reading_time import calculate_reading_time, get_excerpt
from marshmallow import ValidationError
from datetime import datetime, timezone
from sqlalchemy import desc, func

@bp.route('', methods=['POST'])
@jwt_required()
@limiter.limit("10 per hour")
def create_story():
    """Create a new story"""
    current_user_id = get_jwt_identity()
    user = User.query.filter_by(public_id=current_user_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    try:
        schema = PostCreationSchema()
        data = schema.load(request.json)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    
    # Calculate reading time
    reading_time = calculate_reading_time(data['content'])
    
    # Create new story
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
    
    # Set published_at if publishing immediately
    if story.status == PostStatus.PUBLISHED:
        story.published_at = datetime.now(timezone.utc)
    
    try:
        db.session.add(story)
        db.session.commit()
        
        return jsonify({
            'message': 'Story created successfully',
            'story': story.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Story creation error: {str(e)}")
        return jsonify({'error': 'Story creation failed'}), 500


@bp.route('/', methods=['GET'])
def get_stories():
    """Get list of published stories with optional filtering"""
    # Query parameters
    story_type = request.args.get('story_type')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    sort_by = request.args.get('sort_by', 'latest')  # latest, trending, most_viewed
    
    # Base query - only published stories
    query = Post.query.filter_by(status=PostStatus.PUBLISHED)
    
    # Filter by story type
    if story_type:
        try:
            query = query.filter_by(story_type=StoryType(story_type))
        except ValueError:
            return jsonify({'error': 'Invalid story type'}), 400
    
    # Sorting
    if sort_by == 'trending':
        # Trending: most reactions in last 7 days
        query = query.outerjoin(Support).group_by(Post.id).order_by(
            desc(func.count(Support.id))
        )
    elif sort_by == 'most_viewed':
        query = query.order_by(desc(Post.view_count))
    else:  # latest
        query = query.order_by(desc(Post.published_at))
    
    # Paginate
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    stories = [story.to_dict() for story in pagination.items]
    
    return jsonify({
        'stories': stories,
        'total': pagination.total,
        'page': page,
        'per_page': per_page,
        'total_pages': pagination.pages
    })


@bp.route('/featured', methods=['GET'])
def get_featured_stories():
    """Get featured stories"""
    stories = Post.query.filter_by(
        status=PostStatus.PUBLISHED,
        is_featured=True
    ).order_by(desc(Post.featured_at)).limit(10).all()
    
    return jsonify({
        'featured_stories': [story.to_dict() for story in stories]
    })


@bp.route('/category/<story_type>', methods=['GET'])
def get_stories_by_category(story_type):
    """Get stories filtered by category"""
    try:
        story_type_enum = StoryType(story_type)
    except ValueError:
        return jsonify({'error': 'Invalid story type'}), 400
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    pagination = Post.query.filter_by(
        status=PostStatus.PUBLISHED,
        story_type=story_type_enum
    ).order_by(desc(Post.published_at)).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'stories': [story.to_dict() for story in pagination.items],
        'category': story_type,
        'total': pagination.total,
        'page': page,
        'per_page': per_page,
        'total_pages': pagination.pages
    })


@bp.route('/<story_id>', methods=['GET'])
def get_story(story_id):
    """Get a single story by ID and increment view count"""
    story = Post.query.filter_by(public_id=story_id).first()
    
    if not story:
        return jsonify({'error': 'Story not found'}), 404
    
    if story.status != PostStatus.PUBLISHED:
        # Only allow author to view unpublished stories
        try:
            current_user_id = get_jwt_identity()
            if not current_user_id or story.author.public_id != current_user_id:
                return jsonify({'error': 'Story not found'}), 404
        except:
            return jsonify({'error': 'Story not found'}), 404
    
    # Increment view count
    story.view_count += 1
    db.session.commit()
    
    return jsonify({'story': story.to_dict()})


@bp.route('/<story_id>', methods=['PUT'])
@jwt_required()
def update_story(story_id):
    """Update a story (only by author)"""
    current_user_id = get_jwt_identity()
    user = User.query.filter_by(public_id=current_user_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    story = Post.query.filter_by(public_id=story_id).first()
    
    if not story:
        return jsonify({'error': 'Story not found'}), 404
    
    # Check if user is the author
    if story.user_id != user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    try:
        schema = PostCreationSchema()
        data = schema.load(request.json)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    
    # Update fields
    story.title = data.get('title', story.title)
    story.content = data.get('content', story.content)
    story.story_type = StoryType(data.get('story_type', story.story_type.value))
    story.is_anonymous = data.get('is_anonymous', story.is_anonymous)
    story.tags = data.get('tags', story.tags)
    
    # Recalculate reading time if content changed
    if 'content' in data:
        story.reading_time = calculate_reading_time(data['content'])
    
    # Update status
    new_status = PostStatus(data.get('status', story.status.value))
    if new_status == PostStatus.PUBLISHED and story.status != PostStatus.PUBLISHED:
        story.published_at = datetime.now(timezone.utc)
    story.status = new_status
    
    story.updated_at = datetime.now(timezone.utc)
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'Story updated successfully',
            'story': story.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Story update error: {str(e)}")
        return jsonify({'error': 'Story update failed'}), 500


@bp.route('/<story_id>', methods=['DELETE'])
@jwt_required()
def delete_story(story_id):
    """Delete a story (only by author)"""
    current_user_id = get_jwt_identity()
    user = User.query.filter_by(public_id=current_user_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    story = Post.query.filter_by(public_id=story_id).first()
    
    if not story:
        return jsonify({'error': 'Story not found'}), 404
    
    # Check if user is the author
    if story.user_id != user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    try:
        db.session.delete(story)
        db.session.commit()
        return jsonify({'message': 'Story deleted successfully'})
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Story deletion error: {str(e)}")
        return jsonify({'error': 'Story deletion failed'}), 500


@bp.route('/<story_id>/comments', methods=['POST'])
@jwt_required()
@limiter.limit("20 per hour")
def add_comment(story_id):
    """Add a comment to a story"""
    current_user_id = get_jwt_identity()
    user = User.query.filter_by(public_id=current_user_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    story = Post.query.filter_by(public_id=story_id, status=PostStatus.PUBLISHED).first()
    
    if not story:
        return jsonify({'error': 'Story not found'}), 404
    
    try:
        schema = CommentCreationSchema()
        data = schema.load(request.json)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    
    comment = Comment(
        content=data['content'],
        is_anonymous=data.get('is_anonymous', True),
        user_id=user.id,
        post_id=story.id
    )
    
    # Handle parent comment for nested replies
    if data.get('parent_id'):
        parent = Comment.query.filter_by(public_id=data['parent_id']).first()
        if parent and parent.post_id == story.id:
            comment.parent_id = parent.id
    
    try:
        db.session.add(comment)
        db.session.commit()
        return jsonify({
            'message': 'Comment added successfully',
            'comment': comment.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Comment creation error: {str(e)}")
        return jsonify({'error': 'Comment creation failed'}), 500


@bp.route('/<story_id>/comments', methods=['GET'])
def get_comments(story_id):
    """Get comments for a story"""
    story = Post.query.filter_by(public_id=story_id, status=PostStatus.PUBLISHED).first()
    
    if not story:
        return jsonify({'error': 'Story not found'}), 404
    
    # Get top-level comments (no parent)
    comments = Comment.query.filter_by(
        post_id=story.id,
        parent_id=None
    ).order_by(Comment.created_at).all()
    
    return jsonify({
        'comments': [comment.to_dict() for comment in comments],
        'total': len(comments)
    })


@bp.route('/<story_id>/react', methods=['POST'])
@jwt_required()
@limiter.limit("30 per hour")
def react_to_story(story_id):
    """Add a reaction to a story"""
    current_user_id = get_jwt_identity()
    user = User.query.filter_by(public_id=current_user_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    story = Post.query.filter_by(public_id=story_id, status=PostStatus.PUBLISHED).first()
    
    if not story:
        return jsonify({'error': 'Story not found'}), 404
    
    try:
        schema = SupportSchema()
        data = schema.load(request.json)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    
    # Check if user already reacted with this type
    existing = Support.query.filter_by(
        giver_id=user.id,
        post_id=story.id,
        support_type=data.get('support_type', 'heart')
    ).first()
    
    if existing:
        return jsonify({'error': 'Already reacted with this type'}), 409
    
    reaction = Support(
        support_type=data.get('support_type', 'heart'),
        message=data.get('message'),
        giver_id=user.id,
        receiver_id=story.user_id,
        post_id=story.id
    )
    
    try:
        db.session.add(reaction)
        db.session.commit()
        return jsonify({
            'message': 'Reaction added successfully',
            'reaction': reaction.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Reaction creation error: {str(e)}")
        return jsonify({'error': 'Reaction creation failed'}), 500


@bp.route('/user/<user_id>/stories', methods=['GET'])
def get_user_stories(user_id):
    """Get all published stories by a specific user"""
    user = User.query.filter_by(public_id=user_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    # Only show non-anonymous published stories
    pagination = Post.query.filter_by(
        user_id=user.id,
        status=PostStatus.PUBLISHED,
        is_anonymous=False
    ).order_by(desc(Post.published_at)).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'stories': [story.to_dict() for story in pagination.items],
        'author': {
            'id': user.public_id,
            'username': user.username,
            'display_name': user.display_name,
            'author_bio': user.author_bio,
            'is_featured_author': user.is_featured_author
        },
        'total': pagination.total,
        'page': page,
        'per_page': per_page,
        'total_pages': pagination.pages
    })