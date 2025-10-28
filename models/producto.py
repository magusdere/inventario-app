from sqlalchemy import Column, Integer, String, DECIMAL, ForeignKey, Index
from sqlalchemy.orm import relationship
from config.database import Base

class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(String(255))
    stock_actual = Column(Integer, nullable=False, default=0)
    stock_minimo = Column(Integer, nullable=False, default=0)
    precio_compra = Column(DECIMAL(10, 2))
    precio_venta = Column(DECIMAL(10, 2))

    id_categoria = Column(
        Integer,
        ForeignKey("categorias.id", ondelete="SET NULL", onupdate="CASCADE"),
        nullable=True,
        index=True,
    )
    id_proveedor = Column(
        Integer,
        ForeignKey("proveedores.id", ondelete="SET NULL", onupdate="CASCADE"),
        nullable=True,
        index=True,
    )

    categoria = relationship("Categoria", back_populates="productos")
    proveedor = relationship("Proveedor", back_populates="productos")
    movimientos = relationship("MovimientoStock", back_populates="producto", cascade="all, delete-orphan", passive_deletes=True)

Index("idx_prod_nombre", Producto.nombre)
Index("idx_prod_categoria", Producto.id_categoria)
Index("idx_prod_proveedor", Producto.id_proveedor)
