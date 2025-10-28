import { useEffect, useState } from "react";
import api from "../../services/api";
import ProductoForm from "./ProductoForm";
import toast, { Toaster } from "react-hot-toast";

export default function ProductoList() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [productoEdit, setProductoEdit] = useState(null);

  const cargarProductos = () => {
    setCargando(true);
    api
      .get("/productos/")
      .then((res) => setProductos(res.data))
      .catch(() => toast.error("Error al cargar productos"))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const eliminarProducto = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este producto?")) {
      try {
        await api.delete(`/productos/${id}`);
        toast.success("Producto eliminado");
        cargarProductos();
      } catch {
        toast.error("Error al eliminar");
      }
    }
  };

  if (cargando) return <div className="text-center mt-10">Cargando productos...</div>;

  return (
    <div>
      <Toaster position="top-right" />
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Listado de Productos</h2>
          <button
            onClick={() => {
              setProductoEdit(null);
              setMostrarForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Nuevo Producto
          </button>
        </div>

        {productos.length === 0 ? (
          <p className="text-gray-500">No hay productos cargados.</p>
        ) : (
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-2 border text-left">ID</th>
                <th className="px-4 py-2 border text-left">Nombre</th>
                <th className="px-4 py-2 border text-left">Stock</th>
                <th className="px-4 py-2 border text-left">Precio Venta</th>
                <th className="px-4 py-2 border text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((prod) => (
                <tr key={prod.id} className="hover:bg-blue-50">
                  <td className="px-4 py-2 border">{prod.id}</td>
                  <td className="px-4 py-2 border">{prod.nombre}</td>
                  <td className="px-4 py-2 border">{prod.stock_actual}</td>
                  <td className="px-4 py-2 border">${prod.precio_venta}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => {
                        setProductoEdit(prod);
                        setMostrarForm(true);
                      }}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarProducto(prod.id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {mostrarForm && (
        <ProductoForm
          producto={productoEdit}
          onSuccess={cargarProductos}
          onClose={() => setMostrarForm(false)}
        />
      )}
    </div>
  );
}
