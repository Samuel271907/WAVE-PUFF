export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'vapers' | 'capsulas' | 'baterias';
  categoryLabel: string;
  price: number;
  rating: number;
  reviewsCount: number;
  description: string;
  image: string; // Product color gradient or thumbnail visual
  features: string[];
  colors: { name: string; hex: string }[];
  puffs?: number;
  nicotine?: string;
  battery?: string;
  capacity?: string;
  stock: number;
  isPopular: boolean;
  isNew: boolean;
  reviews: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'shipping' | 'warranty' | 'usage' | 'security';
}
