# Aliva — Línea gráfica (brand brief)

> Identidad de marca de Aliva. En el futuro basta con decir "aplica lo de BRAND.md".
> Aplicada a la app el 24/07/2026 (ver `app/README.md` y el registro de decisiones del modelo).

Aliva es una app donde una persona alérgica crea su perfil de alergias y lo enseña en un QR al
llegar a un restaurante, para no tener que explicarse cada vez. El alma de la marca es **el
alivio**: transmitir calma y seguridad, nunca miedo.

## 1. Design tokens

```css
:root{
  /* Marca */
  --aliva-green:  #0E8C63;  /* color principal: botones, marca, estados "todo bien" */
  --pine:         #0A2A22;  /* texto principal y superficies oscuras */
  --sprout:       #57C79A;  /* verde medio: UI secundaria, iconos */
  --mint:         #DFF3EA;  /* fondos suaves, tarjetas, tintes */
  --paper:        #F6FAF8;  /* fondo base (blanco frío, NUNCA crema) */
  --zest:         #FFCA4B;  /* acento cálido: úsalo con cuentagotas */

  /* Texto */
  --text:         #0A2A22;  /* primario */
  --text-soft:    #3C5B50;  /* secundario */
  --line:         #CBE4D8;  /* bordes y separadores */

  /* Semántico — alérgenos ("no puedo comer"): alerta cálida, no roja agresiva */
  --alert-bg:     #FCE9E4;
  --alert-text:   #B04A3A;
  --alert-border: #F3C9BF;

  /* Forma y profundidad */
  --radius-sm: 12px;
  --radius:    22px;
  --radius-lg: 26px;
  --shadow:    0 22px 50px -20px rgba(10,42,34,.40);
}
```

El **verde es el 80% de la marca**, no un acento; el **amarillo (zest)** aparece poco; el **pino**
es para texto y fondos oscuros. Fondo base siempre `--paper`, nunca blanco puro ni crema.

## 2. Tipografía

- **Bricolage Grotesque** → titulares, nombres de pantalla, el logotipo. Peso 700–800, `letter-spacing:-0.02em`.
- **Hanken Grotesk** → texto de lectura, botones, formularios. Peso 400–600. Fuente por defecto del `body`.
- **Space Mono** → etiquetas pequeñas, datos, encabezados de sección en mayúsculas con tracking (`letter-spacing:.14em; text-transform:uppercase`).

## 3. Logo / marca

Símbolo = **módulo QR** (cuadrado redondeado) con un pequeño **check** de confirmación abajo a la
derecha. Assets en `app/assets/brand/` (icon, mark, mark-on-dark, mono). El wordmark "aliva" va en
minúscula, Bricolage Grotesque 700. No deformes ni recolorees el símbolo; deja aire alrededor.

## 4. Componentes

- **Botón primario:** fondo verde, texto paper, `border-radius:999px`, Bricolage 700. Solo uno claro por vista.
- **Acento puntual:** fondo zest, texto pino. Con moderación.
- **Tarjetas:** blanco o mint, borde `--line`, `--radius`, sombra solo al flotar.
- **Chips de alérgenos ("no puedo comer"):** tokens `--alert-*` (rosado claro, texto teja). Única nota de alerta, sin dramatismo.
- **Éxito / verificado:** verde con check.
- **Encabezados de sección:** Space Mono en mayúsculas con tracking.
- Formas redondeadas y generosas. Nada de esquinas duras.

## 5. Voz y tono

Regla de oro: **no vendemos miedo**.
- **Sí:** cercano, segunda persona, calmado ("Enséñalo y siéntate a disfrutar", "Mostrar mi perfil").
- **No:** "una reacción puede ser mortal", "no arriesgues tu vida", "protocolo de gestión de alérgenos", jerga B2B.
- Tagline: **"Deja de explicarte. Enséñalo."**

## 6. Accesibilidad

- Contraste AA. Respeta `prefers-reduced-motion`. No metas librerías nuevas si no hacen falta.
  Favicon y PWA icon con el nuevo logo.
