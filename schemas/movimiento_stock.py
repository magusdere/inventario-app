from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Literal

class MovimientoStockBase(BaseModel):
    id_producto: int
    tipo: Literal["entrada", "salida"]
    cantidad: int = Field(..., gt=0)
    id_usuario: Optional[int] = None

class MovimientoStockCreate(MovimientoStockBase):
    pass

class MovimientoStockResponse(MovimientoStockBase):
    id: int
    fecha: datetime

    class Config:
        from_attributes = True
