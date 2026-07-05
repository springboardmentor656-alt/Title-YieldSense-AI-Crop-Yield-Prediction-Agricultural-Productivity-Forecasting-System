"""
YieldSense AI — Data Preprocessing Pipeline
File: backend/preprocess.py

Transforms raw agricultural datasets (FAOSTAT / USDA / Kaggle) in
`backend/data/raw/` into a single, clean, model-ready dataset written to
`backend/data/processed/`.

Usage:
    python preprocess.py --input data/raw --output data/processed

Pipeline stages:
    1. Load raw CSVs from each source subfolder
    2. Normalize column names/schema per source
    3. Concatenate into a single DataFrame
    4. Handle missing values
    5. Remove duplicates
    6. Detect and handle outliers (IQR method on yield_kg_per_ha)
    7. Feature engineering (derived columns)
    8. Export processed dataset + a run summary log
"""

from __future__ import annotations

import argparse
import logging
from dataclasses import dataclass, field
from pathlib import Path

import numpy as np
import pandas as pd

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(message)s",
)
logger = logging.getLogger("yieldsense.preprocess")

REQUIRED_COLUMNS = [
    "crop",
    "state",
    "district",
    "year",
    "area_harvested_ha",
    "production_tonnes",
    "yield_kg_per_ha",
    "source",
]


@dataclass
class PreprocessReport:
    """Tracks pipeline statistics for auditability."""

    files_loaded: int = 0
    rows_ingested: int = 0
    rows_after_dedup: int = 0
    missing_values_filled: dict = field(default_factory=dict)
    duplicates_removed: int = 0
    outliers_flagged: int = 0
    rows_final: int = 0

    def log_summary(self) -> None:
        logger.info("===== Preprocessing Summary =====")
        logger.info("Files loaded:            %d", self.files_loaded)
        logger.info("Rows ingested:            %d", self.rows_ingested)
        logger.info("Duplicates removed:       %d", self.duplicates_removed)
        logger.info("Rows after dedup:         %d", self.rows_after_dedup)
        logger.info("Missing values filled:    %s", self.missing_values_filled)
        logger.info("Outliers flagged:         %d", self.outliers_flagged)
        logger.info("Final row count:          %d", self.rows_final)
        logger.info("==================================")


# ---------------------------------------------------------------------------
# 1. Loading
# ---------------------------------------------------------------------------

def load_raw_datasets(raw_dir: Path) -> list[pd.DataFrame]:
    """
    Load all normalized-schema CSVs from raw_dir's source subfolders.

    Expects files already mapped to the common schema (see
    backend/data/raw/README.md). In a real ingestion job, source-specific
    mapping functions (map_faostat, map_usda, map_kaggle) would run here;
    for Milestone-1 we assume pre-mapped CSVs are dropped into each folder,
    and we validate/normalize dtypes at load time.
    """
    frames: list[pd.DataFrame] = []
    csv_files = sorted(raw_dir.rglob("*.csv"))

    if not csv_files:
        logger.warning("No CSV files found under %s — nothing to process.", raw_dir)
        return frames

    for csv_path in csv_files:
        try:
            df = pd.read_csv(csv_path)
            missing_cols = set(REQUIRED_COLUMNS) - set(df.columns)
            if missing_cols:
                logger.warning(
                    "Skipping %s — missing required columns: %s", csv_path.name, missing_cols
                )
                continue
            frames.append(df[REQUIRED_COLUMNS])
            logger.info("Loaded %s (%d rows)", csv_path.name, len(df))
        except Exception as exc:  # noqa: BLE001
            logger.error("Failed to load %s: %s", csv_path.name, exc)

    return frames


# ---------------------------------------------------------------------------
# 2. Cleaning
# ---------------------------------------------------------------------------

def handle_missing_values(df: pd.DataFrame, report: PreprocessReport) -> pd.DataFrame:
    """
    Fill/drop missing values with documented, reproducible rules:
      - district: fill with 'UNKNOWN' (FAOSTAT/USDA rows have no district)
      - numeric fields: fill with the median for that (crop, source) group
      - rows missing crop/state/year (essential keys): dropped
    """
    df = df.copy()

    essential_keys = ["crop", "state", "year"]
    before = len(df)
    df = df.dropna(subset=essential_keys)
    dropped_essential = before - len(df)
    if dropped_essential:
        report.missing_values_filled["dropped_missing_essential_keys"] = dropped_essential

    df["district"] = df["district"].fillna("UNKNOWN")

    numeric_cols = ["area_harvested_ha", "production_tonnes", "yield_kg_per_ha"]
    for col in numeric_cols:
        na_count = int(df[col].isna().sum())
        if na_count:
            df[col] = df.groupby(["crop", "source"])[col].transform(
                lambda s: s.fillna(s.median())
            )
            # Fallback: any still-missing (whole group was NaN) -> global median
            df[col] = df[col].fillna(df[col].median())
            report.missing_values_filled[col] = na_count

    return df


def remove_duplicates(df: pd.DataFrame, report: PreprocessReport) -> pd.DataFrame:
    """Remove exact duplicate rows and duplicate (crop, state, district, year, source) keys."""
    before = len(df)
    df = df.drop_duplicates()
    df = df.drop_duplicates(subset=["crop", "state", "district", "year", "source"], keep="first")
    report.duplicates_removed = before - len(df)
    report.rows_after_dedup = len(df)
    return df


def handle_outliers(df: pd.DataFrame, report: PreprocessReport) -> pd.DataFrame:
    """
    Flag and cap outliers in yield_kg_per_ha using the IQR method, applied
    per-crop (since acceptable yield ranges vary drastically by crop).
    Outliers are capped (winsorized) rather than dropped, to preserve
    row count for downstream joins.
    """
    df = df.copy()
    df["is_outlier"] = False

    for crop, group in df.groupby("crop"):
        q1 = group["yield_kg_per_ha"].quantile(0.25)
        q3 = group["yield_kg_per_ha"].quantile(0.75)
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr

        mask = (df["crop"] == crop) & (
            (df["yield_kg_per_ha"] < lower_bound) | (df["yield_kg_per_ha"] > upper_bound)
        )
        report.outliers_flagged += int(mask.sum())
        df.loc[mask, "is_outlier"] = True
        df.loc[df["crop"] == crop, "yield_kg_per_ha"] = df.loc[
            df["crop"] == crop, "yield_kg_per_ha"
        ].clip(lower=lower_bound, upper=upper_bound)

    return df


# ---------------------------------------------------------------------------
# 3. Feature Engineering
# ---------------------------------------------------------------------------

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Add derived columns useful for future ML models and dashboards."""
    df = df.copy()

    # Recompute yield from area/production where both are valid, for consistency.
    valid_mask = (df["area_harvested_ha"] > 0) & df["production_tonnes"].notna()
    df.loc[valid_mask, "yield_kg_per_ha_recomputed"] = (
        df.loc[valid_mask, "production_tonnes"] * 1000 / df.loc[valid_mask, "area_harvested_ha"]
    )

    # Year-over-year yield change per (crop, state, district)
    df = df.sort_values(["crop", "state", "district", "year"])
    df["yield_yoy_change_pct"] = (
        df.groupby(["crop", "state", "district"])["yield_kg_per_ha"].pct_change() * 100
    )

    # Rolling 3-year average yield (simple trend smoothing feature)
    df["yield_rolling_3yr_avg"] = (
        df.groupby(["crop", "state", "district"])["yield_kg_per_ha"]
        .transform(lambda s: s.rolling(window=3, min_periods=1).mean())
    )

    # Log-transformed production (useful for models sensitive to skew)
    df["production_tonnes_log"] = np.log1p(df["production_tonnes"].clip(lower=0))

    return df


# ---------------------------------------------------------------------------
# 4. Pipeline Orchestration
# ---------------------------------------------------------------------------

def run_pipeline(input_dir: str, output_dir: str) -> PreprocessReport:
    raw_dir = Path(input_dir)
    processed_dir = Path(output_dir)
    processed_dir.mkdir(parents=True, exist_ok=True)

    report = PreprocessReport()

    frames = load_raw_datasets(raw_dir)
    report.files_loaded = len(frames)

    if not frames:
        logger.warning("Pipeline halted: no valid input data.")
        return report

    df = pd.concat(frames, ignore_index=True)
    report.rows_ingested = len(df)

    df = handle_missing_values(df, report)
    df = remove_duplicates(df, report)
    df = handle_outliers(df, report)
    df = engineer_features(df)

    report.rows_final = len(df)

    output_path = processed_dir / "yield_dataset_processed.csv"
    df.to_csv(output_path, index=False)
    logger.info("Processed dataset written to %s (%d rows)", output_path, len(df))

    report.log_summary()
    return report


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="YieldSense AI data preprocessing pipeline")
    parser.add_argument("--input", default="data/raw", help="Path to raw data directory")
    parser.add_argument("--output", default="data/processed", help="Path to processed data output directory")
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    run_pipeline(args.input, args.output)
