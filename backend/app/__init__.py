from flask import Flask
from flask_cors import CORS
from app.extensions import db, migrate, jwt, limiter, socketio
from app.config import Config
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
    # limiter.init_app(app)  # Disabled for development without Redis
    socketio.init_app(app, cors_allowed_origins="*", async_mode='threading')
    
    # CORS configuration
    CORS(app, origins=["http://localhost:3000", "http://localhost:5173"], 
         supports_credentials=True)
    
    # Register blueprints
    from app.blueprints.auth import bp as auth_bp
    from app.blueprints.posts import bp as posts_bp
    from app.blueprints.admin import bp as admin_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(posts_bp, url_prefix='/api/posts')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    # Error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return {'error': 'Resource not found'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return {'error': 'Internal server error'}, 500
    
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