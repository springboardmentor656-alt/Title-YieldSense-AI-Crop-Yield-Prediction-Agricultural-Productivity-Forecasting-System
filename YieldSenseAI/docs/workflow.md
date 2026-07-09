# Programmatic Workflows - YieldSense AI

Traces the end-to-end programmatic flow of data across the system.

## 1. Information Flow Diagram
```
  [User Authentication]
           |
           v
  [Onboard Farm Profile]  ---> (Store Geo-coords, Farm Name & Soil pH)
           |
           v
  [Fetch Weather Data]    ---> (Fetch regional climate info via Coordinates)
           |
           v
  [Pipeline Ingestion]    ---> (Feed Soil Data + Weather Data + Crop Type)
           |
           v
  [ML Prediction Engine]  ---> (Model inference calculates predicted yield)
           |
           v
  [Visual UI Update]      ---> (Renders crop yields, climate logs & advice)
```

## 2. Step-by-Step Sequence

### Step 1: User Login
- The User logs in via a Next.js form.
- The client receives an encrypted JWT authorization token from the FastAPI backend and stores it.

### Step 2: Farm Profile Onboarding
- The User fills out a form specifying:
  - Farm Name
  - Geo-coordinates (Latitude & Longitude)
  - Soil pH

### Step 3: Climate Ingestion
- The Backend captures these coordinates and submits an external query to a Meteorological/Weather API to capture current and historical weather features.

### Step 4: Machine Learning Inference
- The combined features (soil metrics + weather parameters + target crop) are structured as a clean array and passed to the serialized ML models to return prediction estimates.
