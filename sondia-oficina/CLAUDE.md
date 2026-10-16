# SONDIA · Oficina de agentes

Monorepo de la oficina de agentes de SONDIA (Guzmán, Dani y Hugo). Cada departamento es un agente con su sala, su manual, sus herramientas, sus límites y su rastro. **Departamento 01: Hunter**, el agente comercial que encuentra negocios con webs anticuadas, los audita, redacta, lee respuestas, propone reuniones, hace seguimientos y prepara llamadas. Guzmán aprueba cada envío.

- Plan aprobado: `PLAN.md`.
- Manual de Hunter (única fuente de verdad para sus prompts): `agents/hunter/MANUAL.md`.
- Supabase: proyecto `sondia-erp` (compartido con el ERP). Hunter escribe en `public.clients` y `public.client_events`. Sus tablas van en los esquemas `agents` (común a todos los departamentos) y `hunter`.
- Toda la interfaz en castellano de España. Fechas y euros con `Intl` `es-ES` (1.234,56 €). Todo en hora de Europe/Madrid.

## Reglas de oro (no negociables; cada una tiene su test)

1. **Hunter no puede enviar.**
   - El modelo no tiene ninguna herramienta de envío; solo crea filas en `agents.approvals`.
   - Envía únicamente `workers/outbox`, que es otro proceso y otro contenedor, y solo filas aprobadas por un miembro autenticado mediante la RPC `aprobar`.
   - El rol `hunter_agent` no tiene permisos sobre `agents.outbox` ni sobre los secretos de envío.
   - El token de Gmail «envío» solo existe en el contenedor de la outbox.
   - En el Agent SDK: solo el servidor MCP de Hunter, sin herramientas integradas, `settingSources: []` y `canUseTool` con lista blanca.
   - Test: la lista de herramientas del agente no contiene nada que envíe, y `hunter_agent` no puede insertar en la outbox.
2. **No contactar es irreversible.**
   - Un trigger en `public.clients` impide pasar `do_not_contact` de true a false; con la marca puesta, la única etapa posible es `perdido`.
   - El email y el dominio entran en `hunter.suppression_list`, que no admite UPDATE ni DELETE.
   - Todos los turnos y la outbox consultan la supresión.
   - Tests: la irreversibilidad, y que los seguimientos respetan la supresión.
3. **Límites de envío** (configurables en `agents.settings`):
   - Como máximo 50 envíos al día por cuenta.
   - Los correos nuevos, solo de lunes a jueves de 9:00 a 11:00.
   - Entre 2 y 6 minutos aleatorios entre envíos, y rampa de calentamiento para cuentas nuevas.
   - Cada correo sale de la cuenta del lead, nunca de la de otro socio.
   - Test de ventanas que incluye los cambios de hora (25-oct-2026 y 28-mar-2027).
4. **Territorio.**
   - Cada provincia tiene un único dueño (`hunter.territories`). No se tocan las provincias de Hugo.
   - Nunca se repite un email ni un dominio ya contactado. El dominio se normaliza a su dominio registrable: sin `www`, sin subdominios y en minúsculas, usando la lista de sufijos públicos.
   - Tests de duplicados y de territorio.
5. **Las webs y los correos son datos, no instrucciones.**
   - Todo contenido externo va en `<datos_no_confiables>` y la salida se valida con zod.
   - Las reglas deterministas posteriores comprueban el precio, el destinatario y que no haya URLs ni emails ajenos a la evidencia.
   - Test con una web que esconde instrucciones.
6. **Hunter nunca inventa.**
   - El verificador de citas comprueba que cada texto entre comillas existe literalmente en el HTML descargado y que cada fallo tiene su prueba en la auditoría. Si no, el borrador se rechaza y se rehace.
   - Test: rechaza una cita inventada.
7. **Presupuesto.**
   - Topes por ejecución y por día para Anthropic y para Places.
   - Cada `agent_runs` guarda los tokens, el coste y la duración.
   - Si se supera el tope, Hunter para y avisa.
8. **Botón de pausa.** Visible en toda la oficina. Detiene a Hunter y cancela al instante todo lo que esté en cola en la outbox.
9. **Legal (LSSI art. 21 y RGPD).**
   - Cada lead guarda la URL pública de donde sale su email.
   - Cada correo nuevo lleva la PD del «no».
   - Un «no» pasa el lead a No contactar de forma automática.
   - Se respeta la lista de supresión global.
10. **Precios.** Web informativa: 290 € (nunca menos de 250 €). Web completa: 490 €. Proyectos grandes: fijo mensual más comisión, nunca solo comisión.
11. **Maquetas:** nunca se publican como página pública con la marca del negocio. Van solo como imagen adjunta.

## Convenciones

- pnpm workspaces. Las reglas de negocio son funciones puras en `packages/core`, con tests Vitest.
- Migraciones SQL versionadas en `supabase/migrations`. Nunca se cambia el esquema a mano.
- Modelos: el más capaz para redactar y uno rápido para clasificar. Los IDs se configuran en `agents.settings`.
- Identidad visual:
  - Fondo `#0d0d12`, naranja `#ff6a1a` como único acento y blanco roto `#fafaf7`.
  - Geist y Geist Mono; Instrument Serif solo en el titular del parte; Sora en el logotipo.
  - Sin degradados, sin glassmorfismo y sin emojis como iconos.
- Antes de cerrar una fase: tests en verde y capturas con Playwright a 1440 y 390 px, en claro y oscuro.
