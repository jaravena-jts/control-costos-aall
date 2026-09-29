# Control de costo de aguas lluvias 2026 — v12

Aplicación web preparada para **GitHub + Railway**, manteniendo el diseño de las versiones anteriores.

## Roles y visibilidad

- **Administrador general**: `javier.aravena@usach.cl`
  - Ve el dashboard completo: Resumen oficial, AALL, Mandante, OBRA y Pendiente clasificar.
  - Puede cargar/publicar nuevas planillas.
  - Es el único que ve el **Panel administrador** y puede bloquear/desbloquear la página.
- **Actualizador**: `jgonzalez@ingevec.cl`
  - Ve el dashboard completo: Resumen oficial, AALL, Mandante, OBRA y Pendiente clasificar.
  - Puede cargar/publicar nuevas planillas.
  - No puede entrar al Panel administrador ni bloquear la página.
- **Visor**:
  - Ve únicamente la información de **Aguas Lluvias (AALL)**.
  - Mantiene filtros, gráfico por obra, detalle de gastos y enlaces PDF de los movimientos AALL.
  - No recibe desde el servidor los datos de Mandante, OBRA ni Pendiente clasificar.

> Las claves no están guardadas dentro del HTML ni del repositorio. Se configuran como variables privadas en Railway.

## Nueva lectura desde hoja `resumen`

La versión v12 mantiene la hoja **`resumen`** como fuente oficial y agrega una segunda lectura directa del bloque de edificios con filtraciones.

La lectura se detecta por encabezados, actualmente ubicados en **H:P**:

- H: Obra
- I: Nombre de obra
- J: Supervisor
- K: AALL 2026
- L: Status
- M: Total / costo AALL
- N: Medio / gestionado por
- O: Obs1
- P: Obs2

La web muestra una sección **Estado de obras con filtraciones 2026**. Cada obra indica estado, costo AALL, medio de gestión y observaciones. Las obras con costo cero se muestran con una alerta **? Sin costo asociado**. Al hacer clic en la obra se despliegan Obs1 y Obs2.

## Archivo validado

Con `Gastos AALL 2026 (6).xlsx` se detectaron:

- 84 edificios/obras en el bloque H:P.
- 27 con costo AALL asociado.
- 57 sin costo AALL asociado.
- Suma de columna M: **$211.239.599,75**, que coincide con el total AALL de la tabla dinámica principal de la hoja `resumen`.

## Publicar en GitHub + Railway

1. Sube/reemplaza los archivos del proyecto en GitHub.
2. Railway desplegará automáticamente desde la rama conectada.
3. Mantén estas variables en Railway:

```text
NODE_ENV=production
ADMIN_EMAIL=javier.aravena@usach.cl
ADMIN_PASSWORD=<clave privada del administrador>
UPDATER_EMAIL=jgonzalez@ingevec.cl
UPDATER_PASSWORD=<clave privada del actualizador>
SESSION_SECRET=<cadena larga aleatoria>
DATA_DIR=/data
```

4. Mantén un **Volume** montado en `/data`.

## Aplicar solo el parche v12

Reemplaza en tu repositorio:

- `public/index.html`
- `server.js`

No es necesario cambiar las contraseñas ni las variables de Railway.

## Seguridad de roles

La restricción del visor no depende solo de ocultar tarjetas en HTML. El backend entrega a los visores únicamente las filas clasificadas como **AALL**. Los datos de Mandante, OBRA, Pendiente y el Resumen oficial completo solo se entregan a Administrador general y Actualizador.

## v14 — lectura H:P / alertas M vacía
La tabla de obras con filtraciones se lee directamente desde H:P de la hoja `resumen`. Las obras con M vacía o $0 se muestran primero, con alerta y los valores de L (estatus) y N (gestionado por).
