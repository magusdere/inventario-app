from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import SessionLocal
from models.categoria import Categoria
from schemas.categoria import CategoriaBase, CategoriaResponse
from typing import List

router = APIRouter(prefix="/categorias", tags=["Categorías"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Listar todas las categorías
@router.get("/", response_model=List[CategoriaResponse])
def listar_categorias(db: Session = Depends(get_db)):
    return db.query(Categoria).all()

# Crear una nueva categoría
@router.post("/", response_model=CategoriaResponse)
def crear_categoria(categoria: CategoriaBase, db: Session = Depends(get_db)):
    nueva = Categoria(nombre=categoria.nombre, descripcion=categoria.descripcion)
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

# Actualizar categoría
@router.put("/{id}", response_model=CategoriaResponse)
def actualizar_categoria(id: int, categoria: CategoriaBase, db: Session = Depends(get_db)):
    cat = db.query(Categoria).filter(Categoria.id == id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    cat.nombre = categoria.nombre
    cat.descripcion = categoria.descripcion
    db.commit()
    db.refresh(cat)
    return cat

# Eliminar categoría
@router.delete("/{id}")
def eliminar_categoria(id: int, db: Session = Depends(get_db)):
    cat = db.query(Categoria).filter(Categoria.id == id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    db.delete(cat)
    db.commit()
    return {"msg": "Categoría eliminada correctamente"}
