"""Model training pipeline for YieldSense AI.

Loads (or builds) the processed crop yield dataset, auto-detects the
target and feature columns, trains several candidate regressors,
compares them on held-out test data, and persists the best model plus
its metadata to backend/models/.

Run directly:
    python -m app.ml.train_model
"""

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Tuple

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from xgboost import XGBRegressor

from app.core.logging import logger

try:
    from lightgbm import LGBMRegressor
    LIGHTGBM_AVAILABLE = True
except ImportError:
    LIGHTGBM_AVAILABLE = False

# ---------------------------------------------------------------------------
# Paths (resolved relative to this file so it works regardless of cwd)
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parents[2]  # backend/
RAW_DATASET_PATH = BASE_DIR / "datasets" / "raw" / "yield_df.csv"
PROCESSED_DATASET_PATH = (
    BASE_DIR / "datasets" / "processed" / "cleaned_crop_data.csv"
)
MODEL_DIR = BASE_DIR / "models"
MODEL_PATH = MODEL_DIR / "crop_yield_model.pkl"
METADATA_PATH = MODEL_DIR / "model_metadata.json"

# Columns that exist in the source data but must not be used as model
# features: "year" and "pesticides" are not derivable from a farm's
# current conditions, and "area" (country, 101 distinct values) is not
# tracked per-farm. "soil_ph" is not present in this dataset at all -
# soil suitability is scored separately by app.services.soil_service
# and combined with this model's output.
EXCLUDED_FEATURE_COLUMNS = {"year", "pesticides", "area"}

# Yield differs by an order of magnitude between crop types (e.g. Potatoes
# vs Soybeans), which swamps any climate signal if crop type is ignored.
# Any low-cardinality text column (crop type) is therefore auto-detected
# and one-hot encoded as a feature alongside the numeric ones.
MAX_CATEGORICAL_CARDINALITY = 20


def _clean_raw_dataset(raw_path: Path) -> pd.DataFrame:
    """Clean the raw yield dataset and standardize its column names.

    Args:
        raw_path: Location of the raw yield_df.csv file.

    Returns:
        A cleaned DataFrame with snake_case column names.

    Raises:
        FileNotFoundError: If the raw dataset does not exist.
    """
    if not raw_path.exists():
        raise FileNotFoundError(
            f"Raw dataset not found at {raw_path}. Cannot build "
            "the processed crop yield dataset."
        )

    logger.info(f"Loading raw dataset from {raw_path}")
    df = pd.read_csv(raw_path)

    # Drop the stray pandas index column the source CSV was exported with.
    df = df.loc[:, ~df.columns.str.contains(r"^Unnamed")]

    df = df.rename(columns={
        "hg/ha_yield": "yield",
        "average_rain_fall_mm_per_year": "rainfall",
        "avg_temp": "temperature",
        "pesticides_tonnes": "pesticides",
        "Area": "area",
        "Item": "item",
        "Year": "year",
    })

    rows_before = len(df)
    df = df.drop_duplicates()
    df = df.dropna()
    df = df[
        (df["rainfall"] >= 0)
        & (df["yield"] >= 0)
        & (df["pesticides"] >= 0)
    ]
    logger.info(f"Cleaned raw dataset: {rows_before} -> {len(df)} rows")

    return df


def load_dataset() -> pd.DataFrame:
    """Load the processed dataset, building it from raw data if missing.

    Returns:
        The processed crop yield DataFrame.
    """
    if PROCESSED_DATASET_PATH.exists():
        logger.info(
            f"Loading processed dataset from {PROCESSED_DATASET_PATH}"
        )
        return pd.read_csv(PROCESSED_DATASET_PATH)

    logger.warning(
        f"{PROCESSED_DATASET_PATH} not found. Building it from "
        f"{RAW_DATASET_PATH}."
    )
    df = _clean_raw_dataset(RAW_DATASET_PATH)

    PROCESSED_DATASET_PATH.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(PROCESSED_DATASET_PATH, index=False)
    logger.info(f"Saved processed dataset to {PROCESSED_DATASET_PATH}")

    return df


def detect_features_and_target(
    df: pd.DataFrame,
) -> Tuple[List[str], List[str], str]:
    """Auto-detect the target column and usable feature columns.

    The target is the numeric column whose name contains "yield".
    Numeric feature candidates are the remaining numeric columns minus
    EXCLUDED_FEATURE_COLUMNS. Categorical feature candidates are
    low-cardinality text columns (e.g. crop type), which are one-hot
    encoded downstream since yield scale depends heavily on crop type.

    Args:
        df: The dataset to inspect.

    Returns:
        A tuple of (numeric_features, categorical_features, target_column).

    Raises:
        ValueError: If no yield-like target or no usable features
            can be found.
    """
    numeric_columns = df.select_dtypes(include="number").columns.tolist()

    target_matches = [c for c in numeric_columns if "yield" in c.lower()]
    if not target_matches:
        raise ValueError(
            "Could not auto-detect a yield target column. Numeric "
            f"columns available: {numeric_columns}"
        )
    target = target_matches[0]

    numeric_features = [
        c for c in numeric_columns
        if c != target and c.lower() not in EXCLUDED_FEATURE_COLUMNS
    ]

    categorical_features = [
        c for c in df.select_dtypes(include="object").columns.tolist()
        if c.lower() not in EXCLUDED_FEATURE_COLUMNS
        and df[c].nunique() <= MAX_CATEGORICAL_CARDINALITY
    ]

    if not numeric_features and not categorical_features:
        raise ValueError("No usable feature columns were detected.")

    logger.info(f"Auto-detected target column: '{target}'")
    logger.info(f"Auto-detected numeric feature columns: {numeric_features}")
    logger.info(
        f"Auto-detected categorical feature columns: {categorical_features}"
    )

    return numeric_features, categorical_features, target


def _evaluate(y_true: pd.Series, y_pred) -> Dict[str, float]:
    """Compute MAE, RMSE and R2 for a set of predictions."""
    return {
        "mae": float(mean_absolute_error(y_true, y_pred)),
        "rmse": float(mean_squared_error(y_true, y_pred) ** 0.5),
        "r2": float(r2_score(y_true, y_pred)),
    }


def _build_preprocessor(categorical_features: List[str]) -> ColumnTransformer:
    """Build a preprocessor that one-hot encodes categorical features
    and passes numeric features through unchanged.

    Unknown categories seen at inference time (e.g. a crop not present
    during training) are safely ignored rather than raising an error.
    """
    return ColumnTransformer(
        transformers=[
            (
                "crop_type",
                OneHotEncoder(handle_unknown="ignore"),
                categorical_features,
            ),
        ],
        remainder="passthrough",
    )


def train_and_compare_models(
    X_train: pd.DataFrame,
    X_test: pd.DataFrame,
    y_train: pd.Series,
    y_test: pd.Series,
    categorical_features: List[str],
) -> Tuple[str, Pipeline, Dict[str, Dict[str, float]]]:
    """Train each candidate regressor and pick the best one by RMSE.

    Each candidate is wrapped in a Pipeline with the shared
    preprocessor, so the persisted artifact is self-contained and can
    accept raw feature columns at inference time.

    Returns:
        A tuple of (best_model_name, best_fitted_pipeline, metrics_by_model).

    Raises:
        RuntimeError: If every candidate model fails to train.
    """
    regressors = {
        "RandomForestRegressor": RandomForestRegressor(
            n_estimators=200, random_state=42, n_jobs=-1
        ),
        "XGBRegressor": XGBRegressor(
            n_estimators=300, random_state=42, n_jobs=-1
        ),
    }

    if LIGHTGBM_AVAILABLE:
        regressors["LGBMRegressor"] = LGBMRegressor(random_state=42)
    else:
        logger.warning("LightGBM is not installed; skipping this candidate.")

    metrics_by_model: Dict[str, Dict[str, float]] = {}
    trained_pipelines: Dict[str, Pipeline] = {}

    for name, regressor in regressors.items():
        logger.info(f"Training {name}...")
        try:
            pipeline = Pipeline(steps=[
                ("preprocessor", _build_preprocessor(categorical_features)),
                ("regressor", regressor),
            ])
            pipeline.fit(X_train, y_train)
            predictions = pipeline.predict(X_test)
            metrics = _evaluate(y_test, predictions)
            metrics_by_model[name] = metrics
            trained_pipelines[name] = pipeline
            logger.info(f"{name} metrics: {metrics}")
        except Exception:
            logger.exception(f"Training failed for {name}; skipping it.")

    if not metrics_by_model:
        raise RuntimeError("All candidate models failed to train.")

    best_name = min(metrics_by_model, key=lambda n: metrics_by_model[n]["rmse"])
    logger.info(f"Best model selected: {best_name} ({metrics_by_model[best_name]})")

    return best_name, trained_pipelines[best_name], metrics_by_model


def save_artifacts(
    pipeline: Pipeline,
    best_model_name: str,
    numeric_features: List[str],
    categorical_features: List[str],
    target: str,
    all_metrics: Dict[str, Dict[str, float]],
    crop_categories: List[str],
) -> None:
    """Persist the trained pipeline and its metadata to backend/models/."""
    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    joblib.dump(pipeline, MODEL_PATH)
    logger.info(f"Saved model to {MODEL_PATH}")

    metadata = {
        "model_name": best_model_name,
        "features": numeric_features + categorical_features,
        "numeric_features": numeric_features,
        "categorical_features": categorical_features,
        "crop_categories": crop_categories,
        "target": target,
        "training_date": datetime.now(timezone.utc).isoformat(),
        "metrics": all_metrics[best_model_name],
        "model_comparison": all_metrics,
    }

    with open(METADATA_PATH, "w") as f:
        json.dump(metadata, f, indent=2)
    logger.info(f"Saved model metadata to {METADATA_PATH}")


def main() -> None:
    """Run the full training pipeline end-to-end."""
    try:
        df = load_dataset()
        numeric_features, categorical_features, target = (
            detect_features_and_target(df)
        )
        all_features = numeric_features + categorical_features

        X = df[all_features]
        y = df[target]

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        best_name, best_pipeline, all_metrics = train_and_compare_models(
            X_train, X_test, y_train, y_test, categorical_features
        )

        crop_categories = (
            sorted(df[categorical_features[0]].unique().tolist())
            if categorical_features
            else []
        )

        save_artifacts(
            best_pipeline,
            best_name,
            numeric_features,
            categorical_features,
            target,
            all_metrics,
            crop_categories,
        )
        logger.info("Training pipeline completed successfully.")

    except Exception:
        logger.exception("Training pipeline failed.")
        raise


if __name__ == "__main__":
    main()
