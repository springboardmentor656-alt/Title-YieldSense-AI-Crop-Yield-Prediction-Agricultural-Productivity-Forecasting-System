import pandas as pd
import os

# File paths
INPUT_FILE = "datasets/raw/crop_yield_raw.csv"
OUTPUT_FILE = "datasets/processed/crop_yield_cleaned.csv"

print("Loading dataset...")

# Read dataset
df = pd.read_csv(INPUT_FILE)
if "Unnamed: 0" in df.columns:
    df.drop("Unnamed: 0", axis=1, inplace=True)

print("\nDataset Shape:")
print(df.shape)

print("\nColumns:")
print(df.columns)

print("\nMissing Values:")
print(df.isnull().sum())

print("\nDuplicate Rows:")
print(df.duplicated().sum())

# Remove duplicate rows
df = df.drop_duplicates()
print("\nDataset Shape After Removing Duplicates:")
print(df.shape)

# Fill missing numerical values with mean
numeric_columns = df.select_dtypes(include=["int64", "float64"]).columns

for col in numeric_columns:
    df[col] = df[col].fillna(df[col].mean())

# Create processed folder if it doesn't exist
os.makedirs("datasets/processed", exist_ok=True)

# Save cleaned dataset
df.to_csv(OUTPUT_FILE, index=False)

print("\nCleaned dataset saved successfully!")
print(f"Location: {OUTPUT_FILE}")