# routers/categoria.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from config.database import get_async_db
from models.categoria import Categoria
from schemas.categoria import CategoriaBase

router = APIRouter(prefix="/categorias", tags=["Categorías"])

#  Listar
@router.get("/", response_model=List[CategoriaBase])
async def listar_categorias(db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Categoria))
    return result.scalars().all()

#  Obtener por ID
@router.get("/{id}", response_model=CategoriaBase)
async def obtener_categoria(id: int, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Categoria).where(Categoria.id == id))
    categoria = result.scalar_one_or_none()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return categoria

#  Crear
@router.post("/", response_model=CategoriaBase, status_code=201)
async def crear_categoria(data: CategoriaBase, db: AsyncSession = Depends(get_async_db)):
    nueva = Categoria(**data.dict())
    db.add(nueva)
    await db.commit()
    await db.refresh(nueva)
    return nueva

#  Actualizar
@router.put("/{id}", response_model=CategoriaBase)
async def actualizar_categoria(id: int, data: CategoriaBase, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Categoria).where(Categoria.id == id))
    categoria = result.scalar_one_or_none()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    for campo, valor in data.dict(exclude_unset=True).items():
        setattr(categoria, campo, valor)

    await db.commit()
    await db.refresh(categoria)
    return categoria

#  Eliminar
@router.delete("/{id}", status_code=204)
async def eliminar_categoria(id: int, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Categoria).where(Categoria.id == id))
    categoria = result.scalar_one_or_none()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    await db.delete(categoria)
    await db.commit()
