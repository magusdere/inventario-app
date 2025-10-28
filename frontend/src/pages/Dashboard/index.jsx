import { useEffect, useState } from "react";
import api from "../../services/api";

export default function DashboardPage() {
  const [resumen, setResumen] = useState({ productos: 0, stock: 0, movimientos: 0 });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [prods, movs] = await Promise.all([api.get("/productos/"), api.get("/movimientos/")]);
        const productos = prods.data.length;
        const stock = prods.data.reduce((acc, p) => acc + (p.stock_actual || 0), 0);
        const movimientos = movs.data.length;
        setResumen({ productos, stock, movimientos });
      } catch {
        setResumen({ productos: 0, stock: 0, movimientos: 0 });
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <div className="card card-p">
        <div className="text-sm text-gray-500">Productos</div>
        <div className="text-3xl font-bold">{resumen.productos}</div>
      </div>
      <div className="card card-p">
        <div className="text-sm text-gray-500">Stock total</div>
        <div className="text-3xl font-bold">{resumen.stock}</div>
      </div>
      <div className="card card-p">
        <div className="text-sm text-gray-500">Movimientos</div>
        <div className="text-3xl font-bold">{resumen.movimientos}</div>
      </div>
    </div>
  );
}
