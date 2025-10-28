import { useEffect, useState } from "react";
import api from "../../services/api";
import toast, { Toaster } from "react-hot-toast";

export default function UsuarioList() {
  const [items, setItems] = useState([]);
  const load = async () => {
    try {
      const r = await api.get("/usuarios/");
      setItems(r.data);
    } catch {
      toast.error("Error al cargar usuarios");
    }
  };
  useEffect(() => { load(); }, []);

  return (
    <div>
      <Toaster position="top-right" />
      <div className="card card-p">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Usuarios</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg">
            <thead className="bg-blue-50 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-2 border text-left">ID</th>
                <th className="px-4 py-2 border text-left">Nombre</th>
                <th className="px-4 py-2 border text-left">Email</th>
                <th className="px-4 py-2 border text-left">Rol</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id} className="hover:bg-blue-50">
                  <td className="px-4 py-2 border">{u.id}</td>
                  <td className="px-4 py-2 border">{u.nombre}</td>
                  <td className="px-4 py-2 border">{u.email}</td>
                  <td className="px-4 py-2 border">{u.rol}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-500" colSpan={4}>Sin usuarios</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
