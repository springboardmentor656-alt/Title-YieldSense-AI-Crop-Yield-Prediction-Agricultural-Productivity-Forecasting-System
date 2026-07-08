-- ==========================================================
-- YieldSense AI Database Schema
-- PostgreSQL
-- ==========================================================

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE users (

    id SERIAL PRIMARY KEY,

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    role_id INTEGER NOT NULL,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(role_id)
        REFERENCES roles(id)
);

CREATE TABLE farms (

    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    farm_name VARCHAR(100) NOT NULL,

    latitude NUMERIC(9,6),

    longitude NUMERIC(9,6),

    area NUMERIC(10,2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE crops (

    id SERIAL PRIMARY KEY,

    farm_id INTEGER NOT NULL,

    crop_name VARCHAR(100),

    hectares_planted NUMERIC(10,2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(farm_id)
        REFERENCES farms(id)
        ON DELETE CASCADE
);

CREATE TABLE soil_reports (

    id SERIAL PRIMARY KEY,

    farm_id INTEGER NOT NULL,

    nitrogen NUMERIC(6,2),

    phosphorus NUMERIC(6,2),

    potassium NUMERIC(6,2),

    ph NUMERIC(4,2),

    moisture NUMERIC(6,2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(farm_id)
        REFERENCES farms(id)
        ON DELETE CASCADE
);

CREATE TABLE weather_records (

    id SERIAL PRIMARY KEY,

    farm_id INTEGER NOT NULL,

    temperature NUMERIC(6,2),

    humidity NUMERIC(6,2),

    rainfall NUMERIC(8,2),

    pressure NUMERIC(8,2),

    wind_speed NUMERIC(8,2),

    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(farm_id)
        REFERENCES farms(id)
        ON DELETE CASCADE
);

CREATE TABLE predictions (

    id SERIAL PRIMARY KEY,

    crop_id INTEGER NOT NULL,

    predicted_yield NUMERIC(10,2),

    confidence NUMERIC(5,2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(crop_id)
        REFERENCES crops(id)
        ON DELETE CASCADE
);

CREATE TABLE activity_logs (

    id SERIAL PRIMARY KEY,

    user_id INTEGER,

    action TEXT,

    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(user_id)
        REFERENCES users(id)
);