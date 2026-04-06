FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8080
CMD sh -c "python -c 'from app import create_app, db; app = create_app(); \
  app.app_context().push(); db.create_all()' && \
  gunicorn --bind 0.0.0.0:8080 wsgi:app"
