import pandas as pd

df = pd.read_csv("datasets/raw/pesticides.csv")

df.drop_duplicates(inplace=True)

df.fillna(df.mean(numeric_only=True), inplace=True)

df.to_csv(
    "datasets/processed/cpesticides_clean.csv",
    index=False
)

print("Pesticides preprocessing completed.")