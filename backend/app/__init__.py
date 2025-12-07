from flask import Flask
from flask_cors import CORS
from app.extensions import db, migrate, jwt, limiter
from app.config import Config
from app.utils.errors import register_error_handlers, APIError
import logging
from logging.handlers import RotatingFileHandler
import os

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    limiter.init_app(app)
    
    # CORS configuration
    CORS(app, origins=app.config['CORS_ORIGINS'], 
         supports_credentials=True)
    
    # Register JWT token blocklist callback
    from app.blueprints.auth.routes import is_token_revoked
    jwt.token_in_blocklist_loader(is_token_revoked)
    
    # Register blueprints
    from app.blueprints.auth import bp as auth_bp
    from app.blueprints.posts import bp as posts_bp
    from app.blueprints.admin import bp as admin_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(posts_bp, url_prefix='/api/posts')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    # Register centralized error handlers
    register_error_handlers(app)
    
    # Additional error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return {'error': 'Resource not found'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        app.logger.error(f"Internal error: {str(error)}")
        return {'error': 'Internal server error'}, 500
    
    @app.errorhandler(429)
    def rate_limit_error(error):
        return {'error': 'Rate limit exceeded. Please try again later.'}, 429
    
    # Logging setup
    if not app.debug and not app.testing:
        if not os.path.exists('logs'):
            os.mkdir('logs')
        file_handler = RotatingFileHandler('logs/storytelling.log', maxBytes=10240, backupCount=10)
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('Storytelling Platform startup')
    
    return app