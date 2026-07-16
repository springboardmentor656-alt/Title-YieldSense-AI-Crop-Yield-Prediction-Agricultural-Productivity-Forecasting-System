import pandas as pd

FEATURE_COLUMNS = [
    "rainfall_mm", "avg_temp_c", "humidity_pct",
    "soil_ph", "nitrogen_kg_ha", "phosphorus_kg_ha", "potassium_kg_ha",
    "crop_type_encoded", "region_encoded",
]
TARGET_COLUMN = "yield_kg_ha"

def build_features(df: pd.DataFrame) -> pd.DataFrame:
    """Single source of truth for feature engineering.
    Must be called identically at train time and inference time."""
    df = df.copy()
    df["crop_type_encoded"] = df["crop_type"].astype("category").cat.codes
    df["region_encoded"] = df["region"].astype("category").cat.codes
    cols = FEATURE_COLUMNS + [TARGET_COLUMN] if TARGET_COLUMN in df else FEATURE_COLUMNS
    return df[cols]