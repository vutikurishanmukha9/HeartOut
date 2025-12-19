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
    
    # Validate environment variables (skip in testing)
    if not app.config.get('TESTING'):
        from app.utils.validate_env import validate_environment
        validate_environment(app)
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    limiter.init_app(app)
    
    # Auto-run migrations on startup (for production where shell access is limited)
    with app.app_context():
        try:
            from flask_migrate import upgrade, stamp
            from sqlalchemy import text
            
            # Check if we need to fix migration history first
            try:
                # Try to get current revision
                result = db.session.execute(text("SELECT version_num FROM alembic_version"))
                current_version = result.scalar()
                app.logger.info(f'Current migration version: {current_version}')
            except Exception:
                current_version = None
                app.logger.info('No alembic_version table found')
            
            # If database exists but alembic_version is wrong, stamp it
            try:
                result = db.session.execute(text("SELECT 1 FROM users LIMIT 1"))
                db_has_data = True
            except Exception:
                db_has_data = False
            
            if db_has_data and current_version is None:
                # Database has data but no version - stamp it to second migration
                app.logger.info('Stamping database to 94438ba377ef')
                stamp(revision='94438ba377ef')
            
            # Now run upgrade
            upgrade()
            app.logger.info('Database migrations applied successfully')
            
        except Exception as e:
            app.logger.warning(f'Migration check: {str(e)}')
            
            # Fallback: Try to add missing columns directly with raw SQL
            try:
                from sqlalchemy import text
                columns_to_add = [
                    "ALTER TABLE posts ADD COLUMN IF NOT EXISTS save_count INTEGER DEFAULT 0",
                    "ALTER TABLE posts ADD COLUMN IF NOT EXISTS completion_rate FLOAT DEFAULT 0.0",
                    "ALTER TABLE posts ADD COLUMN IF NOT EXISTS avg_read_time INTEGER DEFAULT 0",
                    "ALTER TABLE posts ADD COLUMN IF NOT EXISTS reread_count INTEGER DEFAULT 0",
                    "ALTER TABLE posts ADD COLUMN IF NOT EXISTS unique_readers INTEGER DEFAULT 0",
                    "ALTER TABLE posts ADD COLUMN IF NOT EXISTS rank_score FLOAT DEFAULT 0.0",
                    "ALTER TABLE posts ADD COLUMN IF NOT EXISTS last_ranked_at TIMESTAMP",
                ]
                for sql in columns_to_add:
                    try:
                        db.session.execute(text(sql))
                    except Exception:
                        pass
                db.session.commit()
                app.logger.info('Added missing columns via fallback SQL')
            except Exception as fallback_error:
                app.logger.error(f'Fallback migration failed: {str(fallback_error)}')
    
    # CORS configuration - allow all origins for API endpoints
    # Note: When using wildcard "*", supports_credentials must be False
    # For production, set CORS_ORIGINS to specific domains
    CORS(app, resources={
        r"/api/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Content-Type"],
            "supports_credentials": False
        }
    })
    
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
    
    # Health check endpoint for cold start warmup
    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy', 'message': 'Server is awake!'}, 200
    
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