# 🌾 YieldSense AI: Crop Yield Prediction & Agricultural Productivity Forecasting System

YieldSense AI is a machine learning platform designed to help farmers and agricultural organizations estimate future crop production using historical farming data, weather conditions, and soil characteristics.

---

## 📋 Project Status

| Milestone | Status | Key Deliverables |
| :--- | :--- | :--- |
| **Milestone 1: Foundation & Core Setup** | ✅ Complete | Decoupled Next.js & FastAPI setup, PostgreSQL database schema, JWT role-based authentication, and user dashboard wireframes. |
| **Milestone 2: Yield Prediction & Analysis** | ✅ Complete | XGBoost machine learning training pipeline, `/api/v1/predict-yield` API endpoint, and real-time frontend forecast integration. |

---

## 🌾 Milestone 1 Summary

### Backend Setup & Auth
* **Architecture**: Decoupled Python FastAPI server and relational PostgreSQL tables (`users`, `farms`, `crops`).
* **Authentication**: Stateless JSON Web Tokens (JWT) using `PyJWT` and bcrypt password hashing.
* **Data Processing**: Pipeline script (`preprocess.py`) to clean, impute missing values, and filter anomalous noise in agricultural data.

### Frontend Dashboards
* **Aesthetics**: Premium glassmorphism design with responsive dark themes.
* **Role Routing**: Dynamic landing page and login routing based on user profiles:
  * **Farmer**: Displays yield estimations and farm profiles.
  * **Administrator**: Displays user registries, database table schemas, and terminal logs.
  * **Agri Consultant**: Displays client lists and soil advisory recommendation portals.
  * **Researcher**: Displays datasets metadata and model regression metrics.
  * **Agriculture Department**: Displays regional yield stats and financial support ledgers.

---

## 🤖 Milestone 2 Summary

### XGBoost Machine Learning Pipeline
* **Script**: `backend/train_model.py` splits the dataset 80/20 and trains an `XGBRegressor` on temperature, rainfall, and pH to predict crop yield ($kg/ha$).
* **Evaluation Metrics**:
  * **Mean Absolute Error (MAE)**: `429.02 kg/ha`
  * **Root Mean Square Error (RMSE)**: `558.22 kg/ha`
* **Feature Importance**: Analyzes feature impact weights:
  * **Annual Rainfall**: `41.45%`
  * **Soil pH**: `35.16%`
  * **Avg Temperature**: `23.39%`
* **Model Serialization**: Saves weights locally to `crop_yield_model.pkl` (configured via `.gitignore` to be excluded from commits).

### API Inference Endpoint
* **Path**: `/api/v1/predict-yield` (POST)
* **Features**: Loads the `.pkl` binary in under 10ms, runs inference on user inputs, and classifies weather stress and soil acidity.

### Frontend Integration
* **Component**: Interactive forecasting form on the Farmer Dashboard.
* **Connectivity**: Wired to call the local backend and dynamically render yield results and ratings in real-time.