# Inventario App
Sistema de gestión de inventario con FastAPI (backend), React + Vite + Tailwind (frontend) y MySQL.

## Requisitos
- Python 3.11
- Node.js 20+
- MySQL 8+

## Backend (FastAPI)

1) Crear y activar entorno virtual

```powershell
python -m venv venv
./venv/Scripts/Activate.ps1
```

2) Instalar dependencias

```powershell
pip install -r requirements.txt
```

3) Configurar variables de entorno (opcional)

Por defecto el backend usa:
- `DB_USER=root`
- `DB_PASSWORD=12345`
- `DB_HOST=localhost`
- `DB_NAME=inventarios_db`

Puedes exportarlas en PowerShell antes de iniciar:

```powershell
$env:DB_USER = "root"
$env:DB_PASSWORD = "12345"
$env:DB_HOST = "localhost"
$env:DB_NAME = "inventarios_db"
```

4) Crear base de datos y tablas

Importa `inventarios_db.sql` en tu servidor MySQL (Workbench/CLI).

5) Ejecutar API

```powershell
uvicorn main:app --reload --port 8000
```

La API quedará en `http://127.0.0.1:8000`.

## Frontend (React + Vite)

1) Instalar dependencias

```powershell
cd frontend
npm install
```

2) Ejecutar el servidor de desarrollo

```powershell
npm run dev
```

El frontend quedará en `http://127.0.0.1:5173`.

## Notas
- CORS está habilitado para `http://localhost:5173`.
- Tailwind v4 está configurado con `@import "tailwindcss";` en `src/index.css` y tokens en `src/styles/theme.css`.
- Al crear un producto con stock inicial > 0 se genera un movimiento de tipo entrada automáticamente.
