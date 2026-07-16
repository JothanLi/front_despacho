import test from "node:test";
import assert from "node:assert/strict";
import {
  crearDespachoDesdeVenta,
  crearEstadoDespacho,
} from "../src/utils/despachoMappers.js";

test("crea el payload de un despacho usando el campo despachado", () => {
  const payload = crearDespachoDesdeVenta(
    {
      idVenta: 10,
      direccionCompra: "Av. Siempre Viva 123",
      valorCompra: 45000,
    },
    {
      fechaDespacho: "2026-07-20",
      patenteCamion: " abcd12 ",
    }
  );

  assert.deepEqual(payload, {
    fechaDespacho: "2026-07-20",
    patenteCamion: "ABCD12",
    intento: 0,
    despachado: false,
    idCompra: 10,
    direccionCompra: "Av. Siempre Viva 123",
    valorCompra: 45000,
  });
});

test("convierte los valores del formulario de cierre al tipo correcto", () => {
  assert.deepEqual(
    crearEstadoDespacho({ intento: "2", despachado: "true" }),
    { intento: 2, despachado: true }
  );
});
