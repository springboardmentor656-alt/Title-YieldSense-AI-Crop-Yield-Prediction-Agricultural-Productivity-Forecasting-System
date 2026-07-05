from fastapi import APIRouter

router = APIRouter()

@router.post("/register")
def register():
    return {
        "message": "Registration endpoint created successfully"
    }


@router.post("/login")
def login():
    return {
        "message": "Login endpoint created successfully"
    }