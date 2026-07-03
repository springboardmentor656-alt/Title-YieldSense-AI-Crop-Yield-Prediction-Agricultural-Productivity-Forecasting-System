// Shared TypeScript types mirroring backend Pydantic schemas.
// File: frontend/types/index.ts

export type UserRole = "farmer" | "cooperative" | "agribusiness" | "government" | "admin";

export type OnboardingRole =
  | "Farmer"
  | "Cooperative Member"
  | "Agribusiness"
  | "Government Officer";

// Maps the display label shown in the UI to the backend role key.
export const ROLE_KEY_MAP: Record<OnboardingRole, UserRole> = {
  "Farmer": "farmer",
  "Cooperative Member": "cooperative",
  "Agribusiness": "agribusiness",
  "Government Officer": "government",
};

export type CropOption = "Rice" | "Cotton" | "Wheat" | "Maize";

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  role: UserRole;
  expires_in_minutes: number;
}

export interface OnboardingRequest {
  full_name: string;
  email: string;
  password: string;
  role: UserRole;
  state: string;
  district: string;
  crops: CropOption[];
}

export interface OnboardingResponse {
  access_token: string;
  token_type: string;
  role: UserRole;
  farm_id: string;
  expires_in_minutes: number;
}

export interface OnboardingData {
  role: OnboardingRole;
  state: string;
  district: string;
  crops: CropOption[];
  fullName: string;
  email: string;
  password: string;
}

export interface YieldPrediction {
  crop: CropOption;
  predicted_yield_kg_per_ha: number;
  confidence_score: number;
  model_version: string;
}