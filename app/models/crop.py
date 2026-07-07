from sqlalchemy import Column, Integer, String
from app.database.base import Base


class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    season = Column(String)