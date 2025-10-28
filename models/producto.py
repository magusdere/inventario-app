from sqlalchemy import Column, Integer, String, DECIMAL, ForeignKey
from config.database import Base

class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    descripcion = Column(String(255))
    stock_actual = Column(Integer)
    precio_compra = Column(DECIMAL(10, 2))
    precio_venta = Column(DECIMAL(10, 2))
    id_categoria = Column(Integer, ForeignKey("categorias.id"))
    id_proveedor = Column(Integer, ForeignKey("proveedores.id"))
