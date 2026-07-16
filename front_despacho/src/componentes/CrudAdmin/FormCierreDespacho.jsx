import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import api from "../../api/axiosConfig";
import { crearEstadoDespacho } from "../../utils/despachoMappers";

export const FormCierreDespacho = ({ despacho, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      intento: despacho.intento,
      despachado: String(Boolean(despacho.despachado)),
    },
  });

  const onSubmit = async (data) => {
    try {
      await api.patch(
        `/despachos/${despacho.idDespacho}/estado`,
        crearEstadoDespacho(data)
      );

      await Swal.fire({
        title: "¡Despacho actualizado!",
        text: "Los intentos y el estado de entrega fueron modificados.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      onClose();
    } catch (error) {
      await Swal.fire({
        title: "No fue posible actualizar el despacho",
        text: error.response?.data?.message ?? "Revisa la conexión e inténtalo nuevamente.",
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
        Editar y cerrar despacho
      </div>

      <ReadOnlyField label="ID despacho" value={despacho.idDespacho} />
      <ReadOnlyField label="Fecha del despacho" value={despacho.fechaDespacho} />
      <ReadOnlyField label="Patente del camión" value={despacho.patenteCamion} />

      <div className="mb-5">
        <label className="block font-bold mb-2">Intentos de entrega</label>
        <input
          type="number"
          min="0"
          className="border border-gray-300 rounded-lg block w-full p-1"
          {...register("intento", { required: true, min: 0 })}
        />
      </div>

      <div className="mb-5">
        <label className="block font-bold mb-2">Estado del despacho</label>
        <select
          className="border border-gray-300 rounded-lg block w-full p-1"
          {...register("despachado", { required: true })}
        >
          <option value="false">Despacho abierto</option>
          <option value="true">Despacho entregado</option>
        </select>
      </div>

      <ReadOnlyField label="ID compra" value={despacho.idCompra} />
      <ReadOnlyField label="Dirección de compra" value={despacho.direccionCompra} />
      <ReadOnlyField label="Valor de compra" value={despacho.valorCompra} />

      <button
        className="py-6 px-14 rounded-lg bg-teal-600 text-white font-bold mb-14 disabled:opacity-60"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Guardando..." : "Modificar despacho"}
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
