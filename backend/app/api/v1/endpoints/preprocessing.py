from fastapi import APIRouter
from fastapi import Depends

from app.auth.permissions import admin_required
from app.preprocessing.pipeline import PreprocessingPipeline
from app.utils.api_response import APIResponse

router = APIRouter(
    prefix="/preprocessing",
    tags=["Preprocessing"]
)


@router.post("/run")
def run_preprocessing(
    user=Depends(admin_required)
):

    PreprocessingPipeline.run(
        input_path="datasets/raw/crop_yield.csv",
        output_path="datasets/processed/crop_yield_clean.csv"
    )

    return APIResponse.success(
        message="Dataset preprocessing completed successfully."
    )