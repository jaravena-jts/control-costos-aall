# Parche v19 — nuevas columnas en hoja Resumen

Se mantiene el mismo diseño y funcionamiento de la v18.

## Cambio principal
La lectura del cuadro operativo de la hoja `resumen` ya no depende de posiciones fijas de columnas. El portal detecta los datos por nombre de encabezado, por lo que puede seguir funcionando aunque se inserten columnas nuevas.

Formato detectado en `Gastos AALL 2026 (7).xlsx`:

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

## Visualización
Al seleccionar una obra en el gráfico se mantienen Supervisor, Estado, Costo, Gestionado por y Observaciones, y se incorporan GD, GP y PA cuando existan.

El filtro `Gerente proyecto` también incorpora los valores GP disponibles en la hoja `resumen`, incluyendo obras sin costo.

## Compatibilidad
El lector conserva compatibilidad con la estructura anterior de la hoja `resumen`, por lo que no depende de que Status, Total o Gestionado por permanezcan en una letra de columna específica.

## Validación del archivo (7)
- 84 obras en el cuadro operativo.
- 27 con costo.
- 57 sin costo registrado.
- Total AALL del cuadro: $211.239.599,75.
- Total oficial de la hoja resumen: $236.069.055,75.
