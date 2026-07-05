# YieldSense AI Workflow

1. Farmer registers/logs into the system.

2. Farmer creates farm profile:
   - Farm location
   - Latitude and longitude
   - Soil information

3. Backend receives farmer data using FastAPI.

4. Weather API provides climate information.

5. Data combined:
   - Crop details
   - Soil parameters
   - Weather data

6. Machine Learning model predicts:
   - Expected crop yield
   - Agricultural insights

Technology Flow:

Next.js Frontend
        ↓
FastAPI Backend
        ↓
PostgreSQL Database
        ↓
ML Prediction Model