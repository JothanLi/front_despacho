export const crearDespachoDesdeVenta = (venta, formData) => ({
  fechaDespacho: formData.fechaDespacho,
  patenteCamion: formData.patenteCamion.trim().toUpperCase(),
  intento: 0,
  despachado: false,
  idCompra: venta.idVenta,
  direccionCompra: venta.direccionCompra,
  valorCompra: venta.valorCompra,
});

export const crearEstadoDespacho = (formData) => ({
  intento: Number(formData.intento),
  despachado:
    typeof formData.despachado === "boolean"
      ? formData.despachado
      : formData.despachado === "true",
});
