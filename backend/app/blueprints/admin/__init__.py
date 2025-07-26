from flask import Blueprint

bp = Blueprint('admin', __name__)

from app.blueprints.admin import routes

# backend/app/blueprints/admin/routes.py
from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.blueprints.admin import bp
from app.extensions import db, limiter
from app.models import User, Post, Comment, Support, CallSession, UserRole, PostStatus
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
        # Get date range (last 30 days by default)
        days = request.args.get('days', 30, type=int)
        start_date = datetime.now(timezone.utc) - timedelta(days=days)
        
        # User statistics
        total_users = User.query.count()
        new_users = User.query.filter(User.created_at >= start_date).count()
        active_users = User.query.filter(User.is_active == True).count()
        
        # Post statistics
        total_posts = Post.query.count()
        published_posts = Post.query.filter_by(status=PostStatus.PUBLISHED).count()
        flagged_posts = Post.query.filter_by(auto_flagged=True).count()
        critical_posts = Post.query.filter_by(severity_level='critical').count()
        
        # Daily activity for the last 7 days
        daily_stats = []
        for i in range(7):
            date = datetime.now(timezone.utc) - timedelta(days=i)
            day_start = date.replace(hour=0, minute=0, second=0, microsecond=0)
            day_end = day_start + timedelta(days=1)
            
            posts_count = Post.query.filter(
                Post.created_at >= day_start,
                Post.created_at < day_end
            ).count()
            
            users_count = User.query.filter(
                User.created_at >= day_start,
                User.created_at < day_end
            ).count()
            
            daily_stats.append({
                'date': day_start.date().isoformat(),
                'posts': posts_count,
                'users': users_count
            })
        
        # Support statistics
        total_supports = Support.query.count()
        recent_supports = Support.query.filter(Support.created_at >= start_date).count()
        
        # Call session statistics
        total_calls = CallSession.query.count()
        emergency_calls = CallSession.query.filter_by(is_emergency=True).count()
        
        return jsonify({
            'users': {
                'total': total_users,
                'new': new_users,
                'active': active_users
            },
            'posts': {
                'total': total_posts,
                'published': published_posts,
                'flagged': flagged_posts,
                'critical': critical_posts
            },
            'supports': {
                'total': total_supports,
                'recent': recent_supports
            },
            'calls': {
                'total': total_calls,
                'emergency': emergency_calls
            },
            'daily_activity': daily_stats[::-1]  # Reverse to show oldest first
        })
        
    except Exception as e:
        current_app.logger.error(f"Dashboard stats error: {str(e)}")
        return jsonify({'error': 'Failed to fetch dashboard stats'}), 500

@bp.route('/users', methods=['GET'])
@admin_required
def get_users():
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 50, type=int), 100)
    search = request.args.get('search', '').strip()
    role_filter = request.args.get('role')
    
    query = User.query
    
    # Apply search filter
    if search:
        query = query.filter(
            db.or_(
                User.username.ilike(f'%{search}%'),
                User.email.ilike(f'%{search}%'),
                User.display_name.ilike(f'%{search}%')
            )
        )
    
    # Apply role filter
    if role_filter:
        try:
            role = UserRole(role_filter)
            query = query.filter_by(role=role)
        except ValueError:
            pass
    
    users = query.order_by(desc(User.created_at))\
                 .paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'users': [user.to_dict(include_sensitive=True) for user in users.items],
        'pagination': {
            'page': page,
            'pages': users.pages,
            'per_page': per_page,
            'total': users.total,
            'has_next': users.has_next,
            'has_prev': users.has_prev
        }
    })

@bp.route('/users/<user_id>/toggle-active', methods=['POST'])
@admin_required
def toggle_user_active(user_id):
    user = User.query.filter_by(public_id=user_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    user.is_active = not user.is_active
    
    try:
        db.session.commit()
        return jsonify({
            'message': f'User {"activated" if user.is_active else "deactivated"} successfully',
            'user': user.to_dict(include_sensitive=True)
        })
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Toggle user active error: {str(e)}")
        return jsonify({'error': 'Failed to update user status'}), 500

@bp.route('/users/<user_id>/role', methods=['PUT'])
@admin_required
def update_user_role(user_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.filter_by(public_id=current_user_id).first()
    
    # Only admins can change roles
    if current_user.role != UserRole.ADMIN:
        return jsonify({'error': 'Admin access required'}), 403
    
    user = User.query.filter_by(public_id=user_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.json
    new_role = data.get('role')
    
    try:
        role = UserRole(new_role)
        user.role = role
        
        db.session.commit()
        return jsonify({
            'message': 'User role updated successfully',
            'user': user.to_dict(include_sensitive=True)
        })
    except ValueError:
        return jsonify({'error': 'Invalid role'}), 400
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Update user role error: {str(e)}")
        return jsonify({'error': 'Failed to update user role'}), 500

@bp.route('/posts/flagged', methods=['GET'])
@admin_required
def get_flagged_posts():
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    
    posts = Post.query.filter(
        db.or_(
            Post.auto_flagged == True,
            Post.flagged_count > 0
        )
    ).order_by(desc(Post.created_at))\
     .paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'posts': [post.to_dict() for post in posts.items],
        'pagination': {
            'page': page,
            'pages': posts.pages,
            'per_page': per_page,
            'total': posts.total,
            'has_next': posts.has_next,
            'has_prev': posts.has_prev
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
    reason = data.get('reason', '')
    
    if action == 'approve':
        post.status = PostStatus.PUBLISHED
        post.auto_flagged = False
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