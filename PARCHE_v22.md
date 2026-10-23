# Parche v22 — Matriz JG / costo AALL oficial por obra

## Qué corrige

- Mantiene toda la lógica y diseño de la v21.
- Usa la tabla dinámica A:E de la hoja `resumen` como fuente financiera oficial por obra.
- Usa el valor `AALL` de la tabla dinámica para decidir si una obra tiene costo o debe mostrar la alerta **No registra costo por PV**.
- Ya no depende de la columna `Total` del cuadro operativo, que en la matriz JG contiene celdas vacías, `#N/A` o fórmulas con rangos antiguos.
- Conserva del cuadro operativo H:S: Nombre de obra, Supervisor, GD, GP, PA, Status, Gestionado por, Obs1 y Obs2.
- Mantiene filtros, detalle inmediato en el gráfico, factura PDF, roles, carga dinámica, cuadratura y publicación en Railway.

## Resultado esperado con `Gastos AALL 2026 JG.xlsx`

- AALL: $420.538.188,75
- Mandante: $11.884.589
- OBRA: $7.310.605
- Total oficial: $439.733.382,75
- 232 movimientos oficiales.
- 86 obras AALL informadas en el cuadro operativo.
- 32 obras con costo AALL oficial.
- 54 obras con alerta `No registra costo por PV`.

## Instalación

Reemplazar únicamente `public/index.html` en GitHub por el archivo incluido en este parche, hacer Commit y esperar el redeploy de Railway. Después realizar Ctrl+F5 y volver a cargar la matriz JG desde el portal.
