from fastapi import APIRouter

router = APIRouter(
    prefix="/system",
    tags=["System"]
)


@router.get("/health")
def health():

    return {
        "status": "healthy",
        "service": "YieldSense AI"
    }


@router.get("/ready")
def readiness():

    return {
        "ready": True
    }


@router.get("/version")
def version():

    return {
        "version": "1.0.0"
    }