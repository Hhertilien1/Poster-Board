# Backend Tests

This directory is reserved for unit/integration tests for the backend API.

## Suggested test tools
- `pytest` (already in `requirements.txt`)
- `pytest-flask` or `flask-testing` for app fixtures

## Early tests to add
- `test_fake_routes.py`: fake list/post/get/delete behavior
- `test_post_routes.py`: SQLAlchemy end-to-end with a test DB
- `test_models.py`: User/Post validations and relationship cascades

## Running tests

```
cd backend
pip install -r requirements.txt
pytest
```

## Current status
- No tests implemented yet; add tests before production deployment.
