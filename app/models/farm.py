from sqlalchemy import Column, Integer, String, Float, ForeignKey

from app.database.base import Base


class Farm(Base):
    __tablename__ = "farms"

    id = Column(Integer, primary_key=True, index=True)

    farm_name = Column(String, nullable=False)

    location = Column(String, nullable=False)

    latitude = Column(Float, nullable=False)

    longitude = Column(Float, nullable=False)

    ph = Column(Float, nullable=False)

    nitrogen = Column(Float, nullable=False)

    phosphorus = Column(Float, nullable=False)

    potassium = Column(Float, nullable=False)

    rainfall = Column(Float, nullable=False)

    humidity = Column(Float, nullable=False)

    temperature = Column(Float, nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"))