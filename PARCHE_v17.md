# Parche v17 — Optimización visual y filtros

## Archivos modificados
- `public/index.html`

## Cambios incluidos
1. El dashboard usa mejor el ancho disponible de la pantalla (hasta 1800 px).
2. El gráfico de obras se divide en dos columnas 50/50:
   - izquierda: obras de mayor costo;
   - derecha: continuación del ranking y obras sin costo.
3. Las obras sin gasto mantienen la alerta: **No registra costo por PV**.
4. Se elimina cualquier texto visible tipo “columna M vacía”.
5. Al hacer clic en una obra se muestra:
   - Supervisor
   - Estado
   - Costo
   - Gestionado por
   - Observación 1
   - Observación 2
   - desglose del gasto cuando existe.
   No se muestran letras de columnas en el detalle.
6. Se elimina el filtro `Supervisor costo (LM)`.
7. El filtro Periodo transforma automáticamente `202601`, `202602`, etc. en `Enero 2026`, `Febrero 2026`, etc.; se genera dinámicamente con los meses presentes en la planilla.
8. La tabla `Detalle de gastos` se compacta para verse completa sin desplazamiento horizontal en escritorio: columnas con ancho proporcional, texto con salto de línea y enlaces PDF compactos.
9. Se mantiene la lógica dinámica de carga del Excel y la lectura desde la hoja `resumen`.

## Cómo aplicar
Reemplazar en GitHub únicamente:

`public/index.html`

Hacer Commit. Railway desplegará automáticamente. Cuando el servicio vuelva a `Online`, realizar `Ctrl + F5` en el navegador.
