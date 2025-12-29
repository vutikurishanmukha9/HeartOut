from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.blueprints.admin import bp
from app.extensions import db
from app.models import User, Post, Comment, Support, UserRole, PostStatus
from functools import wraps
from datetime import datetime, timezone, timedelta
from sqlalchemy import func, desc

def admin_required(f):
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.filter_by(public_id=current_user_id).first()
        
        if not user or user.role not in [UserRole.ADMIN, UserRole.MODERATOR]:
            return jsonify({'error': 'Admin access required'}), 403
        
        return f(*args, **kwargs)
    
    return decorated_function

@bp.route('/dashboard', methods=['GET'])
@admin_required
def get_dashboard_stats():
    try:
        days = request.args.get('days', 30, type=int)
        start_date = datetime.now(timezone.utc) - timedelta(days=days)
        
        # User statistics
        total_users = User.query.count()
        new_users = User.query.filter(User.created_at >= start_date).count()
        active_users = User.query.filter(User.is_active == True).count()
        
        # Story statistics
        total_stories = Post.query.count()
        published_stories = Post.query.filter_by(status=PostStatus.PUBLISHED).count()
        flagged_stories = Post.query.filter(Post.flagged_count > 0).count()
        
        # Support statistics
        total_reactions = Support.query.count()
        recent_reactions = Support.query.filter(Support.created_at >= start_date).count()
        
        return jsonify({
            'users': {
                'total': total_users,
                'new': new_users,
                'active': active_users
            },
            'stories': {
                'total': total_stories,
                'published': published_stories,
                'flagged': flagged_stories
            },
            'reactions': {
                'total': total_reactions,
                'recent': recent_reactions
            }
        })
        
    except Exception as e:
        current_app.logger.error(f"Dashboard stats error: {str(e)}")
        return jsonify({'error': 'Failed to fetch dashboard stats'}), 500

@bp.route('/users', methods=['GET'])
@admin_required
def get_users():
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 50, type=int), 100)
    
    users = User.query.order_by(desc(User.created_at))\
                 .paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'users': [user.to_dict(include_sensitive=True) for user in users.items],
        'pagination': {
            'page': page,
            'pages': users.pages,
            'per_page': per_page,
            'total': users.total
        }
    })

@bp.route('/posts/flagged', methods=['GET'])
@admin_required
def get_flagged_posts():
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    
    posts = Post.query.filter(Post.flagged_count > 0)\
                .order_by(desc(Post.created_at))\
                .paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'posts': [post.to_dict() for post in posts.items],
        'pagination': {
            'page': page,
            'pages': posts.pages,
            'per_page': per_page,
            'total': posts.total
        }
    })

@bp.route('/posts/<post_id>/moderate', methods=['POST'])
@admin_required
def moderate_post(post_id):
    post = Post.query.filter_by(public_id=post_id).first()
    
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    
    data = request.json
    action = data.get('action')  # approve, remove, flag
    
    if action == 'approve':
        post.status = PostStatus.PUBLISHED
        post.flagged_count = 0
        if not post.published_at:
            post.published_at = datetime.now(timezone.utc)
    elif action == 'remove':
        post.status = PostStatus.REMOVED
    elif action == 'flag':
        post.status = PostStatus.FLAGGED
    else:
        return jsonify({'error': 'Invalid action'}), 400
    
    try:
        db.session.commit()
        return jsonify({
            'message': f'Post {action}d successfully',
            'post': post.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Post moderation error: {str(e)}")
        return jsonify({'error': 'Moderation action failed'}), 500
