from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import SessionLocal
from models.usuario import Usuario
from schemas.usuario import UsuarioBase, UsuarioResponse
from typing import List

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

# --- Dependencia de sesión de BD ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- Listar todos los usuarios ---
@router.get("/", response_model=List[UsuarioResponse])
def listar_usuarios(db: Session = Depends(get_db)):
    return db.query(Usuario).all()


# --- Crear un nuevo usuario ---
@router.post("/", response_model=UsuarioResponse)
def crear_usuario(usuario: UsuarioBase, db: Session = Depends(get_db)):
    nuevo = Usuario(
        nombre=usuario.nombre,
        email=usuario.email,
        rol=usuario.rol,
        password=usuario.password
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


# --- Obtener un usuario por ID ---
@router.get("/{id}", response_model=UsuarioResponse)
def obtener_usuario(id: int, db: Session = Depends(get_db)):
    usr = db.query(Usuario).filter(Usuario.id == id).first()
    if not usr:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usr


# --- Actualizar un usuario ---
@router.put("/{id}", response_model=UsuarioResponse)
def actualizar_usuario(id: int, usuario: UsuarioBase, db: Session = Depends(get_db)):
    usr = db.query(Usuario).filter(Usuario.id == id).first()
    if not usr:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    usr.nombre = usuario.nombre
    usr.email = usuario.email
    usr.rol = usuario.rol
    usr.password = usuario.password
    db.commit()
    db.refresh(usr)
    return usr


# --- Eliminar un usuario ---
@router.delete("/{id}")
def eliminar_usuario(id: int, db: Session = Depends(get_db)):
    usr = db.query(Usuario).filter(Usuario.id == id).first()
    if not usr:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db.delete(usr)
    db.commit()
    return {"msg": "Usuario eliminado correctamente"}
