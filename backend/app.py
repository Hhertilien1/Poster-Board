"""Entry point for Flask-based backend service."""

from app import create_app

app = create_app()

if __name__ == "__main__":
    # Use a local development server; use gunicorn in production.
    app.run(debug=True)
