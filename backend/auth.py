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

    name: str | None = None
    email: str
    password: str
    role: str = "Farmer"



@router.post("/register")
def register(user:User):

    conn = get_conn()
    cur = conn.cursor()


    cur.execute(
        "SELECT * FROM users WHERE email=%s",
        (user.email,)
    )


    if cur.fetchone():

        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )


    cur.execute(
        """
        INSERT INTO users(email,password_hash,role)
        VALUES(%s,%s,%s)
        """,

        (
        user.email,
        hash_password(user.password),
        user.role
        )

    )


    conn.commit()


    return {
        "message":"User registered successfully"
    }




@router.post("/login")
def login(user:User):

    conn = get_conn()
    cur = conn.cursor()


    cur.execute(
        """
        SELECT password_hash,role
        FROM users
        WHERE email=%s
        """,

        (user.email,)

    )


    result = cur.fetchone()


    if result is None:

        raise HTTPException(
            status_code=401,
            detail="User not found"
        )


    if verify_password(
        user.password,
        result[0]
    ) == False:

        raise HTTPException(
            status_code=401,
            detail="Wrong password"
        )



    token = create_token(
        {
        "email":user.email,
        "role":result[1]
        }
    )



    return {

        "message":"Login success",

        "access_token":token,

        "token_type":"bearer"

    }