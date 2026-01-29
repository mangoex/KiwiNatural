import { Category, MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  // Ensaladas
  {
    id: 'e1',
    name: 'Manzana Nuez',
    description: 'Lechuga fresca acompañada con el sabor especial del queso de cabra, nuez, dulces cubitos de manzana, ajonjolí y aderezo balsámico.',
    price: 125,
    category: Category.ENSALADAS,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    isPopular: true,
    calories: 320,
    macros: { protein: 8, carbs: 25, fat: 22 }
  },
  {
    id: 'e2',
    name: 'Frutos Rojos',
    description: 'Mezcla de lechuga con fresa, arándanos, cuadritos de queso panela, cacahuates garapiñados y aderezo balsámico.',
    price: 130,
    category: Category.ENSALADAS,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80',
    calories: 290,
    macros: { protein: 12, carbs: 30, fat: 15 }
  },
  {
    id: 'e3',
    name: 'Ensalada Verde',
    description: 'Lechuga, panela, pepino, espinaca, jugosos tomates cherry, semillas de girasol, aguacate y germinado.',
    price: 110,
    category: Category.ENSALADAS,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80',
    calories: 210,
    macros: { protein: 10, carbs: 12, fat: 14 }
  },
  {
    id: 'e4',
    name: 'Del Chef',
    description: 'Lechuga fresca, pollo a la plancha, pepino, jamón, queso panela, tostadas horneadas y germinado de alfalfa.',
    price: 130,
    category: Category.ENSALADAS,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80',
    calories: 450,
    macros: { protein: 45, carbs: 20, fat: 20 }
  },

  // Combos
  {
    id: 'c1',
    name: 'Combo Premium',
    description: 'Media ensalada premium y medio baguette de pollo, pollo BBQ o atún.',
    price: 185,
    category: Category.COMBOS,
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&q=80',
    isPopular: true,
    calories: 650,
    macros: { protein: 35, carbs: 65, fat: 25 }
  },
  {
    id: 'c2',
    name: 'Combo Kiwi',
    description: 'Media ensalada y medio baguette de pollo, pollo BBQ o atún.',
    price: 170,
    category: Category.COMBOS,
    image: 'https://images.unsplash.com/photo-1621800043295-a73fe2f76e2c?w=800&q=80',
    calories: 580,
    macros: { protein: 30, carbs: 60, fat: 22 }
  },

  // Emparedados
  {
    id: 's1',
    name: 'Baguette de Pollo',
    description: 'Pan artesanal crujiente con pechuga de pollo a la plancha, vegetales frescos y aderezo de la casa.',
    price: 120,
    category: Category.EMPAREDADOS,
    image: 'https://images.unsplash.com/photo-1553909489-cd47e3b4430f?w=800&q=80',
    calories: 420,
    macros: { protein: 35, carbs: 45, fat: 10 }
  },
  {
    id: 's2',
    name: 'Cuernito Jamón',
    description: 'Pan tradicional danés hecho con mantequilla, relleno de jamón de pavo y queso crema.',
    price: 95,
    category: Category.EMPAREDADOS,
    image: 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?w=800&q=80',
    calories: 380,
    macros: { protein: 18, carbs: 35, fat: 20 }
  },
  {
    id: 's3',
    name: 'Focaccia Quesos',
    description: 'Pan italiano horneado con romero y aceite de oliva, relleno de selección de quesos.',
    price: 95,
    category: Category.EMPAREDADOS,
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&q=80',
    calories: 410,
    macros: { protein: 15, carbs: 40, fat: 22 }
  },

  // Omelettes
  {
    id: 'o1',
    name: 'Omelette de Pollo',
    description: 'Con queso y espinaca acompañado de verdura fresca, rebanada de pan y aderezo.',
    price: 140,
    category: Category.OMELETTES,
    image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&q=80',
    calories: 350,
    macros: { protein: 32, carbs: 15, fat: 18 }
  },

  // Jugoterapia
  {
    id: 'j1',
    name: 'Jugo Verde',
    description: 'Mezcla de pepino, apio, espinaca verde, jugo de limón y acidita manzana verde.',
    price: 68,
    category: Category.JUGOS,
    image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800&q=80',
    isPopular: true,
    calories: 120,
    macros: { protein: 2, carbs: 28, fat: 0 }
  },
  {
    id: 'j2',
    name: 'Anti-Anemia',
    description: 'Jugo de naranja fresca con zanahoria y todo el color del betabel.',
    price: 65,
    category: Category.JUGOS,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80',
    calories: 140,
    macros: { protein: 2, carbs: 32, fat: 0 }
  },
  {
    id: 'j3',
    name: 'Shot Jengibre-Piña',
    description: 'Energizante mezcla de extracto de jengibre y rico jugo de piña (118ml).',
    price: 45,
    category: Category.JUGOS,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80',
    calories: 60,
    macros: { protein: 0, carbs: 15, fat: 0 }
  },

  // Smoothies
  {
    id: 'sm1',
    name: 'Smoothie Cacao',
    description: 'Plátano mezclado con leche de almendra, miel de abeja, cacao, chía y espinaca verde.',
    price: 90,
    category: Category.SMOOTHIES,
    image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=800&q=80',
    calories: 280,
    macros: { protein: 8, carbs: 35, fat: 12 }
  },
  {
    id: 'sm2',
    name: 'Licuado Choco-Plátano',
    description: 'El clásico favorito con leche de tu elección.',
    price: 55,
    category: Category.SMOOTHIES,
    image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=800&q=80',
    calories: 320,
    macros: { protein: 12, carbs: 45, fat: 10 }
  },

  // Postres
  {
    id: 'p1',
    name: 'Yogurt con Fruta',
    description: 'Frutas de temporada bañadas con yogurt natural Yoplait, miel y cereales.',
    price: 95,
    category: Category.POSTRES,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
    calories: 220,
    macros: { protein: 8, carbs: 40, fat: 4 }
  },
  {
    id: 'p2',
    name: 'Escamocha',
    description: 'Mezcla de frutas frescas con jugo de naranja, lechera y cereales.',
    price: 95,
    category: Category.POSTRES,
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&q=80',
    calories: 280,
    macros: { protein: 5, carbs: 55, fat: 6 }
  }
];

// Simplified DB for parser. Values per 100g approx.
export const GENERIC_FOOD_DB: Record<string, { cal: number, p: number, c: number, f: number }> = {
  'pollo': { cal: 165, p: 31, c: 0, f: 3.6 },
  'pechuga': { cal: 165, p: 31, c: 0, f: 3.6 },
  'huevo': { cal: 155, p: 13, c: 1.1, f: 11 },
  'claras': { cal: 52, p: 11, c: 0.7, f: 0.2 },
  'atun': { cal: 130, p: 28, c: 0, f: 1 },
  'salmon': { cal: 208, p: 20, c: 0, f: 13 },
  'arroz': { cal: 130, p: 2.7, c: 28, f: 0.3 },
  'avena': { cal: 389, p: 16.9, c: 66, f: 6.9 },
  'tortilla': { cal: 218, p: 5.7, c: 45, f: 2.9 },
  'pan': { cal: 265, p: 9, c: 49, f: 3.2 },
  'pasta': { cal: 131, p: 5, c: 25, f: 1.1 },
  'manzana': { cal: 52, p: 0.3, c: 14, f: 0.2 },
  'platano': { cal: 89, p: 1.1, c: 23, f: 0.3 },
  'aguacate': { cal: 160, p: 2, c: 9, f: 15 },
  'nuez': { cal: 654, p: 15, c: 14, f: 65 },
  'yogurt': { cal: 59, p: 10, c: 3.6, f: 0.4 },
};
