# Poster-Board

## Class Poster Board Project ECE - 618

## Architecture Overview

The project follows an **N-tier architecture**:

- **Presentation Tier**: Frontend UI (public browsing and poster upload)
- **Application Tier**: Flask API handling business logic and uploads
- **Data Tier**: PostgreSQL database (Cloud SQL) and Cloud Storage for images
- **Infrastructure Tier**: Docker, CI/CD, and Google Cloud Run

---

## Technology Stack

### Backend

- Python
- Flask
- SQLAlchemy
- PostgreSQL

### Frontend

- To be implemented (framework TBD)

### Infrastructure & Deployment

- Docker
- Google Cloud Run
- Google Cloud SQL (PostgreSQL)
- Google Cloud Storage
- GitHub Actions (CI/CD)

---

## Team Workflow

- This repository establishes **project structure only** during Sprint 0.
- Each team member works within their assigned folder:
  - Backend: `/backend`
  - Frontend: `/frontend`
  - DevOps / Deployment: `/infra`
  - Documentation & Diagrams: `/docs`

---

## Current Status

- Repository structure created
- Dependencies defined (`requirements.txt`)
- Implementation of backend logic, Docker configuration, frontend UI, and deployment will be completed in subsequent sprints.

---

## Sprint Goals

- **Sprint 0**: Repository structure, responsibilities, and planning
- **Sprint 1+**: Backend API, database models, uploads, deployment
