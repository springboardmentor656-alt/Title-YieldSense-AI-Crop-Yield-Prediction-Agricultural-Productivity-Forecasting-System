import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

# Load dataset
df = pd.read_csv("datasets/processed/crop_yield_cleaned.csv")

# Remove unwanted column if exists
if "Unnamed: 0" in df.columns:
    df.drop("Unnamed: 0", axis=1, inplace=True)

# Convert categorical columns
df = pd.get_dummies(df, columns=["Area", "Item"])

# Features and target
X = df.drop("hg/ha_yield", axis=1)
y = df["hg/ha_yield"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42
)

# Model
model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

# Train
model.fit(X_train, y_train)

# Predict
predictions = model.predict(X_test)

# Evaluation
mae = mean_absolute_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

print("\nModel Performance")
print("-------------------")
print("MAE:", mae)
print("R2 Score:", r2)

# Save model
joblib.dump(model, "models/crop_yield_model.pkl")

print("\nModel saved successfully!")