from fastapi import FastAPI
from routers import producto

app = FastAPI(title="Inventarios API", version="1.0")

# Rutas
app.include_router(producto.router)

@app.get("/")
def root():
    return {"msg": "API Inventarios funcionando correctamente ✅"}
