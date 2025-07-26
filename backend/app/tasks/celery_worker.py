from celery import Celery
from flask import Flask
from app.config import Config
from app.extensions import db
from app.models import User, Post
from app.utils.mailer import send_crisis_notification_email
from app.utils.twilio_helper import send_crisis_alert, send_support_notification
import logging

def make_celery(app):
    """Create Celery instance with Flask app context"""
    celery = Celery(
        app.import_name,
        backend=app.config['CELERY_RESULT_BACKEND'],
        broker=app.config['CELERY_BROKER_URL']
    )
    
    celery.conf.update(app.config)
    
    class ContextTask(celery.Task):
        """Make celery tasks work with Flask app context"""
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)
    
    celery.Task = ContextTask
    return celery

    # Create Flask app for Celery
def create_celery_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    return app

app = create_celery_app()
celery = make_celery(app)

@celery.task
def send_crisis_notifications(user_id, crisis_message):
    """Send crisis notifications to emergency contacts"""
    try:
        user = User.query.filter_by(public_id=user_id).first()
        
        if not user:
            logging.error(f"User not found for crisis notification: {user_id}")
            return False
        
        notifications_sent = 0
        
        # Send SMS to crisis contact
        if user.crisis_contact_number:
            if send_crisis_alert(user.crisis_contact_number, crisis_message):
                notifications_sent += 1
            
        # Send email to emergency contact (if we have email)
        if user.emergency_contact_name and hasattr(user, 'emergency_contact_email'):
            if send_crisis_notification_email(
                user.emergency_contact_email,
                user.display_name or user.username,
                crisis_message
            ):
                notifications_sent += 1
        
        logging.info(f"Crisis notifications sent: {notifications_sent} for user {user_id}")
        return notifications_sent > 0
        
    except Exception as e:
        logging.error(f"Crisis notification task failed: {str(e)}")
        return False

@celery.task
def process_content_moderation(post_id):
    """Process content moderation in background"""
    try:
        from app.utils.moderation import check_content_safety, analyze_crisis_indicators
        
        post = Post.query.filter_by(public_id=post_id).first()
        
        if not post:
            logging.error(f"Post not found for moderation: {post_id}")
            return False
        
        # Perform detailed content analysis
        moderation_result = check_content_safety(post.content)
        crisis_analysis = analyze_crisis_indicators(post.content)
        
        # Update post with analysis results
        post.moderation_score = moderation_result.get('toxicity_score', 0)
        post.auto_flagged = moderation_result.get('should_flag', False)
        
        # Update severity if crisis detected
        if crisis_analysis['is_crisis']:
            from app.models import SeverityLevel
            post.severity_level = SeverityLevel.CRITICAL
        
        db.session.commit()
        
        # Send crisis notifications if needed
        if crisis_analysis['is_crisis']:
            send_crisis_notifications.delay(
                post.author.public_id,
                crisis_analysis['message']
            )
        
        logging.info(f"Content moderation completed for post {post_id}")
        return True
        
    except Exception as e:
        logging.error(f"Content moderation task failed: {str(e)}")
        return False

@celery.task
def send_support_notifications_task(supporter_id, receiver_id, support_type):
    """Send notifications when someone receives support"""
    try:
        supporter = User.query.filter_by(public_id=supporter_id).first()
        receiver = User.query.filter_by(public_id=receiver_id).first()
        
        if not supporter or not receiver:
            logging.error(f"User not found for support notification")
            return False
        
        # Send SMS notification if receiver has phone number
        if receiver.crisis_contact_number:
            supporter_name = supporter.display_name or supporter.username
            if send_support_notification(receiver.crisis_contact_number, supporter_name):
                logging.info(f"Support notification sent to {receiver_id}")
                return True
        
        return False
        
    except Exception as e:
        logging.error(f"Support notification task failed: {str(e)}")
        return False

@celery.task
def cleanup_expired_sessions():
    """Clean up expired call sessions"""
    try:
        from app.models import CallSession, CallParticipant
        from datetime import datetime, timezone, timedelta
        
        # Mark sessions as inactive if they've been running for more than 4 hours
        cutoff_time = datetime.now(timezone.utc) - timedelta(hours=4)
        
        expired_sessions = CallSession.query.filter(
            CallSession.is_active == True,
            CallSession.created_at < cutoff_time
        ).all()
        
        for session in expired_sessions:
            session.is_active = False
            session.ended_at = datetime.now(timezone.utc)
            
            # Mark all participants as inactive
            for participant in session.participants.filter_by(is_active=True):
                participant.is_active = False
                participant.left_at = datetime.now(timezone.utc)
        
        db.session.commit()
        
        logging.info(f"Cleaned up {len(expired_sessions)} expired call sessions")
        return len(expired_sessions)
        
    except Exception as e:
        logging.error(f"Session cleanup task failed: {str(e)}")
        return 0

@celery.task
def generate_daily_reports():
    """Generate daily analytics reports"""
    try:
        from datetime import datetime, timezone, timedelta
        from sqlalchemy import func
        
        today = datetime.now(timezone.utc).date()
        yesterday = today - timedelta(days=1)
        
        # Calculate daily metrics
        daily_stats = {
            'date': yesterday.isoformat(),
            'new_users': User.query.filter(func.date(User.created_at) == yesterday).count(),
            'new_posts': Post.query.filter(func.date(Post.created_at) == yesterday).count(),
            'crisis_posts': Post.query.filter(
                func.date(Post.created_at) == yesterday,
                Post.severity_level == 'critical'
            ).count(),
            'support_actions': db.session.query(func.count()).select_from(
                db.session.query(Post).filter(func.date(Post.created_at) == yesterday).subquery()
            ).scalar()
        }
        
        # Store or send report (implementation depends on requirements)
        logging.info(f"Daily report generated: {daily_stats}")
        
        return daily_stats
        
    except Exception as e:
        logging.error(f"Daily report generation failed: {str(e)}")
        return None

# Periodic tasks
from celery.schedules import crontab

celery.conf.beat_schedule = {
    'cleanup-expired-sessions': {
        'task': 'app.tasks.celery_worker.cleanup_expired_sessions',
        'schedule': crontab(minute=0),  # Every hour
    },
    'generate-daily-reports': {
        'task': 'app.tasks.celery_worker.generate_daily_reports',
        'schedule': crontab(hour=1, minute=0),  # Daily at 1 AM
    },
}

celery.conf.timezone = 'UTC'