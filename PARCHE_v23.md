# Parche v23 — Lectura rápida de OC Formulario

## Problema corregido
El archivo `Gastos AALL 2026 JG.xlsx` contiene una hoja **OC Formulario** físicamente extendida hasta la fila **1.048.576**. Aunque los datos reales terminan cerca de la fila 2.738, la versión anterior descomprimía el XML completo (~44 MB) antes de continuar, dejando el navegador detenido en `Leyendo OC Formulario (4/5)`.

## Cambio
- La lectura de hojas auxiliares gigantes ahora es incremental.
- Para `OC Formulario`, el lector procesa hasta 6.000 filas y cancela la descompresión restante.
- Se conservan los datos reales de OC, trabajos y vínculos.
- No cambia la lógica de `resumen`, Libro Mayor, roles, filtros, gráficos ni cuadratura.

## Aplicación
Reemplazar únicamente `public/index.html` en GitHub y hacer Commit. Railway desplegará la nueva versión automáticamente. Luego usar Ctrl+F5 y volver a cargar el Excel JG.
