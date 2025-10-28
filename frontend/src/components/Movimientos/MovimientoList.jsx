import { useState, useEffect } from "react";
import api from "../../services/api";
import MovimientoForm from "./MovimientoForm";
import toast, { Toaster } from "react-hot-toast";

export default function MovimientoList() {
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [cargando, setCargando] = useState(true);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [resMov, resProd] = await Promise.all([
        api.get("/movimientos/"),
        api.get("/productos/"),
      ]);
      setMovimientos(resMov.data);
      setProductos(resProd.data);
    } catch {
      toast.error("Error al cargar datos");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const nombreProducto = (id) => productos.find((p) => p.id === id)?.nombre || "—";
  const badge = (tipo) =>
    tipo === "entrada"
      ? "badge badge-green"
      : tipo === "salida"
      ? "badge badge-red"
      : "badge badge-yellow";

  if (cargando) return <div className="text-center text-gray-600 mt-10 animate-pulse">Cargando movimientos...</div>;

  return (
    <div>
      <Toaster position="top-right" />
      <div className="card card-p">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Movimientos de Stock</h2>
          <button onClick={() => setMostrarForm(true)} className="btn btn-primary">+ Registrar Movimiento</button>
        </div>

        {movimientos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay movimientos registrados aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 rounded-lg">
              <thead className="bg-blue-50 text-gray-700 uppercase text-xs font-semibold tracking-wider">
                <tr>
                  <th className="px-4 py-3 border">ID</th>
                  <th className="px-4 py-3 border text-left">Producto</th>
                  <th className="px-4 py-3 border text-left">Tipo</th>
                  <th className="px-4 py-3 border text-right">Cantidad</th>
                  <th className="px-4 py-3 border text-left">Fecha</th>
                  <th className="px-4 py-3 border text-left">Observación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {movimientos.map((m) => (
                  <tr key={m.id} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-2 border text-gray-600">{m.id}</td>
                    <td className="px-4 py-2 border font-medium text-gray-800">{nombreProducto(m.id_producto)}</td>
                    <td className="px-4 py-2 border"><span className={badge(m.tipo)}>{m.tipo}</span></td>
                    <td className="px-4 py-2 border text-right font-semibold">{m.cantidad}</td>
                    <td className="px-4 py-2 border text-gray-600">
                      {new Date(m.fecha).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-2 border text-gray-700 italic">{m.observacion || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {mostrarForm && (
        <MovimientoForm onSuccess={cargarDatos} onClose={() => setMostrarForm(false)} />
      )}
    </div>
  );
}
