from flask import Blueprint

bp = Blueprint('calls', __name__)

from app.blueprints.calls import routes

# backend/app/blueprints/calls/routes.py
from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_socketio import emit, join_room, leave_room, rooms
from app.blueprints.calls import bp
from app.extensions import db, socketio, limiter
from app.models import CallSession, CallParticipant, User
from datetime import datetime, timezone
import uuid
import secrets

@bp.route('/create', methods=['POST'])
@jwt_required()
@limiter.limit("5 per hour")
def create_call_session():
    current_user_id = get_jwt_identity()
    user = User.query.filter_by(public_id=current_user_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.json or {}
    is_emergency = data.get('is_emergency', False)
    max_participants = data.get('max_participants', 2)
    
    # Generate unique room ID
    room_id = f"room_{secrets.token_urlsafe(16)}"
    
    session = CallSession(
        room_id=room_id,
        creator_id=user.id,
        is_emergency=is_emergency,
        max_participants=min(max_participants, 10)  # Limit max participants
    )
    
    try:
        db.session.add(session)
        db.session.commit()
        
        # Add creator as first participant
        participant = CallParticipant(
            user_id=user.id,
            session_id=session.id
        )
        db.session.add(participant)
        db.session.commit()
        
        return jsonify({
            'message': 'Call session created',
            'session': session.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Call session creation error: {str(e)}")
        return jsonify({'error': 'Session creation failed'}), 500

@bp.route('/join/<session_id>', methods=['POST'])
@jwt_required()
def join_call_session(session_id):
    current_user_id = get_jwt_identity()
    user = User.query.filter_by(public_id=current_user_id).first()
    
    session = CallSession.query.filter_by(public_id=session_id, is_active=True).first()
    
    if not session:
        return jsonify({'error': 'Session not found or inactive'}), 404
    
    # Check if session is full
    active_participants = session.participants.filter_by(is_active=True).count()
    if active_participants >= session.max_participants:
        return jsonify({'error': 'Session is full'}), 400
    
    # Check if user is already in session
    existing_participant = CallParticipant.query.filter_by(
        user_id=user.id,
        session_id=session.id,
        is_active=True
    ).first()
    
    if existing_participant:
        return jsonify({
            'message': 'Already in session',
            'session': session.to_dict()
        })
    
    # Add user to session
    participant = CallParticipant(
        user_id=user.id,
        session_id=session.id
    )
    
    try:
        db.session.add(participant)
        db.session.commit()
        
        return jsonify({
            'message': 'Joined session successfully',
            'session': session.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Join session error: {str(e)}")
        return jsonify({'error': 'Failed to join session'}), 500

@bp.route('/leave/<session_id>', methods=['POST'])
@jwt_required()
def leave_call_session(session_id):
    current_user_id = get_jwt_identity()
    user = User.query.filter_by(public_id=current_user_id).first()
    
    session = CallSession.query.filter_by(public_id=session_id).first()
    
    if not session:
        return jsonify({'error': 'Session not found'}), 404
    
    participant = CallParticipant.query.filter_by(
        user_id=user.id,
        session_id=session.id,
        is_active=True
    ).first()
    
    if not participant:
        return jsonify({'error': 'Not in this session'}), 400
    
    # Mark participant as inactive
    participant.is_active = False
    participant.left_at = datetime.now(timezone.utc)
    
    # If creator leaves, end the session
    if session.creator_id == user.id:
        session.is_active = False
        session.ended_at = datetime.now(timezone.utc)
        
        # Mark all participants as inactive
        for p in session.participants.filter_by(is_active=True):
            p.is_active = False
            p.left_at = datetime.now(timezone.utc)
    
    try:
        db.session.commit()
        return jsonify({'message': 'Left session successfully'})
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Leave session error: {str(e)}")
        return jsonify({'error': 'Failed to leave session'}), 500

@bp.route('/active', methods=['GET'])
def get_active_sessions():
    # Get public active sessions (non-emergency)
    sessions = CallSession.query.filter_by(
        is_active=True,
        is_emergency=False
    ).all()
    
    # Filter sessions that are not full
    available_sessions = []
    for session in sessions:
        active_count = session.participants.filter_by(is_active=True).count()
        if active_count < session.max_participants:
            session_data = session.to_dict()
            session_data['available_spots'] = session.max_participants - active_count
            available_sessions.append(session_data)
    
    return jsonify({'sessions': available_sessions})

# Socket.IO events for real-time communication
@socketio.on('join_call_room')
def on_join_call_room(data):
    room_id = data.get('room_id')
    user_id = data.get('user_id')
    
    if not room_id or not user_id:
        emit('error', {'message': 'Room ID and User ID required'})
        return
    
    # Verify session exists and user is participant
    session = CallSession.query.filter_by(room_id=room_id, is_active=True).first()
    user = User.query.filter_by(public_id=user_id).first()
    
    if not session or not user:
        emit('error', {'message': 'Invalid session or user'})
        return
    
    participant = CallParticipant.query.filter_by(
        user_id=user.id,
        session_id=session.id,
        is_active=True
    ).first()
    
    if not participant:
        emit('error', {'message': 'Not authorized for this session'})
        return
    
    join_room(room_id)
    emit('user_joined', {
        'user_id': user.public_id,
        'username': user.username,
        'display_name': user.display_name
    }, room=room_id)

@socketio.on('leave_call_room')
def on_leave_call_room(data):
    room_id = data.get('room_id')
    user_id = data.get('user_id')
    
    if room_id and user_id:
        leave_room(room_id)
        emit('user_left', {
            'user_id': user_id
        }, room=room_id)

@socketio.on('webrtc_offer')
def on_webrtc_offer(data):
    room_id = data.get('room_id')
    if room_id:
        emit('webrtc_offer', data, room=room_id, include_self=False)

@socketio.on('webrtc_answer')
def on_webrtc_answer(data):
    room_id = data.get('room_id')
    if room_id:
        emit('webrtc_answer', data, room=room_id, include_self=False)

@socketio.on('webrtc_ice_candidate')
def on_webrtc_ice_candidate(data):
    room_id = data.get('room_id')
    if room_id:
        emit('webrtc_ice_candidate', data, room=room_id, include_self=False)

@socketio.on('call_message')
def on_call_message(data):
    room_id = data.get('room_id')
    message = data.get('message')
    user_id = data.get('user_id')
    
    if room_id and message and user_id:
        emit('call_message', {
            'user_id': user_id,
            'message': message,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }, room=room_id)