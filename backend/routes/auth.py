from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from database import get_conn

from auth_handler import (
    hash_password,
    verify_password,
    create_token
)


router = APIRouter()


class User(BaseModel):
    email: str
    password: str



@router.post("/register")
def register(user: User):

    conn = get_conn()
    cursor = conn.cursor()


    cursor.execute(
        "SELECT email FROM users WHERE email=%s",
        (user.email,)
    )

    existing_user = cursor.fetchone()


    if existing_user:
        cursor.close()
        conn.close()

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )


    hashed = hash_password(user.password)


    cursor.execute(
        """
        INSERT INTO users(email,password_hash)
        VALUES(%s,%s)
        """,
        (
            user.email,
            hashed
        )
    )


    conn.commit()

    cursor.close()
    conn.close()


    return {
        "message":"Farmer registered successfully",
        "email":user.email
    }



@router.post("/login")
def login(user: User):

    conn = get_conn()
    cursor = conn.cursor()


    cursor.execute(
        """
        SELECT email,password_hash
        FROM users
        WHERE email=%s
        """,
        (user.email,)
    )


    db_user = cursor.fetchone()


    cursor.close()
    conn.close()


    if db_user is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid email"
        )


    if not verify_password(
        user.password,
        db_user[1]
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid password"
        )


    token = create_token(
        {
            "email": user.email
        }
    )


    return {
        "message":"Login successful",
        "access_token":token
    }