from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DB_USER = "root"
DB_PASSWORD = "12345"
DB_HOST = "localhost"
DB_NAME = "inventarios_db"

SQLALCHEMY_DATABASE_URL = f"mysql+asyncmy://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

engine = create_engine(SQLALCHEMY_DATABASE_URL.replace("asyncmy", "mysqlconnector"))
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
