import { Product, FAQItem } from './types';
import { easeYellowImg, easePurpleImg, easeGreenImg, capsulaNacionalImg, capsulaLemonadeImg, bateriaBrassknucklesImg, bateriaYellowMiniImg, comboWavePuffImg } from './base64Images';

export const FAQ_ITEMS: FAQItem[] = [
  {
    category: 'shipping',
    question: '¿Realizan envíos a todo el país?',
    answer: 'Sí, realizamos envíos express a todo el país.'
  },
  {
    category: 'shipping',
    question: '¿Cuál es el costo del envío?',
    answer: 'El costo del envío se calcula al momento de coordinar tu despacho por WhatsApp para ofrecerte la opción más rápida y económica según tu ubicación geográfica.'
  },

  {
    category: 'security',
    question: '¿Cómo puedo verificar que mi producto es original?',
    answer: 'Todos nuestros dispositivos importados incluyen una etiqueta con un código QR rascable que te permite verificar su autenticidad directamente en el sitio web oficial del fabricante.'
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'ace-ultra-premium-2ml',
    name: 'ACE ULTRA PREMIUM 2ML',
    brand: 'Ace Ultra Premium',
    category: 'disposables',
    categoryLabel: 'Disposables',
    price: 99900,
    originalPrice: 106000,
    rating: 4.9,
    reviewsCount: 165,
    description: 'Línea de desechables ultra premium con 2ml de destilado premium, sabor intenso y gran potencia. Diseño recargable para aprovechar hasta la última gota.',
    image: 'https://i.ibb.co/fYJZmZst/disposable-1.jpg',
    features: ['2ML de destilado premium', 'Dispositivo recargable tipo C', 'Sabor potente y de alta duración', 'Sin rellenos, puro extracto'],
    colors: [
      { name: 'Estándar', hex: '#E5C158', image: 'https://i.ibb.co/fYJZmZst/disposable-1.jpg' }
    ],
    nicotine: '0% (THC Puro)',
    battery: '400mAh (Recargable)',
    capacity: '2.0 ml',
    stock: 12,
    isPopular: true,
    isNew: true,
    reviews: [
      { id: 'ace1', name: 'Santiago R.', rating: 5, comment: 'El mejor sabor de la línea, excelente golpe y el diseño es comodísimo.', date: '2026-06-20', verified: true }
    ]
  },
  {
    id: 'kit-destilado-thc-nacional',
    name: 'KIT DESTILADO THC NACIONAL 1ML',
    brand: 'Nacional',
    category: 'capsulas',
    categoryLabel: 'Cápsulas',
    price: 79900,
    originalPrice: 90000,
    rating: 4.9,
    reviewsCount: 148,
    description: 'Kit premium con destilado de THC 100% nacional de la más alta pureza (1ML). Incluye batería recargable y cápsula lista para usar.',
    image: 'https://i.ibb.co/v6RdQwmY/KIT-DESTILADO-THC-NACIONAL-1-ML.jpg',
    features: ['Destilado premium 100% nacional', 'Kit completo listo para usar', 'Compatible con rosca estándar 510', 'Batería recargable con regulador'],
    colors: [
      { name: 'Estándar', hex: '#7B52DE', image: 'https://i.ibb.co/v6RdQwmY/KIT-DESTILADO-THC-NACIONAL-1-ML.jpg' }
    ],
    nicotine: '0% (THC Puro)',
    battery: '350mAh (Recargable)',
    capacity: '1.0 ml',
    stock: 15,
    isPopular: true,
    isNew: true,
    reviews: [
      { id: 'kd1', name: 'Andrés M.', rating: 5, comment: 'Excelente calidad y la batería dura un montón, muy recomendado.', date: '2026-06-15', verified: true }
    ]
  },
  {
    id: 'capsula-destilado-nacional',
    name: 'CÁPSULA NACIONAL 1ML',
    brand: 'Nacional',
    category: 'capsulas',
    categoryLabel: 'Cápsulas',
    price: 45000,
    originalPrice: 50000,
    rating: 4.8,
    reviewsCount: 92,
    description: 'Cápsula armada con destilado nacional premium seleccionada con alto nivel de pureza y enriquecida con terpenos orgánicos del país para un sabor incomparable.',
    image: capsulaNacionalImg,
    features: ['Destilado premium 100% nacional', 'Terpenos botánicos seleccionados', 'Compatible con rosca estándar 510/USB', 'Sistema anti-filtración doble'],
    colors: [
      { name: 'Blanco', hex: '#FFFFFF', image: capsulaNacionalImg }
    ],
    nicotine: '0% (Destilado Puro)',
    battery: 'No aplica',
    capacity: '1.0 ml',
    stock: 42,
    isPopular: true,
    isNew: false,
    reviews: [
      { id: 'c1', name: 'Carlos E.', rating: 5, comment: 'El sabor a mango es fantástico, muy natural y un golpe súper limpio.', date: '2026-05-27', verified: true }
    ]
  },
  {
    id: 'capsula-importada-premium',
    name: 'CÁPSULA LEMONADE PREMIUM',
    brand: 'Importado',
    category: 'capsulas',
    categoryLabel: 'Cápsulas',
    price: 56000,
    originalPrice: 66000,
    rating: 4.9,
    reviewsCount: 165,
    description: 'Nuestras icónicas cápsulas premium de origen importado directamente de laboratorios verificados. Certificados de máxima pureza para una sensación y sabor ultra de Lemonade Premium.',
    image: capsulaLemonadeImg,
    features: ['Certificación de origen y máxima pureza', 'Sabor Lemonade Premium dulce y refrescante', 'Compatible con baterías de rosca 510 y USB', 'Flujo de aire optimizado para calada suave'],
    colors: [
      { name: 'Lemonade', hex: '#FACC15', image: capsulaLemonadeImg }
    ],
    nicotine: '0% (Pureza Certificada)',
    battery: 'No aplica',
    capacity: '1.0 ml / 2.0 ml',
    stock: 28,
    isPopular: false,
    isNew: true,
    reviews: [
      { id: 'ci1', name: 'Mariana P.', rating: 5, comment: 'La calidad del destilado importado se nota de inmediato. Lemonade de antes es riquísimo.', date: '2026-05-29', verified: true }
    ]
  },
  {
    id: 'bateria-vape-usb',
    name: 'BATERÍA BRASSKNUCKLES TIPO C',
    brand: 'Brassknuckles',
    category: 'baterias',
    categoryLabel: 'Baterías',
    price: 40000,
    rating: 4.8,
    reviewsCount: 94,
    description: 'Batería compacta importada premium con cargador Tipo C. Conexión clásica de rosca 510 universal de gran conductividad y elegancia absoluta. Ideal para tus sesiones de la mano de la mejor marca.',
    image: bateriaBrassknucklesImg,
    features: ['Cargador rápido Tipo C incluido', 'Conexión universal clásica de rosca 510', 'Regulación de voltaje inteligente preestablecida', 'Diseño elegante y acabado premium'],
    colors: [
      { name: 'Negro', hex: '#000000', image: bateriaBrassknucklesImg }
    ],
    nicotine: 'No aplica',
    battery: '650mAh',
    capacity: 'Universal 510',
    stock: 25,
    isPopular: true,
    isNew: true,
    reviews: [
      { id: 'b1', name: 'Sebastian L.', rating: 5, comment: 'Hermoso color negro y el cargador Tipo C funciona excelente. Súper elegante.', date: '2026-06-11', verified: true }
    ]
  },
  {
    id: 'bateria-importada-variable',
    name: 'BATERÍA TIPO C MINI',
    brand: 'Importado',
    category: 'baterias',
    categoryLabel: 'Baterías',
    price: 40000,
    rating: 4.9,
    reviewsCount: 110,
    description: 'Batería premium súper compacta con conexión de rosca 510 universal y puerto de carga rápida Tipo C. Su tamaño mini es perfecto para llevarla a donde quieras con la máxima discreción y el mejor estilo.',
    image: bateriaYellowMiniImg,
    features: ['Diseño ultra-compacto de bolsillo', 'Puerto de carga rápida Tipo C', 'Conexión universal clásica de rosca 510', 'Excelente estabilidad de corriente para proteger tus cápsulas'],
    colors: [
      { name: 'Amarillo', hex: '#EAB308', image: bateriaYellowMiniImg }
    ],
    nicotine: 'No aplica',
    battery: '400mAh',
    capacity: 'Universal 510',
    stock: 22,
    isPopular: true,
    isNew: true,
    reviews: [
      { id: 'b2', name: 'Nicolás J.', rating: 5, comment: 'Es increíblemente pequeña y súper práctica. Carga rapidísimo por puerto Tipo C y el color amarillo es fantástico.', date: '2026-06-12', verified: true }
    ]
  },
  {
    id: 'ease-8000-puffs',
    name: 'EASE 8000 PUFFS',
    brand: 'Importado',
    category: 'vapers',
    categoryLabel: 'Vapers',
    price: 25000,
    rating: 4.9,
    reviewsCount: 377,
    description: 'El vaporizador EASE 8000 Puffs ofrece gran cantidad de caladas con un diseño divertido e innovador estilo vaso de refresco con boquilla flexible, sabor ultra nítido y alto rendimiento.',
    image: easeYellowImg, // default/fallback
    features: ['Hasta 8000 Puffs reales', 'Diseño ergonómico estilo vaso con bombilla flexible', 'Resistencia mesh coil para máxima intensidad de sabor', 'Batería recargable tipo C de alto rendimiento'],
    colors: [
      { name: 'Amarillo', hex: '#EAB308', image: easeYellowImg },
      { name: 'Morado', hex: '#A855F7', image: easePurpleImg },
      { name: 'Verde', hex: '#22C55E', image: easeGreenImg }
    ],
    puffs: 8000,
    nicotine: '5%',
    battery: '650mAh (Recargable)',
    capacity: '15ml',
    stock: 30,
    isPopular: true,
    isNew: true,
    reviews: [
      { id: 'ryellow1', name: 'Sebastian G.', rating: 5, comment: 'Buenísimo sabor a pera con algodón de azúcar, el diseño del vasito es súper cómodo.', date: '2026-06-10', verified: true },
      { id: 'rpurple1', name: 'Diana K.', rating: 5, comment: 'Me encanta la combinación de kiwi y limón, es súper fresco. El diseño de vasito morado está hermoso.', date: '2026-06-09', verified: true },
      { id: 'rgreen1', name: 'Javier M.', rating: 5, comment: 'Espectacular sabor a manzana y frambuesa azul, súper recomendado. Muy buena potencia.', date: '2026-06-11', verified: true }
    ]
  }
];

export const BRANDS = ['Todos', 'Wave Puff', 'Nacional', 'Importado'];
