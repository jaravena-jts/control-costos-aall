# Parche v13 — alerta de obras sin gasto

Se mantiene el mismo diseño y la misma fuente de datos: hoja `resumen`, bloque H:P.

## Cambio principal
- H = código de obra.
- I = nombre de obra.
- L = Status.
- M = costo AALL del edificio.
- N = Gestionado por / Medio.
- O:P = observaciones.

Toda fila válida del bloque H:P representa una obra que ha registrado filtraciones/AALL 2026.

Cuando la celda de **columna M está vacía** (o contiene cero), la web muestra de forma visible:

**⚠ FILTRACIÓN / POSTVENTA SIN GASTO**

Además muestra `$0`, la leyenda `Sin gasto registrado` y `Columna M vacía`, y resalta la fila.

El detalle de la obra explica que está incluida en el cuadro de filtraciones pero no figura gasto asociado.

## Aplicación
Reemplazar únicamente `public/index.html` en GitHub y hacer commit. Railway hará el redeploy automáticamente.

Después de desplegar, volver a cargar/publicar el Excel para que el sistema conserve explícitamente la condición de celda M vacía.
