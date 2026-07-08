from sqlalchemy import Column
from sqlalchemy import Float
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.orm import relationship

from app.database.base import Base


class Farm(Base):

    __tablename__ = "farms"

    id = Column(Integer, primary_key=True, index=True)

    farm_name = Column(String(100), nullable=False)

    latitude = Column(Float, nullable=False)

    longitude = Column(Float, nullable=False)

    area = Column(Float, nullable=False)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    owner = relationship(
        "User",
        back_populates="farms"
    )

    crops = relationship(
        "Crop",
        back_populates="farm",
        cascade="all, delete-orphan"
    )

    soil_reports = relationship(
        "SoilReport",
        back_populates="farm",
        cascade="all, delete-orphan"
    )

    weather_records = relationship(
        "WeatherRecord",
        back_populates="farm",
        cascade="all, delete-orphan"
    )