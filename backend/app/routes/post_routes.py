from flask import Blueprint, request, jsonify
from app import db
from app.models.post import Post
from app.models.user import User

post_bp = Blueprint("posts", __name__)

# CREATE USER (database persisted)
@post_bp.route("/users", methods=["POST"])
def create_user():
    data = request.get_json() or {}

    user = User(username=data.get("username"))

    db.session.add(user)
    db.session.commit()

    return jsonify(user.to_dict()), 201

# CREATE POST (database persisted)
@post_bp.route("/posts", methods=["POST"])
def create_post():
    data = request.get_json() or {}

    post = Post(
        title=data.get("title"),
        content=data.get("content"),
        image_url=data.get("image_url"),
        user_id=data.get("user_id")
    )

    db.session.add(post)
    db.session.commit()

    return jsonify(post.to_dict()), 201

# GET ALL POSTS
@post_bp.route("/posts", methods=["GET"])
def get_posts():
    posts = Post.query.all()

    results = [
        {
            "id": p.id,
            "title": p.title,
            "content": p.content,
            "image_url": p.image_url,
            "user_id": p.user_id,
            "created_at": p.created_at.isoformat() if p.created_at else None,
        }
        for p in posts
    ]

    return jsonify(results), 200

# GET A SINGLE POST
@post_bp.route("/posts/<int:post_id>", methods=["GET"])
def get_post(post_id):
    post = Post.query.get_or_404(post_id)

    return jsonify(post.to_dict()), 200

# DELETE A POST
@post_bp.route("/posts/<int:post_id>", methods=["DELETE"])
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)

    db.session.delete(post)
    db.session.commit()

    return jsonify({"message": "Post deleted"}), 200

# GET USER AS WELL AS THEIR POSTS
@post_bp.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get_or_404(user_id)

    posts_data = [post.to_dict() for post in user.posts]

    return jsonify({
        "id": user.id,
        "username": user.username,
        "posts": posts_data
    }), 200
