from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import producto, categoria, proveedor, usuario, movimiento_stock

app = FastAPI(title="Inventarios API", version="1.0.0")

#  CORS habilitado para el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#  routers
app.include_router(producto.router)
app.include_router(categoria.router)
app.include_router(proveedor.router)
app.include_router(usuario.router)
app.include_router(movimiento_stock.router)
