from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import StandardScaler


class DataTransformer:

    @staticmethod
    def encode(df):

        encoder = LabelEncoder()

        for col in df.select_dtypes(include="object"):

            df[col] = encoder.fit_transform(df[col])

        return df

    @staticmethod
    def scale(df):

        scaler = StandardScaler()

        numeric = df.select_dtypes(include="number").columns

        df[numeric] = scaler.fit_transform(df[numeric])

        return df