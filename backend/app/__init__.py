from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
import os

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    """Create and configure the Flask application instance."""
    app = Flask(__name__)

    CORS(app)

    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL environment variable is required")

    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    migrate.init_app(app, db)

    from app.models.user import User
    from app.models.post import Post

    #from app.routes.fake_routes import fake_bp
    #app.register_blueprint(fake_bp)
    
    from app.routes.post_routes import post_bp
    app.register_blueprint(post_bp)
    
    @app.route("/")
    def home():
        return "Database Connected"

    return app
