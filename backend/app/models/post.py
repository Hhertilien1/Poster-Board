from app import db
from datetime import datetime


class Post(db.Model):
    """Database model for posts."""

    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )
    view_count = db.Column(db.Integer, nullable=False, default=0)

    __table_args__ = (
        db.Index("idx_created_at", "created_at"),
        db.Index("idx_user_id", "user_id"),
    )

    def to_dict(self):
        timestamp = self.created_at.isoformat() if self.created_at else None
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "image_url": self.image_url,
            "user_id": self.user_id,
            "view_count": self.view_count,
            "created_at": timestamp,
            "uploaded_at": timestamp,
        }
