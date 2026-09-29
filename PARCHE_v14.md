# Parche v14 — obras sin costo en columna M

Este parche corrige la lectura del cuadro H:P de la hoja `resumen`.

## Cambio principal
La lectura ya no depende de encontrar encabezados duplicados en la fila. Usa directamente las columnas definidas en el control:

- H: código de obra
- I: nombre de obra
- J: supervisor
- K: AALL 2026
- L: estatus
- M: costo
- N: gestionado por / medio
- O: observación 1
- P: observación 2

Las obras con M vacía o en $0 se conservan en el dataset, se muestran primero en la tabla y reciben alerta visible. La alerta muestra además el valor de L (estatus) y N (gestionado por).

## Archivo a reemplazar en GitHub
Reemplazar únicamente:

`public/index.html`

No es necesario modificar `server.js`, variables de Railway, usuarios ni contraseñas.

## Validación con el archivo base
Con `Gastos AALL 2026 (6).xlsx`, el cuadro H:P contiene 84 obras: 27 con costo y 57 con M vacía/$0.
