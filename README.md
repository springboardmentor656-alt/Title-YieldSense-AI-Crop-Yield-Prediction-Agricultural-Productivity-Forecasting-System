
### Milestone 1 Features
- **User Authentication**  
- **Farmer Registration & Profile Management**  
- **Soil Test Data Entry** (values stored and processed from our balanced dataset `agri_data_balanced.csv`)  
- **Weather Integration** (OpenWeatherMap API)  
- **Rule-Based Recommendation Engine** (fertilizer and soil advice based on N, P, K, pH, organic matter)  
- **Dashboard** (frontend shows yield prediction, weather, and recommendations)

### Technology Stack
**Frontend**  
- React (Vite)  
- TypeScript  
- Organized structure with `components`, `pages` (AddCrop, Crop, FarmerRegistration, Login, Overview, Profile), and `context` for state management  

**Backend**  
- Node.js (`server.js`) for API and routing  
- Python (`predict.py`) for ML model predictions  

**Machine Learning Model**  
- Dataset: `agri_data_balanced.csv`  
- Training Script: `train_yield_model.py`  
- Model Serving: `ml_service.py`  
- Preprocessing: `encoders.pkl`, `scaler.pkl`  
- Model Artifact: `yield_model.json`  

**Data Source**  
- Balanced agricultural dataset (`agri_data_balanced.csv`) for ML model training  
- OpenWeatherMap for real-time weather  

