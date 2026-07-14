# YieldSense AI: Crop Yield Prediction & Agricultural Productivity Forecasting System

**Developer**: Tirutopu Srivardhan  
**Milestone Status**: Milestone 1 & 2 Complete

YieldSense AI is an AI-powered crop yield prediction platform designed to help farmers and agricultural organizations estimate future crop production using historical farming data, weather conditions, and soil characteristics.

---

## 📋 Project Milestones Status

### 🌾 Milestone 1: Foundation & Core Setup (Complete)
- **Environments Scaffolded**: Decoupled Python FastAPI backend and Next.js (React) frontend.
- **Relational PostgreSQL Schema**: Created tables for `users` (auth), `farms` (metadata, coordinates, soil pH), and `crops` (planted share).
- **Authentication**: Stateless JSON Web Tokens (JWT) using `PyJWT` and bcrypt password hashing.
- **Data Preprocessing**: Implemented standard tabular preprocessing (`preprocess.py`) to clean, handle missing features, and filter outliers from raw agricultural sheets.
- **Modern User Dashboards**: Designed premium glassmorphism layouts matching structural roles (Farmer, Admin, Consultant, Researcher, Department).

### 🤖 Milestone 2: Yield Prediction & Analysis (Complete)
- **Tabular ML Model**: Trained an **XGBoost Regressor** (`XGBRegressor`) on 200 cleaned data records mapping input features (`avg_temp`, `average_rain_fall_mm_per_year`, `ph`) to the target crop yield.
- **Model Metrics Logged**: Prints performance error metrics on training completion:
  - **Mean Absolute Error (MAE)**: `429.02 kg/ha`
  - **Root Mean Square Error (RMSE)**: `558.22 kg/ha`
  - **Feature Importance Analysis**: Analyzes variables mathematically (`rainfall`: ~41%, `ph`: ~35%, `avg_temp`: ~23%).
- **Predict Endpoint**: Exposed `/api/v1/predict-yield` POST route loaded from serialized model weights (`crop_yield_model.pkl`).
- **Interactive UI Forms**: Fully wired the Farmer Dashboard form to perform asynchronous forecast queries, dynamically rendering estimations and assessments in real-time.

---

## 🚀 How to Run the Project

### 1. Run the Backend API (FastAPI)
```bash
# Navigate to the backend directory
cd YieldSenseAI/backend

# Activate the virtual environment
.\venv\Scripts\Activate.ps1

# Run the server
uvicorn app.main:app --reload --port 8000
```
* **API Documentation**: Available at `http://127.0.0.1:8000/docs` (Swagger UI).
* **Health Endpoint**: Test at `http://127.0.0.1:8000/api/v1/health`.

### 2. Run the Frontend UI (Next.js)
```bash
# Navigate to the frontend directory
cd YieldSenseAI/frontend

# Install dependencies (first time only)
npm install

# Start the dev server
npm run dev
```
* Navigate your browser to `http://localhost:3000` to view the platform, access the role dashboards, and test the forecasting model!

---

## 🚫 Git Compliance
The repository has been configured via `.gitignore` to exclude raw Python bytecodes (`__pycache__/`), next.js build files (`.next/`), virtual environments (`venv/`), and large machine learning model binaries (`*.pkl`/`*.h5`) to keep the codebase lightweight and clean.