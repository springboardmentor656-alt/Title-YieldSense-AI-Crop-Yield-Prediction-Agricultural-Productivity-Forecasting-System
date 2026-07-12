# 🌾 YieldSense AI

> AI-powered Crop Yield Prediction and Agricultural Productivity Forecasting System

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

---

## 📋 Overview

YieldSense AI is a production-ready Web and Machine Learning platform designed to help farmers make intelligent, data-driven farming choices. By integrating historical agricultural data, live weather forecasts, soil characteristics, and machine learning models, the system predicts crop yields and recommends optimal crops to cultivate.

This codebase contains the complete implementation for **Milestone 1** (Core Software Foundation & Infrastructure) and **Milestone 2** (Machine Learning, Integration, and Advanced Services).

---

## 🚀 Milestone Features

### Milestone 1: Software Foundation & Core Infrastructure
*   🏗️ **Complete Software Foundation**: Setup a robust FastAPI backend and Next.js frontend with Tailwind CSS and TypeScript.
*   🔐 **Firebase Authentication Integration**: Client-side SDK and Backend Admin SDK validation (Signup, Login, Forgot Password, protected routes).
*   🚜 **Farm Management System**: Full CRUD capability for farm attributes (Area, Crop, Location) stored in Google Firestore.
*   🔔 **Notifications & Settings**: Infrastructure for farm notifications, settings pages, and user profile management.
*   🐳 **Containerization**: Backend Dockerfile, Frontend Dockerfile, and `docker-compose.yml` for multi-container orchestration.

### Milestone 2: Machine Learning & Intelligent Services
*   🧠 **Dual Machine Learning Pipelines**: Independent pipelines for classification (crop recommendation) and regression (yield prediction).
*   📊 **Automated Model Selection**: Evaluates 5 different algorithms for classification and regression, generating comparison matrices and saving the best-performing models dynamically.
*   📈 **KNN Hyperparameter Tuning**: Automatically conducts KNN elbow curve searches (plotting accuracy/$R^2$ scores vs. $k$-neighbors) to train with optimal parameters.
*   🛡️ **Agronomic Boundary Safety Overrides**: Implements strict physical rule overrides inside the prediction engine to force a 0.0 tons/ha output in unviable growing conditions (e.g., freezing temperature, extreme drought, extreme soil pH, or severe nutrient depletion).
*   🌤️ **Live Weather Integration**: Connects with the Open-Meteo API to fetch current weather conditions and 7-day daily forecasts with caching to optimize performance.
*   🌱 **Soil Health Analysis**: Rule-based soil health evaluation assessing NPK ratings, pH status, and crop-specific suitability.
*   🖥️ **Interactive Dashboards**: Live pages for Predictions, Weather monitoring, and Soil analysis connected to the FastAPI endpoints.

---

## 🏗️ Architecture

```
┌─────────────────────────┐     ┌──────────────────────────┐
│   Frontend (Next.js)    │────▶│   Backend (FastAPI)      │
│   Local / Vercel Host   │     │   Local / Render Host    │
│                         │     │                          │
│  • React 19 + TypeScript│     │  • REST API (v1)         │
│  • Tailwind CSS v4      │     │  • Firebase Admin SDK    │
│  • Firebase Client SDK  │     │  • ML Inference Engine   │
│  • App Router           │     │  • Open-Meteo Weather    │
└─────────────────────────┘     └──────────────────────────┘
         │                                │
         │         ┌──────────────┐       │
         └────────▶│   Firebase   │◀──────┘
                   │              │
                   │  • Auth      │
                   │  • Firestore │
                   │  • Storage   │
                   └──────────────┘
```

---

## 📁 Folder Structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py              # Auth and Firestore injectables
│   │   │   └── v1/
│   │   │       ├── auth.py          # Firebase Auth endpoints
│   │   │       ├── farms.py         # Farm collection CRUD operations
│   │   │       ├── prediction.py    # Yield prediction & Crop recommendation routes
│   │   │       ├── weather.py       # Weather data and forecasts
│   │   │       ├── soil.py          # Soil analysis endpoints
│   │   │       └── router.py        # v1 Aggregator
│   │   ├── core/
│   │   │   └── config.py            # Pydantic environment configurations
│   │   ├── services/
│   │   │   ├── weather_service.py   # Open-Meteo client wrapper with caching
│   │   │   ├── soil_service.py      # NPK & pH suitability checker
│   │   │   └── prediction_service.py# E2E prediction orchestrator
│   │   └── schemas/                 # Request/Response validation schemas
│   ├── datasets/
│   │   ├── raw/                     # Original CSV files (Crop_recommendation, yield_df, sample_crop_data)
│   │   └── processed/               # Preprocessing output (cleaned & encoded files)
│   ├── ml/
│   │   ├── utils/
│   │   │   └── config.py            # Path & model feature configs
│   │   ├── inference/
│   │   │   └── predictor.py         # Singleton predictor loading .joblib artifacts
│   │   └── train.py                 # ML training orchestrator CLI
│   ├── test_api.py                  # API integration test suite
│   ├── requirements.txt
│   └── main.py                      # FastAPI App entrypoint
├── frontend/
│   ├── src/
│   │   ├── app/                     # Next.js App Router structure
│   │   │   └── (dashboard)/
│   │   │       ├── prediction/      # Interactive AI Yield Prediction Page
│   │   │       ├── weather/         # 7-day Weather Forecast Page
│   │   │       └── soil/            # Soil Analysis & Recommendations Page
│   │   ├── services/                # API client calls (predictionService, etc.)
│   │   └── utils/
│   │       └── constants.ts         # Constant crop/season lists matching ML categories
│   ├── package.json
│   └── tailwind.config.ts
└── README.md
```

---

## 📁 Milestone File Mapping

The following structure outlines which files were created and implemented for each milestone:

### Milestone 1 Files (Core Foundation)
*   **Backend Core & Config**: [backend/app/core/config.py](file:///d:/ANUBHAB/b_Projects/Infosys_AI_crop/Demo_3/backend/app/core/config.py), [backend/app/core/security.py](file:///d:/ANUBHAB/b_Projects/Infosys_AI_crop/Demo_3/backend/app/core/security.py), [backend/app/firebase/client.py](file:///d:/ANUBHAB/b_Projects/Infosys_AI_crop/Demo_3/backend/app/firebase/client.py)
*   **Database & Firebase Integration**: [backend/app/firebase/firestore.py](file:///d:/ANUBHAB/b_Projects/Infosys_AI_crop/Demo_3/backend/app/firebase/firestore.py)
*   **Domain Models & CRUD Services**: `backend/app/models/farm.py`, `backend/app/models/user.py`, `backend/app/services/farm_service.py`, `backend/app/services/auth_service.py`, `backend/app/services/user_service.py`
*   **API Routers**: `backend/app/api/v1/auth.py`, `backend/app/api/v1/farms.py`, `backend/app/api/v1/users.py`, `backend/app/api/v1/notifications.py`
*   **Deployment Setup**: `backend/Dockerfile`, `frontend/Dockerfile`, `docker-compose.yml`
*   **Frontend Authentication & CRUD Views**: `frontend/src/app/(auth)/login/page.tsx`, `frontend/src/app/(auth)/signup/page.tsx`, `frontend/src/app/(auth)/forgot-password/page.tsx`, `frontend/src/app/(dashboard)/farms/page.tsx`, `frontend/src/app/(dashboard)/farms/new/page.tsx`
*   **Auth Context & Services**: `frontend/src/contexts/AuthContext.tsx`, `frontend/src/services/authService.ts`, `frontend/src/services/farmService.ts`

### Milestone 2 Files (Machine Learning & Advanced Services)
*   **ML Pipeline & Runner**: [backend/ml/train.py](file:///d:/ANUBHAB/b_Projects/Infosys_AI_crop/Demo_3/backend/ml/train.py), `backend/ml/preprocessing/`, `backend/ml/training/`, `backend/ml/evaluation/`, `backend/ml/utils/config.py`
*   **Model Inference Engine**: [backend/ml/inference/predictor.py](file:///d:/ANUBHAB/b_Projects/Infosys_AI_crop/Demo_3/backend/ml/inference/predictor.py)
*   **Data Preprocessing Pipeline**: `backend/preprocessing/process.ipynb`, `backend/preprocessing/run_preprocess.py`
*   **Weather, Soil, & Prediction Services**: `backend/app/services/weather_service.py`, `backend/app/services/soil_service.py`, `backend/app/services/prediction_service.py`
*   **Prediction, Weather, & Soil APIs**: `backend/app/api/v1/prediction.py`, `backend/app/api/v1/weather.py`, `backend/app/api/v1/soil.py`, `backend/app/schemas/prediction.py`
*   **API Test Suite**: [backend/test_api.py](file:///d:/ANUBHAB/b_Projects/Infosys_AI_crop/Demo_3/backend/test_api.py)
*   **Interactive Frontend Pages**: `frontend/src/app/(dashboard)/prediction/page.tsx`, `frontend/src/app/(dashboard)/weather/page.tsx`, `frontend/src/app/(dashboard)/soil/page.tsx`
*   **Prediction Service Callouts**: `frontend/src/services/predictionService.ts`, `frontend/src/types/prediction.ts`

---

## 🧠 Machine Learning Engine

YieldSense AI employs a modular machine learning pipeline built on `scikit-learn` and `joblib`. The models are trained on processed versions of the dataset generated by reproducing the steps in `process.ipynb`.

### 1. Crop Recommendation (Classification)
*   **Dataset**: `Crop_recommendation_processed.csv` (2,200 rows)
*   **Goal**: Classify the optimal crop to cultivate based on Nitrogen (`N`), Phosphorus (`P`), Potassium (`K`), temperature, humidity, pH, and rainfall.
*   **Algorithms Evaluated**: Logistic Regression, Decision Tree (Gini), Decision Tree (Entropy), Random Forest Classifier, and KNN Classifier.
*   **KNN Optimization**: Ran an elbow search (1 to 15 $k$-neighbors) yielding an optimal parameter of **$k=3$**.
*   **Performance Result**: **Random Forest** achieved the highest test accuracy of **0.9932** (Weighted F1: 0.9932).
*   **Saved Artifacts**: `crop_best_model.joblib`, `crop_scaler.joblib`, and metadata.
*   **Comparison Outputs**: Saved under `backend/ml/models/saved/plots/`:
    *   `crop_knn_elbow.png`
    *   `crop_model_comparison.png`
    *   `crop_confusion_matrix.png`

### 2. Crop Yield Prediction (Regression)
*   **Dataset**: `yield_df_processed.csv` (25,932 rows, 114 columns)
*   **Goal**: Predict the yield in tons/hectare using environmental parameters (temperature, rainfall, pesticide tonnage) and location/crop categories.
*   **Algorithms Evaluated**: Multiple Linear Regression, Decision Tree (criterion='squared_error'), Decision Tree (criterion='friedman_mse'), Random Forest Regressor, and KNN Regressor.
*   **KNN Optimization**: Ran an elbow search (1 to 15 $k$-neighbors) yielding an optimal parameter of **$k=2$**.
*   **Performance Result**: **KNN Regressor (tuned)** achieved the highest $R^2$ score of **0.9860** on the test set.
*   **Saved Artifacts**: `yield_best_model.joblib`, `yield_scaler.joblib`, `yield_feature_columns.joblib`, and metadata.
*   **Comparison Outputs**: Saved under `backend/ml/models/saved/plots/`:
    *   `yield_knn_elbow.png`
    *   `yield_model_comparison.png`
    *   `yield_actual_vs_predicted.png`

### 3. Agronomic Safety Overrides
To prevent false-positive predictions under impossible environmental conditions (a limitation of standard ML models), a rule-based layer intercepts inputs. The system instantly returns `0.0` tons/ha yield with `High` confidence if any of the following boundaries are breached:
*   🌧️ **Extreme Drought**: `annual_rainfall` < 50.0 mm
*   🌡️ **Extreme Temperature**: `temperature` < 5.0°C or > 48.0°C
*   🧪 **Extreme Soil pH**: `soil_ph` < 4.0 or > 9.5
*   📉 **Severe Nutrient Depletion**: Nitrogen, Phosphorus, and Potassium all < 5.0 kg/ha

---

## 🔌 API Documentation

### 1. Predict Yield
*   **URL**: `/api/v1/prediction/predict-yield`
*   **Method**: `POST`
*   **Payload**:
    ```json
    {
      "crop": "Rice",
      "season": "Kharif",
      "state": "Uttar Pradesh",
      "area": 10.0,
      "temperature": 28.5,
      "annual_rainfall": 1200.0,
      "humidity": 70.0,
      "soil_ph": 6.5,
      "nitrogen": 80.0,
      "phosphorus": 40.0,
      "potassium": 38.0,
      "fertilizer_usage": 180.0,
      "pesticide_usage": 12.5,
      "latitude": 28.6139,
      "longitude": 77.2090
    }
    ```
*   **Response**:
    ```json
    {
      "predicted_yield": 3.607,
      "prediction_unit": "tons/hectare",
      "total_production": 36.07,
      "crop": "Rice",
      "area": 10.0,
      "season": "Kharif",
      "model_used": "KNN Regressor (tuned)",
      "model_accuracy": 0.986,
      "confidence": "High",
      "weather_summary": {
        "temperature": 29.6,
        "humidity": 85.0,
        "rainfall": 0.0,
        "wind_speed": 2.7,
        "description": "Mainly clear",
        "source": "Open-Meteo"
      },
      "soil_summary": {
        "health_score": 100.0,
        "health_label": "Excellent",
        "ph_status": "Neutral",
        "warnings": [],
        "suggestions": ["Soil conditions are generally favorable for cultivation"]
      },
      "prediction_timestamp": "2026-07-12T17:44:37.452364+00:00"
    }
    ```

### 2. Recommend Crop
*   **URL**: `/api/v1/prediction/recommend-crop`
*   **Method**: `POST`
*   **Payload**:
    ```json
    {
      "nitrogen": 90.0,
      "phosphorus": 45.0,
      "potassium": 35.0,
      "temperature": 24.5,
      "humidity": 82.0,
      "soil_ph": 6.8,
      "annual_rainfall": 1000.0
    }
    ```
*   **Response**:
    ```json
    {
      "recommended_crop": "Rice",
      "top_recommendations": [
        { "crop": "Rice", "confidence": 92.0 },
        { "crop": "Jute", "confidence": 8.0 },
        { "crop": "Pomegranate", "confidence": 0.0 }
      ],
      "model_used": "Random Forest",
      "model_accuracy": 0.9932
    }
    ```

### 3. Soil Analysis
*   **URL**: `/api/v1/soil/analyze`
*   **Method**: `POST`
*   **Request**: `soil_ph`, `nitrogen`, `phosphorus`, `potassium`, `crop` (optional)
*   **Response**: Overall health score (0-100), nutrient status classification, warnings, and improvement suggestions.

### 4. Weather Forecast
*   **URL**: `/api/v1/weather/forecast`
*   **Method**: `GET`
*   **Params**: `lat` (latitude), `lon` (longitude)
*   **Response**: Cached current conditions and 7-day forecast.

---

## ⚙️ Project Setup & Configuration

### Prerequisites
*   Python 3.10+
*   Node.js 18+

### Environment Configuration
The backend and frontend connect to resources using local configurations. Create the environment files using `.env.example` templates to avoid leaking credentials.

#### Backend Env (`backend/.env`):
```ini
PROJECT_NAME="YieldSense AI"
VERSION="1.0.0"
API_V1_STR="/api/v1"

# Firebase Config (Populate locally with your emulator or sandbox credentials)
FIREBASE_DATABASE_URL="https://your-project.firebaseio.com"
FIREBASE_STORAGE_BUCKET="your-project.appspot.com"

# Weather Configuration
WEATHER_CACHE_TTL=3600
```

#### Frontend Env (`frontend/.env.local`):
```ini
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api/v1"

# Firebase Client SDK Configuration (Populate with sandbox project identifiers)
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="12345678"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123:web:abc"
```

### Running Locally

#### 1. Start FastAPI Backend
```bash
cd backend
# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate      # Windows
source venv/bin/activate   # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Run model training pipeline
python -m ml.train

# Start the uvicorn development server
uvicorn main:app --reload --port 8000
```

#### 2. Start Next.js Frontend
```bash
cd frontend
# Install packages
npm install

# Start the development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application interface.

#### 3. Run API Tests
```bash
cd backend
# Verify all endpoints and ML predictions
python test_api.py
```

---

## 🚀 Repository & Deployment Note

*   **Security Check**: All Firestore JSON keys, Firebase private tokens, and `.env` variables are strictly ignored by `.gitignore` to prevent credentials from being exposed on GitHub.
*   **Deployment Target**: The current active branch for development is `anubhab-mishra`. No pushes should be made directly to the `main` branch to prevent deployment conflicts.
*   **Commit/Push Rule**: Changes are validated and run locally. Pushes to remote repository branches will only be triggered when explicitly requested by the project developer.
