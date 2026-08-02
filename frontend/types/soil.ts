export interface SoilPh {
    ph: number;
    ph_category: string;
    is_valid: boolean;
    yield_multiplier: number;
}

export interface SoilSuitability {
    farm_id: number;
    ph: SoilPh;
    nutrient_score: number;
    fertility_category: string;
    nitrogen: number | null;
    phosphorus: number | null;
    potassium: number | null;
    moisture: number | null;
}

export interface SoilReport {
    id: number;
    farm_id: number;
    farm_name: string | null;
    ph: number;
    nitrogen: number | null;
    phosphorus: number | null;
    potassium: number | null;
    moisture: number | null;
    organic_carbon: number | null;
    ph_category: string;
    nutrient_score: number;
    fertility_category: string;
    soil_health_index: number;
    health_category: "healthy" | "moderate" | "poor";
    created_at: string;
}

export interface SoilReportListResponse {
    items: SoilReport[];
    total: number;
    page: number;
    page_size: number;
}

export interface SoilDashboardStats {
    average_soil_health: number | null;
    healthy_farms: number;
    poor_soil_farms: number;
    total_farms_with_reports: number;
    recent_reports: number;
    total_reports: number;
}

export interface SoilReportInput {
    farm_id: number;
    ph: number;
    nitrogen?: number;
    phosphorus?: number;
    potassium?: number;
    moisture?: number;
    organic_carbon?: number;
}
