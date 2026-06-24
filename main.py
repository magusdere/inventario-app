from fastapi import FastAPI
from routers import producto, categoria, proveedor, usuario, movimiento_stock

app = FastAPI(title="Inventarios API", version="1.0.0")

app.include_router(producto.router)
app.include_router(categoria.router)
app.include_router(proveedor.router)
app.include_router(usuario.router)
app.include_router(movimiento_stock.router)

@app.get("/")
async def root():
    return {"msg": "API Inventarios funcionando correctamente"}
