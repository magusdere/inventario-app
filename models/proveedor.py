from sqlalchemy import Column, Integer, String
from config.database import Base

class Proveedor(Base):
    __tablename__ = "proveedores"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    telefono = Column(String(20))
    email = Column(String(100))
    direccion = Column(String(255))
