# Modelo de negocio — Verificación independiente de alérgenos en hostelería (Madrid)

**Fase 1 · Documento de trabajo · Julio 2026**
Marco: Desirability / Feasibility / Viability (Bland & Osterwalder, *Testing Business Ideas*)

> ⚠️ **Advertencia previa (léela antes que nada).** Este documento es deliberadamente crítico. Hay dos afirmaciones
> de tu brief que, tal cual están formuladas, son falsas o peligrosas, y el modelo se cae si no las corriges:
>
> 1. **"Sello con valor legal frente al Reglamento (UE) 1169/2011"** — un sello privado **no tiene valor legal**.
>    El Reglamento 1169/2011 (y el RD 126/2015 que lo desarrolla en España) hace responsable al **operador de la
>    empresa alimentaria** —el restaurante— de la información sobre los 14 alérgenos. Ningún sello de terceros le
>    exime ni le transfiere esa responsabilidad. Lo máximo defendible: el expediente de verificación sirve como
>    **prueba de diligencia debida** ante una inspección o reclamación. Eso sigue siendo valioso, pero es otra frase
>    y otro pitch. Además, la palabra **"certificación"** en España sugiere acreditación ENAC; usarla sin serlo puede
>    considerarse publicidad engañosa. Vocabulario del proyecto en adelante: **"verificación documental
>    independiente"**, no "certificación".
> 2. **El riesgo inverso:** si tú pones un sello de "verificado" y una persona sufre una anafilaxia en ese local,
>    la responsabilidad reputacional (y potencialmente civil) te salpica a ti. El sello nunca puede prometer
>    "seguro para alérgicos"; promete "información contrastada con evidencia a fecha X". Esta distinción tiene que
>    estar en el naming, el diseño, los términos de uso y el contrato B2B desde el día 1.

---

## 1. Propuesta de valor en una frase

> **"Somos la única entidad independiente que contrasta la carta de un restaurante con la evidencia real —fichas
> técnicas de proveedor, etiquetado y escandallos— para que el sello de alérgenos que ve el cliente esté verificado,
> fechado y vigilado, no autodeclarado."**

Versión corta para el sello físico/QR: **"Alérgenos verificados con evidencia · Última revisión: [fecha]"**.

Lo que **no** somos (y esto es el foso frente a Alergenu/Egourmet): no somos otra carta digital que ayuda al
restaurante a declarar; somos quien **audita la declaración**. Ellos son TurboTax; nosotros somos el auditor.
Consecuencia incómoda: nuestro producto es más caro de operar, más lento de escalar y con más responsabilidad.
Ese es el precio del diferencial.

---

## 2. Business Model Canvas (foco: Madrid)

### 2.1 Segmentos de clientes
- **B2B primario (quien paga):** restaurantes independientes y pequeños grupos (2–10 locales) de Madrid con
  **carta estable** y ticket medio 20–45 €: cocina de mercado, italianos, arrocerías, brunch, healthy. La carta
  estable es criterio duro: un local que cambia la carta cada semana hace inviable la verificación con nuestros costes.
- **B2B secundario (probable mejor cliente, a explorar):** colectividades y catering (comedores escolares, empresas).
  Tienen obligación contractual real de control de alérgenos, presupuesto y un comprador profesional. Puede ser el
  pivot natural si el restaurante independiente no paga.
- **B2C (usuario, no cliente):** personas con alergias alimentarias e intolerancias en Madrid y su entorno de decisión
  (padres de niños alérgicos, parejas, organizadores del plan de grupo). Los **padres de menores alérgicos** son el
  subsegmento con más dolor y más activismo (AEPNAA); los **celíacos** son el más organizado pero ya tienen a FACE
  con su propio sello, así que no son nuestra cuña de entrada, son mercado posterior.

### 2.2 Propuesta de valor
- **Para el restaurante:** (a) captación de un cliente fiel y de grupo —el alérgico decide dónde come todo el grupo y
  repite donde se siente seguro—; (b) expediente de diligencia debida ante inspección/reclamación (RD 126/2015);
  (c) carta QR filtrable incluida, con lo que sustituye (no suma) al gasto en carta digital.
- **Para el alérgico:** dejar de fiarse de la palabra del camarero; ver qué locales tienen la información contrastada,
  cuándo se revisó por última vez, y poder reportar discrepancias que alguien de verdad investiga.
- **Honestidad interna:** el restaurante compra **marketing + protección**, no compliance (el compliance ya lo cree
  tener). El pitch de venta debe liderar con "te traigo mesas de 4–6 personas que repiten", no con el Reglamento.

### 2.3 Canales
- **B2B:** venta a puerta fría/templada barrio a barrio (tú, al principio); prescriptores: asesorías de hostelería y
  consultoras APPCC que ya cobran al restaurante por higiene alimentaria (les damos comisión, ellos ponen la
  confianza); asociaciones como Hostelería Madrid a medio plazo.
- **B2C:** asociaciones de pacientes (AEPNAA, Histasan, Asociación Española de Alérgicos a Alimentos y Látex),
  grupos de Facebook/Telegram/WhatsApp de padres alérgicos, micro-influencers de vida con alergias, y el propio QR
  en mesa como canal de descubrimiento.
- El QR en el local es el canal más barato: cada comensal no alérgico que lo escanea aprende que existe el sello.

### 2.4 Relación con clientes
- **B2B:** alta guiada (concierge), re-verificación periódica con recordatorios, gestor único (tú). El restaurante
  debe sentir que esto le quita trabajo, no que le añade una auditoría.
- **B2C:** autoservicio; el canal de reportes de discrepancia es la relación —cada reporte respondido crea un
  evangelista; cada reporte ignorado destruye el producto entero.

### 2.5 Fuentes de ingresos
Ver sección 3 (precios). Resumen: setup de verificación inicial + cuota recurrente B2B; B2C gratuito.

### 2.6 Recursos clave
- **El protocolo de verificación** (checklist documental + criterios de aceptación + registro fotográfico): es EL
  activo. Documentarlo desde el piloto 1 como si fuera a auditarlo un tercero.
- Marca de confianza (naming, sello, tono) y su respaldo jurídico (términos redactados por abogado alimentario).
- Base de datos estructurada plato→ingrediente→alérgeno→evidencia con trazabilidad de fechas.
- Tú: conocimiento vivido del problema + capacidad técnica (Supabase, automatización, IA como copiloto del revisor).
- **Seguro de responsabilidad civil profesional** en cuanto haya un solo sello en la calle. No es opcional.

### 2.7 Actividades clave
- Verificación documental (revisión de fichas técnicas, etiquetados, escandallos) asistida por IA, con decisión humana.
- Vigilancia de vigencia: re-declaración obligatoria del restaurante, caducidad del sello, spot-checks.
- Gestión de reportes B2C (sistema inmune del sello).
- Venta B2B y evangelización B2C.

### 2.8 Alianzas clave
- Asociaciones de pacientes (credibilidad B2C y acceso a usuarios) — cuidado: no pueden parecer avalistas del sello
  sin acuerdo formal.
- Consultoras APPCC / asesorías de hostelería (canal B2B con confianza ya construida).
- Abogado especializado en derecho alimentario (contrato marco, wording del sello, límites de responsabilidad).
- Más adelante: aseguradoras (un sello que reduce siniestralidad podría interesarles) y plataformas de reservas.

### 2.9 Estructura de costes
- Dominante: **horas de verificación** (el coste variable que decide si el negocio existe; medirlo es el objetivo nº1
  del piloto). Estimación a validar: 4–8 h la inicial de un local de 30–50 platos; 1–2 h la re-verificación trimestral.
- Fijos bajos: Supabase (0–25 €/mes), dominio, herramientas (~50 €/mes), seguro RC (~40–80 €/mes estimado),
  asesoría jurídica inicial (300–600 € one-off).
- Adquisición B2B: tu tiempo (LEINN te da la estructura para imputarlo, hazlo: si una venta te cuesta 10 h, cuesta
  dinero aunque no salga de tu bolsillo).

---

## 3. Modelo de precios

### B2B (restaurantes) — precios de partida PARA TESTAR, no verdades

| Concepto | Precio | Incluye |
|---|---|---|
| **Verificación inicial (setup)** | **349 € (one-off)** | Revisión documental completa de la carta (fichas técnicas, etiquetados, escandallos), 1 visita presencial, informe de discrepancias, alta de carta QR filtrable, sello físico + digital fechado |
| **Plan Verificado (recurrente)** | **59 €/mes** (o 590 €/año) | Vigencia del sello, re-verificación documental trimestral, actualización de platos (hasta 5/mes), gestión de reportes de usuarios, expediente de diligencia debida descargable |
| **Grupos (2–10 locales)** | setup 249 €/local + 49 €/local/mes | Igual, con panel multi-local |

**Por qué estas cifras y dónde van a doler:**
- Una carta digital con alérgenos autodeclarados cuesta 0–30 €/mes (Alergenu, Egourmet). Nuestro recurrente pide
  **~30 €/mes de prima por el sello**. Esa prima solo se paga si el restaurante percibe que trae clientes: por eso el
  argumento de venta es "una mesa de 4 al mes ya lo paga" (ticket 25 € × 4 personas = 100 € > 59 €).
- El ancla correcta no es la carta digital sino la **consultoría APPCC** que muchos ya pagan (50–120 €/mes): estamos
  en su rango y resolvemos un dolor que la APPCC genérica no cubre bien.
- El setup de 349 € probablemente **no cubre tu coste real** al principio (si la inicial son 8 h + visita, estás
  vendiendo a ~35 €/h antes de impuestos, sin contar la venta). Se acepta como inversión en aprendizaje durante el
  piloto; la tesis de escala es que la IA + protocolo bajen la inicial a 2–3 h. Si tras 10 verificaciones sigues en
  8 h, el modelo no escala con estos precios y hay que subirlos o pivotar a colectividades.
- **Regla de validación:** estos precios se testean pidiendo dinero real o compromiso firmado (ver experimentos),
  nunca con "¿pagarías 59 €?" en una encuesta.

### B2C (consumidores) — gratis, y punto (por ahora)

- **Gratis:** buscar locales verificados, carta filtrada por alérgeno, fecha de última revisión, reportar discrepancias.
- **Sin plan premium los primeros 12–18 meses.** Razón: el activo B2C es la **densidad de usuarios que reportan y
  recomiendan**; cualquier fricción de pago la mata, y el ARPU realista de una app de nicho (2–3 €/mes con conversión
  del 2–5 % sobre una base pequeña) es ruido frente a una sola cuota B2B. El freemium B2C queda en el roadmap
  (alertas, multi-perfil familiar, mapa de viaje) como opción de año 2, no como fuente de ingresos del plan.

### Dimensión del mercado (Madrid, órdenes de magnitud para no engañarnos)

- Hostelería en la Comunidad de Madrid: ~30.000–33.000 locales de restauración; quizá **6.000–10.000** encajan en el
  perfil "carta estable + ticket medio + gestión profesionalizada" (SAM).
- **SOM año 1 honesto: 20–40 locales de pago.** Con 30 locales a ~59 €/mes + setups ≈ **28.000–32.000 € de ingresos
  en el año 1**. Esto NO es un sueldo; es una validación. El negocio se pone interesante en la fase 2 de escala
  (300+ locales o pivot a colectividades), no antes. Que nadie te venda otra cosa, incluido tú mismo.

---

## 4. Plan de validación DFV con Experiment Cards

Orden deliberado: **primero deseabilidad B2B (quien paga), después factibilidad de la verificación, y la viabilidad
se testea con ventas reales, no con encuestas.** El B2C se valida en paralelo porque es barato.

### EC-1 · Entrevistas de problema a hosteleros — *Desirability B2B* 🔴 la más crítica

- **Hipótesis:** los restauradores de Madrid con carta estable perciben los alérgenos como un riesgo real (multas,
  reseñas, incidentes) y no confían al 100 % en su propia declaración actual.
- **Test:** 15 entrevistas de problema (no de solución) con dueños/jefes de sala en 2 barrios objetivo. Guion: último
  incidente con un alérgico, quién mantiene la carta de alérgenos, cuándo se actualizó, qué pasó en la última
  inspección. La solución no se menciona hasta el final.
- **Métrica:** % que relata un incidente o miedo concreto no resuelto + % que admite que su declaración puede estar
  desactualizada.
- **Criterio de éxito:** ≥ 8/15 con dolor explícito. **Si < 5/15: el B2B restaurante independiente muere aquí**
  y se salta directamente a EC-6 (colectividades).
- **Coste/tiempo:** 0 € · 2 semanas.

### EC-2 · Entrevistas + encuesta a alérgicos — *Desirability B2C*

- **Hipótesis:** el alérgico (o padre/madre) desconfía de las cartas autodeclaradas, ha tenido malas experiencias, y
  un sello verificado cambiaría su elección de restaurante.
- **Test:** 15 entrevistas (vía AEPNAA, Histasan, grupos de FB/Telegram de padres alérgicos) + encuesta corta (n≥100)
  difundida en esos grupos. Preguntas de comportamiento pasado ("¿cuándo fue la última vez que descartaste un
  restaurante por dudas?"), no de intención futura.
- **Métrica:** % con incidente/descarte en los últimos 3 meses; % que dice que el grupo entero cambió de local por ellos.
- **Criterio de éxito:** ≥ 60 % con descarte reciente y evidencia clara del "efecto grupo" (es el argumento de venta B2B).
- **Coste/tiempo:** 0–50 € · 2 semanas, en paralelo con EC-1.

### EC-3 · Verificación concierge de 2 restaurantes reales — *Feasibility* 🔴 la segunda más crítica

- **Hipótesis:** puedo completar una verificación documental inicial en ≤ 6 h/local, los restaurantes me entregan la
  documentación (fichas, etiquetados, escandallos), y encuentro discrepancias reales entre lo declarado y la evidencia.
- **Test:** verificar gratis 2 restaurantes (uno "amigo", uno frío captado en EC-1). Pedir docs por WhatsApp/email,
  revisar en remoto con ayuda de IA, 1 visita para fotos de etiquetado. Cronometrar TODO por tarea.
- **Métrica:** horas/local; % de documentación conseguida sin perseguir al dueño; nº de discrepancias encontradas.
- **Criterio de éxito:** ≤ 6 h/local y ≥ 1 discrepancia real encontrada. **Ojo:** encontrar discrepancias es
  comercialmente perfecto (tu mejor material de venta: "de 40 cartas revisadas, 32 tenían errores") pero si NO
  consigues la documentación de proveedores en < 2 semanas de persecución, la factibilidad está en cuestión: el cuello
  de botella no es la IA, es la burocracia del restaurante.
- **Coste/tiempo:** 0 € (tu tiempo) · 3 semanas.

### EC-4 · Consulta jurídica sobre el sello — *Feasibility/riesgo legal*

- **Hipótesis:** existe una formulación del sello y un contrato B2B que aportan valor de diligencia debida al
  restaurante sin trasladarme a mí una responsabilidad inasumible.
- **Test:** 1–2 h con abogado de derecho alimentario (pídelo vía la red LEINN/TWATI antes de pagar): wording del
  sello, uso de "verificado" vs "certificado", cláusulas de limitación, necesidad y coste real del seguro RC.
- **Criterio de éxito:** wording aprobado + presupuesto de seguro RC < 100 €/mes. Si el abogado dice que no hay
  formulación segura, el sello se convierte en "informe de revisión" privado y cambia el producto (mejor saberlo ya).
- **Coste/tiempo:** 0–300 € · 1 semana.

### EC-5 · Venta real con compromiso — *Viability* 🔴 el juez final

- **Hipótesis:** un restaurante paga 349 € + 59 €/mes por la verificación (o firma un compromiso de pago condicionado
  al lanzamiento).
- **Test:** pitch de venta con precio real a 10 restaurantes (usando las discrepancias de EC-3 como demo). Se pide:
  pago del setup por adelantado, o carta de intenciones firmada con precio explícito, o al menos señal (50 €).
  Nada de "me interesa" verbal: no cuenta.
- **Métrica:** nº de compromisos con fricción real (dinero o firma) / 10 pitches.
- **Criterio de éxito:** ≥ 3/10. Con 1–2/10: revisar precio o segmento. Con 0/10: pivot (colectividades o B2C-first).
- **Coste/tiempo:** 0 € · 3 semanas.

### EC-6 · (Condicional) Exploración de colectividades — *plan B*

- **Disparador:** EC-1 < 5/15 o EC-5 = 0/10.
- **Test:** 5 entrevistas con responsables de catering escolar/empresa y 2 con dirección de colegios sobre cómo
  verifican hoy los menús para alérgicos y qué pagarían por verificación externa.
- **Racional:** allí la obligación es contractual, el comprador es profesional y un incidente les cuesta el contrato.
  Peor para el alma (menos visible), mejor para la cartera.

---

## 5. MVP Wizard of Oz (mínimo trabajo de campo)

**Principio:** en la fase WoZ no se construye NADA que una persona pueda hacer a mano en < 30 min/restaurante.
La IA de cruce de documentos **no existe todavía**: eres tú leyendo fichas técnicas con ayuda de un LLM genérico.
El usuario no lo sabe ni le importa.

**Flujo:**
1. **Captación B2B:** landing simple (1 página) + tu pitch presencial. El "formulario de subida" inicial puede ser
   un Tally/carpeta compartida o incluso WhatsApp: los hosteleros mandan fotos por WhatsApp, no suben PDFs a portales.
   *Minimiza campo:* toda la documentación se pide y revisa en remoto; **una sola visita** por local (fotos de
   etiquetado + entrega del sello + foto para la web). Agrupa las visitas por barrio en una misma tarde.
2. **"Motor" de verificación:** checklist en una hoja de cálculo/Notion: plato → ingredientes → alérgenos declarados
   → evidencia (enlace a ficha/foto) → veredicto → fecha. Tú revisas con el LLM como copiloto. Cada verificación
   alimenta el protocolo (recurso clave 2.6).
3. **Salida B2C:** página pública por restaurante (esto sí merece ser web real desde el inicio, es la cara del
   producto): carta filtrable por los 14 alérgenos, sello con fecha de última revisión, botón "reportar discrepancia"
   (un formulario que te llega a ti). QR impreso en mesa/puerta.
4. **Vigencia:** recordatorio mensual automatizado (n8n) al restaurante: "¿ha cambiado algo? responde SÍ/NO".
   Sin respuesta en 15 días → el sello pasa a "revisión pendiente" visible públicamente. Esta mecánica ES el producto:
   la autodeclaración caduca; la nuestra, no, porque la vigilamos.

**Lo que NO se hace en el WoZ:** IA propia de extracción, panel B2B self-service, app nativa, pagos online
(se factura a mano), multi-idioma, celíacos como segmento (FACE ya lo cubre).

---

## 6. Roadmap 90 días

**Días 1–30 · Descubrir (no construir):**
EC-1 + EC-2 en paralelo · EC-4 (abogado) · elegir los 2 barrios objetivo · conseguir el restaurante "amigo" para EC-3
· naming y sello (borrador) · **decisión Go/No-Go nº1** con los criterios de las experiment cards.

**Días 31–60 · Verificar de verdad (WoZ):**
EC-3 completa (2 locales, cronometrada) · construir SOLO la página B2C pública + formulario de reporte (fase 2 de este
proyecto) · material de venta con las discrepancias reales encontradas · contratar seguro RC si hay sello en la calle
· primeros 20–30 usuarios B2C vía asociaciones sobre los locales piloto.

**Días 61–90 · Cobrar:**
EC-5: 10 pitches con precio real · objetivo: **3 clientes de pago o compromisos firmados** · medir: horas/verificación
(¿bajando?), escaneos de QR, reportes B2C, retención del piloto · **decisión Go/No-Go nº2:** perseverar (escalar a
20 locales en un distrito), pivotar (colectividades, EC-6) o parar. Documentarlo todo: para LEINN, este paper trail
de evidencia vale tanto como el negocio.

**Métrica norte de los 90 días:** *ingresos comprometidos por restaurantes* (no usuarios, no descargas, no likes del
sello). Si el 13 de octubre de 2026 no hay al menos 1.500–2.000 € comprometidos, la respuesta del mercado es "no
así".

---

## 7. Los 3 mayores riesgos (y por qué el orden importa)

### R1 · Un incidente bajo tu sello (riesgo existencial, no probable pero fatal)
Una anafilaxia en un local "verificado" —porque el cocinero improvisó, hubo contaminación cruzada o la verificación
estaba caducada— destruye la marca y puede implicarte legalmente. La contaminación cruzada en cocina **no se puede
verificar documentalmente**: tu sello cubre la información, no la ejecución.
**Mitigación:** (a) el sello verifica *información*, nunca promete *seguridad* — wording jurídicamente revisado en
sello, web y contrato (EC-4); (b) caducidad visible y automática del sello con re-declaración mensual;
(c) seguro RC profesional antes del primer sello público; (d) el canal de reportes B2C tratado como sistema de
alerta temprana con SLA propio (todo reporte investigado en < 72 h); (e) exclusión explícita de la contaminación
cruzada del alcance, dicha en voz alta al alérgico (paradójicamente, esta honestidad aumenta la confianza).

### R2 · El restaurante no paga la prima de verificación (riesgo más probable)
El hostelero medio español opera con márgenes del 5–10 %, sufre fatiga de vendedores de SaaS y cree que su carta
"ya cumple". La diferencia entre autodeclaración (gratis/30 €) y verificación (59 €/mes) solo la paga quien vea
clientes nuevos o tenga miedo reciente (inspección, reseña, incidente).
**Mitigación:** (a) vender captación, no compliance ("una mesa de 4 al mes lo paga"); (b) usar las discrepancias de
EC-3 como demo de choque ("tu carta actual tiene 3 errores; te los enseño"); (c) entrar por barrios con densidad de
familias (efecto red local: "el sello que ya tienen 5 locales de tu calle"); (d) criterio de corte explícito en EC-5:
si 0/10 compromete dinero, pivot a colectividades sin enamorarse del segmento restaurante.

### R3 · La verificación no escala (riesgo de modelo)
Si cada local cuesta 8 h iniciales + persecución documental + visita, con 59 €/mes el negocio es una consultoría
artesanal mal pagada, no una startup. Y la verificación se degrada: proveedores y recetas cambian sin avisar, y un
sello desactualizado es peor que ninguno.
**Mitigación:** (a) cronometrar cada verificación desde la nº1 y fijar el umbral (≤ 3 h a la décima verificación con
protocolo + IA, o repricing/pivot); (b) seleccionar clientes con carta estable (criterio de cualificación, no vender
a cualquiera); (c) trasladar trabajo al restaurante con formato fijo de entrega de documentación; (d) la
re-declaración mensual + reportes B2C como vigilancia barata entre re-verificaciones; (e) la IA entra en fase 3 para
comprimir la revisión documental, cuando el protocolo manual ya esté estandarizado (automatizar un proceso que no
dominas solo automatiza errores).

---

## 8. Qué me tienes que confirmar antes de la Fase 2

1. ¿Aceptas el reposicionamiento **"verificación documental independiente"** (sin promesa legal, sin la palabra
   "certificación") o quieres pelear el enfoque legal con un abogado antes?
2. ¿Validamos los precios de partida (349 € setup / 59 €/mes) como hipótesis a testar en EC-5?
3. ¿De acuerdo con B2C 100 % gratis (freemium aplazado a año 2)?
4. ¿El MVP de Fase 2 se construye tal como está definido en la sección 5 (solo la cara pública B2C es web "de verdad";
   la subida B2B y el admin, mínimos)?

Con tu OK a estos 4 puntos, paso a Fase 2.
