import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import api from "../../api/axiosConfig";
import { crearDespachoDesdeVenta } from "../../utils/despachoMappers";

export const FormDespacho = ({ venta, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const despachoPayload = crearDespachoDesdeVenta(venta, data);
    let despachoCreado;

    try {
      const response = await api.post("/despachos", despachoPayload);
      despachoCreado = response.data;

      try {
        await api.patch(`/ventas/${venta.idVenta}/despacho`, {
          despachoGenerado: true,
        });
      } catch (error) {
        if (despachoCreado?.idDespacho) {
          await api.delete(`/despachos/${despachoCreado.idDespacho}`).catch(() => null);
        }
        throw error;
      }

      await Swal.fire({
        title: "¡Despacho registrado!",
        text: "La orden de despacho fue creada correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      onClose();
    } catch (error) {
      await Swal.fire({
        title: "No fue posible registrar el despacho",
        text: error.response?.data?.message ?? "Revisa la conexión con los servicios e inténtalo nuevamente.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center text-center px-24 text-xl"
    >
      <div className="mx-auto text-3xl font-bold mb-10 text-teal-600">
        Ingreso de orden de despacho
      </div>

      <div className="mb-5">
        <label className="block font-bold mb-2">Fecha de despacho</label>
        <input
          type="date"
          className="border border-gray-300 rounded-lg block w-full p-1"
          {...register("fechaDespacho", { required: true })}
        />
      </div>

      <div className="mb-5">
        <label className="block font-bold mb-2">Patente de camión</label>
        <input
          type="text"
          placeholder="Ejemplo: ABCD12"
          className="border border-gray-300 rounded-lg block w-full p-1"
          {...register("patenteCamion", { required: true })}
        />
      </div>

      <ReadOnlyField label="Orden de compra asociada" value={venta.idVenta} />
      <ReadOnlyField label="Dirección de entrega" value={venta.direccionCompra} />
      <ReadOnlyField label="Valor de compra" value={venta.valorCompra} />

      <button
        className="py-6 px-14 rounded-lg bg-teal-600 text-white font-bold mb-14 disabled:opacity-60"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Registrando..." : "Asignar despacho"}
      </button>
    </form>
  );
};

const ReadOnlyField = ({ label, value }) => (
  <div className="mb-5">
    <label className="block font-bold mb-2">{label}</label>
    <input
      type="text"
      readOnly
      value={value ?? ""}
      className="border border-gray-300 rounded-lg block w-full text-slate-400 p-1"
    />
  </div>
);
