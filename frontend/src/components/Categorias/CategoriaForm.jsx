import { useForm } from "react-hook-form";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function CategoriaForm({ initial, onSuccess, onClose }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: initial || { nombre: "", descripcion: "" },
  });

  const onSubmit = async (data) => {
    try {
      if (initial?.id) {
        await api.put(`/categorias/${initial.id}`, data);
        toast.success("Categoría actualizada");
      } else {
        await api.post("/categorias/", data);
        toast.success("Categoría creada");
      }
      onSuccess();
      onClose();
      reset();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Error al guardar categoría");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="card card-p w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{initial?.id ? "Editar categoría" : "Nueva categoría"}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="label">Nombre</label>
            <input className="input" {...register("nombre", { required: true })} />
          </div>
          <div>
            <label className="label">Descripción</label>
            <input className="input" {...register("descripcion")} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
