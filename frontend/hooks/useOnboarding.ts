// File: frontend/hooks/useOnboarding.ts
"use client";

import { useState } from "react";
import { onboardingService } from "../services/api";
import { ROLE_KEY_MAP } from "../types";
import type { CropOption, OnboardingData, OnboardingRole, OnboardingResponse } from "../types";

const initialState: OnboardingData = {
  role: "Farmer", state: "", district: "", crops: [], fullName: "", email: "", password: "",
};

export function useOnboarding() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [data, setData] = useState<OnboardingData>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setRole = (role: OnboardingRole) => setData((prev) => ({ ...prev, role }));
  const setLocation = (state: string, district: string) => setData((prev) => ({ ...prev, state, district }));
  const toggleCrop = (crop: CropOption) =>
    setData((prev) => ({
      ...prev,
      crops: prev.crops.includes(crop) ? prev.crops.filter((c) => c !== crop) : [...prev.crops, crop],
    }));
  const setAccountField = (field: "fullName" | "email" | "password", value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const nextStep = () => setStep((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : prev));
  const prevStep = () => setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev));

  const isStepValid = (): boolean => {
    if (step === 1) return Boolean(data.role);
    if (step === 2) return data.state.length > 0 && data.district.length > 0;
    if (step === 3)
      return data.crops.length > 0 && data.fullName.length >= 2 && data.email.includes("@") && data.password.length >= 8;
    return false;
  };

  const submit = async (): Promise<OnboardingResponse> => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      return await onboardingService.submit({
        full_name: data.fullName,
        email: data.email,
        password: data.password,
        role: ROLE_KEY_MAP[data.role],
        state: data.state,
        district: data.district,
        crops: data.crops,
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Onboarding failed.");
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return { step, data, setRole, setLocation, toggleCrop, setAccountField, nextStep, prevStep, isStepValid, submit, submitting, submitError };
}