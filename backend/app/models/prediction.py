from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class Prediction(Base):

    __tablename__ = "predictions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    crop_id = Column(
        Integer,
        ForeignKey("crops.id", ondelete="CASCADE"),
        nullable=False
    )

    predicted_yield = Column(
        Float,
        nullable=False
    )

    confidence = Column(
        Float,
        nullable=False
    )

    recommendation = Column(
        String(500)
    )

    model_name = Column(
        String(100)
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    crop = relationship(
        "Crop",
        back_populates="predictions"
    )