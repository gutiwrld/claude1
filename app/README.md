# Aliva ✦ — Perfil de alergias y aviso a cocina vía QR

MVP Wizard of Oz del modelo descrito en [`../modelo-negocio.md`](../modelo-negocio.md) (v2, pivot del 14/07/2026).
Stack: HTML/CSS/JS vanilla + Supabase. Sin frameworks, sin build: se sirve tal cual.

> Marca: **Aliva** (decidido el 14/07/2026). Si algún día cambia, se ajusta en `js/config.js`
> (`appName`) y en los `<title>` de las 4 páginas.

Diseño: tema oscuro premium (referencias Opal/Revolut) — fondo aurora animado en canvas, orbe
de identidad con gradiente cónico animado (`@property`), tarjetas de cristal (`backdrop-filter`),
transiciones entre páginas con la View Transitions API, reveals en cascada (IntersectionObserver)
y partículas en la confirmación. Todo respeta `prefers-reduced-motion`.

## Qué hace

- **`index.html`** — el usuario crea su perfil de alergias (14 alérgenos UE, trazas, gravedad,
  elaboración separada). El perfil vive **solo en su dispositivo** (localStorage): nunca se sube a
  ningún servidor (minimización RGPD, dato de salud art. 9).
- **`aviso.html?l=<local>&m=<mesa>`** — la página que abre el QR de cada mesa. Muestra exactamente
  qué se enviará (sin nombre), pide consentimiento explícito, envía el aviso y espera la
  confirmación de sala en tiempo real. Si en 5 minutos nadie confirma, pide al usuario que avise
  en persona (requisito anti-falsa-seguridad; configurable en `js/config.js`).
- **`sala.html`** — panel para el restaurante (código de local + PIN): su insignia de comunidad
  con el progreso al siguiente nivel, avisos pendientes y botón "Confirmar: sala y cocina
  enterados". En el piloto real esto se complementa con WhatsApp vía n8n.
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

## Modo real (Supabase)

1. Crea un proyecto en supabase.com y ejecuta `supabase/schema.sql` en el SQL Editor
   (crea `locales` y `avisos`, políticas RLS abiertas de piloto y Realtime).
2. Copia Project URL y anon key en `js/config.js`.
3. Cambia los locales de ejemplo y sus PINs en la tabla `locales`.

⚠️ Las políticas RLS están abiertas a propósito para el piloto (como un formulario público).
Antes de pasar de ~3 locales piloto: autenticación real por local y políticas estrictas.

## QRs de mesa

Cada mesa lleva un QR que apunta a:

```
https://TU-DOMINIO/aviso.html?l=<codigo-del-local>&m=<numero-de-mesa>
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
