import { useForm } from "react-hook-form";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function ProveedorForm({ initial, onSuccess, onClose }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: initial || { nombre: "", telefono: "", email: "", direccion: "" },
  });

  const onSubmit = async (data) => {
    try {
      if (initial?.id) {
        await api.put(`/proveedores/${initial.id}`, data);
        toast.success("Proveedor actualizado");
      } else {
        await api.post("/proveedores/", data);
        toast.success("Proveedor creado");
      }
      onSuccess();
      onClose();
      reset();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Error al guardar proveedor");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="card card-p w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">{initial?.id ? "Editar proveedor" : "Nuevo proveedor"}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label">Nombre</label>
            <input className="input" {...register("nombre", { required: true })} />
          </div>
          <div>
            <label className="label">Teléfono</label>
            <input className="input" {...register("telefono")} />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" {...register("email")} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Dirección</label>
            <input className="input" {...register("direccion")} />
          </div>

          <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
