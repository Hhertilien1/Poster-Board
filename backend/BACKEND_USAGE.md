# Poster-Board

## Overview

Poster-Board is a full-stack event poster feed application.

* **Backend:** Flask + SQLAlchemy + PostgreSQL
* **Frontend:** Next.js + TypeScript + TanStack React Query
* **Mock data mode:** In-memory `fake_routes` for easy testing without a database

---

## Architecture

### `/backend` (API server)

* `app.py`
  Entry point that starts the Flask server.

* `app/__init__.py`
  Creates and configures the Flask app using the **app factory pattern**.
  Registers database and API routes (blueprints).

* `app/models/`
  Contains SQLAlchemy ORM models (`User`, `Post`) that define database tables.

* `app/routes/`
  Contains API route definitions (real database routes and fake/mock routes).

* `app/fake_data.py`
  Stores in-memory mock data used when running the app without PostgreSQL.

* `app/services/` *(optional structure)*
  Intended for business logic (not heavily used yet).

* `app/repositories/` *(optional structure)*
  Intended for database abstraction layer (not heavily used yet).

---

### Why are there multiple `__init__.py` files?

You will see `__init__.py` files in several folders like:

```text
app/
models/
routes/
services/
repositories/
```

These files exist because:

1. **They tell Python that a folder is a package**
   This allows imports like:

   ```python
   from app.models.user import User
   ```

2. **They enable clean project structure**
   Without them, Python may not recognize folders as modules in some environments.

3. **They support scalable architecture**
   Even if some are empty now, they make it easier to:

   * organize large projects
   * add logic later (e.g., shared imports, initialization code)

👉 In this project, only `app/__init__.py` contains real logic.
The others exist mainly for **structure and future scalability**.

---

## Running the Backend

1. Navigate to backend:

   ```
   cd backend
   ```

2. Create virtual environment:

   ```
   python -m venv venv
   ```

3. Activate it:

   ```
   .\venv\Scripts\activate
   ```

4. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

5. Create a `.env` file:

   ```
   DATABASE_URL=postgresql://username:password@localhost/posterboard
   ```

6. Run the server:

   ```
   python app.py
   ```

---

## API Endpoints

### Users

* `POST /users` → Create a user
* `GET /users/<id>` → Get user with posts

### Posts

* `GET /posts` → Get all posts
* `GET /posts/<id>` → Get a single post
* `POST /posts` → Create a post
* `DELETE /posts/<id>` → Delete a post

---

## Fake (Mock) API Mode

To run the backend **without PostgreSQL**:

1. Open:

   ```
   backend/app/__init__.py
   ```

2. Replace:

   ```python
   #from app.routes.post_routes import post_bp
   #app.register_blueprint(post_bp)
   ```

   with:

   ```python
   from app.routes.fake_routes import fake_bp
   app.register_blueprint(fake_bp)
   ```

### Behavior in Fake Mode

* Data is stored in Python lists (in-memory)
* No database setup required
* Data resets when the server restarts

This mode is useful for:

* demos
* testing API quickly
* avoiding PostgreSQL installation

---


## Development Notes

* Backend supports both:

  * **real database mode (PostgreSQL)**
  * **fake/mock mode (in-memory)**
* API responses are JSON formatted for frontend consumption
* Project structure follows scalable backend patterns (models/routes/services)

---

## TODO / Future Improvements

* Add migrations (Flask-Migrate / Alembic)
* Add input validation
* Add authentication & authorization
* Add automated testing (backend + frontend)
* Add CI/CD pipeline

---
