# Control de costo de aguas lluvias 2026 — v19

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

## Lectura dinámica desde hoja `resumen`

La hoja **`resumen`** sigue siendo la fuente oficial. Desde la v19, el cuadro operativo de obras se detecta por **nombre de encabezado**, no por letras fijas de columna.

El archivo `Gastos AALL 2026 (7).xlsx` incorpora:

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

Esto permite insertar nuevas columnas sin romper la lectura. Al seleccionar una obra, el gráfico muestra Supervisor, GD, GP, PA, Estado, Costo, Gestionado por y Observaciones cuando estén disponibles.

## Archivo validado

Con `Gastos AALL 2026 (7).xlsx` se detectaron:

- 84 edificios/obras.
- 27 con costo AALL asociado.
- 57 sin costo AALL asociado.
- Total AALL del cuadro: **$211.239.599,75**.
- Total oficial de la hoja `resumen`: **$236.069.055,75**.

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
