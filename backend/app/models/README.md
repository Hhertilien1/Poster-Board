# Backend Models

Database models are in `backend/app/models` and use SQLAlchemy ORM.

## User
- `id` (Integer, PK)
- `username` (String, unique, required)
- `created_at` (DateTime, default now)
- `posts` relationship to `Post` (cascade delete)

## Post
- `id` (Integer, PK)
- `title` (String, required)
- `content` (Text, required)
- `image_url` (Text, optional)
- `created_at` (DateTime, default now)
- `user_id` (FK to `users.id`, required)

## Indexes
- `idx_created_at` on `created_at`
- `idx_user_id` on `user_id`

## helper method
- `.to_dict()` available for easy JSON serialization.
