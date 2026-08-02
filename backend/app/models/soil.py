from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import Float
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class SoilReport(Base):

    __tablename__ = "soil_reports"

    id = Column(
        Integer,
        primary_key=True
    )

    nitrogen = Column(Float)

    phosphorus = Column(Float)

    potassium = Column(Float)

    ph = Column(Float)

    moisture = Column(Float)

    organic_carbon = Column(Float)

    farm_id = Column(
        Integer,
        ForeignKey("farms.id")
    )

    farm = relationship(
        "Farm",
        back_populates="soil_reports"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )