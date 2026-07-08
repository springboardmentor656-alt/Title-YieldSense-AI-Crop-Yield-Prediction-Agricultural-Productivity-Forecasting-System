from sqlalchemy import Column
from sqlalchemy import Float
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.base import Base
from sqlalchemy import  String
from sqlalchemy.sql import func



class WeatherRecord(Base):
    __tablename__ = "weather_records"

    id = Column(Integer, primary_key=True, index=True)

    farm_id = Column(
        Integer,
        ForeignKey("farms.id", ondelete="CASCADE")
    )
    farm = relationship(
    "Farm",
    back_populates="weather_records"
)

    temperature = Column(Float)

    humidity = Column(Float)

    rainfall = Column(Float)

    pressure = Column(Float)

    wind_speed = Column(Float)

    weather_condition = Column(String(100))

    weather_icon = Column(String(20))

    recorded_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )