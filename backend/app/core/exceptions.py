from fastapi import HTTPException


class UserAlreadyExistsException(HTTPException):

    def __init__(self):

        super().__init__(
            status_code=400,
            detail="User already exists."
        )


class InvalidCredentialsException(HTTPException):

    def __init__(self):

        super().__init__(
            status_code=401,
            detail="Invalid email or password."
        )


class ResourceNotFoundException(HTTPException):

    def __init__(self, resource: str):

        super().__init__(
            status_code=404,
            detail=f"{resource} not found."
        )


class PermissionDeniedException(HTTPException):

    def __init__(self):

        super().__init__(
            status_code=403,
            detail="Permission denied."
        )