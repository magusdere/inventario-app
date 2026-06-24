from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import text
from typing import List

from config.database import get_async_db
from models.movimiento_stock import MovimientoStock
from models.producto import Producto
from schemas.movimiento_stock import MovimientoStockCreate, MovimientoStockResponse

router = APIRouter(prefix="/movimientos", tags=["Movimientos de Stock"])

@router.get("/", response_model=List[MovimientoStockResponse])
async def listar_movimientos(db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(MovimientoStock).order_by(MovimientoStock.id.desc()))
    return result.scalars().all()

@router.get("/{id}", response_model=MovimientoStockResponse)
async def obtener_movimiento(id: int, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(MovimientoStock).where(MovimientoStock.id == id))
    mov = result.scalar_one_or_none()
    if not mov:
        raise HTTPException(status_code=404, detail="Movimiento no encontrado")
    return mov

@router.post("/", response_model=MovimientoStockResponse, status_code=201)
async def registrar_movimiento(data: MovimientoStockCreate, db: AsyncSession = Depends(get_async_db)):
    # Transacción explícita. Usamos SELECT ... FOR UPDATE para bloquear la fila del producto.
    async with db.begin():
        # Bloqueo pesimista de la fila del producto
        # Nota: .with_for_update() requiere motor que lo soporte (asyncmy lo soporta).
        result = await db.execute(
            select(Producto).where(Producto.id == data.id_producto).with_for_update()
        )
        producto = result.scalar_one_or_none()

        if not producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado")

        if data.tipo == "salida" and producto.stock_actual < data.cantidad:
            raise HTTPException(status_code=400, detail="Stock insuficiente para realizar la salida")

        # Crear movimiento
        mov = MovimientoStock(**data.dict())
        db.add(mov)

        # Actualizar stock
        if data.tipo == "entrada":
            producto.stock_actual = int(producto.stock_actual) + int(data.cantidad)
        else:
            producto.stock_actual = int(producto.stock_actual) - int(data.cantidad)

    # Commit hecho por el context manager .begin()
    await db.refresh(mov)
    return mov

@router.delete("/{id}")
async def eliminar_movimiento(id: int, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(MovimientoStock).where(MovimientoStock.id == id))
    mov = result.scalar_one_or_none()
    if not mov:
        raise HTTPException(status_code=404, detail="Movimiento no encontrado")

    await db.delete(mov)
    await db.commit()
    return {"msg": "Movimiento eliminado correctamente"}
