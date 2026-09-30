# Parche v16 — gráfico único por obra con alertas integradas

Cambios solicitados:

- Se elimina por completo el bloque **Resumen por obra**.
- Se elimina la tabla separada **Estado de obras con filtraciones 2026**.
- Toda la información de la hoja **resumen**, cuadro **H:P**, queda concentrada en el recuadro principal **Costos por obra — clasificación, estado y alertas**.
- El recuadro se divide en **dos esquemas verticales**, no lado a lado:
  1. Obras con costo registrado en columna **M**.
  2. Obras con AALL/Postventa pero con columna **M vacía o $0**, marcadas con alerta.
- Al hacer clic en una obra se muestran dentro del mismo gráfico:
  - **L:** estatus.
  - **N:** gestionado por.
  - **O:** observación 1.
  - **P:** observación 2.
  - **M:** costo o alerta de ausencia de gasto.
- En obras con costo se mantiene además el desglose por clasificación de gastos.
- Se mantiene la carga dinámica de Excel, filtros, facturas PDF, roles y actualización central vía Railway.

## Instalación

Reemplazar únicamente:

`public/index.html`

Hacer Commit en GitHub. Railway desplegará automáticamente.
