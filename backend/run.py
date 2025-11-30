# backend/run.py
#!/usr/bin/env python3
from app import create_app, socketio
from app.extensions import db
import os

app = create_app()

@app.shell_context_processor
def make_shell_context():
    """Add database models to shell context"""
    from app.models import User, Post, Comment, Support
    return {
        'db': db,
        'User': User,
        'Post': Post,
        'Comment': Comment,
        'Support': Support
    }

if __name__ == '__main__':
    # Use SocketIO's run method for WebSocket support
    socketio.run(
        app,
        host='0.0.0.0',
        port=int(os.environ.get('PORT', 5000)),
        debug=os.environ.get('FLASK_ENV') == 'development'
    )