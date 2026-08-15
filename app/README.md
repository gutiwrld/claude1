# Aliva ✦ — Perfil de alergias y aviso a cocina vía QR

MVP Wizard of Oz del modelo descrito en [`../modelo-negocio.md`](../modelo-negocio.md) (v2, pivot del 14/07/2026).
Stack: HTML/CSS/JS vanilla + Supabase. Sin frameworks, sin build: se sirve tal cual.

> Marca: **Aliva** (decidido el 14/07/2026). Si algún día cambia, se ajusta en `js/config.js`
> (`appName`) y en los `<title>` de las 5 páginas.

Diseño: **línea gráfica Aliva v1.0** (ver `../BRAND.md`) — marca clara y calmada ("alivio, no
miedo"). Fondo `paper` (#F6FAF8, nunca oscuro), verde `#0E8C63` como color dominante, amarillo
`zest` con cuentagotas, chips de alérgeno en alerta cálida (nunca roja agresiva). Tipografía:
Bricolage Grotesque (titulares y logotipo), Hanken Grotesk (texto), Space Mono (etiquetas en
mayúsculas). El símbolo es el módulo QR + check (`assets/brand/`), que también es el estado de
espera animado. Transiciones con View Transitions API, reveals en cascada y partículas verdes en
la confirmación. Todo respeta `prefers-reduced-motion`.

Los tokens de marca viven en `:root` de `css/styles.css`; cámbialos ahí y se propagan a toda la app.

## Qué hace

- **`index.html`** — el usuario crea su perfil de alergias (14 alérgenos UE, trazas, gravedad,
  elaboración separada). El perfil vive **solo en su dispositivo** (localStorage): nunca se sube a
  ningún servidor (minimización RGPD, dato de salud art. 9).
- **`carta.html?l=<local>&m=<mesa>`** — **el destino del QR de cada mesa.** La carta del restaurante
  **filtrada por el perfil del cliente**: cada plato marcado como "Encaja contigo", "Se puede
  adaptar" o "No apto", con filtros (Para ti / Se pueden adaptar / Toda la carta). Al tocar un plato
  se abre su detalle con los alérgenos y los interruptores **"Pídelo sin…"** (los alérgenos que el
  restaurante puede quitar). El cliente monta su pedido y pasa al aviso. La carta es contenido de
  prototipo en `js/menu.js` (en producción viviría en la tabla `platos` de Supabase).
- **`aviso.html?l=<local>&m=<mesa>`** — Muestra exactamente
  qué se enviará (sin nombre), pide consentimiento explícito, envía el aviso y espera la
  confirmación de sala en tiempo real. Si el cliente venía de la carta, **incluye su pedido**
  (platos + "sin X"). Si en 5 minutos nadie confirma, pide al usuario que avise en persona
  (requisito anti-falsa-seguridad; configurable en `js/config.js`).
- **`sala.html`** — panel para el restaurante (código de local + PIN): su insignia de comunidad
  con el progreso al siguiente nivel, avisos pendientes **con el pedido de cada mesa** (platos y
  sus "sin X") y botón "Confirmar: sala y cocina enterados". En el piloto real esto se complementa
  con WhatsApp vía n8n.
- **`locales.html`** — lista pública de locales adheridos, ordenada por insignia de comunidad.

## Insignias de comunidad (`js/badge.js`)

Los propios comensales alérgicos avalan a un restaurante. Tras una visita confirmada, el usuario
valora desde su historial: **¿prepararon tu plato de forma segura, respetando tus alérgenos?**
Esas valoraciones componen la insignia del local, con cinco estados:

| Insignia | Cómo se obtiene |
|---|---|
| **Recién adherido** | Adherido, aún sin valoraciones suficientes (< 3) |
| **Valorado por la comunidad** | ≥ 3 valoraciones, mayoría positivas |
| **De confianza** | ≥ 8 positivas y ≥ 82 % de aciertos |
| **Refugio de la comunidad** | ≥ 20 positivas y ≥ 90 % de aciertos |
| **En revisión** ⚠️ | La insignia **baja** aquí si el ratio cae por debajo del 65 % |

Tres reglas de diseño **no negociables** (ver comentarios en `badge.js`):

1. **La insignia refleja reputación, no seguridad.** Nunca promete "seguro para ti hoy". Los
   mensajes de "avisa siempre en persona" se mantienen incluso en el nivel máximo.
2. **Puede bajar.** Una racha de valoraciones negativas la degrada a "En revisión". Eso la separa
   de una reseña de Google, que solo sube.
3. **Anti-trampa.** Una valoración solo cuenta si va ligada a un aviso real enviado desde ese
   dispositivo, y solo una por visita (constraint `unique(aviso_id)` en Supabase; registro local
   `aliva_valorados` en modo demo). No puedes valorar un sitio donde no has comido.

> Los umbrales están calibrados para escala piloto en `badge.js`; súbelos al crecer la red. La
> ponderación por recencia (que una insignia sin valoraciones recientes pierda fuerza) está
> anotada como mejora futura: hoy se muestra el nº de valoraciones recientes pero no altera el nivel.

## Modo demo (sin configurar nada)

Si no rellenas Supabase en `js/config.js`, la app funciona con datos en el navegador:

1. Sirve la carpeta: `npx serve app` (o cualquier estático) y abre `http://localhost:3000`.
2. Crea tu perfil en `index.html`.
3. Usa el código de local `la-nonna` y una mesa, y envía el aviso.
4. Abre `sala.html` **en otra pestaña del mismo navegador**, entra con `la-nonna` / PIN `1234`
   y confirma: verás la confirmación llegar a la pestaña del cliente.
5. Vuelve a `index.html`: en "Tus últimos avisos" aparece la valoración de esa visita. Al
   responder, la insignia del local se actualiza (visible en `locales.html` y `aviso.html`).

El demo llega con tres locales sembrados en distintos niveles de insignia (`la-nonna` = Refugio,
`casa-vera` = De confianza, `alba-brunch` = Valorado) para enseñar el sistema de un vistazo.
Perfecto para enseñar el flujo completo a un restaurante piloto sin montar backend.

## App instalable (PWA)

Aliva es una **PWA**: se instala en el móvil como una app (icono en la pantalla de inicio,
pantalla completa sin barra del navegador) y **arranca sin conexión** gracias al service worker
(`service-worker.js` + `manifest.webmanifest`). Requisito: servirla por **https** (o localhost).

- **Android / Chrome / Edge:** aparece un botón flotante "Instalar Aliva"; o menú ⋮ →
  "Instalar aplicación / Añadir a pantalla de inicio".
- **iPhone / Safari:** botón Compartir → "Añadir a pantalla de inicio" (iOS no muestra botón
  automático; usa el `apple-touch-icon` incluido).

Al cambiar el armazón (HTML/CSS/JS), sube `CACHE_VERSION` en `service-worker.js` para que los
usuarios reciban la versión nueva.

> Tipografía: hoy se carga Outfit desde Google Fonts (falla el estilo offline y envía la IP a
> Google). Mejora pendiente recomendada para producción: alojar la fuente en `css/` y así ser
> 100 % offline y sin terceros.

## Publicar (deploy)

No hay build; es estático puro. La forma más rápida de tener una URL https real:

1. **Netlify (arrastrar):** entra en Netlify → *Add new site → Deploy manually* y arrastra esta
   carpeta `app/`. En segundos tienes `https://<algo>.netlify.app`. (Incluye `netlify.toml` con
   las cabeceras correctas para el service worker y el manifest.)
2. **Netlify (desde el repo):** conecta el repositorio y pon *Base directory* = `app`, *Build
   command* vacío, *Publish directory* = `.`.
3. Alternativas equivalentes: Vercel, Cloudflare Pages o GitHub Pages (sirviendo la carpeta `app/`).

El `netlify.toml` de la raíz del repo pertenece a otro proyecto; no afecta si despliegas `app/`
como sitio aparte.

## Modo real (Supabase)

1. Crea un proyecto en supabase.com y ejecuta `supabase/schema.sql` en el SQL Editor
   (crea `locales`, `avisos` y `valoraciones`, políticas RLS abiertas de piloto y Realtime).
2. Copia Project URL y anon key en `js/config.js`.
3. Cambia los locales de ejemplo y sus PINs en la tabla `locales`.

⚠️ Las políticas RLS están abiertas a propósito para el piloto (como un formulario público).
Antes de pasar de ~3 locales piloto: autenticación real por local y políticas estrictas.

## QRs de mesa

Cada mesa lleva un QR que apunta a la **carta** (el hub desde el que se ve el menú filtrado y se
avisa a cocina):

```
https://TU-DOMINIO/carta.html?l=<codigo-del-local>&m=<numero-de-mesa>
```

Genera los QRs con cualquier generador (o con la librería `qrcode` en n8n). Un QR por mesa;
si el local prefiere uno solo, omite `&m=` y el usuario escribe la mesa (ya soportado).

## Aviso por WhatsApp (Wizard of Oz con n8n)

El panel de sala funciona solo, pero en el piloto el encargado vive en WhatsApp:

1. n8n con un trigger de Supabase (webhook sobre INSERT en `avisos`).
2. Nodo de WhatsApp (Cloud API o Twilio) al móvil del receptor de sala con el formato:
   `Mesa 4 · Alérgenos: frutos de cáscara, huevo · Alergia grave · Requiere elaboración separada · Confirma en el panel: <enlace a sala.html>`
3. La confirmación se hace en `sala.html` (un toque). Integrar la respuesta "OK" de WhatsApp
   como confirmación es una mejora posterior.

## Despliegue

Carpeta estática pura: Netlify (arrastra la carpeta `app/`), Vercel, GitHub Pages o cualquier
hosting. No hay build. *(El `netlify.toml` de la raíz del repo pertenece al otro proyecto —
la porra del Mundial— y no afecta si despliegas `app/` como sitio aparte.)*

## Límites conocidos del MVP (a propósito)

- Sin auth: PIN de sala en texto plano y RLS abiertas → solo válido para el piloto.
- Sin app nativa ni push: la web + WhatsApp cubren el flujo.
- El aviso no expira solo en base de datos (el estado `expirado` existe pero no hay cron).
- Ningún aviso con datos reales antes de cerrar la validación jurídica (EC-4 del modelo).
