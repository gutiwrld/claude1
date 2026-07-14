# Modelo de negocio — App de perfil de alergias y aviso a cocina vía QR (Madrid)

**Fase 1 · Documento de trabajo · Julio 2026 (v2 — pivot completo)**
Marco: Desirability / Feasibility / Viability (Bland & Osterwalder, *Testing Business Ideas*)

> ⚠️ **Advertencias previas del socio crítico.** Este modelo tiene tres frentes que hay que atacar de cara,
> porque son los que lo pueden matar (o matarte la marca):
>
> 1. **El sustituto es gratis y ya funciona:** decírselo al camarero. La app tiene que ser claramente mejor que esa
>    conversación en algo medible (rigor, registro, comodidad, vergüenza evitada), no solo más tecnológica.
> 2. **Falsa seguridad:** si el usuario cree que "notificación enviada" = "cocina enterada y adaptada", y nadie miró
>    el móvil en hora punta, la app habrá causado el incidente que quería evitar. Toda la experiencia se diseña
>    alrededor de la **confirmación de lectura por parte del restaurante** y del mensaje permanente
>    "**avisa también en persona**". La app nunca promete seguridad; promete comunicación registrada.
> 3. **Datos de salud (art. 9 RGPD):** un perfil de alergias transmitido a terceros es dato de categoría especial.
>    Diseño de partida: el aviso viaja **sin nombre** (mesa + alérgenos + gravedad), con consentimiento explícito
>    en cada envío, y el perfil completo vive en el dispositivo. Aun así, hace falta validación jurídica antes del
>    primer aviso real (EC-4).
>
> **Nota sobre el "100 % elaboración separada":** la app puede *exigirlo* en el aviso ("requiere elaboración
> separada, sin trazas"), pero no puede *garantizar* que la cocina lo cumpla. Lo que sí puede hacer —y es el valor
> defendible— es dejar **registro con confirmación** de que se pidió y de que el restaurante lo aceptó. Ese registro
> protege al usuario (evidencia) y al restaurante (diligencia debida). Vende el registro, no la garantía.

---

## 1. Propuesta de valor en una frase

> **"Guarda tu perfil de alergias una vez y, al escanear el QR de la mesa, la cocina recibe al instante qué
> alérgenos tienes, tu nivel de gravedad y si necesitas elaboración separada — con confirmación de lectura del
> restaurante, para que tu seguridad no dependa de una conversación apurada con un camarero con prisa."**

Para el restaurante, en una frase: **"Te avisamos de cada cliente alérgico antes de que pida, con su perfil exacto
y por escrito — conviertes tu punto débil en el motivo por el que las familias con alergias te eligen a ti."**

**El enemigo a batir no es Alergenu ni Egourmet: es "ya se lo digo yo al camarero".** El diferencial está en lo que
la conversación verbal no da: perfil exacto y completo (14 alérgenos, trazas, gravedad), sin vergüenza ni
repetición, en cualquier idioma del personal, y con registro y confirmación que quedan guardados.

---

## 2. Business Model Canvas (foco: Madrid)

### 2.1 Segmentos de clientes
- **B2C (usuario y motor del modelo):** personas con alergias alimentarias graves y padres de menores alérgicos en
  Madrid. El subsegmento cabeza de playa son los **padres de niños con alergia grave** (anafilaxia): máximo dolor,
  máxima disciplina de uso, comunidades activas (AEPNAA) y el que peor lo pasa en la conversación con el camarero.
  Los celíacos quedan para después (FACE ya les da un ecosistema propio).
- **B2B (quien paga):** restaurantes de Madrid que quieran posicionarse como "allergy-friendly": familiares,
  italianos/pizzerías (mucho niño alérgico), hamburgueserías de calidad, locales de brunch y cadenas medianas
  (5–30 locales) con estándares de sala. Criterio de cualificación: que haya una persona de sala identificable por
  turno que pueda ser "receptor del aviso".
- **Antisegmento explícito:** locales sin protocolo posible (barra pura, alta rotación, sin encargado en sala). Meter
  la app ahí crea el riesgo nº1.

### 2.2 Propuesta de valor
- **Para el alérgico:** perfil completo una vez (14 alérgenos, trazas sí/no, gravedad, elaboración separada);
  escaneo → aviso instantáneo a cocina; **confirmación visible de que sala lo ha leído y aceptado**; historial de
  avisos (tu evidencia si algo va mal); y el mapa de locales adheridos donde sabes que esto funciona.
- **Para el restaurante:** captación del cliente alérgico y su grupo (el alérgico decide dónde comen 4–6 personas y
  repite donde se siente seguro); el aviso llega **antes de la comanda**, estructurado y por escrito, en vez de un
  recado verbal que se degrada camarero→cocina; **registro de avisos y confirmaciones = expediente de diligencia
  debida** (RD 126/2015) que hoy no tiene; kit de protocolo de sala (formación breve + cartelería "local adherido").
- **Honestidad interna:** el restaurante compra marketing (familias que repiten) + protección documental. No compra
  "más trabajo en hora punta" — por eso el flujo de recepción tiene que costarle < 30 segundos.

### 2.3 Canales
- **B2C:** asociaciones de pacientes (AEPNAA, Histasan), grupos de padres alérgicos (Telegram/WhatsApp/Facebook),
  pediatras alergólogos (folleto en consulta es un canal infrautilizado y muy creíble), micro-influencers de alergias.
- **B2B:** venta directa barrio a barrio; el propio usuario como prescriptor ("pídele a tu restaurante que se
  adhiera" con un flujo de invitación dentro de la app); asociaciones de hostelería más adelante.
- **El QR en mesa** de locales adheridos es el canal de descubrimiento B2C de coste cero.

### 2.4 Relación con clientes
- **B2C:** autoservicio + comunidad. Cada aviso confirmado es un momento de confianza; cada aviso sin confirmar debe
  degradar visiblemente al local en la app (esto mantiene el sistema honesto).
- **B2B:** onboarding presencial de 30 min (protocolo + alta + cartelería), soporte por WhatsApp, informe mensual
  ("este mes te visitaron 9 clientes alérgicos, 34 comensales en sus mesas").

### 2.5 Fuentes de ingresos
Ver sección 3. Resumen: B2B por suscripción (el restaurante paga por estar adherido y recibir avisos); B2C gratis.

### 2.6 Recursos clave
- **El protocolo de sala** (quién recibe el aviso, cómo se confirma, qué hace cocina, tiempos máximos): es EL activo.
  Sin protocolo, la app es solo un timbre que nadie escucha.
- La base de usuarios alérgicos activos y su confianza (se gana lento, se pierde con un incidente).
- Cumplimiento RGPD de datos de salud (consentimiento por envío, minimización, aviso sin nombre) — validado por
  abogado antes del primer aviso real (EC-4) — y **seguro RC profesional** desde el primer local adherido.
- El registro de avisos/confirmaciones con sellado de tiempo (valor probatorio para ambos lados).
- Tú: problema vivido + stack (Supabase Realtime para el aviso, n8n para el WoZ).

### 2.7 Actividades clave
- Altas y formación de restaurantes (protocolo de 30 min); vigilancia de calidad de respuesta (tiempos de
  confirmación por local, con retirada del distintivo si degradan).
- Crecimiento B2C vía comunidades; soporte y gestión de incidencias con SLA.
- Evolución de producto: perfil, flujo de aviso, panel de sala.

### 2.8 Alianzas clave
- Asociaciones de pacientes (credibilidad y acceso; no avalan seguridad, colaboran en difusión).
- Alergólogos y pediatras (prescripción del perfil como herramienta de gestión).
- Abogado de derecho alimentario/protección de datos (contrato B2B, consentimientos, wording).
- Futuro: TPVs/comanderos (integrar el aviso donde ya mira el camarero) — probablemente la clave de escala real.

### 2.9 Estructura de costes
- Fijos bajos: Supabase (0–25 €/mes), dominio y herramientas (~50 €/mes), seguro RC (~40–80 €/mes est.), asesoría
  jurídica inicial (500–900 € one-off — más que en el modelo anterior, porque aquí sí hay tratamiento de datos de salud).
- Variable dominante: **adquisición** en los dos lados (tu tiempo en venta B2B y en comunidad B2C). El coste de
  servir es casi cero una vez el local está formado; el modelo es de márgenes altos si (y solo si) la adopción llega.

---

## 3. Modelo de precios

### B2B (restaurantes) — precios de partida PARA TESTAR

| Concepto | Precio | Incluye |
|---|---|---|
| **Alta + protocolo (setup)** | **99 € (one-off)** | Visita de onboarding, formación de sala de 30 min, definición del receptor del aviso, kit QR + cartelería "local adherido" |
| **Plan Adherido (recurrente)** | **39 €/mes** (o 390 €/año) | Recepción de avisos con confirmación, panel/canal de sala, registro descargable de avisos (diligencia debida), presencia destacada en el mapa de la app, informe mensual de clientes alérgicos |
| **Cadenas (5–30 locales)** | 29 €/local/mes, setup 59 €/local | Igual + panel multi-local |

**Racional y dónde va a doler:**
- Es un precio de "herramienta de sala + marketing local", no de auditoría: por eso baja respecto al modelo anterior
  (39 vs 59 €/mes). El argumento de cierre sigue siendo aritmético: **una mesa de 4 al mes ya lo paga** (ticket
  25 € × 4 = 100 € > 39 €), y el informe mensual se lo demuestra con sus propios datos.
- El setup de 99 € no te paga la visita a precio de mercado; se acepta porque el onboarding presencial ES el control
  de calidad del protocolo (no se puede saltar) y porque el activo caro aquí no es tu hora, es la densidad de red.
- **Trampa a evitar:** regalar el plan "para hacer red". Un local gratis no forma a su gente ni mira los avisos.
  Piloto con descuento y fecha de fin, sí; gratis indefinido, no.
- Regla de validación intacta: estos precios se testean pidiendo dinero o firma (EC-5), nunca con encuestas.

### B2C (consumidores) — gratis, sin premium los primeros 12–18 meses

- **Gratis:** perfil completo, escaneo y aviso, confirmaciones, historial, mapa de locales adheridos, reporte de
  malas experiencias.
- **Sin premium:** la densidad de usuarios es lo que vendes al restaurante; cualquier fricción de pago la mata.
  Ideas de premium (multi-perfil familiar, modo viaje/idiomas, tarjeta de alergia imprimible) quedan para año 2.

### Dimensión honesta (Madrid)

- Alergia alimentaria diagnosticada: ~2–3 % adultos y ~5–8 % niños → en la Comunidad de Madrid, plausiblemente
  **150.000–250.000 personas afectadas** directamente; el segmento cabeza de playa (familias con alergia grave
  pediátrica) quizá 20.000–40.000 hogares. Suficiente para una red local densa; escaso para monetizar B2C — refuerza
  que pague el restaurante.
- SAM B2B: los ~6.000–10.000 locales "con sala y protocolo posible" de siempre. **SOM año 1 honesto: 25–50 locales
  adheridos** → con 35 locales ≈ **19.000–20.000 € año 1**. Menos que el modelo anterior por local, así que la
  tesis de este modelo es **volumen y red**, no ticket. Que el documento lo diga claro: esto no da sueldo en año 1;
  da (o no) la prueba de que la red funciona.

---

## 4. Plan de validación DFV con Experiment Cards

Orden deliberado: primero el **momento de la verdad** (¿el aviso se lee en hora punta?), porque si eso falla, nada
más importa. La deseabilidad B2C es la apuesta más segura del modelo (tú eres el usuario); la viabilidad B2B es la
más dudosa y se testea con dinero.

### EC-1 · Simulación del aviso en servicio real — *Feasibility* 🔴 el momento de la verdad

- **Hipótesis:** un restaurante en hora punta lee y confirma un aviso digital de cliente alérgico en < 5 minutos,
  y cocina lo recibe sin degradarse.
- **Test:** cero código. En 5 restaurantes (conseguidos vía EC-2), un viernes/sábado en servicio: se envía un
  WhatsApp estructurado al móvil del encargado simulando el aviso ("Mesa X · alérgico: frutos secos, huevo ·
  gravedad: anafilaxia · requiere elaboración separada · confirma con OK"). Se cronometra lectura, confirmación y
  qué llega de verdad a cocina (pregúntale al cocinero después).
- **Métrica:** % de avisos confirmados en < 5 min; % en que cocina recibió el detalle completo (no "hay un alérgico"
  a secas).
- **Criterio de éxito:** ≥ 4/5 confirmados en < 5 min y ≥ 3/5 con detalle íntegro en cocina. **Si ≤ 2/5: el aviso en
  tiempo real no es viable con móvil del encargado** → rediseño (integración TPV/comandero, aviso en reserva previa
  en vez de en mesa) antes de construir nada.
- **Coste/tiempo:** 0 € · 2 semanas.

### EC-2 · Entrevistas a hosteleros — *Desirability B2B*

- **Hipótesis:** los restauradores ven al cliente alérgico como oportunidad (fidelidad, grupos) y no solo como
  riesgo/molestia, y aceptarían un canal formal de avisos con protocolo.
- **Test:** 15 entrevistas (dueños/encargados) en 2 barrios familiares. Guion: qué pasa hoy cuando llega un alérgico,
  quién se entera en cocina, incidentes o sustos, ¿el alérgico trae o espanta clientela? La solución, al final.
- **Métrica:** % que ve oportunidad comercial; % dispuesto a nombrar un "receptor del aviso" por turno.
- **Criterio de éxito:** ≥ 8/15 ven oportunidad y aceptarían protocolo. Si < 5/15: el B2B no paga esto → replantear
  quién es el cliente (¿cadenas? ¿aseguradoras? ¿B2C premium a pesar de todo?).
- **Coste/tiempo:** 0 € · 2 semanas, en paralelo con EC-3.

### EC-3 · Entrevistas + encuesta a alérgicos — *Desirability B2C*

- **Hipótesis:** el alérgico (o el padre/madre) vive la conversación con el camarero como un punto de dolor
  (vergüenza, repetición, no ser tomado en serio) y quiere un aviso formal — **sin dejar por ello de avisar en persona**.
- **Test:** 15 entrevistas + encuesta (n≥100) vía AEPNAA/grupos de padres. Preguntas de comportamiento pasado, y una
  trampa deliberada: "si la app confirma que cocina lo ha leído, ¿seguirías avisando al camarero?" —
- **Métrica:** % con dolor explícito en la conversación actual; % que descarta locales por desconfianza; ⚠️ % que
  admite que dejaría de avisar en persona (métrica de riesgo: alimenta el diseño y el R1).
- **Criterio de éxito:** ≥ 60 % con dolor explícito y evidencia del "efecto grupo". Si el % de "dejaría de avisar" es
  alto, la confirmación de lectura y el recordatorio verbal pasan de features a requisitos de lanzamiento.
- **Coste/tiempo:** 0–50 € · 2 semanas.

### EC-4 · Validación jurídica (RGPD + responsabilidad) — *Feasibility legal* 🔴 bloqueante

- **Hipótesis:** existe un diseño de consentimiento y minimización (aviso sin nombre: mesa + alérgenos + gravedad)
  que permite transmitir el aviso a un restaurante sin un régimen de cumplimiento inasumible, y un contrato B2B que
  no me convierte en responsable de lo que haga la cocina.
- **Test:** 2 h con abogado de protección de datos + alimentario (red LEINN/TWATI antes de pagar): base jurídica del
  tratamiento (art. 9.2.a, consentimiento explícito), papel de cada parte (¿el restaurante es responsable o
  encargado?), retención del historial, wording de "adherido" vs "seguro", seguro RC.
- **Criterio de éxito:** diseño de consentimiento aprobado + presupuesto RC < 100 €/mes. **Ningún aviso con datos
  reales se envía antes de cerrar esto.**
- **Coste/tiempo:** 0–400 € · 2 semanas.

### EC-5 · Venta real con compromiso — *Viability* 🔴 el juez final

- **Hipótesis:** un restaurante paga 99 € + 39 €/mes por adherirse (o firma compromiso condicionado al lanzamiento).
- **Test:** pitch con precio real a 10 locales cualificados, usando los datos de EC-1/EC-2 ("en la simulación, tu
  encargado confirmó en 3 minutos; esto te trae mesas de familias que hoy no vienen"). Se pide setup por adelantado,
  LOI firmada con precio, o señal. "Me interesa" verbal no cuenta.
- **Métrica:** compromisos con fricción real / 10 pitches.
- **Criterio de éxito:** ≥ 3/10. Con 1–2: revisar precio/segmento. **Con 0/10: el restaurante no paga por recibir
  avisos** → pivots posibles: cadenas como cliente, integración en TPV como canal, o volver al modelo de verificación
  (v1 de este documento, en el historial de git).
- **Coste/tiempo:** 0 € · 3 semanas.

### EC-6 · WoZ de extremo a extremo — *integración de todo* (solo si EC-1, 4 y 5 pasan)

- **Test:** 3 locales adheridos reales + 15–25 usuarios alérgicos reclutados de EC-3 usando el MVP (sección 5)
  durante 4 semanas.
- **Métricas:** avisos enviados/usuario/mes; % confirmados < 5 min; % de usuarios que además avisaron en persona
  (medir por encuesta post-visita); repetición de local; NPS de ambos lados.
- **Criterio de éxito:** ≥ 90 % de avisos confirmados, ≥ 80 % de usuarios avisaron también en persona, y al menos
  1 local renueva pagando precio completo al acabar el piloto.

---

## 5. MVP Wizard of Oz (mínimo trabajo de campo)

**Principio:** el restaurante no instala nada; su "panel" es WhatsApp, que ya mira. Tú y n8n sois el sistema.

**Flujo:**
1. **Perfil (web app / PWA, sin app nativa):** el usuario crea su perfil una vez: 14 alérgenos, trazas sí/no,
   nivel de gravedad (intolerancia / alergia / anafilaxia) y el flag "requiere elaboración separada". El perfil vive
   en el dispositivo; solo se transmite, con consentimiento explícito en cada envío, el contenido del aviso
   (sin nombre: mesa + alérgenos + gravedad + elaboración separada).
2. **Escaneo y aviso:** QR por mesa (o por local + nº de mesa manual). Al confirmar el envío, n8n manda el aviso por
   **WhatsApp al móvil del receptor de sala** con formato fijo y petición de confirmación ("responde OK").
   La respuesta dispara el estado "✅ Cocina ha confirmado tu aviso · 14:32" en la pantalla del usuario.
   Si no hay confirmación en X minutos: "⚠️ Sin confirmación — avisa en persona" (la app empuja al comportamiento
   seguro, nunca al contrario). En pantalla, siempre: **"Este aviso complementa, no sustituye, avisar a tu camarero."**
3. **Registro:** cada aviso y confirmación queda guardado con fecha/hora (Supabase) — historial para el usuario,
   registro descargable para el restaurante.
4. **Mapa de adheridos:** página simple con los locales activos, su tiempo medio de confirmación (público: presión
   sana) y su protocolo.
5. **Onboarding B2B:** visita única de 30 min (protocolo + QRs + cartelería). Todo lo demás, remoto.

**Lo que NO se hace en el WoZ:** app nativa ni notificaciones push propias (WhatsApp ya existe), panel de
restaurante (WhatsApp), pagos online (factura a mano), integración TPV, multi-idioma, y **ningún aviso con datos
reales antes de cerrar EC-4**.

---

## 6. Roadmap 90 días

**Días 1–30 · El momento de la verdad, sin código:**
EC-2 (hosteleros) + EC-3 (alérgicos) en paralelo · EC-1 (simulación de aviso en hora punta en 5 locales) · EC-4
(abogado: consentimiento y contrato) · elegir 2 barrios familiares objetivo · **Go/No-Go nº1:** si el aviso no se
confirma en servicio (EC-1 ≤ 2/5), se rediseña el canal de recepción antes de escribir una línea de código.

**Días 31–60 · Construir el WoZ y venderlo:**
MVP de la sección 5 (perfil + escaneo + aviso vía n8n/WhatsApp + registro) · seguro RC · EC-5: 10 pitches con precio
real → objetivo 3 compromisos · formar los 3 primeros locales adheridos (pilotos de pago con descuento y fecha de fin).

**Días 61–90 · Piloto de extremo a extremo:**
EC-6: 3 locales + 15–25 usuarios reales durante 4 semanas · medir confirmaciones, doble aviso (app + persona),
repetición y renovación · **Go/No-Go nº2:** perseverar (densificar el barrio a 15–20 locales), pivotar (cadenas /
integración TPV / volver a verificación) o parar. Todo documentado para LEINN.

**Métrica norte de los 90 días:** *% de avisos confirmados en < 5 min en servicio real* + *ingresos comprometidos
B2B*. La primera dice si el producto es seguro; la segunda, si es negocio. Necesitas las dos: una app segura que
nadie paga es una ONG; una app pagada que no se confirma en cocina es un peligro con modelo de ingresos.

---

## 7. Los 3 mayores riesgos (y por qué el orden importa)

### R1 · Falsa seguridad → incidente bajo tu marca (existencial)
El escenario: el usuario envía el aviso, ve "enviado", se relaja y no avisa en persona; el encargado no mira el
móvil en hora punta; cocina emplata con frutos secos; anafilaxia. La app no solo no evitó el incidente: **lo
facilitó**, y el historial demostrará que el aviso no fue confirmado.
**Mitigación:** (a) la confirmación de lectura es EL producto, no una feature: sin "OK" del local en X minutos, la
app muestra en grande "avisa en persona"; (b) recordatorio "complementa, no sustituye" en cada envío; (c) solo
locales con protocolo formado y receptor nombrado pueden estar en la red (antisegmento respetado a rajatabla);
(d) locales con tiempos de confirmación malos pierden el distintivo automáticamente; (e) seguro RC + wording
jurídico (EC-4) antes del primer aviso real; (f) el flag "requiere elaboración separada" se comunica como petición
registrada, jamás como garantía cumplida.

### R2 · El restaurante no paga por recibir avisos (el más probable)
Para el local, cada aviso es trabajo en el peor momento (hora punta) y responsabilidad por escrito. El hostelero
puede razonar: "esto ya me lo dice el camarero gratis, ¿por qué pago 39 € por un canal que además me deja registro
en contra si fallo?".
**Mitigación:** (a) darle la vuelta al registro: es SU diligencia debida (hoy, si pasa algo, no tiene ninguna prueba
de haber sido diligente; con la app, sí); (b) vender captación con datos propios (informe mensual de mesas
alérgicas); (c) el usuario como prescriptor ("adhiere a mi restaurante" desde la app crea demanda entrante);
(d) precio de herramienta (39 €), no de auditoría; (e) criterio de corte explícito en EC-5 — con 0/10, el pivot es
de cliente (cadenas, TPV) o de modelo (volver a verificación), no de precio.

### R3 · Doble cara sin densidad: la app fantasma
Un usuario que abre la app y ve 3 locales adheridos en todo Madrid no vuelve. Un local que paga y recibe 0 avisos
al mes no renueva. Este modelo es MÁS sensible a la densidad que el de verificación (allí la carta filtrada valía
aunque fueras el único local; aquí el aviso solo vale si hay red que escanea).
**Mitigación:** (a) hiperdensidad geográfica: un solo barrio familiar hasta dominarlo (15–20 locales en 1 km²) antes
de tocar el siguiente; (b) reclutar los usuarios B2C exactamente alrededor de esos locales (colegios y comunidades
del barrio); (c) el informe mensual B2B gestiona la expectativa (aunque haya pocos avisos, muestra comensales
totales y tendencia); (d) fijar suelo de renovación en el piloto: si con densidad máxima de barrio el local medio
recibe < 2 avisos/mes y no renueva, el problema es estructural, no de marketing — y toca pivot.

### (Mención obligada) RGPD de datos de salud
No entra en el top 3 porque tiene solución conocida (minimización + consentimiento explícito + asesoría, EC-4), pero
es **bloqueante en calendario**: ningún aviso con datos reales antes de cerrar EC-4, y el coste jurídico inicial
(500–900 €) va en el presupuesto desde el día 1.

---

## 8. Registro de decisiones

- **13/07/2026 — Perfil de alergias como capa, no como pivot.** Se propuso pivotar a "perfil + notificación de
  presencia" y se decidió mantener la verificación como núcleo, integrando el perfil como capa B2C. Motivos en la v1
  (historial de git).
- **14/07/2026 — Pivot completo al modelo de aviso (este documento, v2).** Decisión del fundador: el producto ES el
  perfil de alergias + aviso a cocina vía QR con confirmación de lectura. La verificación documental sale del
  modelo (queda como posible pivot de vuelta si EC-5 = 0/10; la v1 está en el historial de git). Las objeciones del
  análisis anterior (sustituto gratis, falsa seguridad, RGPD, quién paga) no se descartan: se convierten en los
  experimentos EC-1, EC-3, EC-4 y EC-5 y en los riesgos R1–R2, con criterios de kill explícitos.

- **14/07/2026 — Naming e identidad: "Aliva".** Marca elegida por el fundador. Identidad visual: tema oscuro
  premium (referencias Opal/Revolut), orbe aurora como símbolo, verdes menta/lavanda, sin iconografía de peligro.
  Pendiente antes de invertir en marca: comprobar disponibilidad de dominio y de marca en OEPM/EUIPO.

## 9. Qué me tienes que confirmar antes de la Fase 2

1. **Alcance del aviso:** ¿confirmas el diseño "aviso sin nombre" (mesa + alérgenos + gravedad + elaboración
   separada) con consentimiento explícito en cada envío, y ningún aviso real antes de la validación jurídica (EC-4)?
2. **Precios de partida a testar:** 99 € setup + 39 €/mes por local adherido; B2C 100 % gratis.
3. **Diseño anti-falsa-seguridad como requisito:** confirmación de lectura obligatoria, aviso "complementa, no
   sustituye" en cada envío, y degradación pública de locales que no confirman. Esto no es negociable a la baja en
   mi opinión, pero necesito tu OK explícito porque condiciona toda la Fase 2.
4. **MVP de Fase 2 según la sección 5:** PWA de perfil + escaneo, aviso vía n8n/WhatsApp (el restaurante no instala
   nada), registro en Supabase, mapa de adheridos. Sin app nativa, sin panel B2B, sin pagos online.

Con tu OK a estos 4 puntos, paso a Fase 2.
