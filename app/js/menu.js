// Carta de los restaurantes (contenido de prototipo).
//
// Cada plato declara:
//   contiene   → alérgenos presentes (de los 14 del Reglamento UE 1169/2011)
//   trazas     → puede contener trazas de estos alérgenos
//   removibles → alérgenos que el restaurante puede QUITAR a petición
//                (p. ej. "sin queso", "base sin gluten"). Es lo que permite
//                pedir un plato "sin cierto alérgeno".
//
// IMPORTANTE: esta información la declara el restaurante. Aliva la ordena para
// el cliente, pero no garantiza seguridad; "pídelo sin X" es una petición
// registrada, no una garantía (misma filosofía que el aviso a cocina).
//
// En producción esta carta viviría en Supabase (tabla `platos`); aquí es
// contenido estático para el prototipo.

export const MENUS = {
  'la-nonna': {
    moneda: '€',
    categorias: [
      {
        nombre: 'Entrantes',
        platos: [
          { id: 'ln-burrata', nombre: 'Burrata con tomate y albahaca', desc: 'Burrata fresca, tomate de temporada, albahaca y AOVE.', precio: 12.5, contiene: ['lacteos'], trazas: ['frutos_cascara'], removibles: [] },
          { id: 'ln-bruschetta', nombre: 'Bruschetta al pomodoro', desc: 'Pan tostado, tomate, ajo y albahaca.', precio: 7.9, contiene: ['gluten'], trazas: [], removibles: [] },
          { id: 'ln-cesar', nombre: 'Ensalada César', desc: 'Lechuga, pollo, picatostes, parmesano y salsa césar.', precio: 11.0, contiene: ['gluten', 'lacteos', 'huevo', 'pescado'], trazas: [], removibles: ['gluten', 'lacteos', 'pescado'] },
          { id: 'ln-carpaccio', nombre: 'Carpaccio de ternera', desc: 'Láminas de ternera, virutas de parmesano y aliño de mostaza.', precio: 13.5, contiene: ['lacteos', 'mostaza'], trazas: [], removibles: ['lacteos', 'mostaza'] },
        ],
      },
      {
        nombre: 'Pasta',
        platos: [
          { id: 'ln-arrabbiata', nombre: "Penne all'arrabbiata", desc: 'Penne, tomate, ajo y guindilla. Sin lácteos.', precio: 10.5, contiene: ['gluten'], trazas: [], removibles: ['gluten'] },
          { id: 'ln-vongole', nombre: 'Spaghetti alle vongole', desc: 'Espaguetis con almejas, ajo, vino blanco y perejil.', precio: 15.9, contiene: ['gluten', 'moluscos', 'sulfitos'], trazas: [], removibles: ['gluten'] },
          { id: 'ln-ragu', nombre: 'Tagliatelle al ragú', desc: 'Pasta fresca al huevo con ragú de ternera y sofrito.', precio: 13.0, contiene: ['gluten', 'huevo', 'apio'], trazas: [], removibles: ['apio'] },
          { id: 'ln-lasagna', nombre: 'Lasagna della casa', desc: 'Lasaña clásica con bechamel y boloñesa.', precio: 13.9, contiene: ['gluten', 'huevo', 'lacteos', 'apio'], trazas: [], removibles: [] },
        ],
      },
      {
        nombre: 'Pizzas',
        platos: [
          { id: 'ln-marinara', nombre: 'Pizza Marinara', desc: 'Tomate, ajo, orégano y AOVE. Sin queso.', precio: 8.5, contiene: ['gluten'], trazas: [], removibles: ['gluten'] },
          { id: 'ln-margarita', nombre: 'Pizza Margarita', desc: 'Tomate, mozzarella y albahaca.', precio: 10.0, contiene: ['gluten', 'lacteos'], trazas: [], removibles: ['gluten', 'lacteos'] },
          { id: 'ln-diavola', nombre: 'Pizza Diavola', desc: 'Tomate, mozzarella y salami picante.', precio: 12.0, contiene: ['gluten', 'lacteos'], trazas: [], removibles: ['gluten', 'lacteos'] },
          { id: 'ln-formaggi', nombre: 'Pizza Quattro Formaggi', desc: 'Cuatro quesos sobre base de tomate.', precio: 12.5, contiene: ['gluten', 'lacteos'], trazas: [], removibles: ['gluten'] },
        ],
      },
      {
        nombre: 'Postres',
        platos: [
          { id: 'ln-sorbete', nombre: 'Sorbete de limón', desc: 'Sorbete artesano de limón. Sin lácteos.', precio: 5.0, contiene: [], trazas: [], removibles: [] },
          { id: 'ln-pannacotta', nombre: 'Panna cotta', desc: 'Con coulis de frutos rojos.', precio: 6.0, contiene: ['lacteos'], trazas: ['frutos_cascara'], removibles: [] },
          { id: 'ln-tiramisu', nombre: 'Tiramisú', desc: 'Bizcocho, café, mascarpone y cacao.', precio: 6.5, contiene: ['gluten', 'huevo', 'lacteos'], trazas: [], removibles: [] },
        ],
      },
    ],
  },

  'casa-vera': {
    moneda: '€',
    categorias: [
      {
        nombre: 'Para picar',
        platos: [
          { id: 'cv-gazpacho', nombre: 'Gazpacho andaluz', desc: 'Tomate, pepino, pimiento y un toque de pan.', precio: 6.0, contiene: ['gluten'], trazas: [], removibles: ['gluten'] },
          { id: 'cv-croquetas', nombre: 'Croquetas de jamón', desc: 'Cremosas, hechas en casa.', precio: 8.5, contiene: ['gluten', 'lacteos', 'huevo'], trazas: [], removibles: [] },
          { id: 'cv-ensaladilla', nombre: 'Ensaladilla rusa', desc: 'Patata, atún, mayonesa y huevo.', precio: 7.5, contiene: ['huevo', 'pescado'], trazas: [], removibles: ['pescado'] },
          { id: 'cv-pulpo', nombre: 'Pulpo a la brasa', desc: 'Con parmentier de patata y pimentón.', precio: 16.0, contiene: ['moluscos'], trazas: [], removibles: [] },
        ],
      },
      {
        nombre: 'Principales',
        platos: [
          { id: 'cv-solomillo', nombre: 'Solomillo con patatas', desc: 'Solomillo de ternera a la brasa con patatas.', precio: 18.5, contiene: [], trazas: [], removibles: [] },
          { id: 'cv-lubina', nombre: 'Lubina a la espalda', desc: 'Lubina con verduras salteadas.', precio: 19.0, contiene: ['pescado'], trazas: [], removibles: [] },
          { id: 'cv-risotto', nombre: 'Risotto de setas', desc: 'Arroz cremoso con setas y parmesano.', precio: 14.0, contiene: ['lacteos', 'sulfitos'], trazas: [], removibles: ['lacteos'] },
        ],
      },
      {
        nombre: 'Postres',
        platos: [
          { id: 'cv-fruta', nombre: 'Fruta de temporada', desc: 'Selección de fruta fresca.', precio: 4.5, contiene: [], trazas: [], removibles: [] },
          { id: 'cv-tarta', nombre: 'Tarta de queso', desc: 'Cremosa, al horno.', precio: 5.5, contiene: ['gluten', 'lacteos', 'huevo'], trazas: [], removibles: [] },
        ],
      },
    ],
  },

  'alba-brunch': {
    moneda: '€',
    categorias: [
      {
        nombre: 'Brunch',
        platos: [
          { id: 'ab-aguacate', nombre: 'Tostada de aguacate', desc: 'Pan de masa madre, aguacate, semillas de sésamo.', precio: 9.5, contiene: ['gluten', 'sesamo'], trazas: [], removibles: ['gluten', 'sesamo'] },
          { id: 'ab-benedict', nombre: 'Huevos Benedict', desc: 'Muffin, huevo poché y salsa holandesa.', precio: 11.0, contiene: ['gluten', 'huevo', 'lacteos'], trazas: [], removibles: [] },
          { id: 'ab-pancakes', nombre: 'Pancakes con sirope', desc: 'Torre de tortitas con sirope de arce.', precio: 9.0, contiene: ['gluten', 'huevo', 'lacteos'], trazas: [], removibles: [] },
          { id: 'ab-yogur', nombre: 'Yogur con granola', desc: 'Yogur natural, granola casera y frutos secos.', precio: 7.0, contiene: ['lacteos', 'gluten', 'frutos_cascara'], trazas: [], removibles: ['gluten', 'frutos_cascara'] },
        ],
      },
      {
        nombre: 'Bowls y saludable',
        platos: [
          { id: 'ab-acai', nombre: 'Bowl de açaí', desc: 'Açaí, plátano, granola y frutos secos.', precio: 8.5, contiene: ['frutos_cascara', 'soja'], trazas: ['gluten'], removibles: ['frutos_cascara', 'soja'] },
          { id: 'ab-poke', nombre: 'Poke de salmón', desc: 'Arroz, salmón, edamame, aguacate y sésamo.', precio: 12.5, contiene: ['pescado', 'soja', 'sesamo'], trazas: [], removibles: ['soja', 'sesamo'] },
        ],
      },
      {
        nombre: 'Bebidas',
        platos: [
          { id: 'ab-zumo', nombre: 'Zumo verde', desc: 'Manzana, apio, espinaca y jengibre.', precio: 4.5, contiene: ['apio'], trazas: [], removibles: ['apio'] },
          { id: 'ab-cafe', nombre: 'Café con leche de avena', desc: 'Espresso con bebida de avena.', precio: 3.0, contiene: ['gluten'], trazas: [], removibles: ['gluten'] },
        ],
      },
    ],
  },
};

export function getMenuLocal(slug) {
  return MENUS[slug] || null;
}

// Clasifica un plato según el perfil del usuario.
// estado: 'seguro' | 'trazas' | 'adaptable' | 'contiene' | 'sinperfil'
export function clasificarPlato(plato, perfil) {
  if (!perfil) {
    return { estado: 'sinperfil', conflictos: [], noRemovibles: [], removiblesQueAyudan: [], trazasConflicto: [] };
  }
  const mis = new Set(perfil.alergenos || []);
  const contiene = plato.contiene || [];
  const trazas = plato.trazas || [];
  const removibles = new Set(plato.removibles || []);

  const conflictos = contiene.filter((a) => mis.has(a));
  const trazasConflicto = trazas.filter((a) => mis.has(a));
  const noRemovibles = conflictos.filter((a) => !removibles.has(a));
  const removiblesQueAyudan = conflictos.filter((a) => removibles.has(a));

  let estado;
  if (conflictos.length === 0) {
    estado = trazasConflicto.length ? 'trazas' : 'seguro';
  } else if (noRemovibles.length === 0) {
    estado = 'adaptable';
  } else {
    estado = 'contiene';
  }
  return { estado, conflictos, noRemovibles, removiblesQueAyudan, trazasConflicto };
}

export const ESTADO_META = {
  seguro: { etiqueta: 'Encaja contigo', clase: 's-seguro' },
  trazas: { etiqueta: 'Puede tener trazas', clase: 's-trazas' },
  adaptable: { etiqueta: 'Se puede adaptar', clase: 's-adaptable' },
  contiene: { etiqueta: 'No apto', clase: 's-contiene' },
  sinperfil: { etiqueta: '', clase: 's-neutro' },
};
