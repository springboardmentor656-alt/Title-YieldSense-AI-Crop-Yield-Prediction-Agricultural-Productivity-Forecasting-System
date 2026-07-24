# Standard Production Pipeline for Tabular ML Processing
import pandas as pd
import numpy as np
import os

def run_agri_preprocessing_pipeline(input_csv_path: str, output_csv_path: str):
    print(f"Launching preprocessing on: {input_csv_path}")

    if not os.path.exists(input_csv_path):
        print(f"File not found: {input_csv_path}")
        return

    df = pd.read_csv(input_csv_path)
    print(f"Loaded {len(df)} rows, {len(df.columns)} columns")

    # Impute missing climate variables using mean
    climate_cols = [col for col in [
        'avg_temp', 'average_rain_fall_mm_per_year',
        'rainfall', 'ph', 'humidity', 'temperature'
    ] if col in df.columns]

    for col in climate_cols:
        if df[col].isnull().sum() > 0:
            mean_val = df[col].mean()
            df[col].fillna(mean_val, inplace=True)
            print(f"Imputed [{col}] with mean: {mean_val:.2f}")

    # Drop rows with negative rainfall
    if 'rainfall' in df.columns:
        before = len(df)
        df = df[df['rainfall'] >= 0]
        print(f"Dropped {before - len(df)} rows with negative rainfall")

    if 'average_rain_fall_mm_per_year' in df.columns:
        before = len(df)
        df = df[df['average_rain_fall_mm_per_year'] >= 0]
        print(f"Dropped {before - len(df)} rows with negative rainfall")

    # Drop duplicates
    before = len(df)
    df.drop_duplicates(inplace=True)
    print(f"Dropped {before - len(df)} duplicate rows")

    # Save clean output
    os.makedirs(os.path.dirname(output_csv_path), exist_ok=True)
    df.to_csv(output_csv_path, index=False)
    print(f"Clean data saved to: {output_csv_path}")
    print(f"Final shape: {df.shape}")

if __name__ == "__main__":
    run_agri_preprocessing_pipeline(
        "data/raw/crop_yield_raw.csv",
        "data/processed/crop_yield_clean.csv"
    )
    run_agri_preprocessing_pipeline(
        "data/raw/crop_recommendation_raw.csv",
        "data/processed/crop_recommendation_clean.csv"
    )