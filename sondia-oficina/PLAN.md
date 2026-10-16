# SondiaHunter · Departamento 01 · Plan (paso 0)

## Contexto

SONDIA capta clientes con cold email a negocios locales que tienen webs anticuadas: 305 leads, 279 contactados y un cliente cerrado. Hasta ahora todo se ha hecho a mano. Hunter automatiza los cinco turnos (rastreo, redacción, bandeja, seguimiento y preparación) con una regla clara: **Guzmán aprueba cada envío**. Es el primer departamento de una «oficina de agentes» a la que se irán sumando más, así que lo común (ejecuciones, rastro, aprobaciones, outbox y pausa) va en una capa compartida.

**Lo decidido en las preguntas**
- Repo nuevo **`gutiwrld/sondia-oficina`**. En `claude1` solo queda este plan.
- Supabase: el proyecto **`sondia-erp`** que ya existe (`aupeskepssofsqqzkqva`). Lo que ya tiene:
  - `members`: 3 filas con la lista cerrada de emails. Se reutiliza como allowlist, así que no hacen falta los emails de Dani y Hugo.
  - `clients`: etapas `lead, contactado, respondio, reunion, maqueta_enviada, propuesta_enviada, negociacion, ganado, perdido`, más `do_not_contact`, `email_bounced` y `send_account`. Está vacía.
  - `client_events`, con un tipo `no_contactar`.
  - Hunter **escribe ahí** y sus tablas propias van en los esquemas `agents` y `hunter`.
- OAuth en **modo de prueba**, con un aviso de reconexión antes de que el token caduque a los 7 días.
- Hunter caza **solo para Guzmán** (sus 12 provincias y sus 2 Gmail). El modelo de datos ya admite más dueños.

## Decisiones que tomo yo (dime si alguna no te cuadra)

1. **Límite frente a ventana.** Con una ventana de 9:00 a 11:00 y entre 2 y 6 minutos aleatorios entre envíos (4 de media), solo caben unos **30 correos nuevos por cuenta y día**, no 50. Propuesta:
   - Los 50 son el tope total del día por cuenta (nuevos, seguimientos y respuestas).
   - Los nuevos van de lunes a jueves de 9:00 a 11:00.
   - Los seguimientos, de lunes a jueves de 11:00 a 13:00.
   - Las respuestas a quien nos ha escrito, de lunes a viernes de 9:00 a 19:00.
   - Todo se puede cambiar en Ajustes.
2. **Seguimiento.** Se prepara a los 3 días naturales y sale en la siguiente ventana. A los 7 días sin respuesta, Hunter crea una aprobación de tipo «llamada» (no un correo).
3. **Los 78 contactados sin cuenta registrada.** La bandeja busca el hilo en las dos cuentas por el destinatario y fija la cuenta donde lo encuentre. Si no aparece en ninguna, el lead queda «sin hilo» y no recibe seguimiento hasta que tú decidas.
4. **Separar permisos también en Google.** Cada cuenta hace **dos autorizaciones**:
   - «Lectura» (`gmail.readonly` y `calendar.freebusy`), que usa el worker del agente.
   - «Envío» (`gmail.send` y `calendar.events`), que solo usa la outbox.

   Así el proceso del agente no tiene en ningún momento una credencial que pueda enviar. No usamos borradores de Gmail: el borrador vive en `approvals`. Contrapartida: con el modo de prueba hay que reconectar dos autorizaciones por semana.
5. **El rastreo es código, no IA.** Places, descarga, auditoría, Señal y captura son deterministas. El modelo solo interviene donde aporta: descartar franquicias en los casos dudosos (modelo rápido), redactar (el modelo más capaz: `claude-opus-5-5`), clasificar (`claude-haiku-5-5`), y escribir respuestas, fichas y el parte. Las herramientas tipadas existen igual y los jobs las llaman directamente.
6. **Jobs con pg-boss** en el VPS. pg_cron no puede lanzar Playwright. Los cron van con `tz: 'Europe/Madrid'`.
7. **Provincias ya trabajadas** (Murcia, León…): siguen siendo de Guzmán pero con el rastreo apagado. Solo se rastrean las 12 nuevas. «Baleares» del CSV se normaliza a «Illes Balears».

## Arquitectura

```
sondia-oficina/
  apps/oficina          Next.js App Router + TS + Tailwind (Vercel)
  workers/hunter        Node + TS + Claude Agent SDK + pg-boss + Playwright (Docker, Hetzner)
    src/jobs/           rastreo, redaccion, bandeja, seguimiento, preparacion, parte, informe
    src/tools/          buscar_negocios, auditar_web, capturar_web, leer_bandeja,
                        consultar_disponibilidad, crear_borrador, generar_maqueta, escribir_ficha
  workers/outbox        proceso aparte y contenedor aparte: el ÚNICO que envía
  packages/core         esquema zod, tipos, reglas puras (señal, dominios, ventanas, territorio,
                        verificador de citas, precios) + tests Vitest
  packages/ui           tokens SONDIA (CSS vars claro/oscuro), Escala de Señal, PuntoVivo, etc.
  supabase/migrations   SQL versionado (Supabase CLI)
  agents/hunter/MANUAL.md   única fuente de verdad de los prompts (desde el playbook)
  .claude/commands      /cazar /bandeja /seguimientos /parte
  CLAUDE.md             reglas de oro
```

**Hunter no puede enviar: se impone en el código, no en el prompt**
- **Agent SDK.** Solo un servidor MCP en proceso con las 8 herramientas. Las herramientas integradas de Claude Code se desactivan (nada de Bash, Write ni WebFetch), `settingSources: []` y un `canUseTool` que deniega todo lo que no esté en la lista blanca.
- **Postgres.** Dos roles:
  - `hunter_agent` puede insertar leads, auditorías, acciones y approvals, pero **no tiene ningún permiso sobre `outbox`** ni sobre Vault.
  - `hunter_outbox` lee la outbox y los secretos de envío.
- **Entrada en la outbox.** Solo se entra con la RPC `aprobar(approval_id, cuerpo_editado)`, `security definer`. Exige que `auth.uid()` esté en `members` y que el estado sea `pendiente`. Además, un trigger rechaza la fila si el email o el dominio están en supresión, si la cuenta no es la del lead o si Hunter está en pausa.
- **Contenedores.** El de outbox es el único que tiene los tokens de «envío».

**Defensa contra la inyección de instrucciones**
- El HTML se pasa a texto, se trunca y se envuelve en `<datos_no_confiables origen="web|correo">`. El prompt de sistema lo trata siempre como dato.
- La salida se valida con zod.
- Reglas de negocio puras después del modelo: precio permitido, destinatario igual al email del lead y ninguna URL o email que no esté en la evidencia.
- El verificador de citas como última barrera.
- Aunque una inyección tuviera éxito, el agente no tiene con qué hacer daño.

## Esquema de datos

**Compartido** (para que otros departamentos lo reutilicen):

| Tabla | Contenido |
|---|---|
| `agents.departments` | slug, número, nombre, estado, descripción |
| `agents.agent_runs` | departamento, turno, disparador (cron, manual o comando), inicio, fin, estado, tokens de entrada y salida, coste en céntimos, llamadas a Places, duración, resumen, error |
| `agents.agent_actions` (el rastro) | ejecución, momento, herramienta, objetivo, evidencia (jsonb), porqué (≤140 caracteres), coste |
| `agents.approvals` | departamento, tipo (nuevo, seguimiento, respuesta, reunión o llamada), lead, cuenta, payload (asunto, cuerpo, adjuntos, hilo y huecos), informe del verificador, estado (pendiente, aprobado, rechazado, rehacer o caducado), quién decidió y cuándo, original, editado, diff |
| `agents.outbox` | approval (única), cuenta, programado para, estado (en cola, enviando, enviado, fallido o cancelado), id de mensaje y de hilo de Gmail, error |
| `agents.settings` | departamento, clave, valor jsonb: límites, ventanas, presupuesto (por ejecución y por día, Anthropic y Places), rampa, `pausa` |

**Hunter**

| Tabla | Contenido |
|---|---|
| `hunter.leads` | 1:1 con `public.clients`: email normalizado (único), dominio registrable (único), **URL de origen del email**, place_id, provincia, cuenta, gancho, prioridad, Señal, ejecución de origen |
| `hunter.lead_audits` | URL final, HTTPS y certificado, viewport, tablas, frames, Flash, año del copyright, textos de plantilla, enlaces rotos, widgets muertos, emails gratuitos, ruta del HTML guardado, ruta de la captura, Señal y desglose |
| `hunter.suppression_list` | email o dominio, motivo, origen, fecha. **Sin UPDATE ni DELETE** para nadie |
| `hunter.territories` | provincia (clave), miembro dueño, rastreo activo |
| `hunter.mail_accounts` | email, miembro, ids de Vault (lectura y envío), inicio del calentamiento, límite diario, caducidad estimada, estado |
| `hunter.messages` | hilo y mensaje de Gmail, dirección, clasificación, lead, fecha |
| `hunter.meetings` | lead, tipo (llamada o visita), inicio, evento de Calendar, ficha en markdown |
| `hunter.style_examples` | antes, después, diff, approval |
| `hunter.reports` | tipo (parte o semanal), fecha, contenido |

**«No contactar» irreversible** (en la base de datos)
- Un trigger en `public.clients` impide el paso de `do_not_contact` de true a false.
- Con la marca puesta, solo se puede cambiar de etapa a `perdido`.
- Al marcarlo, se inserta el email y el dominio en la supresión y se registra un `client_events` de tipo `no_contactar`.
- Es un cambio aditivo en una tabla del ERP: lo dejo documentado en los dos repos.

**RLS:** todo legible y escribible solo por `members` autenticados. `aprobar`, `rechazar` y `pausar` van por RPC.

## Pantallas (`apps/oficina`)

Rutas:
- `/` Vestíbulo
- `/hunter` Hoy
- `/hunter/mesa`
- `/hunter/radar`
- `/hunter/bandeja`
- `/hunter/agenda`
- `/hunter/rastro`
- `/hunter/ajustes`

**Barra superior común:** la marca, el estado vivo de Hunter y el botón **Pausa**, visible siempre. Al activarse se vuelve naranja y cancela la cola de envío. El estado en vivo llega por Supabase Realtime.

**Mesa de aprobación:** modo foco. La evidencia a la izquierda y el borrador a la derecha. Atajos: A, R, E, J/K y ⌘↵ con confirmación explícita. En el móvil, las dos columnas pasan a pestañas apiladas.

**Diseño:** los tokens de la marca, Geist y Geist Mono, Instrument Serif solo en el titular del parte y Sora en el logotipo. Fechas y euros con formato español mediante `Intl` `es-ES`. La Señal se dibuja como una escala mono fina.

## Fases

**Fase 1: la base**
- Crear el repo `sondia-oficina`, con `CLAUDE.md` (reglas de oro) y `MANUAL.md`.
- Monorepo pnpm, migraciones con RLS, roles y triggers.
- Auth por enlace mágico contra `members`.
- Tokens y `packages/ui`.
- Vestíbulo y las 8 pantallas con estados vacíos que explican qué aparecerá.
- **Importador del seed:**
  - Une el CSV (305) y el JSON (279) por email.
  - Correspondencia de estados:
    - `enviado` → Contactado.
    - `respondido` → Respondió.
    - `descartado` con «no / no volver a escribir / no insistir» → No contactar y supresión.
    - Rebote → Perdido, con `email_bounced` y el teléfono.
    - Los 26 preparados → leads que se reauditan antes de llegar a la mesa.
  - `clientes.csv` se fusiona por nombre.
  - **Primero genera un informe en seco que te enseño, y solo después escribe.**

**Fase 2: la caza sin envío**
- Places, auditoría, Señal, captura a 390 px, redacción, verificador y mesa.
- Prueba real con 10 negocios de Valencia. Te enseño los borradores.

**Fase 3: el correo**
- OAuth (lectura y envío) con los tokens en Vault.
- Outbox con límites, ventanas, rampa y espera aleatoria.
- Bandeja clasificada, No contactar automático y huecos de calendario (de 10:00 a 19:00 en Europe/Madrid, con la zona explícita).

**Fase 4: cerrar el ciclo**
- Seguimiento con maqueta (escritorio y móvil en una sola imagen adjunta, nunca publicada).
- Fichas, parte de las 8:30, informe del lunes.
- Aprendizaje de tus ediciones y comandos `.claude/commands`.

## Verificación (al final de cada fase)

- **Vitest** en `packages/core`:
  - normalización de dominios (`www`, subdominios y mayúsculas, con la lista de sufijos públicos);
  - duplicados;
  - territorio;
  - ventanas y límites, con el **25-oct-2026** y el 28-mar-2027;
  - Señal;
  - el verificador rechaza una cita inventada;
  - precios ≥ 250 €.
- **Tests de base de datos** contra Supabase local (o PGlite si no hay Docker):
  - No contactar es irreversible;
  - la outbox rechaza un lead suprimido;
  - `hunter_agent` no puede insertar en la outbox;
  - los seguimientos respetan la supresión.
- **Test de herramientas:** la lista de herramientas del agente no contiene nada que envíe.
- **Inyección:** una web de prueba con instrucciones escondidas (enviar a otro email, poner 50 €). Un test con el modelo simulado comprueba las barreras deterministas, y un eval opcional en vivo (`pnpm test:live`) lo prueba con el modelo real.
- **Capturas con Playwright** a 1440 y 390 px, en claro y oscuro, revisadas antes de enseñarlas.
- **Resumen corto:** lo hecho, lo pendiente y lo que tienes que configurar tú.
