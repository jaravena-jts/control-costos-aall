# Parche v21 — corrección de lectura AALL 2026

## Problema detectado
En `Gastos AALL 2026 (7).xlsx` se insertaron las columnas GD, GP y PA en el bloque operativo de la hoja `resumen`.
La fórmula existente en la columna AB del Libro Mayor quedó como:

`VLOOKUP(L2,resumen!$H$6:$N$89,4,0)`

Antes el índice 4 devolvía `AALL 2026`. Con las nuevas columnas, el índice 4 ahora devuelve GD. Por eso AB comenzó a mostrar nombres como `Oscar Vidal`, `David Paredes`, etc., y el portal dejó de reconocer los movimientos oficiales.

## Corrección
La v21 deja de depender de AB para identificar el universo AALL. La pertenencia a AALL 2026 se obtiene directamente desde el cuadro operativo de la hoja `resumen`, y la clasificación AALL / Mandante / OBRA se sigue tomando desde la columna `Resumen` del Libro Mayor.

Esto mantiene la trazabilidad y permite que GD, GP y PA sigan creciendo sin romper el control.
