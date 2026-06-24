from pydantic import BaseModel

class CategoriaBase(BaseModel):
    nombre: str
    descripcion: str | None = None

class CategoriaResponse(CategoriaBase):
    id: int

    class Config:
        from_attributes = True

