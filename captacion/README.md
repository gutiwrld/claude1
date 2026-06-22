# Captación · Webs para negocios locales

Proyecto con **dos partes** que comparten una misma base de datos en Supabase:

1. **Web pública** (`/`) — landing de marketing para captar clientes. Tiene un
   formulario de contacto que registra cada **lead** en la base de datos.
2. **Panel interno** (`/panel`) — CRM para Guz y Luis: pipeline de prospección,
   ficha de cada negocio con historial de seguimiento, lista de tareas (to-do) y
   bandeja de leads entrantes. Protegido con un **PIN**.

> Vive en la subcarpeta `captacion/` del repo. La app "Porra Mundial 2026" de la
> raíz queda intacta y aparte.

## Stack

- **Vite + React + TypeScript** (SPA, sin SSR).
- **Tailwind CSS** (tema cálido: terracota + papel).
- **Supabase** (Postgres + Realtime), cliente `@supabase/supabase-js`.
- Despliegue en **Netlify**.

## Puesta en marcha

```bash
cd captacion
npm install
cp .env.example .env   # y rellena los valores (ver abajo)
npm run dev            # http://localhost:5173  → web pública
                       # http://localhost:5173/panel → CRM (PIN)
```

### Conectar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. **SQL Editor → New query**, pega `supabase/schema.sql` y pulsa **Run**.
   Esto crea las tablas (`businesses`, `interactions`, `tasks`, `leads`), las
   políticas RLS y activa **Realtime**.
3. **Project Settings → API** → copia *Project URL* y *anon public key*.
4. Rellena `.env`:

   ```
   VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   VITE_PANEL_PIN=1234        # PIN para entrar al panel
   ```

## Modelo de datos

| Tabla          | Para qué |
|----------------|----------|
| `businesses`   | Negocios locales: prospectos y clientes. Estado (nuevo→contactado→interesado→propuesta→cliente→descartado), prioridad, responsable, origen, datos de contacto. |
| `interactions` | Historial de seguimiento de cada negocio (llamadas, emails, notas…). |
| `tasks`        | To-do list, opcionalmente ligada a un negocio, con fecha y responsable. |
| `leads`        | Entradas del formulario de la web pública, listas para convertir en negocio. |

## Cómo se usa el panel

- **Resumen:** métricas, embudo de prospección y próximas tareas.
- **Negocios:** tablero por estado. Crea/edita negocios, cambia el estado en un
  clic y registra el seguimiento en cada ficha.
- **Tareas:** lista de pendientes con fecha, prioridad y responsable.
- **Leads:** lo que llega por la web. Conviértelo en negocio (entra al pipeline
  como *interesado*, origen *web*) o descártalo.

Cambia el equipo, la marca y los textos en `src/data/constants.ts`.

## Despliegue en Netlify

Como el proyecto está en una subcarpeta, crea un **sitio nuevo** en Netlify
apuntando a este repo y pon **Base directory = `captacion`** (el `netlify.toml`
ya define `command`, `publish` y el redirect SPA). Añade en *Environment
variables*: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` y `VITE_PANEL_PIN`.

## Nota de seguridad

Las políticas RLS son **abiertas** a propósito: el acceso al panel se protege
con un **PIN** en la app y por la obscuridad de la URL `/panel`, no con
autenticación real. La `anon key` es pública por diseño (va en el cliente).
Es un planteamiento pragmático para dos personas; **no metáis datos sensibles**.
Si en el futuro queréis seguridad de verdad, se migra a Supabase Auth con
políticas RLS por usuario.
