from app.preprocessing.pipeline import (
    PreprocessingPipeline
)

PreprocessingPipeline.run(

    input_path="datasets/raw/yield.csv",

    output_path="datasets/processed/yield_clean.csv"

)