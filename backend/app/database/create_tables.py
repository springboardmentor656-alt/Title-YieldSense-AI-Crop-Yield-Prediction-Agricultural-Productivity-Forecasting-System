from app.database.base import Base
from app.database.connection import engine

from app.database.session import SessionLocal
from app.database.seed_roles import seed_roles

from app.models import *

Base.metadata.create_all(bind=engine)

db = SessionLocal()

seed_roles(db)

db.close()

print("Database Created Successfully")