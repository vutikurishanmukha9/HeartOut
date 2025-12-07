from app import create_app
from app.extensions import db
from app.models import User, Post, Comment, Support

app = create_app()
with app.app_context():
    # Delete all data in correct order (foreign keys)
    Support.query.delete()
    Comment.query.delete()
    Post.query.delete()
    User.query.delete()
    db.session.commit()
    print("✅ All test data cleared successfully!")
    print("   - Users: 0")
    print("   - Stories: 0")
    print("   - Comments: 0")
    print("   - Reactions: 0")
