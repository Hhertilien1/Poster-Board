from flask import Blueprint, jsonify, request
from datetime import datetime
from app.fake_data import users, posts
from app.services.image_processing import normalize_image_data_url

fake_bp = Blueprint("fake", __name__)

# GET all posts (in-memory)
@fake_bp.route("/posts", methods=["GET"])
def get_posts():
    return jsonify(posts)

# GET one post by id
@fake_bp.route("/posts/<int:post_id>", methods=["GET"])
def get_post(post_id):
    for post in posts:
        if post["id"] == post_id:
            return jsonify(post)
    return jsonify({"error": "Post not found"}), 404

# GET user with their posts
@fake_bp.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = next((u for u in users if u["id"] == user_id), None)

    if not user:
        return jsonify({"error": "User not found"}), 404

    user_posts = [p for p in posts if p["user_id"] == user_id]

    return jsonify({
        "id": user["id"],
        "username": user["username"],
        "created_at": user.get("created_at"),
        "posts": user_posts
    })


# LOOK UP USERS (optionally by username)
@fake_bp.route("/users", methods=["GET"])
def get_users():
    username = (request.args.get("username") or "").strip()
    query = (request.args.get("query") or "").strip()

    if username:
        match = next((u for u in users if u["username"].lower() == username.lower()), None)
        if not match:
            return jsonify({"error": "User not found"}), 404
        return jsonify(match), 200

    if query:
        matches = [u for u in users if query.lower() in u["username"].lower()]
        results = [
            {
                "id": user["id"],
                "username": user["username"],
                "created_at": user.get("created_at"),
                "posts": [post for post in posts if post["user_id"] == user["id"]],
            }
            for user in matches
        ]
        return jsonify(results), 200

    return jsonify(users), 200

# CREATE post (fake, does not persist across service restarts)
@fake_bp.route("/posts", methods=["POST"])
def create_post():
    data = request.get_json() or {}
    user_id = data.get("user_id")

    if not isinstance(user_id, int):
        return jsonify({"error": "user_id must be an integer"}), 400

    user = next((u for u in users if u["id"] == user_id), None)
    if not user:
        return jsonify({"error": "User not found"}), 404

    image_url = data.get("image_url")
    try:
        normalized_image_url = normalize_image_data_url(image_url)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    created_at = datetime.utcnow().isoformat()

    new_post = {
        "id": len(posts) + 1,
        "title": data.get("title"),
        "content": data.get("content"),
        "image_url": normalized_image_url,
        "user_id": user_id,
        "created_at": created_at,
        "uploaded_at": created_at,
    }

    posts.append(new_post)

    return jsonify(new_post), 201

# DELETE fake post
@fake_bp.route("/posts/<int:post_id>" , methods=["DELETE"])
def delete_post(post_id):
    for i, post in enumerate(posts):
        if post["id"] == post_id:
            deleted_post = posts.pop(i)
            return jsonify({
                "message" : "Post deleted",
                "post": deleted_post
            }), 200

    return jsonify({"error": "Post not found"}), 404

# CREATE user (fake)
@fake_bp.route("/users", methods=["POST"])
def create_user():
    data = request.get_json() or {}
    username = (data.get("username") or "").strip()

    if not username:
        return jsonify({"error": "Username is required"}), 400

    existing = next((u for u in users if u["username"].lower() == username.lower()), None)
    if existing:
        return jsonify({"error": "Username already exists"}), 409

    new_user = {
        "id": len(users) + 1,
        "username": username,
        "created_at": datetime.utcnow().isoformat(),
    }

    users.append(new_user)

    return jsonify(new_user), 201
