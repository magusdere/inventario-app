from pydantic import BaseModel, Field
from typing import Optional

#  Base con los campos comunes
class ProductoBase(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100)
    descripcion: Optional[str] = None
    stock_actual: int = Field(default=0, ge=0)
    stock_minimo: int = Field(default=0, ge=0)
    precio_compra: Optional[float] = Field(default=None, ge=0)
    precio_venta: Optional[float] = Field(default=None, ge=0)
    id_categoria: Optional[int] = None
    id_proveedor: Optional[int] = None

#  Para crear productos (requiere nombre)
class ProductoCreate(ProductoBase):
    nombre: str

#  Para actualizar (todos los campos opcionales)
class ProductoUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    stock_minimo: Optional[int] = Field(default=None, ge=0)
    precio_compra: Optional[float] = Field(default=None, ge=0)
    precio_venta: Optional[float] = Field(default=None, ge=0)
    id_categoria: Optional[int] = None
    id_proveedor: Optional[int] = None

#  Para respuestas (usa from_attributes)
class ProductoResponse(ProductoBase):
    id: int

    class Config:
        from_attributes = True
