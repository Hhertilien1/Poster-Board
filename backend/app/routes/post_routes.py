from flask import Blueprint, request, jsonify
from app import db
from app.models.post import Post
from app.models.user import User
from app.services.image_processing import normalize_image_data_url

post_bp = Blueprint("posts", __name__)

# CREATE USER (database persisted)
@post_bp.route("/users", methods=["POST"])
def create_user():
    data = request.get_json() or {}
    username = (data.get("username") or "").strip()

    if not username:
        return jsonify({"error": "Username is required"}), 400

    existing = User.query.filter(db.func.lower(User.username) == username.lower()).first()
    if existing:
        return jsonify({"error": "Username already exists"}), 409

    user = User(username=username)

    db.session.add(user)
    db.session.commit()

    return jsonify(user.to_dict()), 201

# CREATE POST (database persisted)
@post_bp.route("/posts", methods=["POST"])
def create_post():
    data = request.get_json() or {}
    user_id = data.get("user_id")

    if not isinstance(user_id, int):
        return jsonify({"error": "user_id must be an integer"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    image_url = data.get("image_url")
    try:
        normalized_image_url = normalize_image_data_url(image_url)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    post = Post(
        title=data.get("title"),
        content=data.get("content"),
        image_url=normalized_image_url,
        user_id=user_id
    )

    db.session.add(post)
    db.session.commit()

    return jsonify(post.to_dict()), 201

# GET ALL POSTS
@post_bp.route("/posts", methods=["GET"])
def get_posts():
    # Atomically increment view_count for all posts
    db.session.query(Post).update(
        {Post.view_count: Post.view_count + 1},
        synchronize_session=False
    )
    db.session.commit()
    
    posts = Post.query.all()
    return jsonify([post.to_dict() for post in posts]), 200

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
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "posts": posts_data
    }), 200


# LOOK UP USERS (optionally by username)
@post_bp.route("/users", methods=["GET"])
def get_users():
    username = (request.args.get("username") or "").strip()
    query = (request.args.get("query") or "").strip()

    if username:
        user = User.query.filter(db.func.lower(User.username) == username.lower()).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user.to_dict()), 200

    if query:
        users = (
            User.query
            .filter(User.username.ilike(f"%{query}%"))
            .order_by(User.username.asc())
            .all()
        )
        return jsonify([
            {
                "id": user.id,
                "username": user.username,
                "created_at": user.created_at.isoformat() if user.created_at else None,
                "posts": [post.to_dict() for post in user.posts],
            }
            for user in users
        ]), 200

    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200
