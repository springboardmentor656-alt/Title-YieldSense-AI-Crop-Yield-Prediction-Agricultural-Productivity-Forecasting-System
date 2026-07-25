# 🌾 YieldSense AI

An AI-powered Crop Yield Prediction and Agricultural Decision Support System built using **Next.js, FastAPI, PostgreSQL, and XGBoost**. The application helps farmers predict crop yield using soil parameters, weather conditions, and machine learning while providing actionable farming recommendations and analytics.

---

## 🚀 Features

### 🔐 Authentication
- User Registration
- Secure Login
- JWT-based Authentication
- Password Hashing

### 🚜 Farm Management
- Register Farm Details
- Store Crop & Soil Information
- Manage Farm Records

### 🤖 AI Yield Prediction
- XGBoost Machine Learning Model
- Crop Yield Prediction (kg/ha)
- Yield Potential Classification
- Risk Level Assessment

### 🌱 Soil Analysis
- Soil Health Assessment
- pH Analysis
- Nitrogen, Phosphorus & Potassium Analysis
- Fertilizer Recommendations
- Irrigation Suggestions
- Crop Suitability Analysis

### ☁️ Weather Analysis
- Live Weather Data using Open-Meteo API
- Temperature
- Humidity
- Rainfall
- Wind Speed
- Pressure
- Weather Condition Analysis

### 📊 Analytics Dashboard
- Yield Prediction Reports
- Productivity Analytics
- Seasonal Performance
- Farm Comparison Reports
- Interactive Charts
- Agricultural Insights Summary

### 💡 AI Recommendations
- Crop Planning Suggestions
- Farming Recommendations
- Resource Optimization Advice
- Risk Mitigation Guidance

---

# 🏗️ System Architecture

```
                +----------------+
                |   Next.js UI   |
                +--------+-------+
                         |
                  REST API Calls
                         |
                +--------v-------+
                |    FastAPI     |
                +--------+-------+
                         |
         +---------------+----------------+
         |                                |
+--------v--------+              +---------v---------+
| PostgreSQL DB   |              | XGBoost ML Model |
+-----------------+              +------------------+
                         |
                Open-Meteo Weather API
```

---

# 🛠️ Tech Stack

## Frontend
- Next.js
- React
- TypeScript
- CSS

## Backend
- FastAPI
- Python
- JWT Authentication

## Database
- PostgreSQL

## Machine Learning
- XGBoost
- Scikit-learn
- Pandas
- NumPy
- Joblib

## APIs
- Open-Meteo Weather API

---

# 📂 Project Structure

```
YieldSense-AI/
│
├── frontend/
│   ├── app/
│   ├── components/
│   └── styles/
│
├── backend/
│   ├── routes/
│   ├── dataset/
│   ├── train_model.py
│   ├── preprocessing.py
│   ├── yield_model.pkl
│   ├── crop_encoder.pkl
│   └── app.py
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/YieldSense-AI.git
```

```bash
cd YieldSense-AI
```

---

## Backend Setup

```bash
cd backend
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run FastAPI

```bash
uvicorn app:app --reload
```

Backend

```
http://127.0.0.1:8000
```

Swagger API

```
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

```bash
cd frontend
```

Install packages

```bash
npm install
```

Run application

```bash
npm run dev
```

Frontend

```
http://localhost:3000
```

---

# 🤖 Machine Learning

Model Used

- XGBoost Regressor

Input Features

- Crop Type
- Rainfall
- Pesticides
- Average Temperature

Output

- Estimated Crop Yield (kg/ha)

Model Evaluation

- MAE (Mean Absolute Error)
- RMSE (Root Mean Squared Error)
- R² Score

---

# 📸 Application Modules

- User Registration & Login
- Farm Profile
- AI Prediction
- Dashboard
- Soil Analysis
- Weather Analysis
- Analytics Dashboard
- AI Recommendations


