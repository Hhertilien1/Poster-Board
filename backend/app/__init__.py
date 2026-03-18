from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

load_dotenv()

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    
    from app.models.user import User
    from app.models.post import Post
    
    ##Actual routes from postgres database
    #from app.routes.post_routes import post_bp
    #app.register_blueprint(post_bp)
    
    from app.routes.fake_routes import fake_bp
    app.register_blueprint(fake_bp)
    
    @app.route("/")
    def home():
        return "Database Connected"

    return app


