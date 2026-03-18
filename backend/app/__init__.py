from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

load_dotenv()

db = SQLAlchemy()

def create_app():
    """Create and configure the Flask application instance."""
    app = Flask(__name__)

    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL environment variable is required")

    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    # Import models to ensure tables are registered with SQLAlchemy metadata.
    from app.models.user import User
    from app.models.post import Post

    # Register blueprints for endpoint groups.
    # Use postgres-backed endpoints in production.
    #from app.routes.post_routes import post_bp
    #app.register_blueprint(post_bp)

    #STATIC ENDPOINTS FOR TESTING
    # Fake in-memory routes can be used for local development or fallback.
    from app.routes.fake_routes import fake_bp
    app.register_blueprint(fake_bp)

    @app.route("/")
    def home():
        return "Database Connected"

    return app
