from sqlalchemy import Boolean
from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.orm import relationship

from app.database.base import Base


class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    full_name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )

    password = Column(
        String(255),
        nullable=False
    )

    role_id = Column(
        Integer,
        ForeignKey("roles.id")
    )

    is_active = Column(
        Boolean,
        default=True
    )

    role = relationship(
        "Role",
        back_populates="users"
    )

    farms = relationship(
        "Farm",
        back_populates="owner",
        cascade="all, delete"
    )