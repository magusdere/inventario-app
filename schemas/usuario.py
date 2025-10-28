from pydantic import BaseModel, EmailStr

class UsuarioBase(BaseModel):
    nombre: str
    email: EmailStr
    rol: str
    password: str

class UsuarioResponse(UsuarioBase):
    id: int

    class Config:
        from_attributes = True
