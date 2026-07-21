from app.repositories.dashboard_repository import (
    DashboardRepository
)


class DashboardService:
    def __init__(self, db):

        self.repo = DashboardRepository(db)

    def summary(self, user_id):

        weather = self.repo.latest_weather(user_id)

        return {

            "total_farms":

                self.repo.total_farms(user_id),

            "total_crops":

                self.repo.total_crops(user_id),

            "prediction_accuracy":

                self.repo.prediction_accuracy(),

            "weather_alerts": 0,

            "weather":

                {

                    "temperature":

                        weather.temperature

                        if weather else 0,

                    "humidity":

                        weather.humidity

                        if weather else 0,

                    "rainfall":

                        weather.rainfall

                        if weather else 0,

                }

        }

    def prediction_analytics(self, user_id):

        average, highest, lowest, count = (
            self.repo.prediction_summary(user_id)
        )

        trend_rows = self.repo.monthly_prediction_trend(user_id)

        return {
            "average_predicted_yield": (
                round(average, 2) if average is not None else 0
            ),
            "highest_prediction": (
                round(highest, 2) if highest is not None else 0
            ),
            "lowest_prediction": (
                round(lowest, 2) if lowest is not None else 0
            ),
            "prediction_count": count or 0,
            "monthly_trend": [
                {
                    "month": row.month.strftime("%Y-%m"),
                    "average_yield": round(row.average_yield, 2),
                    "count": row.count,
                }
                for row in trend_rows
            ],
        }