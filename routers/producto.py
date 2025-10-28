from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config.database import SessionLocal
from models.producto import Producto

router = APIRouter(prefix="/productos", tags=["Productos"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def listar_productos(db: Session = Depends(get_db)):
    productos = db.query(Producto).all()
    return productos
