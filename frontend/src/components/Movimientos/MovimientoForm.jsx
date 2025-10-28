import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function MovimientoForm({ onSuccess, onClose }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { tipo: "entrada", cantidad: 1, observacion: "" },
  });

  const [productos, setProductos] = useState([]);

  useEffect(() => {
    api.get("/productos/")
      .then((res) => setProductos(res.data))
      .catch(() => toast.error("Error al cargar productos"));
  }, []);

  const onSubmit = async (data) => {
    try {
      data.cantidad = parseInt(data.cantidad);
      await api.post("/movimientos/", data);
      toast.success("Movimiento registrado correctamente");
      onSuccess();
      onClose();
      reset();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Error al registrar movimiento");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Registrar Movimiento
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Producto</label>
            <select
              {...register("id_producto")}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Seleccione...</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Tipo de movimiento</label>
            <select
              {...register("tipo")}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Cantidad</label>
            <input
              {...register("cantidad")}
              type="number"
              min="1"
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Observación</label>
            <textarea
              {...register("observacion")}
              placeholder="Motivo o comentario (opcional)"
              className="w-full border border-gray-300 rounded-md p-2 resize-none"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
