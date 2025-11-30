from flask import Blueprint

bp = Blueprint('posts', __name__)

from app.blueprints.posts import routes
