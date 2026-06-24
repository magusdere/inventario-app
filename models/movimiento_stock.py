from sqlalchemy import Column, Integer, Enum, ForeignKey, TIMESTAMP, CheckConstraint, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from config.database import Base

class MovimientoStock(Base):
    __tablename__ = "movimientos_stock"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_producto = Column(Integer, ForeignKey("productos.id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False, index=True)
    tipo = Column(Enum('entrada', 'salida'), nullable=False)
    cantidad = Column(Integer, nullable=False)
    fecha = Column(TIMESTAMP, server_default=func.current_timestamp())
    id_usuario = Column(Integer, ForeignKey("usuarios.id", ondelete="SET NULL", onupdate="CASCADE"), nullable=True, index=True)

    producto = relationship("Producto", back_populates="movimientos")
    usuario = relationship("Usuario", back_populates="movimientos")

    __table_args__ = (
        CheckConstraint("cantidad > 0", name="chk_cantidad_positiva"),
    )

Index("idx_mov_fecha", MovimientoStock.fecha)
Index("idx_mov_usuario", MovimientoStock.id_usuario)
