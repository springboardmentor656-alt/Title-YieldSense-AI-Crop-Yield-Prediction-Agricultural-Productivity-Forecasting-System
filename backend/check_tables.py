from sqlalchemy import inspect

from app.db.database import engine

inspector = inspect(engine)

print("Database URL:", engine.url.render_as_string(hide_password=True))
print("\nTables:")

for table_name in inspector.get_table_names():
    print("-", table_name)