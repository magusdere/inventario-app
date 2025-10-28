import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import api from "../../services/api";

const schema = yup.object({
    nombre: yup.string().required("El nombre es obligatorio"),
    descripcion: yup.string().nullable(),
    stock_actual: yup.number().typeError("Debe ser un número").required().min(0),
    stock_minimo: yup.number().typeError("Debe ser un número").required().min(0),
    precio_compra: yup.number().typeError("Debe ser un número").required().min(0),
    precio_venta: yup.number().typeError("Debe ser un número").required().min(0),
});

export default function ProductoForm({ producto, onSuccess, onClose }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: producto || {
            nombre: "",
            descripcion: "",
            stock_actual: 0,
            stock_minimo: 0,
            precio_compra: 0,
            precio_venta: 0,
        },
    });

    const onSubmit = async (data) => {
        try {
            if (producto) {
                await api.put(`/productos/${producto.id}`, data);
                toast.success("Producto actualizado correctamente");
            } else {
                await api.post("/productos/", data);
                toast.success("Producto creado correctamente");
            }

            //  Espera a que la API responda antes de refrescar
            await new Promise((r) => setTimeout(r, 200)); // leve delay para sincronizar backend-UI

            onSuccess(); // recarga el listado
            onClose();   // cierra modal
            reset();

        } catch (err) {
            console.error(err);
            toast.error("Error al guardar el producto");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    {producto ? "Editar Producto" : "Nuevo Producto"}
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div>
                        <label className="block text-gray-700">Nombre</label>
                        <input
                            {...register("nombre")}
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                        <p className="text-red-500 text-sm">{errors.nombre?.message}</p>
                    </div>

                    <div>
                        <label className="block text-gray-700">Descripción</label>
                        <input
                            {...register("descripcion")}
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-gray-700">Stock actual</label>
                            <input
                                {...register("stock_actual")}
                                type="number"
                                className="w-full border border-gray-300 rounded-md p-2"
                                disabled={!!producto}
                            />

                        </div>
                        <div>
                            <label className="block text-gray-700">Stock mínimo</label>
                            <input
                                {...register("stock_minimo")}
                                type="number"
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-gray-700">Precio compra</label>
                            <input
                                {...register("precio_compra")}
                                type="number"
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Precio venta</label>
                            <input
                                {...register("precio_venta")}
                                type="number"
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
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
