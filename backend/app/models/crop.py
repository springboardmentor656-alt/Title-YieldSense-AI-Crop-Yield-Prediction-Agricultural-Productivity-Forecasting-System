from sqlalchemy import Column, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database.base import Base


class Crop(Base):

    __tablename__ = "crops"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    crop_name = Column(
        String(100),
        nullable=False
    )

    hectares_planted = Column(Float)

    farm_id = Column(
        Integer,
        ForeignKey("farms.id", ondelete="CASCADE"),
        nullable=False
    )

    farm = relationship(
        "Farm",
        back_populates="crops"
    )

    predictions = relationship(
        "Prediction",
        back_populates="crop",
        cascade="all, delete-orphan"
    )