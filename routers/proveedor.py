from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import SessionLocal
from models.proveedor import Proveedor
from schemas.proveedor import ProveedorBase, ProveedorResponse
from typing import List

router = APIRouter(prefix="/proveedores", tags=["Proveedores"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Listar todos los proveedores
@router.get("/", response_model=List[ProveedorResponse])
def listar_proveedores(db: Session = Depends(get_db)):
    return db.query(Proveedor).all()

# Obtener proveedor por ID
@router.get("/{id}", response_model=ProveedorResponse)
def obtener_proveedor(id: int, db: Session = Depends(get_db)):
    prov = db.query(Proveedor).filter(Proveedor.id == id).first()
    if not prov:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    return prov

# Crear un nuevo proveedor
@router.post("/", response_model=ProveedorResponse)
def crear_proveedor(proveedor: ProveedorBase, db: Session = Depends(get_db)):
    nuevo = Proveedor(**proveedor.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

# Actualizar proveedor existente
@router.put("/{id}", response_model=ProveedorResponse)
def actualizar_proveedor(id: int, proveedor: ProveedorBase, db: Session = Depends(get_db)):
    prov = db.query(Proveedor).filter(Proveedor.id == id).first()
    if not prov:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    for campo, valor in proveedor.dict().items():
        setattr(prov, campo, valor)
    db.commit()
    db.refresh(prov)
    return prov

# Eliminar proveedor
@router.delete("/{id}")
def eliminar_proveedor(id: int, db: Session = Depends(get_db)):
    prov = db.query(Proveedor).filter(Proveedor.id == id).first()
    if not prov:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    db.delete(prov)
    db.commit()
    return {"msg": "Proveedor eliminado correctamente"}
