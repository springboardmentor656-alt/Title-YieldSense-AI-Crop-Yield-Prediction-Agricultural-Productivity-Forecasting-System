from sqlalchemy import create_engine

DATABASE_URL = "postgresql://postgres:Lovely%40123@localhost:5432/yieldsense_db"

engine = create_engine(DATABASE_URL)

try:
    connection = engine.connect()
    print("Database connected successfully")
    connection.close()

except Exception as e:
    print("Database connection failed", e)