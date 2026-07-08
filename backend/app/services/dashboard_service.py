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