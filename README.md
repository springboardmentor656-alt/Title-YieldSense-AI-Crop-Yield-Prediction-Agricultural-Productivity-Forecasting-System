# YieldSense AI
### Crop Yield Prediction & Agricultural Productivity Forecasting System

## Infosys Virtual Internship Project

YieldSense AI is an intelligent agriculture platform being developed as part of the **Infosys Virtual Internship**. The project aims to build a complete AI-powered system for crop yield prediction, weather analysis, soil analysis, and agricultural recommendations.

**Current Progress:** Weeks 1–2 Completed

---

# Project Status

## ✅ Completed (Weeks 1–2)

- Project architecture
- Backend setup
- PostgreSQL database configuration
- Authentication module
- Web authentication interface
- Mobile authentication interface
- Dataset management backend
- Dataset import APIs
- Historical Yield dataset integration
- Soil dataset integration
- Weather dataset integration
- Web dataset management interface
- Mobile dataset viewing interface
- Role-based access control
- API testing
- End-to-end integration testing

---

# Technology Stack

## Backend

- Python 3
- FastAPI
- SQLAlchemy ORM
- PostgreSQL
- JWT Authentication
- Pydantic

## Web

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router

## Mobile

- React Native
- Expo SDK 54
- Expo Router
- AsyncStorage
- Axios

## Database

- PostgreSQL

---

# Project Structure

```
YieldSense-AI
│
├── backend
│   ├── app
│   │   ├── api
│   │   │   ├── deps.py
│   │   │   └── routes
│   │   │       ├── auth.py
│   │   │       └── datasets.py
│   │   │
│   │   ├── core
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   │
│   │   ├── db
│   │   │   └── database.py
│   │   │
│   │   ├── models
│   │   │   ├── user.py
│   │   │   └── agriculture.py
│   │   │
│   │   ├── schemas
│   │   │   ├── auth.py
│   │   │   └── dataset.py
│   │   │
│   │   ├── services
│   │   │   └── dataset_import_service.py
│   │   │
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── test_db.py
│
├── web
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   │   ├── auth
│   │   │   ├── common
│   │   │   └── datasets
│   │   │
│   │   ├── layouts
│   │   ├── pages
│   │   │   ├── auth
│   │   │   ├── dashboard
│   │   │   ├── datasets
│   │   │   └── profile
│   │   │
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── mobile
│   ├── app
│   │   ├── (auth)
│   │   ├── (protected)
│   │   ├── _layout.jsx
│   │   └── index.jsx
│   │
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   │   ├── auth
│   │   │   ├── common
│   │   │   └── datasets
│   │   │
│   │   ├── constants
│   │   ├── context
│   │   ├── hooks
│   │   ├── services
│   │   ├── storage
│   │   ├── styles
│   │   └── utils
│   │
│   └── package.json
│
└── README.md
```

---

# Authentication Module

## Backend APIs

- Register
- Login
- Logout
- Send OTP
- Verify OTP
- Forgot Password
- Reset Password
- Current User
- Update Profile
- Change Password
- JWT Authentication
- Password Hashing
- Role-Based Access Control

---

## Web Authentication

Implemented pages

- Landing Page
- Register
- Login
- Send OTP
- Verify OTP
- Forgot Password
- Reset Password
- Dashboard
- Profile

Features

- Form validation
- JWT authentication
- Protected routes
- Token management
- Responsive UI

---

## Mobile Authentication

Implemented screens

- Register
- Login
- Send OTP
- Verify OTP
- Forgot Password
- Reset Password
- Dashboard
- Profile

Features

- JWT authentication
- AsyncStorage token persistence
- Protected navigation
- Loading states
- Error handling

---

# Dataset Management

Three datasets are integrated into the project.

## Historical Crop Yield Dataset

Columns

- Crop
- Crop Year
- Season
- State
- Area
- Production
- Annual Rainfall
- Fertilizer
- Pesticide
- Yield

---

## Soil Dataset

Columns

- State
- Nitrogen (N)
- Phosphorus (P)
- Potassium (K)
- pH

---

## Weather Dataset

Columns

- State
- Year
- Average Temperature
- Total Rainfall
- Average Humidity

---

# Dataset APIs

Implemented

## Import APIs

- Import Historical Yield CSV
- Import Soil CSV
- Import Weather CSV

## Read APIs

Historical Yield

- Get Records
- Summary
- Filtering
- Pagination

Soil

- Get Records
- Summary
- Filtering
- Pagination

Weather

- Get Records
- Summary
- Filtering
- Pagination

---

# Web Features

Completed

- Authentication
- Dashboard
- Profile
- Dataset Upload
- Historical Yield Viewer
- Soil Viewer
- Weather Viewer
- Search & Filtering
- Pagination
- Summary Cards
- Admin-only Upload Access

---

# Mobile Features

Completed

- Authentication
- Dashboard
- Profile
- Historical Yield Viewer
- Soil Viewer
- Weather Viewer
- Filters
- Pagination
- Pull-to-Refresh
- Summary Cards

---

# Security Features

- Password hashing
- JWT authentication
- Protected APIs
- Role-based authorization
- Admin-only dataset uploads
- Secure token storage
- Input validation

---

# Testing Completed

## Backend

- Database connection
- Authentication APIs
- Dataset APIs
- Authorization
- Dataset import validation

## Web

- Authentication flow
- Protected routes
- Dataset upload
- Dataset viewing
- Filtering
- Pagination

## Mobile

- Authentication flow
- Token persistence
- Dataset viewing
- Filtering
- Pagination
- Pull-to-refresh

---

# Upcoming Development

The following modules are planned for future milestones:

- Data preprocessing
- Machine Learning model training
- Crop yield prediction
- Weather analytics
- Soil suitability analysis
- AI recommendations
- Analytics dashboard
- Reporting module

---

# Current Milestone

**Weeks 1–2 Completed Successfully**

✔ Project Setup

✔ Authentication System

✔ Dataset Management

✔ Web Application

✔ Mobile Application

✔ Backend APIs

✔ Database Integration

✔ Integration Testing

---

## Author

Infosys Virtual Internship Project

**YieldSense AI – Crop Yield Prediction & Agricultural Productivity Forecasting System**
