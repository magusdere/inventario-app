from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from config.database import get_async_db
from models.usuario import Usuario
from schemas.usuario import UsuarioBase, UsuarioResponse

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

@router.get("/", response_model=List[UsuarioResponse])
async def listar_usuarios(db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Usuario))
    return result.scalars().all()

@router.get("/{id}", response_model=UsuarioResponse)
async def obtener_usuario(id: int, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Usuario).where(Usuario.id == id))
    usuario = result.scalar_one_or_none()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

@router.post("/", response_model=UsuarioResponse, status_code=201)
async def crear_usuario(data: UsuarioBase, db: AsyncSession = Depends(get_async_db)):
    # data.password_hash ya debe venir hasheado; más adelante podemos agregar hash en servidor
    nuevo = Usuario(**data.dict())
    db.add(nuevo)
    await db.commit()
    await db.refresh(nuevo)
    return nuevo

@router.delete("/{id}", status_code=204)
async def eliminar_usuario(id: int, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Usuario).where(Usuario.id == id))
    usuario = result.scalar_one_or_none()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    await db.delete(usuario)
    await db.commit()
