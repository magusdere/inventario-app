from fastapi import FastAPI
<<<<<<< HEAD
from routers import producto, categoria, proveedor, usuario
=======
from routers import producto, categoria, proveedor
>>>>>>> origin/develop

app = FastAPI(title="Inventarios API", version="1.0")

# Rutas
app.include_router(producto.router)
app.include_router(categoria.router)
app.include_router(proveedor.router)
<<<<<<< HEAD
app.include_router(usuario.router)
=======
>>>>>>> origin/develop

@app.get("/")
def root():
    return {"msg": "API Inventarios funcionando correctamente"}
