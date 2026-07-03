# 🌾 YieldSense AI 
## Crop Yield Prediction & Agricultural Productivity Forecasting

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![Next.js](https://img.shields.io/badge/Next.js-Frontend-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 📖 Overview

**YieldSense AI** is an AI-powered web platform designed to help farmers and agricultural organizations make informed decisions by predicting crop yields using environmental, soil, and farm data.

The platform combines machine learning with a modern web interface to provide accurate yield predictions, farm management tools, and insightful visualizations that improve agricultural productivity.

---

## ✨ Features

* 🔐 Secure User Authentication (JWT)
* 🌱 Farm Registration & Management
* 📊 Interactive Dashboard
* 🤖 AI-Based Crop Yield Prediction
* 🧪 Soil Data Management
* 📈 Agricultural Analytics
* 📱 Responsive User Interface
* 🔒 Secure REST API using FastAPI

---

## 🛠 Tech Stack

### Frontend

* Next.js 14
* TypeScript
* Tailwind CSS

### Backend

* FastAPI
* Python
* JWT Authentication
* Pydantic

### Database

* PostgreSQL

### Machine Learning

* Pandas
* NumPy
* Scikit-learn

---

## 📂 Project Structure

```text
YieldSense-AI/
│
├── yieldsense-backend/
│   ├── routers/
│   ├── auth_handler.py
│   ├── database.py
│   ├── preprocess.py
│   ├── schema.sql
│   └── main.py
│
├── yieldsense-frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── public/
│
└── README.md
```

---

## 🚀 Getting Started

 ### Installation

git clone https://github.com/your-username/YieldSense-AI.git
cd YieldSense-AI

### Backend

cd yieldsense-backend
pip install -r requirements.txt
uvicorn main:app --reload

### Frontend

cd yieldsense-frontend
npm install
npm run dev