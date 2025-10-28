import { useEffect, useState } from "react";
import api from "../../services/api";
import toast, { Toaster } from "react-hot-toast";
import CategoriaForm from "./CategoriaForm";

export default function CategoriaList() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try {
      const r = await api.get("/categorias/");
      setItems(r.data);
    } catch {
      toast.error("Error al cargar categorías");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id) => {
    if (!confirm("¿Eliminar categoría?")) return;
    try {
      await api.delete(`/categorias/${id}`);
      toast.success("Categoría eliminada");
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
          <h2 className="text-2xl font-bold text-gray-800">Categorías</h2>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>
            + Nueva Categoría
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg">
            <thead className="bg-blue-50 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-2 border text-left">ID</th>
                <th className="px-4 py-2 border text-left">Nombre</th>
                <th className="px-4 py-2 border text-left">Descripción</th>
                <th className="px-4 py-2 border text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="hover:bg-blue-50">
                  <td className="px-4 py-2 border">{c.id}</td>
                  <td className="px-4 py-2 border">{c.nombre}</td>
                  <td className="px-4 py-2 border">{c.descripcion || "—"}</td>
                  <td className="px-4 py-2 border text-right">
                    <button className="btn btn-ghost mr-2" onClick={() => { setEditing(c); setShowForm(true); }}>
                      Editar
                    </button>
                    <button className="btn btn-ghost" onClick={() => onDelete(c.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-500" colSpan={4}>Sin categorías</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <CategoriaForm
          initial={editing}
          onSuccess={load}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
