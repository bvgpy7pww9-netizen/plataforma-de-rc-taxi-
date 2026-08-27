# RC Taxi y Limo — Backend real (piloto)

Esto reconstruye lo que ya habíamos armado y probado: registro/login de choferes,
ubicación en vivo cada 10 segundos, y un panel de despacho con mapa para ver a
cada chofer conectado en tiempo real.

## Qué hay en esta carpeta

- `server.js` — el backend (Node + Express).
- `driver-app/chofer.html` — la app que abre el chofer en su celular.
- `dispatch/dispatch.html` — el panel que abrís vos para ver el mapa.
- `package.json` — dependencias.

## Paso 1 — Subir esto a GitHub (sin usar comandos, desde el navegador)

1. Andá a [github.com](https://github.com) y creá una cuenta si no tenés (gratis).
2. Arriba a la derecha, tocá el `+` → **New repository**.
3. Nombre: `rc-taxi-platform` (o el que quieras). Dejalo **Public** o **Private**,
   cualquiera de las dos sirve para Render. Tocá **Create repository**.
4. En la página del repo vacío, tocá el link **uploading an existing file**.
5. Arrastrá TODOS los archivos y carpetas de esta entrega (descomprimí el .zip
   primero) a esa página, y tocá **Commit changes**.

## Paso 2 — Conectarlo a Render

1. Andá a [render.com](https://render.com) → **Get Started for Free** →
   registrate con GitHub (así te deja elegir el repo directo).
2. En el dashboard de Render, tocá **New +** → **Web Service**.
3. Elegí el repo `rc-taxi-platform` que acabás de subir.
4. Configuración:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. Antes de crear el servicio, tocá **Advanced** → **Add Environment Variable**:
   - Key: `DISPATCH_KEY`
   - Value: la clave que quieras usar para entrar al panel de despacho (anotala,
     la vas a necesitar).
6. Tocá **Create Web Service**. Tarda 1-2 minutos en levantar.

Cuando termine, Render te da una dirección tipo
`https://rc-taxi-platform.onrender.com`.

## Paso 3 — Los dos links que vas a usar

- **App del chofer:** `https://rc-taxi-platform.onrender.com/driver-app/chofer.html`
  (este es el que le mandás al chofer).
- **Panel de despacho (vos):** `https://rc-taxi-platform.onrender.com/dispatch/dispatch.html`
  (te va a pedir la clave `DISPATCH_KEY` que pusiste en el paso 2, después la
  recuerda en el navegador).

## Nota sobre el plan gratis de Render

El plan gratis "duerme" el servicio después de 15 minutos sin uso, y tarda unos
30-60 segundos en despertar cuando alguien vuelve a entrar. Para un piloto con
pocos choferes no es un problema; cuando pases a choferes reales todos los días,
conviene pasar al plan pago (~$7/mes) para que no se duerma.

## Qué falta (a propósito, para no complicar el piloto)

- No hay pantalla de "aceptar/rechazar viaje" todavía — este backend cubre el
  paso que faltaba: que vos puedas VER al chofer conectado en el mapa en vivo.
- Las ganancias, asignación automática al más cercano, consola de 6 líneas y
  la zona de parada de la estación (todo lo que ya habíamos probado antes) se
  puede ir agregando arriba de esta base — avisame cuando quieras seguir con
  eso.
