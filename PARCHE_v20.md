# Parche v20 — lectura correcta Resumen + filtros GP y PA

## Corrección principal
La web usa como fuente maestra de datos de obra el cuadro operativo de la hoja `resumen`.

En el archivo `Gastos AALL 2026 (7).xlsx` se detectó esta estructura:

- Obra
- Nombre de obra
- Supervisor
- GD
- GP
- PA
- AALL 2026
- Status
- Total
- GESTIONADO POR
- Obs1
- Obs2

La lectura se realiza por nombre de encabezado, no por letra fija de Excel.

## Cambios
- Se agregó filtro independiente `PA`.
- El filtro `GP` toma prioritariamente la información del cuadro operativo de `resumen`.
- Los movimientos del Libro Mayor heredan de `resumen` los datos correctos de Supervisor, GD, GP, PA, Estado y Gestionado por para evitar cruces con metadatos antiguos.
- Filtrar por GP o PA ya no elimina las obras que tienen postventa/AALL pero costo $0.
- El gráfico de obras responde a los filtros GP y PA.
- Se mantienen las alertas `No registra costo por PV`.
- En el detalle de obra se mantienen Supervisor, GD, GP, PA, Estado, Costo, Gestionado por y Observaciones.
- La exportación CSV incorpora GD, GP y PA.
- Valores `#N/A` no se ofrecen como opciones de filtro.

## Aplicación
Reemplazar únicamente:

`public/index.html`

Hacer Commit en GitHub y esperar el redeploy de Railway. Luego volver a cargar el Excel actualizado desde el portal y hacer Ctrl+F5.
