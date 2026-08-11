export interface YieldTrendPointFarm {
    date: string;
    predicted_yield: number;
    crop: string | null;
}

export interface YieldTrendResponse {
    farm_id: number;
    points: YieldTrendPointFarm[];
}

export interface FarmComparisonEntry {
    farm_id: number;
    farm_name: string;
    crop_name: string | null;
    latest_yield: number | null;
    average_yield: number | null;
    prediction_count: number;
}

export interface ProductivityScore {
    productivity_score: number | null;
    latest_yield: number | null;
    average_yield: number | null;
    sample_size: number;
    interpretation: string | null;
}

export interface SeasonalComparisonPoint {
    season: string;
    yield: number;
    count: number;
}

export interface DashboardYieldTrendPoint {
    date: string;
    yield: number;
    farm_id: number;
    crop: string | null;
}

export interface WeatherSummary {
    temperature: number;
    humidity: number;
    rainfall: number;
}

export interface DashboardSummary {
    total_farms: number;
    total_crops: number;
    prediction_accuracy: number;
    weather_alerts: number;
    weather: WeatherSummary | null;
    productivity_score: ProductivityScore;
    yield_trend: DashboardYieldTrendPoint[];
    seasonal_comparison: SeasonalComparisonPoint[];
    farm_comparison: FarmComparisonEntry[];
}
