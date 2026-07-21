export interface PredictionRequest {
    farm_id: number;
    temperature?: number;
    rainfall?: number;
    soil_ph?: number;
}

export interface SeasonComparison {
    average_past_yield?: number;
    delta_pct?: number;
}

export interface PredictionResult {
    predicted_yield: number;
    confidence: number;
    model_used: string;
    timestamp: string;
    risk_level: string;
    season_comparison: SeasonComparison | null;
    trend_forecast: string | null;
}

export interface PredictionHistoryFeatures {
    temperature: number;
    rainfall: number;
    soil_ph: number;
    crop: string;
}

export interface PredictionHistoryEntry {
    id: number;
    farm_id: number;
    prediction: number;
    model_version: string;
    features: PredictionHistoryFeatures;
    created_at: string;
}
