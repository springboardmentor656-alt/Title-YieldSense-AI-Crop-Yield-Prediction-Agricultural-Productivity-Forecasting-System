from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.base import Base


class ActivityLog(Base):

    __tablename__ = "activity_logs"

    id = Column(
        Integer,
        primary_key=True
    )

    action = Column(
        String(255),
        nullable=False
    )

    timestamp = Column(
        DateTime,
        default=datetime.utcnow
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    user = relationship("User")