# YieldSense AI - API Documentation


## Backend Framework

FastAPI is used for developing REST APIs.


## Authentication APIs


### 1. Farmer Registration API

Endpoint:

POST /register


Purpose:

Register a new farmer account.


Request:

{
    "email":"farmer@gmail.com",
    "password":"password123"
}


Process:

- Accept user credentials
- Hash password securely
- Store farmer details in PostgreSQL


Response:

{
    "message":"Farmer registered successfully"
}


------------------------------------------------


### 2. Farmer Login API

Endpoint:

POST /login


Purpose:

Authenticate farmer login.


Request:

{
    "email":"farmer@gmail.com",
    "password":"password123"
}


Process:

- Verify email
- Verify encrypted password
- Generate JWT token


Response:

{
    "message":"Login successful",
    "access_token":"jwt_token"
}


------------------------------------------------


## Future APIs


### Farm Profile API

POST /farm


Purpose:

Store farmer land details:

- Farm Name
- Latitude
- Longitude
- Soil pH



### Crop Prediction API

POST /predict


Purpose:

Predict crop yield using ML model.


Inputs:

- Crop
- Soil Data
- Weather Data


Output:

Predicted crop yield.