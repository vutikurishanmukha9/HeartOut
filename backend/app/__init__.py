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
                    "ALTER TABLE posts ADD COLUMN IF NOT EXISTS support_count INTEGER DEFAULT 0",
                    "ALTER TABLE posts ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0",
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
    
    # Database fix endpoint - call once to add missing columns
    @app.route('/api/fix-db')
    def fix_database():
        from sqlalchemy import text
        results = []
        
        columns_sql = [
            ("save_count", "ALTER TABLE posts ADD COLUMN save_count INTEGER DEFAULT 0"),
            ("completion_rate", "ALTER TABLE posts ADD COLUMN completion_rate FLOAT DEFAULT 0.0"),
            ("avg_read_time", "ALTER TABLE posts ADD COLUMN avg_read_time INTEGER DEFAULT 0"),
            ("reread_count", "ALTER TABLE posts ADD COLUMN reread_count INTEGER DEFAULT 0"),
            ("unique_readers", "ALTER TABLE posts ADD COLUMN unique_readers INTEGER DEFAULT 0"),
            ("rank_score", "ALTER TABLE posts ADD COLUMN rank_score FLOAT DEFAULT 0.0"),
            ("last_ranked_at", "ALTER TABLE posts ADD COLUMN last_ranked_at TIMESTAMP"),
            ("support_count", "ALTER TABLE posts ADD COLUMN support_count INTEGER DEFAULT 0"),
            ("comment_count", "ALTER TABLE posts ADD COLUMN comment_count INTEGER DEFAULT 0"),
        ]
        
        for col_name, sql in columns_sql:
            try:
                db.session.execute(text(sql))
                db.session.commit()
                results.append(f"Added: {col_name}")
            except Exception as e:
                db.session.rollback()
                if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
                    results.append(f"Exists: {col_name}")
                else:
                    results.append(f"Error {col_name}: {str(e)[:50]}")
        
        # Create bookmarks table if not exists
        try:
            db.session.execute(text("""
                CREATE TABLE IF NOT EXISTS bookmarks (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL REFERENCES users(id),
                    post_id INTEGER NOT NULL REFERENCES posts(id),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(user_id, post_id)
                )
            """))
            db.session.commit()
            results.append("Created/verified: bookmarks table")
        except Exception as e:
            db.session.rollback()
            results.append(f"Bookmarks table: {str(e)[:50]}")
        
        # Create read_progress table if not exists
        try:
            db.session.execute(text("""
                CREATE TABLE IF NOT EXISTS read_progress (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL REFERENCES users(id),
                    post_id INTEGER NOT NULL REFERENCES posts(id),
                    scroll_depth FLOAT DEFAULT 0.0,
                    time_spent INTEGER DEFAULT 0,
                    completed BOOLEAN DEFAULT FALSE,
                    read_count INTEGER DEFAULT 1,
                    first_read TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    last_read TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(user_id, post_id)
                )
            """))
            db.session.commit()
            results.append("Created/verified: read_progress table")
        except Exception as e:
            db.session.rollback()
            results.append(f"Read progress table: {str(e)[:50]}")
        
        return {'status': 'complete', 'results': results}, 200
    
    # Debug endpoint to check database columns on posts table
    @app.route('/api/check-db')
    def check_database():
        """Check all columns in posts table to identify missing columns"""
        from sqlalchemy import text
        results = {
            'status': 'checking',
            'posts_table_columns': [],
            'expected_columns': [
                'id', 'public_id', 'title', 'content', 'status', 'story_type',
                'is_anonymous', 'tags', 'reading_time', 'view_count', 'is_featured',
                'featured_at', 'created_at', 'updated_at', 'published_at', 'flagged_count',
                'save_count', 'completion_rate', 'avg_read_time', 'reread_count',
                'unique_readers', 'rank_score', 'last_ranked_at', 'support_count',
                'comment_count', 'user_id'
            ],
            'missing_columns': [],
            'test_insert_error': None
        }
        
        try:
            # Get actual columns from database
            result = db.session.execute(text("""
                SELECT column_name FROM information_schema.columns 
                WHERE table_name = 'posts' ORDER BY ordinal_position
            """))
            actual_columns = [row[0] for row in result.fetchall()]
            results['posts_table_columns'] = actual_columns
            
            # Find missing columns
            results['missing_columns'] = [col for col in results['expected_columns'] if col not in actual_columns]
            
            if results['missing_columns']:
                results['status'] = 'missing_columns'
            else:
                results['status'] = 'all_columns_present'
                
        except Exception as e:
            results['status'] = 'error'
            results['error'] = str(e)
        
        return results, 200
    
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