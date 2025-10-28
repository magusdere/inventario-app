import { useEffect, useState } from "react";
import api from "../../services/api";
import toast, { Toaster } from "react-hot-toast";
import ProveedorForm from "./ProveedorForm";

export default function ProveedorList() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try {
      const r = await api.get("/proveedores/");
      setItems(r.data);
    } catch {
      toast.error("Error al cargar proveedores");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id) => {
    if (!confirm("¿Eliminar proveedor?")) return;
    try {
      await api.delete(`/proveedores/${id}`);
      toast.success("Proveedor eliminado");
      load();
    } catch {
      toast.error("No se pudo eliminar");
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      <div className="card card-p">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Proveedores</h2>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>
            + Nuevo Proveedor
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg">
            <thead className="bg-blue-50 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-2 border text-left">ID</th>
                <th className="px-4 py-2 border text-left">Nombre</th>
                <th className="px-4 py-2 border text-left">Teléfono</th>
                <th className="px-4 py-2 border text-left">Email</th>
                <th className="px-4 py-2 border text-left">Dirección</th>
                <th className="px-4 py-2 border text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="hover:bg-blue-50">
                  <td className="px-4 py-2 border">{p.id}</td>
                  <td className="px-4 py-2 border">{p.nombre}</td>
                  <td className="px-4 py-2 border">{p.telefono || "—"}</td>
                  <td className="px-4 py-2 border">{p.email || "—"}</td>
                  <td className="px-4 py-2 border">{p.direccion || "—"}</td>
                  <td className="px-4 py-2 border text-right">
                    <button className="btn btn-ghost mr-2" onClick={() => { setEditing(p); setShowForm(true); }}>
                      Editar
                    </button>
                    <button className="btn btn-ghost" onClick={() => onDelete(p.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-500" colSpan={6}>Sin proveedores</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <ProveedorForm
          initial={editing}
          onSuccess={load}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
