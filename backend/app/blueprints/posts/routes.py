from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.blueprints.posts import bp
from app.extensions import db, limiter
from app.models import User, Post, Comment, Support, PostStatus, StoryType
from app.schemas import PostCreationSchema, CommentCreationSchema, SupportSchema
from app.utils.reading_time import calculate_reading_time, get_excerpt
from app.utils.decorators import get_current_user
from app.services.story_service import StoryService
from marshmallow import ValidationError
from datetime import datetime, timezone
from sqlalchemy import desc, func, or_


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
    
    try:
        story = StoryService.create_story(user, data)
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
    story_type = request.args.get('story_type')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    sort_by = request.args.get('sort_by', 'latest')
    
    try:
        filters = {'story_type': story_type} if story_type else None
        pagination = StoryService.get_stories(filters, page, per_page, sort_by)
        
        return jsonify({
            'stories': [story.to_dict() for story in pagination.items],
            'total': pagination.total,
            'page': page,
            'per_page': per_page,
            'total_pages': pagination.pages
        })
    except Exception as e:
        current_app.logger.error(f"Get stories error: {str(e)}")
        return jsonify({'error': 'Failed to fetch stories'}), 500


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


# ========== NEW: Drafts Endpoint ==========
@bp.route('/drafts', methods=['GET'])
@jwt_required()
def get_user_drafts():
    """Get current user's draft stories"""
    current_user_id = get_jwt_identity()
    user = User.query.filter_by(public_id=current_user_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    pagination = StoryService.get_user_drafts(user, page, per_page)
    
    return jsonify({
        'drafts': [story.to_dict() for story in pagination.items],
        'total': pagination.total,
        'page': page,
        'per_page': per_page,
        'total_pages': pagination.pages
    })


# ========== NEW: Search Endpoint ==========
@bp.route('/search', methods=['GET'])
def search_stories():
    """Search stories by title or content"""
    query = request.args.get('q', '').strip()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    if not query or len(query) < 2:
        return jsonify({'error': 'Search query must be at least 2 characters'}), 400
    
    try:
        pagination = StoryService.search_stories(query, page, per_page)
        
        return jsonify({
            'results': [story.to_dict() for story in pagination.items],
            'query': query,
            'total': pagination.total,
            'page': page,
            'per_page': per_page,
            'total_pages': pagination.pages
        })
    except Exception as e:
        current_app.logger.error(f"Search error: {str(e)}")
        return jsonify({'error': 'Search failed'}), 500


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
        try:
            current_user_id = get_jwt_identity()
            if not current_user_id or story.author.public_id != current_user_id:
                return jsonify({'error': 'Story not found'}), 404
        except:
            return jsonify({'error': 'Story not found'}), 404
    
    # Increment view count
    StoryService.increment_view_count(story)
    
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
    
    if story.user_id != user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    try:
        schema = PostCreationSchema()
        data = schema.load(request.json)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    
    try:
        updated_story = StoryService.update_story(story, user, data)
        return jsonify({
            'message': 'Story updated successfully',
            'story': updated_story.to_dict()
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
    
    if story.user_id != user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    try:
        StoryService.delete_story(story, user)
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


# ========== NEW: Toggle Reaction Endpoint ==========
@bp.route('/<story_id>/toggle-react', methods=['POST'])
@jwt_required()
@limiter.limit("60 per hour")
def toggle_reaction(story_id):
    """Toggle reaction - add if not exists, remove if exists"""
    current_user_id = get_jwt_identity()
    user = User.query.filter_by(public_id=current_user_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    story = Post.query.filter_by(public_id=story_id, status=PostStatus.PUBLISHED).first()
    
    if not story:
        return jsonify({'error': 'Story not found'}), 404
    
    try:
        schema = SupportSchema()
        data = schema.load(request.json or {})
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    
    support_type = data.get('support_type', 'heart')
    message = data.get('message')
    
    try:
        result = StoryService.toggle_reaction(story, user, support_type, message)
        
        if result['action'] == 'removed':
            return jsonify({
                'message': 'Reaction removed',
                'action': 'removed',
                'support_count': result['support_count']
            })
        else:
            return jsonify({
                'message': 'Reaction added',
                'action': 'added',
                'reaction': result['reaction'].to_dict(),
                'support_count': result['support_count']
            }), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Toggle reaction error: {str(e)}")
        return jsonify({'error': 'Toggle reaction failed'}), 500


@bp.route('/user/<user_id>/stories', methods=['GET'])
def get_user_stories(user_id):
    """Get all published stories by a specific user"""
    user = User.query.filter_by(public_id=user_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
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