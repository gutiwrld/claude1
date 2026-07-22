// Sistema de insignias de Aliva.
//
// PRINCIPIO CLAVE (no negociable): la insignia refleja la REPUTACIÓN de
// comunidad — la experiencia de otros comensales alérgicos — no una garantía
// de seguridad. Nunca promete "seguro para ti hoy". Por eso:
//   1. Solo cuentan valoraciones ligadas a un aviso real (una por visita).
//   2. La insignia puede BAJAR: una racha de valoraciones negativas la
//      degrada a "En revisión". Eso la separa de las reseñas al uso.
//   3. Los mensajes de "avisa siempre en persona" se mantienen aunque la
//      insignia sea la máxima.
//
// La valoración responde a una pregunta concreta: ¿el restaurante preparó
// tu plato de forma segura, respetando tus alérgenos (elaboración separada)?
//   cumplio = true  → cumplió la regla
//   cumplio = false → no la cumplió / hubo un problema

// Umbrales calibrados para escala piloto (se endurecen al crecer la red).
const MIN_VALORACIONES = 3; // por debajo: "Recién adherido"
const RATIO_REVISION = 0.65; // por debajo (con datos suficientes): "En revisión"

export const NIVELES = {
  nuevo: {
    id: 'nuevo',
    nombre: 'Recién adherido',
    icono: '◕',
    clase: 'b-nuevo',
    desc: 'Adherido con protocolo de sala. Aún sin valoraciones suficientes de la comunidad.',
  },
  revision: {
    id: 'revision',
    nombre: 'En revisión',
    icono: '⏸',
    clase: 'b-revision',
    desc: 'Ha recibido valoraciones negativas recientes. La comunidad recomienda extra precaución.',
  },
  valorado: {
    id: 'valorado',
    nombre: 'Valorado por la comunidad',
    icono: '✦',
    clase: 'b-valorado',
    desc: 'Comensales alérgicos confirman que aquí les prepararon su plato con cuidado.',
  },
  confianza: {
    id: 'confianza',
    nombre: 'De confianza',
    icono: '✦✦',
    clase: 'b-confianza',
    desc: 'Muchas visitas de alérgicos bien atendidas, de forma sostenida.',
  },
  refugio: {
    id: 'refugio',
    nombre: 'Refugio de la comunidad',
    icono: '✦✦✦',
    clase: 'b-refugio',
    desc: 'El nivel más alto: un lugar donde la comunidad alérgica come tranquila una y otra vez.',
  },
};

// Devuelve el nivel + estadísticas a partir de la lista de valoraciones.
export function calcularBadge(valoraciones = []) {
  const total = valoraciones.length;
  const positivas = valoraciones.filter((v) => v.cumplio).length;
  const negativas = total - positivas;
  const ratio = total ? positivas / total : 0;

  // Actividad reciente (últimos 90 días): la reputación debe estar viva.
  const hace90 = Date.now() - 90 * 24 * 3600 * 1000;
  const recientes = valoraciones.filter((v) => {
    const t = new Date(v.created_at || v.fecha || 0).getTime();
    return t >= hace90;
  }).length;

  const stats = { total, positivas, negativas, ratio, recientes };

  let nivel;
  if (total < MIN_VALORACIONES) {
    nivel = NIVELES.nuevo;
  } else if (ratio < RATIO_REVISION) {
    nivel = NIVELES.revision;
  } else if (positivas >= 20 && ratio >= 0.9) {
    nivel = NIVELES.refugio;
  } else if (positivas >= 8 && ratio >= 0.82) {
    nivel = NIVELES.confianza;
  } else {
    nivel = NIVELES.valorado;
  }

  return { ...nivel, ...stats };
}

// Progreso hacia el siguiente nivel (para motivar al restaurante en su panel).
export function siguienteNivel(badge) {
  if (badge.id === 'nuevo') {
    return { objetivo: 'Valorado por la comunidad', faltan: Math.max(0, MIN_VALORACIONES - badge.total), unidad: 'valoraciones' };
  }
  if (badge.id === 'valorado') {
    return { objetivo: 'De confianza', faltan: Math.max(0, 8 - badge.positivas), unidad: 'valoraciones positivas' };
  }
  if (badge.id === 'confianza') {
    return { objetivo: 'Refugio de la comunidad', faltan: Math.max(0, 20 - badge.positivas), unidad: 'valoraciones positivas' };
  }
  return null;
}

// Texto corto para el subtítulo de la insignia.
export function resumenBadge(badge) {
  if (badge.total === 0) return 'Sin valoraciones todavía';
  const pct = Math.round(badge.ratio * 100);
  return `${badge.positivas} de ${badge.total} comensales alérgicos bien atendidos (${pct}%)`;
}

// ---------- Render (devuelven HTML como cadena) ----------

// Píldora compacta para listas.
export function insigniaChipHTML(badge) {
  const estrellas = badge.icono.includes('✦') ? `<span class="star">${badge.icono}</span>` : `<span class="star">${badge.icono}</span>`;
  return `<span class="insignia ${badge.clase}">${estrellas}${badge.nombre}</span>`;
}

// Tarjeta grande para la cabecera de aviso y el panel de sala.
export function insigniaHeroHTML(badge) {
  return `
    <div class="insignia-hero ${badge.clase}">
      <div class="medal">${badge.icono.includes('✦') ? '✦' : badge.icono}</div>
      <div class="txt">
        <div class="nom">${badge.nombre}</div>
        <div class="det">${resumenBadge(badge)}</div>
      </div>
    </div>`;
}
