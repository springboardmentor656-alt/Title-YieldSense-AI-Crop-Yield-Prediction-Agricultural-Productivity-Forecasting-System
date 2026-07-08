import pandas as pd

df = pd.read_csv("datasets/raw/Crop_recommendation.csv")

df.drop_duplicates(inplace=True)

df.fillna(df.mean(numeric_only=True), inplace=True)

df.to_csv(
    "datasets/processed/crop_recommendation_clean.csv",
    index=False
)

print("Crop Recommendation preprocessing completed.")