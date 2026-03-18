from app import db
from datetime import datetime


class User(db.Model):
    """Database model for users."""

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    posts = db.relationship(
        "Post",
        backref="author",
        cascade="all, delete",
        lazy=True
    )

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
