import os
import pandas as pd


def run_agri_preprocessing_pipeline(input_csv_path: str, output_csv_path: str) -> dict:
    print(f"Launching extraction sequence on: {input_csv_path}")

    if not os.path.exists(input_csv_path):
        print(f"Target raw file not found at {input_csv_path}.")
        return {"status": "Failed", "error": "Raw file not found"}

    try:
        df = pd.read_csv(input_csv_path)
        initial_row_count = len(df)
        initial_missing_count = int(df.isnull().sum().sum())
        columns = list(df.columns)

        # Impute missing values
        climate_cols = [
            col
            for col in ["avg_temp", "average_rain_fall_mm_per_year", "rainfall", "ph", "nitrogen", "phosphorus", "potassium", "organic_matter"]
            if col in df.columns
        ]
        for col in climate_cols:
            if df[col].isnull().sum() > 0:
                mean_val = df[col].mean()
                df[col] = df[col].fillna(mean_val)
                print(f"Imputed missing values in {col} using mean: {mean_val:.2f}")

        # Drop negative rainfall values
        for col in ["rainfall", "average_rain_fall_mm_per_year", "nitrogen", "phosphorus", "potassium", "organic_matter"]:
            if col in df.columns:
                initial_count = len(df)
                df = df[df[col] >= 0]
                dropped = initial_count - len(df)
                if dropped:
                    print(f"Dropped {dropped} rows with negative {col}.")

        # Validate pH values
        for col in ["ph", "soil_ph"]:
            if col in df.columns:
                initial_count = len(df)
                df = df[(df[col] >= 0) & (df[col] <= 14)]
                dropped = initial_count - len(df)
                if dropped:
                    print(f"Dropped {dropped} rows with invalid pH values.")

        os.makedirs(os.path.dirname(output_csv_path), exist_ok=True)
        df.to_csv(output_csv_path, index=False)
        print(f"Preprocessing complete. Clean data exported to: {output_csv_path}")

        return {
            "status": "Completed",
            "row_count": len(df),
            "missing_values": initial_missing_count,
            "columns_found": ", ".join(columns)
        }
    except Exception as e:
        print(f"Preprocessing failed: {str(e)}")
        return {
            "status": "Failed",
            "row_count": 0,
            "missing_values": 0,
            "columns_found": "",
            "error": str(e)
        }


if __name__ == "__main__":
    run_agri_preprocessing_pipeline("data/raw/crop_yield_raw.csv", "data/processed/crop_yield_clean.csv")

