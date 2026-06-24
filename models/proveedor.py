from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from config.database import Base

class Proveedor(Base):
    __tablename__ = "proveedores"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    telefono = Column(String(30))
    email = Column(String(100))
    direccion = Column(String(255))

    productos = relationship("Producto", back_populates="proveedor", passive_deletes=True)
