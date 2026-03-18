from flask import Blueprint, request, jsonify
from app import db
from app.models.post import Post
from app.models.user import User

post_bp = Blueprint("posts", __name__)

# CREATE USER
@post_bp.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()

    user = User(username=data["username"])

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "id": user.id,
        "username": user.username
    }), 201


# CREATE POST
@post_bp.route("/posts", methods=["POST"])
def create_post():
    data = request.get_json()

    post = Post(
        title=data["title"],
        content=data["content"],
        image_url=data.get("image_url"),
        user_id=data["user_id"]
    )

    db.session.add(post)
    db.session.commit()

    return jsonify({
        "id": post.id,
        "title": post.title,
        "content": post.content
    }), 201


# GET ALL POSTS
@post_bp.route("/posts", methods=["GET"])
def get_posts():
    posts = Post.query.all()

    results = []

    for post in posts:
        results.append({
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "user_id": post.user_id
        })


#GET A SINGLE POST
@post_bp.route("/posts/<int:post_id>", methods =["GET"])
def get_post(post_id):
    post = Post.query.get_or_404(post_id)
    
    return jsonify({
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "user_id": post.user_id
    })
    
#DELETE A POST
@post_bp.route("/posts/<int:post_id>", methods=["DELETE"])
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)

    db.session.delete(post)
    db.session.commit()

    return jsonify({"message": "Post deleted"})

#GET USER AS WELL AS SHOWING THEIR POSTS
@post_bp.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get_or_404(user_id)

    posts = []
    for post in user.posts:
        posts.append({
            "id": post.id,
            "title": post.title,
            "content": post.content
        })

    return jsonify({
        "id": user.id,
        "username": user.username,
        "posts": posts
    })
    
    

    return jsonify(results)