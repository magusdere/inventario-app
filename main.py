from fastapi import FastAPI
from routers import producto, categoria, proveedor, usuario

app = FastAPI(title="Inventarios API", version="1.0")

# Rutas
app.include_router(producto.router)
app.include_router(categoria.router)
app.include_router(proveedor.router)
app.include_router(usuario.router)

@app.get("/")
def root():
    return {"msg": "API Inventarios funcionando correctamente"}
