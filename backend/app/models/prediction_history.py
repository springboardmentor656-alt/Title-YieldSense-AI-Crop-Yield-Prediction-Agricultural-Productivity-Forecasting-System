from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    JSON,
    String,
)
from sqlalchemy.sql import func

from app.database.base import Base


class PredictionHistory(Base):

    __tablename__ = "prediction_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    farm_id = Column(
        Integer,
        ForeignKey("farms.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    features = Column(
        JSON,
        nullable=False
    )

    prediction = Column(
        Float,
        nullable=False
    )

    actual_yield = Column(
        Float,
        nullable=True
    )

    model_version = Column(
        String(100),
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        index=True
    )
