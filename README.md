# Porra Mundial 2026 ⚽

App web para una **porra (quiniela) del Mundial 2026** entre amigos. Cada jugador predice el marcador de cada partido y se
puntúa así:

- **+3** marcador exacto.
- **+1** acertar el ganador (o el empate) sin el marcador exacto.
- **0** fallar.

Funciona en la nube y se **sincroniza en tiempo real** entre dispositivos gracias a Supabase Realtime.

## Stack

- **Vite + React + TypeScript** (SPA, sin SSR).
- **Tailwind CSS**.
- **Supabase** (Postgres + Realtime), cliente `@supabase/supabase-js`.
- Despliegue en **Netlify** (`netlify.toml` con build y redirect SPA).
- Navegación por pestañas con estado de React (sin router pesado).

## Conectar tu Supabase (pasos exactos)

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Ve a **SQL Editor → New query**, pega el contenido de [`supabase/schema.sql`](supabase/schema.sql) y pulsa **Run**.
   Esto crea las tablas, las políticas RLS abiertas y **activa Realtime** para `matches` y `predictions`
   (`alter publication supabase_realtime add table matches, predictions;`).
   - Alternativa para Realtime: **Database → Replication** y activa `matches` y `predictions`.
3. Ve a **Project Settings → API** y copia **Project URL** y la **anon public key**.
4. Copia `.env.example` a `.env` y rellénalas:
   ```
   VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

## Comandos

```bash
npm install      # instala dependencias
npm run dev      # desarrollo en http://localhost:5173
npm run build    # build de producción en dist/
npm run preview  # sirve el build localmente
npm test         # comprueba los 5 casos de puntuación
```

## Despliegue en Netlify

1. Conecta el repositorio en Netlify (o `netlify deploy`).
2. El `netlify.toml` ya define `command = "npm run build"`, `publish = "dist"` y el redirect SPA `/* → /index.html 200`.
3. En **Site settings → Environment variables** añade `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.

## Cómo se usa

1. **Crear porra:** pon tu nombre y un PIN de admin. Se crea la pool, se siembran los **72 partidos** de la fase de grupos
   y se te redirige a `?pool=<id>`. Usa **Invitar 🔗** para copiar el enlace.
2. **Unirse:** quien abra el enlace ve los jugadores y entra como uno o crea su nombre. El dispositivo lo recuerda
   (`localStorage`).
3. **Partidos:** pestaña con los partidos por jornada; ajusta tu marcador con +/− (se guarda solo). Con resultado, ves tus
   puntos y un desplegable **Ver porras** con lo que puso cada uno.
4. **Clasificación:** ranking por puntos (desempate por exactos y nombre); te resalta a ti.
5. **Admin (PIN):** carga resultados, **Marcar final**, cerrar/reabrir, borrar resultado y **añadir eliminatorias**
   (dos equipos de los 48 + ronda).

Un pronóstico solo es editable si el partido **no está cerrado** y **no tiene resultado**.

## Resultados automáticos vía API (opcional)

Hay una **Netlify Function** (`netlify/functions/sync-results.mts`) que trae los marcadores reales
desde [football-data.org](https://www.football-data.org) (plan gratuito) y los aplica en Supabase.
Se ejecuta sola **cada 15 min** y también desde el botón *"Sincronizar resultados ahora"* en Admin.

Para activarla, en **Netlify → Site configuration → Environment variables** añade:

| Variable | Valor |
|----------|-------|
| `SUPABASE_URL` | misma URL del proyecto Supabase |
| `SUPABASE_ANON_KEY` | la anon key (las políticas RLS son abiertas) |
| `FOOTBALL_DATA_TOKEN` | token gratuito de football-data.org (tras registrarte) |
| `FOOTBALL_DATA_COMPETITION` | *(opcional)* código de competición, por defecto `WC` |

Notas:
- El cruce se hace por **pareja de equipos** (sin importar local/visitante). Los nombres de la API
  (inglés) se mapean a los nombres en español en `ALIASES` dentro de la función; si la API usa un
  nombre que no está en el mapa, ese partido aparece en `unmatched` en la respuesta para que amplíes
  el mapa.
- Solo funciona cuando football-data.org tiene esos partidos terminados. Mientras tanto, el admin
  puede meter resultados a mano (la suma de puntos y el cierre siguen siendo automáticos).

## Nota de seguridad

Las políticas RLS son **abiertas** a propósito: es una porra privada entre amigos protegida por el enlace de la pool y el
**PIN** de administrador, no por autenticación real. La `anon key` es **pública por diseño** (va en el cliente); no expone
nada que no quieras compartir con quien tenga el enlace. No metas datos sensibles.

## Estructura del proyecto

```
.
├── index.html
├── netlify.toml              # build + redirect SPA
├── .env.example
├── supabase/
│   └── schema.sql            # tablas, RLS abiertas y Realtime
├── src/
│   ├── main.tsx
│   ├── App.tsx               # estado, pestañas, flujo crear/unir
│   ├── index.css             # Tailwind + tema oscuro estadio
│   ├── data/
│   │   └── teams.ts          # 12 grupos oficiales (48 equipos)
│   ├── lib/
│   │   ├── supabase.ts       # cliente Supabase
│   │   ├── types.ts          # tipos de dominio
│   │   ├── matches.ts        # genera los 72 partidos de grupos
│   │   ├── score.ts          # lógica de puntuación
│   │   ├── score.test.ts     # 5 casos de aceptación
│   │   ├── standings.ts      # cálculo de la clasificación
│   │   ├── storage.ts        # identidad por dispositivo (localStorage)
│   │   └── usePoolData.ts    # carga + suscripción Realtime
│   └── components/
│       ├── ConfigMissing.tsx
│       ├── CreatePool.tsx
│       ├── JoinPool.tsx
│       ├── MatchesTab.tsx
│       ├── MatchCard.tsx
│       ├── ScoreStepper.tsx
│       ├── StandingsTab.tsx
│       ├── AdminTab.tsx
│       ├── AdminGate.tsx
│       └── ui.tsx            # primitivos (Button, Banner, Spinner…)
└── ...config (vite, tsconfig, tailwind, postcss)
```
