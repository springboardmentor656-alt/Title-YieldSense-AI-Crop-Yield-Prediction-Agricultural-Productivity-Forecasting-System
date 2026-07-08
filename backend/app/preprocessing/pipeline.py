from sklearn.model_selection import train_test_split

from app.preprocessing.loader import DataLoader
from app.preprocessing.validator import DataValidator
from app.preprocessing.cleaner import DataCleaner
from app.preprocessing.transformer import DataTransformer
from app.preprocessing.feature_engineering import (
    FeatureEngineering
)
from app.preprocessing.exporter import DataExporter


class PreprocessingPipeline:

    @staticmethod
    def run(input_path, output_path):

        print("Loading dataset...")

        df = DataLoader.load_csv(input_path)

        print("Validating dataset...")

        df = DataValidator.validate(df)

        print("Cleaning dataset...")

        df = DataCleaner.remove_duplicates(df)

        df = DataCleaner.fill_missing(df)

        df = DataCleaner.remove_negative_rainfall(df)

        df = DataCleaner.remove_negative_yield(df)

        print("Feature Engineering...")

        df = FeatureEngineering.create_features(df)

        print("Encoding...")

        df = DataTransformer.encode(df)

        print("Scaling...")

        df = DataTransformer.scale(df)

        print("Saving cleaned dataset...")

        DataExporter.save(df, output_path)

        print("Splitting train/test...")

        train, test = train_test_split(

            df,

            test_size=0.2,

            random_state=42

        )

        DataExporter.save(

            train,

            "datasets/train/train.csv"

        )

        DataExporter.save(

            test,

            "datasets/test/test.csv"

        )

        print("Pipeline Completed Successfully.")