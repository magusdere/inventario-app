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
    } catch (error) {
      toast.error("Error al cargar datos");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const obtenerNombreProducto = (id) => {
    const prod = productos.find((p) => p.id === id);
    return prod ? prod.nombre : "—";
  };

  const tipoBadge = (tipo) => {
    const estilos = {
      entrada: "bg-green-100 text-green-700 border-green-300",
      salida: "bg-red-100 text-red-700 border-red-300",
      correccion: "bg-yellow-100 text-yellow-700 border-yellow-300",
    };
    return (
      <span
        className={`px-3 py-1 text-sm rounded-full border font-medium ${estilos[tipo]}`}
      >
        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
      </span>
    );
  };

  if (cargando)
    return (
      <div className="text-center text-gray-600 mt-10 animate-pulse">
        Cargando movimientos...
      </div>
    );

  return (
    <div>
      <Toaster position="top-right" />
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Movimientos de Stock
          </h2>
          <button
            onClick={() => setMostrarForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-200"
          >
            + Registrar Movimiento
          </button>
        </div>

        {movimientos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay movimientos registrados aún.
          </p>
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
                {movimientos.map((mov) => (
                  <tr
                    key={mov.id}
                    className="hover:bg-blue-50 transition-all duration-150"
                  >
                    <td className="px-4 py-2 border text-gray-600">{mov.id}</td>
                    <td className="px-4 py-2 border font-medium text-gray-800">
                      {obtenerNombreProducto(mov.id_producto)}
                    </td>
                    <td className="px-4 py-2 border">{tipoBadge(mov.tipo)}</td>
                    <td className="px-4 py-2 border text-right font-semibold">
                      {mov.cantidad}
                    </td>
                    <td className="px-4 py-2 border text-gray-600">
                      {new Date(mov.fecha).toLocaleString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-2 border text-gray-700 italic">
                      {mov.observacion || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {mostrarForm && (
        <MovimientoForm
          onSuccess={cargarDatos}
          onClose={() => setMostrarForm(false)}
        />
      )}
    </div>
  );
}
