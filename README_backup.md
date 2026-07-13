# YieldSense AI - Milestone 1

This folder contains the Week 1-2 foundation deliverable for YieldSense AI.

## Completed Outcomes

- Agricultural forecasting workflow defined through backend routes and frontend onboarding flow.
- PostgreSQL schema included in `backend/schema.sql`.
- FastAPI backend scaffold includes Swagger docs, health check, register, login, JWT auth, RBAC-ready user payloads, farm creation, and crop creation.
- Database persistence is implemented with a PostgreSQL `DATABASE_URL`; SQLite is used automatically for local demos when PostgreSQL is not configured.
- Data preprocessing pipeline is implemented in `backend/preprocess.py`.
- Sample raw crop-yield data is included in `backend/data/raw/crop_yield_raw.csv`.
- Frontend UI shell is implemented with Next.js, TypeScript, Tailwind CSS, and Lucide icons.
- Mandatory UI views are represented: authentication, farm onboarding grid, dashboard yield placeholders, climate risk alerts, and feature coefficient placeholders.

## Project Structure

```text
yieldsense-milestone1/
  backend/
    app/
      auth_handler.py
      db.py
      models.py
    data/
      raw/crop_yield_raw.csv
      processed/
    main.py
    preprocess.py
    requirements.txt
    schema.sql
  frontend/
    app/
      globals.css
      layout.tsx
      page.tsx
    package.json
    tailwind.config.ts
    tsconfig.json
```

## Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Open:

- Health check: `http://127.0.0.1:8000/api/v1/health`
- Swagger docs: `http://127.0.0.1:8000/docs`

## PostgreSQL Setup

Create a PostgreSQL database, then set:

```bash
set DATABASE_URL=postgresql://postgres:password@localhost:5432/yieldsense
```

The backend applies `schema.sql` during startup. If `DATABASE_URL` is not set, the backend uses `yieldsense_dev.db` for local demonstration.

## Auth Test Payloads

Register:

```bash
curl -X POST http://127.0.0.1:8000/api/v1/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"farmer@yieldsense.ai\",\"password\":\"password123\",\"role\":\"Farmer\"}"
```

Login:

```bash
curl -X POST http://127.0.0.1:8000/api/v1/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"farmer@yieldsense.ai\",\"password\":\"password123\"}"
```

## Data Pipeline

```bash
cd backend
python preprocess.py
```

Expected output:

```text
data/processed/crop_yield_clean.csv
```

The script imputes missing temperature/rainfall/pH values and removes invalid rainfall or pH records.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Milestone 1 Sign-Off Checklist

- Backend starts without import errors.
- `GET /api/v1/health` returns a healthy status.
- `POST /api/v1/register` returns a JWT.
- `POST /api/v1/login` returns a JWT.
- Farm profile and crop routes are protected by bearer token auth.
- SQL schema includes `users`, `farms`, and `crops`.
- `data/processed/crop_yield_clean.csv` is created by the preprocessing script.
- Frontend shows authentication, farm onboarding, dashboard shell, climate risk, and placeholder ML panels.
