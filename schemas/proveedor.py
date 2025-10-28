from pydantic import BaseModel, EmailStr

class ProveedorBase(BaseModel):
    nombre: str
    telefono: str | None = None
    email: EmailStr | None = None
    direccion: str | None = None

class ProveedorResponse(ProveedorBase):
    id: int

    class Config:
        orm_mode = True
