# config/database.py
from os import getenv
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Puedes cargar dotenv si querés:
# from dotenv import load_dotenv; load_dotenv()

DB_USER = getenv("DB_USER", "root")
DB_PASSWORD = getenv("DB_PASSWORD", "12345")
DB_HOST = getenv("DB_HOST", "localhost")
DB_NAME = getenv("DB_NAME", "inventarios_db")

DATABASE_URL = f"mysql+asyncmy://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

engine = create_async_engine(
    DATABASE_URL,
    echo=False,           # ponelo True si querés ver SQL en consola
    pool_pre_ping=True,
    future=True,
)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)

Base = declarative_base()

# Dependency FastAPI
async def get_async_db():
    async with AsyncSessionLocal() as session:
        yield session
