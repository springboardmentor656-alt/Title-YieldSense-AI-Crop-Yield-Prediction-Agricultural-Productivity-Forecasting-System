# train_model.py - Tabular Machine Learning Pipeline
import pandas as pd
import numpy as np
import joblib
import os
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

# Fallback for root_mean_squared_error based on scikit-learn version
try:
    from sklearn.metrics import root_mean_squared_error as rmse_metric
except ImportError:
    try:
        from sklearn.metrics import root_mean_square_error as rmse_metric
    except ImportError:
        def rmse_metric(y_true, y_pred):
            return np.sqrt(np.mean((y_true - y_pred) ** 2))

def train_yield_engine(data_path: str, model_export_path: str):
    print("[*] Initializing YieldSense AI Training Sequence...")
    df = pd.read_csv(data_path)
    
    # Define features (Inputs) and target variable (Output)
    # Target columns must map directly to your dataset schema features
    X = df[['avg_temp', 'average_rain_fall_mm_per_year', 'ph']] 
    y = df['yield_kg_per_ha'] 
    
    # Split data: 80% for training the AI, 20% to test its accuracy
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Initialize and train our ensemble model
    model = XGBRegressor(n_estimators=100, learning_rate=0.05, max_depth=6)
    model.fit(X_train, y_train)
    
    # Predict and evaluate mathematical errors
    predictions = model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)
    rmse = rmse_metric(y_test, predictions)
    
    print(f"[+] Training Complete! Evaluation Scores:")
    print(f"   [-] Mean Absolute Error (MAE): {mae:.2f} kg/ha")
    print(f"   [-] Root Mean Square Error (RMSE): {rmse:.2f} kg/ha")
    
    # Feature Importance Calculations
    importances = model.feature_importances_
    features = X.columns
    print(f"[+] Feature Importance Analysis:")
    for feat, imp in zip(features, importances):
        print(f"   [-] {feat}: {imp * 100:.2f}% impact")

    # Serialize (save) the model artifact to disk
    joblib.dump(model, model_export_path)
    print(f"[+] Model binary successfully saved to: {model_export_path}")

if __name__ == "__main__":
    train_yield_engine("data/processed/crop_yield_clean.csv", "data/processed/crop_yield_model.pkl")
