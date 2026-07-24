from collections import defaultdict
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func

from app import models
from app.ml.predictor import get_model_metrics


class AnalyticsService:

    @staticmethod
    def _get_user_farm_ids(db: Session, user_id: int):
        return [
            farm.id
            for farm in db.query(models.Farm.id)
            .filter(models.Farm.user_id == user_id)
            .all()
        ]

    @staticmethod
    def _risk_counts(predictions):
        result = {
            "Low": 0,
            "Medium": 0,
            "High": 0
        }

        for p in predictions:
            if p.risk_level in result:
                result[p.risk_level] += 1

        return result

    @staticmethod
    def dashboard(db: Session, user_id: int):

        farm_ids = AnalyticsService._get_user_farm_ids(db, user_id)

        total_users = db.query(func.count(models.User.id)).scalar() or 0

        total_farms = len(farm_ids)

        total_predictions = (
            db.query(func.count(models.Prediction.id))
            .filter(models.Prediction.farm_id.in_(farm_ids))
            .scalar()
            if farm_ids else 0
        )

        total_area = (
            db.query(func.sum(models.Farm.area_hectares))
            .filter(models.Farm.id.in_(farm_ids))
            .scalar()
            or 0
        )

        avg_yield = (
            db.query(func.avg(models.Prediction.predicted_yield_tons_per_ha))
            .filter(models.Prediction.farm_id.in_(farm_ids))
            .scalar()
            or 0
        )

        highest_yield = (
            db.query(func.max(models.Prediction.predicted_yield_tons_per_ha))
            .filter(models.Prediction.farm_id.in_(farm_ids))
            .scalar()
            or 0
        )

        lowest_yield = (
            db.query(func.min(models.Prediction.predicted_yield_tons_per_ha))
            .filter(models.Prediction.farm_id.in_(farm_ids))
            .scalar()
            or 0
        )

        average_confidence = (
            db.query(func.avg(models.Prediction.confidence_score))
            .filter(models.Prediction.farm_id.in_(farm_ids))
            .scalar()
            or 0
        )

        average_soil_ph = (
            db.query(func.avg(models.SoilAnalysis.ph))
            .join(models.Farm)
            .filter(models.Farm.user_id == user_id)
            .scalar()
            or 0
        )

        average_fertility = (
            db.query(func.avg(models.SoilAnalysis.fertility_score))
            .join(models.Farm)
            .filter(models.Farm.user_id == user_id)
            .scalar()
            or 0
        )

        predictions = (
            db.query(models.Prediction)
            .filter(models.Prediction.farm_id.in_(farm_ids))
            .all()
            if farm_ids else []
        )

        risks = AnalyticsService._risk_counts(predictions)

        crop_stats = defaultdict(list)

        for p in predictions:
            crop_stats[p.crop_type].append(
                p.predicted_yield_tons_per_ha
            )

        best_crop = None
        best_avg = 0

        for crop, yields in crop_stats.items():

            avg = sum(yields) / len(yields)

            if avg > best_avg:
                best_avg = avg
                best_crop = crop

        metrics = get_model_metrics()

        return {

            "total_users": total_users,

            "total_farms": total_farms,

            "active_farms": total_farms,

            "total_predictions": total_predictions,

            "total_area_hectares": round(total_area, 2),

            "average_yield": round(avg_yield, 2),

            "highest_yield": round(highest_yield, 2),

            "lowest_yield": round(lowest_yield, 2),

            "average_confidence": round(average_confidence, 2),

            "average_soil_ph": round(average_soil_ph, 2),

            "average_fertility": round(average_fertility, 2),

            "best_crop": best_crop,

            "high_risk": risks["High"],

            "medium_risk": risks["Medium"],

            "low_risk": risks["Low"],

            "model_accuracy": metrics.get(
                "accuracy_percent",
                0
            ),

            "mae": metrics.get(
                "mae",
                0
            ),

            "rmse": metrics.get(
                "rmse",
                0
            ),

            "training_samples": metrics.get(
                "training_samples",
                0
            ),

            "n_crops": metrics.get(
                "n_crops",
                0
            )
        }

    @staticmethod
    def yield_trends(db: Session, user_id: int):

        farm_ids = AnalyticsService._get_user_farm_ids(db, user_id)

        if not farm_ids:
            return {
                "yield_trend": [],
                "total_predictions": 0,
                "best_yield": 0,
                "worst_yield": 0,
                "average_yield": 0
            }

        predictions = (
            db.query(models.Prediction)
            .filter(models.Prediction.farm_id.in_(farm_ids))
            .order_by(models.Prediction.created_at)
            .all()
        )

        monthly = defaultdict(list)

        for p in predictions:
            key = p.created_at.strftime("%b %Y")
            monthly[key].append(p.predicted_yield_tons_per_ha)

        trend = []

        for month, values in monthly.items():

            trend.append({
                "month": month,
                "average_yield": round(sum(values) / len(values), 2),
                "maximum_yield": round(max(values), 2),
                "minimum_yield": round(min(values), 2),
                "prediction_count": len(values)
            })

        avg = (
            sum(
                p.predicted_yield_tons_per_ha
                for p in predictions
            ) / len(predictions)
            if predictions else 0
        )

        return {

            "yield_trend": trend,

            "total_predictions": len(predictions),

            "average_yield": round(avg, 2),

            "best_yield": max(
                (
                    p.predicted_yield_tons_per_ha
                    for p in predictions
                ),
                default=0
            ),

            "worst_yield": min(
                (
                    p.predicted_yield_tons_per_ha
                    for p in predictions
                ),
                default=0
            )
        }


    @staticmethod
    def crop_performance(db: Session, user_id: int):

        farm_ids = AnalyticsService._get_user_farm_ids(db, user_id)

        if not farm_ids:
            return {
                "crop_performance": []
            }

        predictions = (
            db.query(models.Prediction)
            .filter(models.Prediction.farm_id.in_(farm_ids))
            .all()
        )

        crops = defaultdict(list)

        for p in predictions:
            crops[p.crop_type].append(p)

        report = []

        for crop_name, crop_predictions in crops.items():

            yields = [
                p.predicted_yield_tons_per_ha
                for p in crop_predictions
            ]

            confidence = [
                p.confidence_score
                for p in crop_predictions
            ]

            risks = defaultdict(int)

            for item in crop_predictions:
                risks[item.risk_level] += 1

            dominant_risk = max(
                risks.items(),
                key=lambda x: x[1]
            )[0]

            latest_prediction = max(
                crop_predictions,
                key=lambda x: x.created_at
            )

            report.append({

                "crop": crop_name,

                "prediction_count": len(crop_predictions),

                "average_yield": round(
                    sum(yields) / len(yields),
                    2
                ),

                "highest_yield": round(
                    max(yields),
                    2
                ),

                "lowest_yield": round(
                    min(yields),
                    2
                ),

                "average_confidence": round(
                    sum(confidence) / len(confidence),
                    2
                ),

                "risk_level": dominant_risk,

                "latest_prediction": latest_prediction.created_at,

                "latest_yield": latest_prediction.predicted_yield_tons_per_ha
            })

        report.sort(
            key=lambda x: x["average_yield"],
            reverse=True
        )

        return {

            "crop_performance": report,

            "total_crop_types": len(report),

            "best_crop": report[0]["crop"] if report else None,

            "highest_average_yield": (
                report[0]["average_yield"]
                if report else 0
            )
        }
    @staticmethod
    def farm_comparison(db: Session, user_id: int):

        farms = (
            db.query(models.Farm)
            .filter(models.Farm.user_id == user_id)
            .all()
        )

        comparison = []

        for farm in farms:

            predictions = (
                db.query(models.Prediction)
                .filter(models.Prediction.farm_id == farm.id)
                .all()
            )

            if predictions:

                yields = [
                    p.predicted_yield_tons_per_ha
                    for p in predictions
                ]

                avg_yield = sum(yields) / len(yields)

                best_yield = max(yields)

                worst_yield = min(yields)

                avg_confidence = (
                    sum(
                        p.confidence_score
                        for p in predictions
                    ) / len(predictions)
                )

                productivity_score = min(
                    100,
                    round((avg_yield / 6) * 100, 1)
                )

            else:

                avg_yield = 0
                best_yield = 0
                worst_yield = 0
                avg_confidence = 0
                productivity_score = 0

            comparison.append({

                "farm_id": farm.id,

                "farm_name": farm.farm_name,

                "location": farm.location,

                "area_hectares": farm.area_hectares,

                "soil_ph": farm.soil_ph,

                "soil_type": farm.soil_type,

                "prediction_count": len(predictions),

                "average_yield": round(avg_yield, 2),

                "highest_yield": round(best_yield, 2),

                "lowest_yield": round(worst_yield, 2),

                "average_confidence": round(avg_confidence, 2),

                "productivity_score": productivity_score,

                "crops": list(
                    sorted(
                        {
                            p.crop_type
                            for p in predictions
                        }
                    )
                )

            })

        comparison.sort(
            key=lambda x: x["productivity_score"],
            reverse=True
        )

        for index, farm in enumerate(comparison):
            farm["rank"] = index + 1

        return {

            "total_farms": len(comparison),

            "farm_comparison": comparison

        }


    @staticmethod
    def productivity(db: Session, user_id: int):

        farms = (
            db.query(models.Farm)
            .filter(models.Farm.user_id == user_id)
            .all()
        )

        farm_ids = [f.id for f in farms]

        predictions = (
            db.query(models.Prediction)
            .filter(models.Prediction.farm_id.in_(farm_ids))
            .all()
            if farm_ids else []
        )

        total_area = sum(
            f.area_hectares or 0
            for f in farms
        )

        if predictions:

            avg_yield = (
                sum(
                    p.predicted_yield_tons_per_ha
                    for p in predictions
                )
                / len(predictions)
            )

            production = avg_yield * total_area

            revenue = production * 2500

            productivity_score = min(
                100,
                round((avg_yield / 6) * 100, 1)
            )

            if productivity_score >= 90:
                rating = "Excellent"

            elif productivity_score >= 75:
                rating = "Very Good"

            elif productivity_score >= 60:
                rating = "Good"

            elif productivity_score >= 40:
                rating = "Average"

            else:
                rating = "Poor"

        else:

            avg_yield = 0
            production = 0
            revenue = 0
            productivity_score = 0
            rating = "No Data"

        excellent = 0
        good = 0
        average = 0
        poor = 0

        for farm in farms:

            preds = (
                db.query(models.Prediction)
                .filter(models.Prediction.farm_id == farm.id)
                .all()
            )

            if not preds:
                continue

            score = (
                sum(
                    p.predicted_yield_tons_per_ha
                    for p in preds
                ) / len(preds)
            )

            score = min(
                100,
                (score / 6) * 100
            )

            if score >= 90:
                excellent += 1

            elif score >= 70:
                good += 1

            elif score >= 40:
                average += 1

            else:
                poor += 1

        return {

            "total_area_hectares": round(
                total_area,
                2
            ),

            "average_yield_tons_per_ha": round(
                avg_yield,
                2
            ),

            "estimated_production_tons": round(
                production,
                2
            ),

            "estimated_revenue_inr": round(
                revenue,
                2
            ),

            "productivity_score": productivity_score,

            "performance_rating": rating,

            "excellent_farms": excellent,

            "good_farms": good,

            "average_farms": average,

            "poor_farms": poor

        }
        @staticmethod
        def risk_distribution(db: Session, user_id: int):

           farm_ids = AnalyticsService._get_user_farm_ids(db, user_id)

        predictions = (
            db.query(models.Prediction)
            .filter(models.Prediction.farm_id.in_(farm_ids))
            .all()
            if farm_ids else []
        )

        low = 0
        medium = 0
        high = 0

        for prediction in predictions:

            if prediction.risk_level == "Low":
                low += 1

            elif prediction.risk_level == "Medium":
                medium += 1

            elif prediction.risk_level == "High":
                high += 1

        total = len(predictions)

        return {

            "total_predictions": total,

            "low": low,

            "medium": medium,

            "high": high,

            "low_percent": round((low / total) * 100, 2) if total else 0,

            "medium_percent": round((medium / total) * 100, 2) if total else 0,

            "high_percent": round((high / total) * 100, 2) if total else 0

        }


    @staticmethod
    def soil_health(db: Session, user_id: int):

        analyses = (
            db.query(models.SoilAnalysis)
            .join(models.Farm)
            .filter(models.Farm.user_id == user_id)
            .all()
        )

        if not analyses:

            return {

                "total_analyses": 0,

                "average_ph": 0,

                "average_fertility": 0,

                "healthy_soils": 0,

                "acidic_soils": 0,

                "alkaline_soils": 0

            }

        avg_ph = (
            sum(a.ph for a in analyses)
            / len(analyses)
        )

        avg_fertility = (
            sum(a.fertility_score for a in analyses if a.fertility_score is not None)
            / len([a for a in analyses if a.fertility_score is not None])
        )

        healthy = 0
        acidic = 0
        alkaline = 0

        for soil in analyses:

            if soil.ph < 6:
                acidic += 1

            elif soil.ph > 7.5:
                alkaline += 1

            else:
                healthy += 1

        return {

            "total_analyses": len(analyses),

            "average_ph": round(avg_ph, 2),

            "average_fertility": round(avg_fertility, 2),

            "healthy_soils": healthy,

            "acidic_soils": acidic,

            "alkaline_soils": alkaline

        }


    @staticmethod
    def weather_impact(db: Session, user_id: int):

        farm_ids = AnalyticsService._get_user_farm_ids(db, user_id)

        predictions = (
            db.query(models.Prediction)
            .filter(models.Prediction.farm_id.in_(farm_ids))
            .all()
            if farm_ids else []
        )

        if not predictions:

            return {

                "average_temperature": 0,

                "average_rainfall": 0,

                "average_humidity": 0,

                "average_yield": 0

            }

        return {

            "average_temperature": round(
                sum(p.temperature_c for p in predictions) / len(predictions),
                2
            ),

            "average_rainfall": round(
                sum(p.rainfall_mm for p in predictions) / len(predictions),
                2
            ),

            "average_humidity": round(
                sum(p.humidity_percent for p in predictions) / len(predictions),
                2
            ),

            "average_yield": round(
                sum(p.predicted_yield_tons_per_ha for p in predictions) / len(predictions),
                2
            )

        }


    @staticmethod
    def recent_predictions(db: Session, user_id: int, limit: int = 10):

        farm_ids = AnalyticsService._get_user_farm_ids(db, user_id)

        predictions = (
            db.query(models.Prediction)
            .filter(models.Prediction.farm_id.in_(farm_ids))
            .order_by(models.Prediction.created_at.desc())
            .limit(limit)
            .all()
            if farm_ids else []
        )

        return [

            {

                "id": prediction.id,

                "farm_id": prediction.farm_id,

                "crop_type": prediction.crop_type,

                "yield": prediction.predicted_yield_tons_per_ha,

                "confidence": prediction.confidence_score,

                "risk": prediction.risk_level,

                "temperature": prediction.temperature_c,

                "rainfall": prediction.rainfall_mm,

                "humidity": prediction.humidity_percent,

                "created_at": prediction.created_at

            }

            for prediction in predictions

        ]


    @staticmethod
    def model_performance():

        metrics = get_model_metrics()

        return {

            "accuracy": metrics.get("accuracy_percent", 0),

            "mae": metrics.get("mae", 0),

            "rmse": metrics.get("rmse", 0),

            "training_samples": metrics.get("training_samples", 0),

            "number_of_crops": metrics.get("n_crops", 0),

            "algorithm": "XGBoost",

            "status": "Production"

        }