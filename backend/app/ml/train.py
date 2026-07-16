import json
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

from app.ml.preprocessing import build_features, FEATURE_COLUMNS, TARGET_COLUMN
from app.ml.metrics import evaluate, evaluate_by_crop

DATA_PATH = "data/processed/training_dataset.csv"
MODEL_OUT = "ml_models/yield_model_v1.joblib"
COLUMNS_OUT = "ml_models/feature_columns.json"

def train():
    raw = pd.read_csv(DATA_PATH)

    # --- Kaggle data quality check before anything else ---
    print("Rows before cleaning:", len(raw))
    raw = raw.dropna(subset=["yield_kg_ha", "crop_type"])
    raw = raw[raw["yield_kg_ha"] > 0]  # drop impossible/placeholder rows
    print("Rows after cleaning:", len(raw))
    print("Crop distribution:\n", raw["crop_type"].value_counts())

    df = build_features(raw)
    X, y = df[FEATURE_COLUMNS], df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestRegressor(
        n_estimators=300, max_depth=12, min_samples_leaf=3,
        random_state=42, n_jobs=-1,
    )
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    print("Overall metrics:", evaluate(y_test, preds))
    print("Per-crop metrics:", evaluate_by_crop(raw.loc[X_test.index, "crop_type"], y_test, preds))

    joblib.dump(model, MODEL_OUT)
    with open(COLUMNS_OUT, "w") as f:
        json.dump(FEATURE_COLUMNS, f)

if __name__ == "__main__":
    train()