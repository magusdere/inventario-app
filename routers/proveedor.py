from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from config.database import get_async_db
from models.proveedor import Proveedor
from schemas.proveedor import ProveedorBase, ProveedorResponse

router = APIRouter(prefix="/proveedores", tags=["Proveedores"])

@router.get("/", response_model=List[ProveedorResponse])
async def listar_proveedores(db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Proveedor))
    return result.scalars().all()

@router.get("/{id}", response_model=ProveedorResponse)
async def obtener_proveedor(id: int, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Proveedor).where(Proveedor.id == id))
    proveedor = result.scalar_one_or_none()
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    return proveedor

@router.post("/", response_model=ProveedorResponse, status_code=201)
async def crear_proveedor(data: ProveedorBase, db: AsyncSession = Depends(get_async_db)):
    nuevo = Proveedor(**data.dict())
    db.add(nuevo)
    await db.commit()
    await db.refresh(nuevo)
    return nuevo

@router.put("/{id}", response_model=ProveedorResponse)
async def actualizar_proveedor(id: int, data: ProveedorBase, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Proveedor).where(Proveedor.id == id))
    proveedor = result.scalar_one_or_none()
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")

    for campo, valor in data.dict(exclude_unset=True).items():
        setattr(proveedor, campo, valor)

    await db.commit()
    await db.refresh(proveedor)
    return proveedor

@router.delete("/{id}", status_code=204)
async def eliminar_proveedor(id: int, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Proveedor).where(Proveedor.id == id))
    proveedor = result.scalar_one_or_none()
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")

    await db.delete(proveedor)
    await db.commit()
