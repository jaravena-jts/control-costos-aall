# Control de costo de aguas lluvias 2026 — v7

Aplicación web preparada para **GitHub + Railway**.

## Roles

- **Administrador**: `javier.aravena@usach.cl`
  - Ve el panel administrador.
  - Puede bloquear/desbloquear toda la página.
  - Puede cargar/publicar una nueva planilla.
  - Puede revisar estado, cuadratura, usuarios configurados e historial de actualizaciones.
- **Actualizador**: `jgonzalez@ingevec.cl`
  - Puede cargar/publicar nuevas versiones del Excel.
  - No puede entrar al panel administrador ni bloquear la página.
- **Visor**:
  - Acceso de solo lectura al dashboard.
  - No puede cargar planillas ni ver el panel administrador.

> Las claves **no están escritas dentro del HTML ni del repositorio**. Se configuran como variables privadas en Railway.

## Cambios funcionales incluidos

- Gráfico de costos **por obra**.
- Clasificación de gasto basada en la **columna K / Descripción Cuenta** de `LM a Agosto 2026`.
- `Subcontratos` + `Subcontratos mano de obra` se muestran y suman como una sola categoría: **Subcontratos**.
- Mantiene cuadratura con el Resumen oficial usando `AALL / Mandante / OBRA`.
- Factura/PDF clickeable desde el detalle cuando existe `URL PDF`.
- Publicación central: cuando administrador/actualizador carga un Excel, los visores ven la misma versión.
- Panel administrador no solo está oculto visualmente: sus rutas de servidor requieren rol `admin`.
- Bloqueo general persistente de la página.
- Historial de las últimas actualizaciones publicadas.

## Publicar en GitHub

1. Descomprime esta carpeta.
2. Crea un repositorio privado en GitHub.
3. Sube **todo el contenido de esta carpeta**.
4. No subas ningún archivo `.env` con claves reales. El `.gitignore` ya lo excluye.

## Publicar en Railway

1. En Railway crea un proyecto nuevo.
2. Selecciona **Deploy from GitHub repo** y conecta el repositorio.
3. Railway detectará Node y ejecutará `npm start`.
4. En **Variables**, crea:

```text
NODE_ENV=production
ADMIN_EMAIL=javier.aravena@usach.cl
ADMIN_PASSWORD=<clave privada del administrador>
UPDATER_EMAIL=jgonzalez@ingevec.cl
UPDATER_PASSWORD=<clave del actualizador definida por ustedes>
SESSION_SECRET=<cadena larga aleatoria>
DATA_DIR=/data
```

5. En Railway agrega un **Volume** y móntalo en:

```text
/data
```

Esto es importante: ahí se guarda la planilla publicada normalizada, el bloqueo y el historial. Sin Volume los datos pueden perderse al desplegar nuevamente.

6. Genera el dominio público de Railway.

## Primera carga

1. Abre la URL de Railway.
2. Presiona **Ingresar**.
3. Inicia sesión como administrador o actualizador.
4. Aparecerá el bloque **Sube el Excel actualizado de Gastos AALL**.
5. Selecciona `Gastos AALL 2026 (3).xlsx` o una versión posterior.
6. El navegador procesa el archivo, reconstruye el dashboard y lo publica en el servidor.
7. A partir de ese momento cualquier visor que abra la URL verá la última versión publicada.

## Panel administrador

Solo el administrador verá el botón **Panel administrador**. Desde ahí puede:

- Revisar si la página está activa o bloqueada.
- Bloquear/desbloquear el sistema.
- Definir el mensaje de bloqueo.
- Ver si las credenciales Admin/Actualizador están configuradas en Railway.
- Revisar las últimas cargas, usuario que actualizó, archivo y total publicado.
- Revisar la diferencia entre Libro Mayor reconstruido y hoja Resumen.

## Seguridad

- Las claves se mantienen en variables privadas de Railway.
- El panel administrador está protegido en backend; cambiar CSS o HTML en el navegador no entrega acceso.
- Las sesiones están firmadas y expiran a las 8 horas.
- La cookie de sesión es `HttpOnly`, `SameSite=Strict` y `Secure` en producción.
- Existe límite básico de intentos de inicio de sesión.

## Archivos principales

- `server.js`: servidor, autenticación, roles, bloqueo y persistencia.
- `public/index.html`: dashboard y procesamiento del Excel.
- `.env.example`: nombres de variables requeridas, sin claves reales.
- `data/`: almacenamiento local; en Railway corresponde al Volume `/data`.
