export interface Recommendation {
    farm_id: number;
    crop_suggestions: string[];
    fertilizer_advice: string;
    irrigation_plan: string;
    pest_management_tips: string[];
    best_practices: string[];
}

export interface RiskEntry {
    type: string;
    severity: "Low" | "Medium" | "High";
    advice: string;
}

export interface RiskAssessment {
    farm_id: number;
    overall_risk_level: "Low" | "Medium" | "High";
    risks: RiskEntry[];
}
