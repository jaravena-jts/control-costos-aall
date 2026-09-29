# Parche v11 — lectura desde hoja Resumen

## Archivo revisado
`Gastos AALL 2026 (4)(1).xlsx`

## Resultado de la revisión
La hoja `resumen` mantiene el mismo formato de control:
- encabezado de tabla dinámica en A4:E4
- columnas: `Etiquetas de fila | AALL | Mandante | OBRA | Total general`
- fila `Total general` en la fila 30
- total oficial cacheado: **$123.608.446,75**
- AALL: **$98.778.990,75**
- Mandante: **$17.475.251**
- OBRA: **$7.354.205**
- 25 obras en la tabla dinámica

El Libro Mayor está en `LM a Agosto 2026` y llega visualmente a la fila 1.048.576, pero los movimientos reales terminan alrededor de la fila 5.480. La fila 5.480 es válida: contiene una fórmula (`I5480 = Hoja6!M57`) y participa del Resumen, por lo que NO debe eliminarse.

## Qué cambia
1. La web lee primero la hoja `resumen` como fuente oficial.
2. Extrae el total general y el total por obra directamente desde la tabla dinámica A:E.
3. Luego reconstruye el Libro Mayor con AB=`AALL 2026` y AC=`AALL/Mandante/OBRA`.
4. Valida dos niveles:
   - cuadratura general;
   - cuadratura obra por obra.
5. Mantiene el mismo diseño y filtros de la web.
6. Mantiene facturas PDF, clasificación de columna K y consolidación de ambos tipos de Subcontratos.
7. Reduce el peso de la publicación al servidor eliminando la copia duplicada `raw` de cada fila.
8. Aumenta el límite de publicación del servidor a 60 MB para evitar rechazos de carga de datasets grandes.

## Archivos a reemplazar en GitHub
- `public/index.html`
- `server.js`

Luego hacer Commit. Railway debe desplegar automáticamente.
