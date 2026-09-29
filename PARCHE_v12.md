# Parche v12 — roles + estado de obras desde Resumen H:P

## Archivos a reemplazar

1. `public/index.html`
2. `server.js`

Haz Commit en GitHub y espera el redeploy de Railway.

## Cambios

- Administrador general y Actualizador ven los 5 KPI: Resumen oficial, AALL, Mandante, OBRA y Pendiente clasificar.
- Visor ve solo AALL. La restricción también se aplica en backend.
- La carga del Excel sigue disponible para Administrador general y Actualizador.
- El Panel administrador y el bloqueo siguen siendo exclusivos del Administrador general.
- Se lee dinámicamente el bloque de la hoja `resumen` identificado por los encabezados Obra / Nombre de obra / Supervisor / AALL 2026 / Status / Total / Medio / Obs1 / Obs2 (actualmente H:P).
- Nueva sección de estado de obras con filtraciones.
- Obra con costo 0: alerta `? Sin costo asociado`.
- Clic sobre la obra: despliega Obs1 y Obs2.
- Se agregan filtros Estado obra y Gestionado por.
- Se mantienen gráfico por obra, clasificación K, PDF clickeable y demás trazabilidad.

## Validación con Gastos AALL 2026 (6).xlsx

- 84 obras en H:P.
- 27 con costo.
- 57 sin costo asociado.
- Total columna M: $211.239.599,75.
- Total AALL de la tabla dinámica A:E: $211.239.599,75.
