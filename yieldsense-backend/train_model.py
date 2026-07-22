import pandas as pd
import joblib

from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, root_mean_squared_error

print("🌾 Loading Crop Yield Dataset...")

# Load dataset
df = pd.read_csv("../data/processed/crop_yield_clean.csv")

# Remove unnecessary column if present
if "Unnamed: 0" in df.columns:
    df = df.drop(columns=["Unnamed: 0"])

# Convert rainfall column to numeric
df["average_rain_fall_mm_per_year"] = pd.to_numeric(
    df["average_rain_fall_mm_per_year"],
    errors="coerce"
)

# Remove missing values
df = df.dropna()

# Encode categorical columns
df["Area"] = df["Area"].astype("category").cat.codes
df["Item"] = df["Item"].astype("category").cat.codes

# Features
X = df[
    [
        "Area",
        "Item",
        "Year",
        "average_rain_fall_mm_per_year",
        "pesticides_tonnes",
        "avg_temp",
    ]
]

# Target
y = df["hg/ha_yield"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
)

print("🤖 Training XGBoost Model...")

model = XGBRegressor(
    n_estimators=100,
    learning_rate=0.05,
    max_depth=6,
    random_state=42,
)

model.fit(X_train, y_train)

predictions = model.predict(X_test)

mae = mean_absolute_error(y_test, predictions)
rmse = root_mean_squared_error(y_test, predictions)

print("\n✅ Model Training Completed")
print(f"MAE : {mae:.2f}")
print(f"RMSE: {rmse:.2f}")

joblib.dump(model, "../data/processed/crop_yield_model.pkl")

print("\n💾 Model saved successfully!")