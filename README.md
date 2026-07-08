# Title-YieldSense-AI-Crop-Yield-Prediction-Agricultural-Productivity-Forecasting-System

YieldSense AI is a smart agriculture platform that helps farmers efficiently manage their farms and monitor weather conditions through an intuitive web application. The platform combines modern web technologies with artificial intelligence concepts to support data-driven agricultural decision-making.

The application provides secure authentication, farm management, real-time weather monitoring, and an interactive dashboard to help users access essential agricultural information from a single platform.

---

# ✨ Features

## 🔐 Authentication
- Secure user registration and login
- JWT-based authentication
- Password encryption using BCrypt
- Role-based access (Farmer & Researcher)

---

## 🌾 Farm Management
- Create farms
- View registered farms
- Update farm information
- Delete farms
- Store farm location using latitude and longitude
- Maintain farm area information

---

## 🌦 Weather Monitoring
- Real-time weather information using OpenWeather API
- Temperature
- Humidity
- Rainfall
- Weather dashboard
- Manual weather refresh

---

## 📊 Dashboard
- Total Farms
- Active Crops
- Weather Summary
- Farm Overview
- Interactive dashboard interface

---

## ⚙ Settings
- User settings page
- Secure logout functionality

---

# 🛠 Tech Stack

## Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- React Hook Form
- Zod
- Framer Motion
- Lucide React

---

## Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- JWT Authentication
- BCrypt Password Hashing

---

## Database

- PostgreSQL

---

## External API

- OpenWeather API

---

# 📂 Project Structure

```text
YieldSense-AI
│
├── frontend
│   ├── app
│   ├── components
│   ├── hooks
│   ├── services
│   ├── validators
│   ├── types
│   ├── public
│   └── styles
│
├── backend
│   ├── app
│   │   ├── api
│   │   ├── auth
│   │   ├── config
│   │   ├── database
│   │   ├── middleware
│   │   ├── models
│   │   ├── repositories
│   │   ├── schemas
│   │   ├── services
│   │   └── utils
│   │
│   ├── requirements.txt
│   └── main.py
│
└── README.md
```

---

# ⚙ Installation

## Clone the Repository

```bash
git clone https://github.com/springboardmentor656-alt/Title-YieldSense-AI-Crop-Yield-Prediction-Agricultural-Productivity-Forecasting-System.git
```

```bash
cd YieldSense-AI
```

---

# Backend Setup

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Virtual Environment

**Windows**

```bash
venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment Variables

Create a `.env` file inside the backend directory.

```env
APP_NAME=YieldSense AI
APP_VERSION=1.0.0

DB_HOST=localhost
DB_PORT=5432
DB_NAME=yieldsense
DB_USER=postgres
DB_PASSWORD=your_password

SECRET_KEY=your_secret_key
ALGORITHM=HS256

OPENWEATHER_API_KEY=your_api_key
```

### Start Backend Server

```bash
uvicorn app.main:app --reload
```

Backend:

```
http://localhost:8000
```

Swagger Documentation:

```
http://localhost:8000/docs
```

---

# Frontend Setup

Navigate to the frontend folder.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Start the development server.

```bash
npm run dev
```

Frontend:

```
http://localhost:3000
```

---

# Application Modules

- Authentication
- Dashboard
- Farm Management
- Weather Monitoring
- Settings

---



# License

This project is developed for educational and internship purposes.
