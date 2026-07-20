from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

# this is the Alembic Config object, which provides
# access to values within the .ini file in use.
config = context.config
from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

config = context.config

# --- our additions start here ---
import os
from dotenv import load_dotenv
from app.models.user import Base   # wherever your SQLAlchemy Base lives

load_dotenv()
config.set_main_option("sqlalchemy.url", os.getenv("DATABASE_URL"))
target_metadata = Base.metadata
# --- our additions end here ---