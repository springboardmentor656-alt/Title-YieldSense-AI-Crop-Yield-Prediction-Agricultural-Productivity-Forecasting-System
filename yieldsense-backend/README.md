# YieldSense AI — Backend (Milestone 1)

FastAPI service providing auth, farm profiles, and the data preprocessing
pipeline described in the Milestone 1 blueprint.

## Setup

```bash
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env          # then fill in real DATABASE_URL / JWT_SECRET_KEY
```

Create the database (adjust names as needed):

```bash
createdb yieldsense_db
```

The schema is applied automatically on startup, or manually via:

```bash
psql -U yieldsense_user -d yieldsense_db -f schema.sql
```

## Run

```bash
uvicorn main:app --reload
```

- Swagger docs: http://127.0.0.1:8000/docs
- Health check: http://127.0.0.1:8000/api/v1/health

## Endpoints (Milestone 1)

| Method | Path                     | Auth      | Description              |
|--------|--------------------------|-----------|---------------------------|
| GET    | /api/v1/health           | none      | Liveness check             |
| POST   | /api/v1/auth/register    | none      | Create account, returns JWT |
| POST   | /api/v1/auth/login       | none      | Returns JWT                |
| POST   | /api/v1/farms            | Bearer    | Create a farm profile      |
| GET    | /api/v1/farms            | Bearer    | List the caller's farms    |
| GET    | /api/v1/farms/{id}       | Bearer    | Get one farm (owner/Admin) |

## Data pipeline

```bash
python preprocess.py
```

Expects a raw CSV at `data/raw/crop_yield_raw.csv`
(e.g. the Kaggle Crop Yield Prediction dataset) and writes a cleaned
version to `data/processed/crop_yield_clean.csv`.
