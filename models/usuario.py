from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from config.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    rol = Column(Enum('admin', 'empleado'), nullable=False, default='empleado')

    movimientos = relationship("MovimientoStock", back_populates="usuario", cascade="all, delete-orphan", passive_deletes=True)
