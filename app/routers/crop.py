from fastapi import APIRouter

router = APIRouter(
    prefix="/crops",
    tags=["Crops"]
)

@router.get("/")
def get_crops():
    return {
        "message": "Crop API is working"
    }