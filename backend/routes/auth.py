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
        """
        SELECT email FROM users
        WHERE email=%s
        """,
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
        INSERT INTO users(email,password_hash,role)
        VALUES(%s,%s,%s)
        """,
        (
            user.email,
            hashed,
            "Farmer"
        )
    )


    conn.commit()

    cursor.close()
    conn.close()


    return {
        "message":"Farmer registered successfully"
    }



@router.post("/login")
def login(user: User):

    conn = get_conn()
    cursor = conn.cursor()


    cursor.execute(
        """
        SELECT email,password_hash,role
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
            "email":db_user[0],
            "role":db_user[2]
        }
    )


    return {

        "message":"Login successful",

        "access_token":token,

        "role":db_user[2]
    }