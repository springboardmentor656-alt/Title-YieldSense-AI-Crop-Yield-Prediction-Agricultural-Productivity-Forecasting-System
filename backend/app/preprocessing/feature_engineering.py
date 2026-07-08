class FeatureEngineering:

    @staticmethod
    def create_features(df):

        if (
            "temperature" in df.columns
            and "humidity" in df.columns
        ):

            df["temp_humidity_index"] = (

                df["temperature"]

                * df["humidity"]

            )

        if (

            "rainfall" in df.columns

            and "ph"

            in df.columns

        ):

            df["rainfall_ph"] = (

                df["rainfall"]

                * df["ph"]

            )

        return df