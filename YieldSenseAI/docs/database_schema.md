# Database Schema - YieldSense AI

## 1. Relational Database Schema (PostgreSQL)

The structured tables are mapped out inside `backend/app/models.py` and cover the core business entities.

### Schema Definition
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Farmer' -- 'Farmer', 'Admin'
);

CREATE TABLE farms (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    farm_name VARCHAR(100),
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    soil_ph NUMERIC(3,2)
);

CREATE TABLE crops (
    id SERIAL PRIMARY KEY,
    farm_id INT REFERENCES farms(id) ON DELETE CASCADE,
    crop_name VARCHAR(100),
    hectares_planted NUMERIC(10,2)
);
```

### Table Relationships
- **users $\rightarrow$ farms**: One-to-many relationship. A user can own multiple farms.
- **farms $\rightarrow$ crops**: One-to-many relationship. A farm can contain multiple planted crop items.

---

## 2. Unstructured Database Schema (MongoDB)
MongoDB is used for logging weather updates, high-frequency soil NPK logs, and historical prediction runs.

### Model Metrics Log Document Structure
```json
{
  "_id": "ObjectId",
  "farm_id": 1,
  "crop_id": 2,
  "prediction_timestamp": "2026-07-01T12:00:00Z",
  "input_metrics": {
    "avg_temp": 24.5,
    "precipitation": 120.2,
    "soil_moisture": 35.0,
    "pesticides_used": 2.5
  },
  "predicted_yield_hg_ha": 34500.0,
  "model_version": "xgboost_v1.0"
}
```
