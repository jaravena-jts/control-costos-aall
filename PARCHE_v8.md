# Parche v8 — gráfico por obra con desglose interactivo

## Qué cambia
- El gráfico de **Costos por obra** deja de filtrar la página al hacer clic.
- Al hacer clic en una obra o en su barra, el mismo gráfico despliega debajo el detalle exacto de costos de esa obra.
- Muestra monto y porcentaje por categoría, por ejemplo: **Materiales**, **Subcontratos** (incluye Subcontratos + Subcontratos mano de obra) y **Servicios y consumo generales**.
- Un segundo clic sobre la misma obra, o el botón **Cerrar detalle**, vuelve al gráfico completo.
- Los filtros superiores siguen disponibles y funcionan normalmente.

## Cómo instalar en GitHub
Reemplaza únicamente el archivo:

`public/index.html`

por el `public/index.html` incluido en este parche. Luego haz **Commit changes**. Railway hará el despliegue automático desde la rama `main`.

No es necesario modificar `server.js`, las variables de Railway ni el volumen `/data`.
