import pandas as pd
import os

INPUT = "datasets/raw/yield.csv"
OUTPUT = "datasets/processed/yield_clean.csv"

df = pd.read_csv(INPUT)

# Remove duplicates
df.drop_duplicates(inplace=True)

# Fill missing numeric values
numeric_cols = df.select_dtypes(include="number").columns
df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].mean())

# Remove negative rainfall
if "average_rain_fall_mm_per_year" in df.columns:
    df = df[df["average_rain_fall_mm_per_year"] >= 0]

os.makedirs("datasets/processed", exist_ok=True)

df.to_csv(OUTPUT, index=False)

print("Crop Yield preprocessing completed.")