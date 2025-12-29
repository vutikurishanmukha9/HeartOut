from flask import request, jsonify, current_app
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
from app.blueprints.auth import bp
from app.extensions import db, limiter
from app.models import User, UserRole
from app.schemas import UserRegistrationSchema, UserLoginSchema
from app.utils.password_validator import validate_password, get_password_requirements
from marshmallow import ValidationError
from datetime import datetime, timezone

# JWT blocklist for logout functionality
# TODO: For production, use Redis or database table
jwt_blocklist = set()


@bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for deployment platforms"""
    return jsonify({
        'status': 'healthy',
        'service': 'heartout-api',
        'version': '2.4.0'
    })


@bp.route('/register', methods=['POST'])
@limiter.limit("5 per minute")
def register():
    try:
        schema = UserRegistrationSchema()
        data = schema.load(request.json)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    
    # Validate password strength
    is_valid, error_message = validate_password(data['password'])
    if not is_valid:
        return jsonify({
            'error': error_message,
            'requirements': get_password_requirements()
        }), 400
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 409
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already taken'}), 409
    
    # Create new user
    user = User(
        username=data['username'],
        email=data['email'],
        display_name=data.get('display_name', data['username']),
        age_range=data.get('age_range')
    )
    user.set_password(data['password'])
    
    try:
        db.session.add(user)
        db.session.commit()
        
        # Create tokens
        access_token = create_access_token(identity=user.public_id)
        refresh_token = create_refresh_token(identity=user.public_id)
        
        return jsonify({
            'message': 'Registration successful',
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Registration error: {str(e)}")
        return jsonify({'error': 'Registration failed'}), 500

@bp.route('/login', methods=['POST'])
@limiter.limit("10 per minute")
def login():
    try:
        schema = UserLoginSchema()
        data = schema.load(request.json)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    if not user.is_active:
        return jsonify({'error': 'Account is deactivated'}), 401
    
    try:
        # Update last login
        user.last_login = datetime.now(timezone.utc)
        db.session.commit()
        
        # Create tokens
        access_token = create_access_token(identity=user.public_id)
        refresh_token = create_refresh_token(identity=user.public_id)
        
        # Get user data with error handling
        try:
            user_data = user.to_dict(include_sensitive=True)
        except Exception as e:
            current_app.logger.error(f"Error in user.to_dict: {str(e)}")
            # Fallback to basic user data
            user_data = {
                'id': user.public_id,
                'username': user.username,
                'email': user.email,
                'display_name': user.display_name,
                'role': user.role.value if user.role else 'user'
            }
        
        return jsonify({
            'message': 'Login successful',
            'user': user_data,
            'access_token': access_token,
            'refresh_token': refresh_token
        })
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed. Please try again.'}), 500

@bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    user = User.query.filter_by(public_id=current_user_id).first()
    
    if not user or not user.is_active:
        return jsonify({'error': 'User not found or inactive'}), 404
    
    new_token = create_access_token(identity=current_user_id)
    return jsonify({'access_token': new_token})

@bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()['jti']
    jwt_blocklist.add(jti)
    return jsonify({'message': 'Successfully logged out'})

@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.query.filter_by(public_id=current_user_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({'user': user.to_dict(include_sensitive=True)})

@bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = User.query.filter_by(public_id=current_user_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.json
    
    # Update allowed fields for storytelling platform
    allowed_fields = ['display_name', 'bio', 'age_range', 'preferred_anonymity', 
                     'author_bio', 'website_url', 'social_links']
    
    for field in allowed_fields:
        if field in data:
            setattr(user, field, data[field])
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict(include_sensitive=True)
        })
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Profile update error: {str(e)}")
        return jsonify({'error': 'Update failed'}), 500

@bp.route('/change-password', methods=['POST'])
@jwt_required()
@limiter.limit("3 per hour")
def change_password():
    current_user_id = get_jwt_identity()
    user = User.query.filter_by(public_id=current_user_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.json
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    
    if not current_password or not new_password:
        return jsonify({'error': 'Both current and new passwords required'}), 400
    
    if not user.check_password(current_password):
        return jsonify({'error': 'Current password is incorrect'}), 401
    
    # Use full password validation
    is_valid, error_message = validate_password(new_password)
    if not is_valid:
        return jsonify({
            'error': error_message,
            'requirements': get_password_requirements()
        }), 400
    
    user.set_password(new_password)
    
    try:
        db.session.commit()
        return jsonify({'message': 'Password changed successfully'})
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Password change error: {str(e)}")
        return jsonify({'error': 'Password change failed'}), 500


# ========== NEW: User Statistics Endpoint ==========
@bp.route('/stats', methods=['GET'])
@jwt_required()
def get_user_stats():
    """Get current user's statistics"""
    current_user_id = get_jwt_identity()
    user = User.query.filter_by(public_id=current_user_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    from app.services.story_service import StoryService
    stats = StoryService.get_user_stats(user)
    
    return jsonify({'stats': stats})


# ========== JWT Blocklist Check ==========
def is_token_revoked(jwt_header, jwt_payload):
    """Check if a JWT token has been revoked"""
    from app.models import TokenBlocklist
    jti = jwt_payload['jti']
    
    # First check in-memory cache for quick lookup
    if jti in jwt_blocklist:
        return True
    
    # Then check database for persistent storage
    token = TokenBlocklist.query.filter_by(jti=jti).first()
    return token is not None

