// Los 14 alérgenos de declaración obligatoria (Reglamento UE 1169/2011, Anexo II).
export const ALERGENOS = [
  { id: 'gluten', nombre: 'Gluten', icono: '🌾' },
  { id: 'crustaceos', nombre: 'Crustáceos', icono: '🦐' },
  { id: 'huevo', nombre: 'Huevo', icono: '🥚' },
  { id: 'pescado', nombre: 'Pescado', icono: '🐟' },
  { id: 'cacahuete', nombre: 'Cacahuete', icono: '🥜' },
  { id: 'soja', nombre: 'Soja', icono: '🫘' },
  { id: 'lacteos', nombre: 'Lácteos', icono: '🥛' },
  { id: 'frutos_cascara', nombre: 'Frutos de cáscara', icono: '🌰' },
  { id: 'apio', nombre: 'Apio', icono: '🌿' },
  { id: 'mostaza', nombre: 'Mostaza', icono: '🌼' },
  { id: 'sesamo', nombre: 'Sésamo', icono: '🫓' },
  { id: 'sulfitos', nombre: 'Sulfitos', icono: '🍇' },
  { id: 'altramuz', nombre: 'Altramuces', icono: '🌱' },
  { id: 'moluscos', nombre: 'Moluscos', icono: '🐚' },
];

export const GRAVEDADES = [
  { id: 'intolerancia', nombre: 'Intolerancia', detalle: 'Me sienta mal, pero no es una urgencia' },
  { id: 'alergia', nombre: 'Alergia', detalle: 'Reacción alérgica, necesito evitarlo por completo' },
  { id: 'anafilaxia', nombre: 'Alergia grave', detalle: 'Riesgo de anafilaxia, máxima precaución' },
];

export function nombreAlergeno(id) {
  const a = ALERGENOS.find((x) => x.id === id);
  return a ? a.nombre : id;
}

export function iconoAlergeno(id) {
  const a = ALERGENOS.find((x) => x.id === id);
  return a ? a.icono : '·';
}

export function nombreGravedad(id) {
  const g = GRAVEDADES.find((x) => x.id === id);
  return g ? g.nombre : id;
}
