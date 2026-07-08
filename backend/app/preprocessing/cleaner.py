import numpy as np


class DataCleaner:

    @staticmethod
    def remove_duplicates(df):

        return df.drop_duplicates()

    @staticmethod
    def fill_missing(df):

        numeric = df.select_dtypes(include=np.number).columns

        categorical = df.select_dtypes(exclude=np.number).columns

        for col in numeric:

            df[col].fillna(df[col].median(), inplace=True)

        for col in categorical:

            df[col].fillna(df[col].mode()[0], inplace=True)

        return df

    @staticmethod
    def remove_negative_rainfall(df):

        if "rainfall" in df.columns:

            df = df[df["rainfall"] >= 0]

        return df

    @staticmethod
    def remove_negative_yield(df):

        if "yield" in df.columns:

            df = df[df["yield"] >= 0]

        return df