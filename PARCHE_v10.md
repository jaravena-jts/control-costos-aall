# Parche v10 — lectura robusta de Excel

## Problema detectado
El archivo `Gastos AALL 2026 (4).xlsx` tiene la hoja **LM a Agosto 2026** extendida hasta la fila **1.048.576**. Desde aproximadamente la fila 5.479, Excel mantiene únicamente la columna **AD = "En Libro Mayor"**. Esto hace que el XML interno de esa hoja mida aproximadamente **118 MB**, aunque los datos reales terminan alrededor de la fila 5.478.

La versión anterior intentaba convertir toda esa hoja en un DOM XML, lo que podía congelar el navegador o impedir la carga.

## Corrección
- Se mantiene la lógica original del dashboard.
- Para hojas XML muy grandes, se usa un lector liviano que recorre sólo las filas con datos reales.
- Las filas residuales que contienen únicamente AD no se consideran movimientos.
- No se cambia la clasificación AALL/Mandante/OBRA ni la clasificación de costos de columna K.

## Archivo a reemplazar
Para aplicar sólo el parche en GitHub, reemplazar:

`public/index.html`

Luego hacer **Commit changes**. Railway desplegará automáticamente.
