import httpx
import asyncio
from pprint import pprint

BASE_URL = "http://127.0.0.1:8000"

async def main():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        # 1) Crear un producto base
        print("\n=== CREANDO PRODUCTO BASE ===")
        producto_data = {
            "nombre": "Camiseta Boca 2025",
            "descripcion": "Modelo titular 2025",
            "stock_actual": 10,
            "stock_minimo": 3,
            "precio_compra": 18000,
            "precio_venta": 25000
        }
        r = await client.post("/productos/", json=producto_data)
        producto = r.json()
        pprint(producto)
        producto_id = producto["id"]

        # 2) Movimiento de entrada (suma stock)
        print("\n=== MOVIMIENTO ENTRADA ===")
        entrada_data = {
            "id_producto": producto_id,
            "tipo": "entrada",
            "cantidad": 5,
            "id_usuario": 1
        }
        r = await client.post("/movimientos/", json=entrada_data)
        pprint(r.json())

        # 3) Movimiento de salida válido (resta stock)
        print("\n=== MOVIMIENTO SALIDA VÁLIDA ===")
        salida_ok_data = {
            "id_producto": producto_id,
            "tipo": "salida",
            "cantidad": 3,
            "id_usuario": 1
        }
        r = await client.post("/movimientos/", json=salida_ok_data)
        pprint(r.json())

        # 4) Movimiento con stock insuficiente
        print("\n=== MOVIMIENTO SALIDA CON STOCK INSUFICIENTE ===")
        salida_fail_data = {
            "id_producto": producto_id,
            "tipo": "salida",
            "cantidad": 999,
            "id_usuario": 1
        }
        r = await client.post("/movimientos/", json=salida_fail_data)
        print("Status:", r.status_code)
        pprint(r.json())

        # 5) Movimiento con cantidad inválida (-10)
        print("\n=== MOVIMIENTO CON CANTIDAD INVÁLIDA ===")
        invalido_data = {
            "id_producto": producto_id,
            "tipo": "entrada",
            "cantidad": -10,
            "id_usuario": 1
        }
        r = await client.post("/movimientos/", json=invalido_data)
        print("Status:", r.status_code)
        pprint(r.json())

        # 6) Consultar producto final
        print("\n=== STOCK FINAL DEL PRODUCTO ===")
        r = await client.get(f"/productos/{producto_id}")
        pprint(r.json())

if __name__ == "__main__":
    asyncio.run(main())
