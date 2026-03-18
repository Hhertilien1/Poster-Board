from flask import Blueprint, jsonify, request
from app.fake_data import users, posts

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
        "posts": user_posts
    })

# CREATE post (fake, does not persist across service restarts)
@fake_bp.route("/posts", methods=["POST"])
def create_post():
    data = request.get_json() or {}

    new_post = {
        "id": len(posts) + 1,
        "title": data.get("title"),
        "content": data.get("content"),
        "user_id": data.get("user_id")
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

    new_user = {
        "id": len(users) + 1,
        "username": data.get("username")
    }

    users.append(new_user)

    return jsonify(new_user), 201
