from fastapi import APIRouter

router = APIRouter()

def soil_status(soil_type, crop_type, soil_ph, nitrogen, phosphorus, potassium):

    # ---------- Soil Health ----------
    if 6.0 <= soil_ph <= 7.5:
        soil_health = "Good"
        ph_status = "Optimal"

    elif soil_ph < 6.0:
        soil_health = "Poor"
        ph_status = "Acidic"

    else:
        soil_health = "Moderate"
        ph_status = "Alkaline"

    # ---------- Nitrogen ----------
    if nitrogen < 50:
        nitrogen_status = "Low"
    elif nitrogen < 100:
        nitrogen_status = "Medium"
    else:
        nitrogen_status = "High"

    # ---------- Phosphorus ----------
    if phosphorus < 30:
        phosphorus_status = "Low"
    elif phosphorus < 60:
        phosphorus_status = "Medium"
    else:
        phosphorus_status = "High"

    # ---------- Potassium ----------
    if potassium < 100:
        potassium_status = "Low"
    elif potassium < 200:
        potassium_status = "Medium"
    else:
        potassium_status = "High"

    # ---------- Fertilizer Recommendation ----------
    fertilizer = []

    if nitrogen_status == "Low":
        fertilizer.append("Nitrogen")

    if phosphorus_status == "Low":
        fertilizer.append("Phosphorus")

    if potassium_status == "Low":
        fertilizer.append("Potassium")

    if fertilizer:
        fertilizer_recommendation = (
            "Apply " + ", ".join(fertilizer) + " fertilizer."
        )
    else:
        fertilizer_recommendation = (
            "Balanced NPK fertilizer is sufficient."
        )

    # ---------- Irrigation ----------
    if soil_ph < 5.5:
        irrigation = "Increase irrigation"

    elif soil_ph > 8:
        irrigation = "Reduce irrigation"

    else:
        irrigation = "Moderate irrigation"

    # ---------- Crop Suitability ----------
    if soil_health == "Good":
        crop_suitability = f"{crop_type} is suitable for this soil."
    else:
        crop_suitability = (
            f"Improve soil conditions before cultivating {crop_type}."
        )

    return {

        "soil_health": soil_health,

        "ph_status": ph_status,

        "nitrogen_status": nitrogen_status,

        "phosphorus_status": phosphorus_status,

        "potassium_status": potassium_status,

        "fertilizer": fertilizer_recommendation,

        "irrigation": irrigation,

        "crop_suitability": crop_suitability

    }