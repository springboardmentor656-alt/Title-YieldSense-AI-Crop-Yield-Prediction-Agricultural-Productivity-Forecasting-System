import joblib
import pandas as pd

# Load the trained model
model = joblib.load("models/crop_model.pkl")

# Sample input data
sample_data = {
    "N": 90,
    "P": 42,
    "K": 43,
    "temperature": 20.87,
    "humidity": 82.00,
    "ph": 6.50,
    "rainfall": 202.93
}

# Convert input into DataFrame
input_data = pd.DataFrame([sample_data])

# Predict crop
prediction = model.predict(input_data)

# Display result
print("🌾 Recommended Crop:", prediction[0])