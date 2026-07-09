# System Architecture - YieldSense AI

## 1. Core Stack
- **Frontend**: Next.js (React) + Tailwind CSS (configured for v3 with custom glassmorphism styling).
- **Backend**: Python FastAPI (selected for speed, async efficiency, and native ML integrations).
- **Database**: 
  - **PostgreSQL**: For relational, structured entity storage (Users, Farms, Crops).
  - **MongoDB**: For unstructured, high-frequency, or flexible storage (weather records, soil profiles, and model prediction logs).
- **Authentication**: Stateless JSON Web Tokens (JWT) using `PyJWT` and `passlib` for password hashing.

## 2. System Architecture Design
```
       +---------------------------------------------+
       |             Next.js Frontend                |
       |  - UI Pages (Landing, Login, Dashboard)      |
       |  - JWT token storage in Session/Local Storage|
       +----------------------+----------------------+
                              |
                     HTTPS Requests / JSON
                              |
                              v
       +----------------------+----------------------+
       |             FastAPI Backend                 |
       |  - /api/v1/auth (Registration, Login)       |
       |  - /api/v1/health (Health check)            |
       |  - Data preprocessing pipeline scripts       |
       |  - ML Inference engines (Scikit-Learn/XGBoost)|
       +------------------+---------------+----------+
                          |               |
               SQLAlchemy |               | Motor Driver
                          v               v
           +--------------+---+       +---+--------------+
           |    PostgreSQL    |       |     MongoDB      |
           |  (Structured DB) |       |  (ML/Unstructured)|
           +------------------+       +------------------+
```

## 3. Communication Workflows
1. **User Authentication**: Client posts credentials to `/api/v1/auth/token` -> Backend validates and signs JWT -> Client receives and stores JWT.
2. **Data Processing**: Preprocessing script (`preprocess.py`) runs tabular data through cleaning sequences -> Exports cleaned datasets for ML models.
3. **ML Inference (Future)**: Cleaned features are passed to trained regression models (like XGBoost) -> Inference returns predicted crop yield to the frontend.
