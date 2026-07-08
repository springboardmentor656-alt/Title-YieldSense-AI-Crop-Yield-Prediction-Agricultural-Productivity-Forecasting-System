class DataValidator:

    @staticmethod
    def validate(df):

        if df.empty:

            raise ValueError("Dataset is empty.")

        return df