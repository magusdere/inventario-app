from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from config.database import get_async_db
from sqlalchemy.ext.asyncio import AsyncSession
from models.producto import Producto
from schemas.producto import ProductoCreate, ProductoUpdate, ProductoResponse

router = APIRouter(prefix="/productos", tags=["Productos"])

#  LISTAR (con filtros/paginado)
@router.get("/", response_model=List[ProductoResponse])
async def listar_productos(
    q: Optional[str] = Query(None, description="Buscar por nombre"),
    id_categoria: Optional[int] = None,
    id_proveedor: Optional[int] = None,
    offset: int = 0, limit: int = 50,
    db: AsyncSession = Depends(get_async_db)
):
    stmt = select(Producto)
    if q:
        stmt = stmt.filter(Producto.nombre.like(f"%{q}%"))
    if id_categoria:
        stmt = stmt.filter(Producto.id_categoria == id_categoria)
    if id_proveedor:
        stmt = stmt.filter(Producto.id_proveedor == id_proveedor)

    result = await db.execute(stmt.offset(offset).limit(limit))
    return result.scalars().all()

#  OBTENER UNO
@router.get("/{id}", response_model=ProductoResponse)
async def obtener_producto(id: int, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Producto).where(Producto.id == id))
    producto = result.scalar_one_or_none()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto

#  CREAR
@router.post("/", response_model=ProductoResponse, status_code=201)
async def crear_producto(data: ProductoCreate, db: AsyncSession = Depends(get_async_db)):
    nuevo = Producto(**data.dict())
    db.add(nuevo)
    await db.commit()
    await db.refresh(nuevo)
    return nuevo

#  ACTUALIZAR
@router.put("/{id}", response_model=ProductoResponse)
async def actualizar_producto(id: int, data: ProductoUpdate, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Producto).where(Producto.id == id))
    producto = result.scalar_one_or_none()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    for campo, valor in data.dict(exclude_unset=True).items():
        setattr(producto, campo, valor)

    await db.commit()
    await db.refresh(producto)
    return producto

#  ELIMINAR
@router.delete("/{id}", status_code=204)
async def eliminar_producto(id: int, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Producto).where(Producto.id == id))
    producto = result.scalar_one_or_none()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    await db.delete(producto)
    await db.commit()
