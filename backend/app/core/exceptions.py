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


class InvalidPredictionInputException(HTTPException):

    def __init__(self, detail: str):

        super().__init__(
            status_code=422,
            detail=detail
        )


class IntegrationNotConfiguredException(HTTPException):

    def __init__(self, provider: str):

        super().__init__(
            status_code=501,
            detail=f"{provider} integration is not configured. "
                    f"Set the required credentials in the environment (.env) to enable it."
        )


class IntegrationRequestException(HTTPException):

    def __init__(self, provider: str, detail: str):

        super().__init__(
            status_code=502,
            detail=f"{provider} request failed: {detail}"
        )