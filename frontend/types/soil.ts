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
