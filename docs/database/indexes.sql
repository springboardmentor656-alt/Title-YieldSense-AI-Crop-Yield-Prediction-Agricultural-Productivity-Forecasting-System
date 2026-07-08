CREATE INDEX idx_user_email
ON users(email);

CREATE INDEX idx_farm_user
ON farms(user_id);

CREATE INDEX idx_crop_farm
ON crops(farm_id);

CREATE INDEX idx_prediction_crop
ON predictions(crop_id);

CREATE INDEX idx_weather_farm
ON weather_records(farm_id);

CREATE INDEX idx_soil_farm
ON soil_reports(farm_id);