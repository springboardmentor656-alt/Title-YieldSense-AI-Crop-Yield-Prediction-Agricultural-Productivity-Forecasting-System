import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, root_mean_squared_error

from xgboost import XGBRegressor

from sklearn.metrics import r2_score

# ---------------- Load Dataset ---------------- #

df = pd.read_csv("../dataset/processed/cleaned_crop_yield.csv")

# ---------------- Encode Crop ---------------- #

crop_encoder = LabelEncoder()

df["Item"] = crop_encoder.fit_transform(df["Item"])

# ---------------- Features ---------------- #

X = df[
    [
        "Item",
        "average_rain_fall_mm_per_year",
        "pesticides_tonnes",
        "avg_temp"
    ]
]

# ---------------- Target ---------------- #

y = df["hg/ha_yield"]

# ---------------- Split ---------------- #

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# ---------------- Model ---------------- #

model = XGBRegressor(
    n_estimators=100,
    learning_rate=0.1,
    max_depth=5,
    random_state=42
)

# ---------------- Train ---------------- #

model.fit(X_train, y_train)

# ---------------- Predict ---------------- #

prediction = model.predict(X_test)

# ---------------- Evaluation ---------------- #

mae = mean_absolute_error(y_test, prediction)
rmse = root_mean_squared_error(y_test, prediction)

r2 = r2_score(y_test, prediction)

print("MAE :", round(mae, 2))
print("RMSE:", round(rmse, 2))
print("R2 Score:", round(r2, 4))

confidence = round(max(0, r2) * 100, 2)

joblib.dump(confidence, "model_confidence.pkl")

print("MAE :", round(mae, 2))
print("RMSE:", round(rmse, 2))

# ---------------- Save ---------------- #

joblib.dump(model, "yield_model.pkl")
joblib.dump(crop_encoder, "crop_encoder.pkl")

print("Model Saved Successfully")