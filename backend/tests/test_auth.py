from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_register():

    payload = {

        "full_name": "John Doe",

        "email": "john@example.com",

        "password": "Password@123",

        "role": "Farmer"

    }

    response = client.post(
        "/api/v1/auth/register",
        json=payload
    )

    assert response.status_code in (200, 201, 400)