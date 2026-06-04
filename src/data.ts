import { Product, FAQItem } from './types';

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
    id: 'premium-vaper',
    name: 'Vaper Wave Puff Premium',
    brand: 'Wave Puff',
    category: 'vapers',
    categoryLabel: 'Vapers',
    price: 110000,
    rating: 5.0,
    reviewsCount: 148,
    description: 'Kit de vaporizador premium con batería integrada de larga duración, regulador de potencia y boquilla ergonómica. Ofrece una experiencia de caladas súper suaves y máxima nitidez de sabor.',
    image: 'linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)',
    features: ['Batería interna de gran duración', 'Control de entrada de flujo de aire ajustable', 'Diseño metálico ultra-resistente y premium', 'Indicador inteligente LED'],
    colors: [
      { name: 'Violeta Eléctrico', hex: '#8B5CF6' },
      { name: 'Negro Mate', hex: '#111827' }
    ],
    nicotine: 'Regulable',
    battery: '1100mAh',
    capacity: '2.0ml Recargable',
    stock: 15,
    isPopular: true,
    isNew: true,
    reviews: [
      { id: 'v1', name: 'Alfonso M.', rating: 5, comment: 'La duración de la batería es asombrosa, y el acabado violeta mate se ve increíble.', date: '2026-05-28', verified: true },
      { id: 'v2', name: 'Laura D.', rating: 5, comment: 'Excelente equipo vaper, liviano y con una potencia excelente.', date: '2026-05-25', verified: true }
    ]
  },
  {
    id: 'capsula-destilado-nacional',
    name: 'Cápsula de Destilado Nacional',
    brand: 'Nacional',
    category: 'capsulas',
    categoryLabel: 'Cápsulas',
    price: 45000,
    rating: 4.8,
    reviewsCount: 92,
    description: 'Cápsula armada con destilado nacional premium seleccionada con alto nivel de pureza y enriquecida con terpenos orgánicos del país para un sabor incomparable.',
    image: 'linear-gradient(135deg, #FF6B6B 0%, #D63031 100%)',
    features: ['Destilado premium 100% nacional', 'Terpenos botánicos seleccionados', 'Compatible con rosca estándar 510/USB', 'Sistema anti-filtración doble'],
    colors: [
      { name: 'Arándano Natural', hex: '#3B82F6' },
      { name: 'Mango Haze', hex: '#F59E0B' }
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
    name: 'Cápsula Importada Cali',
    brand: 'Importado',
    category: 'capsulas',
    categoryLabel: 'Cápsulas',
    price: 65000,
    rating: 4.9,
    reviewsCount: 165,
    description: 'Nuestras icónicas cápsulas premium de origen importado directamente de laboratorios verificados. Certificados de máxima pureza para una sensación y sabor ultra limpios.',
    image: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    features: ['Certificación de origen y máxima pureza', 'Sabores y destilación con especificaciones premium', 'Compatible con baterías de rosca 510 y USB', 'Flujo de aire optimizado para calada suave'],
    colors: [
      { name: 'Gelato Sherbert', hex: '#EC4899' },
      { name: 'Pineapple Express', hex: '#FBBF24' }
    ],
    nicotine: '0% (Pureza Certificada)',
    battery: 'No aplica',
    capacity: '1.0 ml / 2.0 ml',
    stock: 28,
    isPopular: false,
    isNew: true,
    reviews: [
      { id: 'ci1', name: 'Mariana P.', rating: 5, comment: 'La calidad del destilado importado se nota de inmediato. Gelato es una locura.', date: '2026-05-29', verified: true }
    ]
  },
  {
    id: 'bateria-vape-usb',
    name: 'Batería Tipo USB Inteligente',
    brand: 'Wave Puff',
    category: 'baterias',
    categoryLabel: 'Baterías',
    price: 35000,
    rating: 4.7,
    reviewsCount: 78,
    description: 'Batería compacta con conector USB integrado directo. Olvídate de los cables adicionales, ideal para cargarlo instantáneamente en cualquier puerto estándar y listo para usar en segundos.',
    image: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    features: ['Carga USB directa integrada sin cables', 'Conexión clásica de rosca 510 universal', '3 niveles de voltaje preestablecidos', 'Diseño ultraligero y de perfil plano'],
    colors: [
      { name: 'Titanio Cepillado', hex: '#9CA3AF' },
      { name: 'Azul Eléctrico', hex: '#2563EB' }
    ],
    nicotine: 'No aplica',
    battery: '350mAh',
    capacity: 'Universal 510',
    stock: 50,
    isPopular: false,
    isNew: false,
    reviews: [
      { id: 'b1', name: 'Mateo R.', rating: 4.8, comment: 'La comodidad de conectarlo directamente a la laptop sin cables es insuperable. Sólida duración.', date: '2026-05-26', verified: true }
    ]
  },
  {
    id: 'bateria-importada-variable',
    name: 'Batería Importada Pro',
    brand: 'Importado',
    category: 'baterias',
    categoryLabel: 'Baterías',
    price: 55000,
    rating: 4.9,
    reviewsCount: 110,
    description: 'Batería premium importada con regulación inteligente de voltaje digital. Excelente estabilidad de corriente para proteger las cápsulas y maximizar la entrega térmica.',
    image: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    features: ['Ajuste fino de voltaje por selector', 'Protección avanzada de sobrecarga para cápsulas', 'Diseño ergonómico texturizado en aleación de aluminio', 'Batería de alto rendimiento de larga duración'],
    colors: [
      { name: 'Púrpura Imperial', hex: '#7C3AED' },
      { name: 'Oro de 24K', hex: '#cca43b' },
      { name: 'Gris Grafito', hex: '#4B5563' }
    ],
    nicotine: 'No aplica',
    battery: '650mAh',
    capacity: 'Universal 510',
    stock: 19,
    isPopular: true,
    isNew: false,
    reviews: [
      { id: 'b2', name: 'Nicolás J.', rating: 5, comment: 'Se siente súper premium la aleación. Recomiendo el color Oro de 24K, es muy vistosa.', date: '2026-05-30', verified: true }
    ]
  }
];

export const BRANDS = ['Todos', 'Wave Puff', 'Nacional', 'Importado'];
