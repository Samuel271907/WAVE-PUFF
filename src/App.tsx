import React, { useState, useEffect, useCallback } from 'react';
import { SlidersHorizontal, ArrowUpDown, ChevronDown, CheckCircle, Smartphone, MapPin, Sparkles, Flame, Percent, Lock, Unlock, Settings, Trash2, Plus, RotateCcw, Edit2, AlertCircle, X, Save, Search, EyeOff, Eye, Loader2 } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetailsModal from './components/ProductDetailsModal';
import CartSidebar from './components/CartSidebar';
import FAQSection from './components/FAQSection';
import WhatsAppButton from './components/WhatsAppButton';
import { Product, CartItem, Review } from './types';
import { PRODUCTS } from './data';
import Logo from './components/Logo';
import AgeVerificationGate from './components/AgeVerificationGate';
import { db, OperationType, handleFirestoreError } from './firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, getDocs } from 'firebase/firestore';

// Obscured verification helper to protect the admin pass "2026W4ve." from plain-text exposure
const verifyAdminPassword = (password: string): boolean => {
  const clean = password.trim();
  if (clean.length !== 9) return false;
  const codes = [50, 48, 50, 54, 87, 52, 118, 101, 46];
  for (let i = 0; i < codes.length; i++) {
    if (clean.charCodeAt(i) !== codes[i]) return false;
  }
  return true;
};

const ADMIN_TEMPLATES = [
  {
    name: 'WAKA TRIPLE MANGO 10K',
    brand: 'Waka',
    category: 'vapers',
    categoryLabel: 'Vapers',
    price: 65000,
    originalPrice: 80000,
    stock: 15,
    puffs: 10000,
    nicotine: '5%',
    battery: '650mAh (Recargable Tipo-C)',
    capacity: '18ml',
    description: 'Vapeador de alta capacidad con pantalla inteligente de batería y líquido. Flujo de aire ajustable y resistencia de malla integrada para una producción de vapor y fidelidad de sabor insuperables.',
    features: [
      'Resistencia Dual Mesh de alta definición',
      'Pantalla indicadora de batería y líquido',
      'Puerto de carga rápida USB Tipo-C',
      'Flujo de aire ajustable en la base'
    ],
    colors: [
      { name: 'Fresa Kiwi', hex: '#FF4B72', image: '' },
      { name: 'Menta Fresca', hex: '#00F5D4', image: '' }
    ]
  },
  {
    name: 'EASE DYNAMIC 6000',
    brand: 'Ease',
    category: 'vapers',
    categoryLabel: 'Vapers',
    price: 45000,
    originalPrice: 55000,
    stock: 15,
    puffs: 6000,
    nicotine: '5%',
    battery: '500mAh (Recargable)',
    capacity: '12ml',
    description: 'Dispositivo compacto y portátil de caladas continuas. Diseño ergonómico con sabores frutales súper intensos creados con sales de nicotina premium.',
    features: [
      'Boquilla ergonómica ultrasuave',
      'Resistencia de malla súper optimizada',
      'Portabilidad extrema y peso pluma',
      'Sabores intensificados de larga duración'
    ],
    colors: [
      { name: 'Sandía Ice', hex: '#FF3366', image: '' }
    ]
  },
  {
    name: 'POD RECARGABLE DISPOSITIVO',
    brand: 'Caliburn',
    category: 'capsulas',
    categoryLabel: 'Cápsulas',
    price: 85000,
    originalPrice: 110000,
    stock: 8,
    puffs: undefined,
    nicotine: 'N/A',
    battery: '690mAh (Batería de larga duración)',
    capacity: '2ml',
    description: 'Sistema de cápsula recargable premium. Ideal para vapear sales de nicotina con máxima fidelidad de sabor, regulación de aire y activación por calada o botón.',
    features: [
      'Activación por botón o calada automática',
      'Resistencias reemplazables de gran sabor',
      'Indicador LED de batería tricolor',
      'Estructura de aleación de aluminio ultrarresistente'
    ],
    colors: [
      { name: 'Negro Calavera', hex: '#212121', image: '' },
      { name: 'Azul Aurora', hex: '#4169E1', image: '' }
    ]
  },
  {
    name: 'CÁPSULA SELLADA SABORIZADA',
    brand: 'Importado',
    category: 'capsulas',
    categoryLabel: 'Cápsulas',
    price: 25000,
    originalPrice: 30000,
    stock: 20,
    puffs: undefined,
    nicotine: '3%',
    battery: 'N/A',
    capacity: '2ml',
    description: 'Cápsulas de repuesto selladas herméticamente. Compatibilidad garantizada y antifugas absolutas con bobina de cerámica para mayor pureza.',
    features: [
      'Tecnología antifugas de triple sellado',
      'Bobina cerámica de grado médico',
      'Empaque de aluminio sellado al vacío',
      'Sales de nicotina premium importadas'
    ],
    colors: [
      { name: 'Arándano Fresa', hex: '#8A2BE2', image: '' }
    ]
  },
  {
    name: 'BATERÍA LÁPIZ ROSCA 510',
    brand: 'Smiss',
    category: 'baterias',
    categoryLabel: 'Baterías',
    price: 35000,
    originalPrice: 45000,
    stock: 10,
    puffs: undefined,
    nicotine: '0%',
    battery: '350mAh (Voltaje Variable)',
    capacity: 'Rosca 510',
    description: 'Batería universal tipo lápiz para cartuchos de rosca 510. Voltaje variable de tres niveles para personalizar tu experiencia de vapeo con indicador LED.',
    features: [
      'Compatibilidad universal con rosca 510',
      'Voltaje variable ajustable (3 clicks)',
      'Precalentamiento automático (2 clicks)',
      'Cargador USB inteligente incluido'
    ],
    colors: [
      { name: 'Negro Mate', hex: '#1C1C1C', image: '' },
      { name: 'Plata Metálica', hex: '#C0C0C0', image: '' }
    ]
  }
];

export default function App() {
  // STATE MANAGEMENT
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(() => {
    return localStorage.getItem('wave_puff_age_verified') === 'true';
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('wave_puff_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Active product being edited or created
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [adminSearch, setAdminSearch] = useState('');
  const [isAdminSaving, setIsAdminSaving] = useState(false);

  // PRODUCTS STATE & PERSISTENCE
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  // Clean up any stale legacy products from local storage to prevent any interference
  useEffect(() => {
    localStorage.removeItem('wave_puff_products');
  }, []);

  // Track synchronization errors gracefully in UI rather than crashing
  const [syncError, setSyncError] = useState<string | null>(null);

  // 1. Initial Seeding and Validation Check
  useEffect(() => {
    const checkAndSeed = async () => {
      try {
        const colRef = collection(db, 'products');
        const snapshot = await getDocs(colRef);
        if (snapshot.empty) {
          console.log('Firestore products collection is empty. Seeding with default PRODUCTS...');
          // Seed the database with defaults. Ensure isAvailable: true is set so it complies with firestore.rules!
          for (const item of PRODUCTS) {
            const seedItem = {
              ...item,
              isAvailable: item.isAvailable !== false // defaults to true
            };
            await setDoc(doc(db, 'products', item.id), seedItem);
          }
          console.log('Seeding completed successfully!');
        }
      } catch (err) {
        console.error('Error during initial products check/seeding:', err);
        setSyncError('Error al conectar o inicializar la base de datos de productos.');
      }
    };
    checkAndSeed();
  }, []);

  // 2. Real-time synchronization listener (ReadOnly, No inline writes!)
  useEffect(() => {
    const colRef = collection(db, 'products');
    
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      try {
        const list: Product[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as Product);
        });
        setProducts(list);
        setSyncError(null); // Clear errors if sync is working
      } catch (err) {
        console.error('Error parsing Firestore products snapshot:', err);
        setSyncError('Error al procesar los datos de productos en tiempo real.');
      }
    }, (error) => {
      console.error('Firestore snapshot subscription error:', error);
      setSyncError(`Error de sincronización: ${error.message}`);
    });

    return () => unsubscribe();
  }, []);

  // Derived Brand Options dynamically so edits show up instantly in filter selectors!
  const derivedBrands = ['Todos', ...Array.from(new Set(products.map((p) => p.brand)))];

  // ADMIN MODULE SYSTEMS STATE
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminVerified, setIsAdminVerified] = useState(() => {
    return sessionStorage.getItem('wave_puff_admin_verified') === 'true';
  });
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'vapers' | 'capsulas' | 'baterias'>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('Todos');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc'>('popular');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [flyingParticles, setFlyingParticles] = useState<{ id: string; x: number; y: number }[]>([]);
  
  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('wave_puff_cart', JSON.stringify(cart));
  }, [cart]);

  // CATEGORY TABS CONFIG
  const categoryTabs = [
    { id: 'all', label: 'Todos' },
    { id: 'vapers', label: 'Vapers' },
    { id: 'capsulas', label: 'Cápsulas' },
    { id: 'baterias', label: 'Baterías' },
  ] as const;

  // HANDLERS
  const handleAddToCart = (product: Product, selectedColor: string, e: React.MouseEvent) => {
    spawnParticle(e);
    
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === selectedColor
      );

      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += 1;
        return updated;
      } else {
        return [...prevCart, { product, quantity: 1, selectedColor }];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, selectedColor: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(productId, selectedColor);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId && item.selectedColor === selectedColor
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string, selectedColor: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.product.id === productId && item.selectedColor === selectedColor))
    );
  };

  const spawnParticle = (e: React.MouseEvent) => {
    const id = Math.random().toString(36).substring(2, 9);
    // Fallback if clientX isn't defined
    const x = e.clientX || window.innerWidth / 2;
    const y = e.clientY || window.innerHeight / 2;

    setFlyingParticles((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setFlyingParticles((prev) => prev.filter((p) => p.id !== id));
    }, 1000);
  };

  const handleSendWhatsApp = (message: string) => {
    // Standard WhatsApp API integration opening window safely
    const customNumber = '573044508617'; // Simulated premium dispatch helpline number
    const targetUrl = `https://wa.me/${customNumber}?text=${encodeURIComponent(message)}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const scrollToCatalog = () => {
    document.getElementById('catalog-anchor')?.scrollIntoView({ behavior: 'smooth' });
  };

  // ADMIN CRITICAL ACTIONS HANDLERS
  const startEditing = useCallback((prod: Product) => {
    setEditingId(prod.id);
    setEditForm({ ...prod });
  }, []);

  const toggleProductAvailability = useCallback(async (id: string) => {
    if (isAdminSaving) return;
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const isCurrentlyActive = product.isAvailable !== false;
    const hasStock = product.stock > 0;
    
    let nextAvailable = product.isAvailable;
    let nextStock = product.stock;

    if (isCurrentlyActive && hasStock) {
      // Active and has stock -> Toggle to Agotado (Keep active but set 0 stock)
      nextAvailable = true;
      nextStock = 0;
    } else {
      // Inactive or out of stock -> Toggle to Disponible (available with stock)
      nextAvailable = true;
      if (product.stock <= 0) {
        nextStock = 15; // default restocked amount
      }
    }

    const updatedProduct = { ...product, isAvailable: nextAvailable, stock: nextStock };

    setIsAdminSaving(true);
    try {
      await setDoc(doc(db, 'products', id), updatedProduct);
      if (editingId === id) {
        setEditForm((prevForm) => ({
          ...prevForm,
          isAvailable: nextAvailable,
          stock: nextStock
        }));
      }
    } catch (err) {
      console.error('Error toggling availability:', err);
      handleFirestoreError(err, OperationType.WRITE, `products/${id}`);
    } finally {
      setIsAdminSaving(false);
    }
  }, [products, editingId, isAdminSaving]);

  const startCreating = useCallback(() => {
    const newId = 'prod-' + Date.now();
    setEditingId(newId);
    setEditForm({
      id: newId,
      name: '',
      brand: 'Importado',
      category: 'vapers',
      categoryLabel: 'Vapers',
      price: 50000,
      originalPrice: 60000,
      rating: 5.0,
      reviewsCount: 1,
      description: '',
      image: '',
      features: ['Sabor premium de larga duración', 'Diseño ergonómico y portátil'],
      colors: [{ name: 'Estándar', hex: '#7B52DE', image: '' }],
      stock: 15,
      isAvailable: true,
      isPopular: false,
      isNew: true,
      reviews: []
    });
  }, []);

  const handleSaveProduct = useCallback(async (keepFormOpen: any = false) => {
    const shouldKeepOpen = keepFormOpen === true;
    if (isAdminSaving) return;
    const errors: string[] = [];

    if (!editForm.name || editForm.name.trim().length < 3) {
      errors.push('El nombre del producto es requerido y debe tener al menos 3 caracteres.');
    }
    if (!editForm.brand || editForm.brand.trim() === '') {
      errors.push('La marca es requerida.');
    }
    if (editForm.price === undefined || editForm.price === null || isNaN(editForm.price) || editForm.price <= 0) {
      errors.push('El precio de venta debe ser un número positivo mayor que 0.');
    }
    if (editForm.originalPrice !== undefined && editForm.originalPrice !== null && editForm.originalPrice !== 0 && editForm.originalPrice < (editForm.price || 0)) {
      errors.push('El precio original (tachado) debe ser mayor o igual al precio de venta.');
    }
    if (editForm.stock === undefined || editForm.stock === null || isNaN(editForm.stock) || editForm.stock < 0) {
      errors.push('Las unidades en stock no pueden ser negativas.');
    }
    if (!editForm.description || editForm.description.trim().length < 10) {
      errors.push('La descripción es requerida y debe contener al menos 10 caracteres.');
    }
    if (!editForm.category) {
      errors.push('Debes seleccionar una categoría.');
    }

    // Validate colors/flavors list
    if (!editForm.colors || editForm.colors.length === 0) {
      errors.push('Debes definir al menos una edición o sabor (con su color hex).');
    } else {
      editForm.colors.forEach((c, idx) => {
        if (!c.name || c.name.trim() === '') {
          errors.push(`El sabor/edición #${idx + 1} requiere un nombre.`);
        }
        if (!c.hex || !c.hex.startsWith('#')) {
          errors.push(`El color hexadecimal del sabor #${idx + 1} debe iniciar con "#" (ej. #FF0000).`);
        }
      });
    }

    if (errors.length > 0) {
      alert("Errores de Validación:\n\n" + errors.map((err, idx) => `${idx + 1}. ${err}`).join('\n'));
      return;
    }

    const finalProduct: Product = {
      id: editForm.id || 'prod-' + Date.now(),
      name: (editForm.name || '').trim(),
      brand: (editForm.brand || 'Importado').trim(),
      category: editForm.category || 'vapers',
      categoryLabel: editForm.categoryLabel || 'Vapers',
      price: Number(editForm.price),
      originalPrice: editForm.originalPrice ? Number(editForm.originalPrice) : undefined,
      rating: editForm.rating || 5.0,
      reviewsCount: editForm.reviewsCount || 1,
      description: (editForm.description || '').trim(),
      image: (editForm.image || '').trim(),
      features: editForm.features || ['Sabor premium de larga duración', 'Diseño ergonómico y portátil'],
      colors: editForm.colors || [{ name: 'Estándar', hex: '#7B52DE', image: '' }],
      puffs: editForm.puffs ? Number(editForm.puffs) : undefined,
      nicotine: editForm.nicotine ? String(editForm.nicotine).trim() : undefined,
      battery: editForm.battery ? String(editForm.battery).trim() : undefined,
      capacity: editForm.capacity ? String(editForm.capacity).trim() : undefined,
      stock: Number(editForm.stock),
      isAvailable: editForm.isAvailable !== false,
      isPopular: !!editForm.isPopular,
      isNew: !!editForm.isNew,
      reviews: editForm.reviews || []
    };

    setIsAdminSaving(true);
    try {
      await setDoc(doc(db, 'products', finalProduct.id), finalProduct);
      if (shouldKeepOpen) {
        const nextId = 'prod-' + Date.now();
        setEditingId(nextId);
        setEditForm({
          ...editForm,
          id: nextId,
          name: '',
          colors: [{ name: 'Nuevo Sabor', hex: '#7B52DE', image: '' }]
        });
      } else {
        setEditingId(null);
        setEditForm({});
      }
    } catch (err) {
      console.error('Error saving product:', err);
      handleFirestoreError(err, OperationType.WRITE, `products/${finalProduct.id}`);
    } finally {
      setIsAdminSaving(false);
    }
  }, [editForm, isAdminSaving]);

  const handleDeleteProduct = useCallback(async (id: string) => {
    if (isAdminSaving) return;
    if (confirm('¿Estás seguro de que deseas eliminar este producto permanentemente del catálogo?')) {
      setIsAdminSaving(true);
      try {
        await deleteDoc(doc(db, 'products', id));
        if (editingId === id) {
          setEditingId(null);
          setEditForm({});
        }
      } catch (err) {
        console.error('Error deleting product:', err);
        handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
      } finally {
        setIsAdminSaving(false);
      }
    }
  }, [editingId, isAdminSaving]);

  const handleResetToDefaults = useCallback(async () => {
    if (isAdminSaving) return;
    if (confirm('¿Deseas restablecer todos los productos a los valores iniciales de fábrica? Esto eliminará tus ediciones actuales.')) {
      setIsAdminSaving(true);
      try {
        const colRef = collection(db, 'products');
        const snapshot = await getDocs(colRef);
        // Delete all current docs
        for (const docSnap of snapshot.docs) {
          await deleteDoc(docSnap.ref);
        }
        // Seed default products with isAvailable explicitly set to true
        for (const item of PRODUCTS) {
          const seedItem = { ...item, isAvailable: item.isAvailable !== false };
          await setDoc(doc(db, 'products', item.id), seedItem);
        }
        setEditingId(null);
        setEditForm({});
      } catch (err) {
        console.error('Error resetting products:', err);
        handleFirestoreError(err, OperationType.DELETE, 'products');
      } finally {
        setIsAdminSaving(false);
      }
    }
  }, [isAdminSaving]);

  const handleAddReview = async (productId: string, newReview: Review) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const updatedReviews = [newReview, ...(product.reviews || [])];
    const updatedProduct = {
      ...product,
      reviews: updatedReviews,
      reviewsCount: updatedReviews.length,
      rating: Number((updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length).toFixed(1))
    };

    try {
      await setDoc(doc(db, 'products', productId), updatedProduct);
    } catch (err) {
      console.error('Error adding review:', err);
      handleFirestoreError(err, OperationType.WRITE, `products/${productId}`);
    }
  };

  // FILTER & SORT INTERACTION
  const filteredProducts = products.filter((product) => {
    // Hide inactive products from customer catalog
    if (product.isAvailable === false) return false;
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesBrand = selectedBrand === 'Todos' || product.brand === selectedBrand;
    return matchesCategory && matchesBrand;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    // Default to popular rating logic
    return b.rating - a.rating;
  });

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (!isAgeVerified) {
    return <AgeVerificationGate onVerified={() => setIsAgeVerified(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#07050f] text-[#F0F0F0] flex flex-col font-sans select-none selection:bg-[#7B52DE] selection:text-white relative overflow-hidden">
      
      {/* BACKGROUND WATERMARK */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden h-[90vh]">
        <h1 className="text-[180px] sm:text-[280px] md:text-[380px] font-black text-white/[0.02] leading-none pointer-events-none tracking-tighter select-none uppercase">
          WAVE
        </h1>
      </div>
      
      {/* HEADER NAVBAR */}
      <Header
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
        products={products}
      />

      {/* FLYING CART PARTICLES CANVAS PORT */}
      {flyingParticles.map((pt) => (
        <div
          key={pt.id}
          className="animate-fly"
          style={{
            left: pt.x - 12,
            top: pt.y - 12,
          }}
        />
      ))}

      {/* HERO HERO SECTION */}
      <Hero
        onExploreClick={scrollToCatalog}
        onWhatsAppConsult={handleSendWhatsApp}
        promoProduct={products.find(p => p.id === 'lemonade-premium-destilado-combo') || products[0] || null}
        onPromoClick={(prod) => setSelectedProduct(prod)}
      />

      {/* WAVE PUFF NEON MARQUEE TICKER */}
      <div className="h-12 w-full bg-[#7B52DE]/15 border-y border-[#7B52DE]/20 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.25em] text-[#A78BFA]">
        <marquee scrollamount="8">
          LOS MEJORES EN CTG, NO ESPERES MAS Y PIDE EL TUYO.
        </marquee>
      </div>

      {/* DYNAMIC CATALOG INTERACTIVE SHOWCASE */}
      <main id="catalog-anchor" className="flex-grow py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* CATALOG TITLE ZONE */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#A78BFA]">
              Wave Puff Curated Menu
            </span>
            <h2 className="mt-1 text-3xl font-black uppercase text-white tracking-tight sm:text-4xl">
              Nuestra Colección
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-md">
              Explora nuestra refinada selección de dispositivos de caladas ilimitadas, pods graduados y e-liquids importados.
            </p>
          </div>

          {/* Sorter selectors and controls layout */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-none border border-[#7B52DE]/20 bg-[#7B52DE]/10 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-[#A78BFA]">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#A78BFA]" />
              <span>Filtrar</span>
            </div>

            {/* Brand filter picker dropdown selector */}
            <div className="relative">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="appearance-none rounded-none border border-white/10 bg-white/5 py-2.5 pl-4 pr-10 text-[10px] uppercase font-black tracking-widest text-white outline-none cursor-pointer transition-colors focus:border-[#7B52DE]"
              >
                {derivedBrands.map((brand) => (
                  <option key={brand} value={brand} className="bg-[#050505] text-white">
                    Marca: {brand}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-white/40">
                <ChevronDown className="h-3 w-3" />
              </div>
            </div>

            {/* Sorting control */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none rounded-none border border-white/10 bg-white/5 py-2.5 pl-4 pr-10 text-[10px] uppercase font-black tracking-widest text-white outline-none cursor-pointer transition-colors focus:border-[#7B52DE]"
              >
                <option value="popular" className="bg-[#050505] text-white">Popularidad</option>
                <option value="price-asc" className="bg-[#050505] text-white">Precio: Menor a Mayor</option>
                <option value="price-desc" className="bg-[#050505] text-white">Precio: Mayor a Menor</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-[#7B52DE]">
                <ArrowUpDown className="h-3.5 w-3.5 text-[#7B52DE]" />
              </div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE CATEGORY FILTER TABS */}
        <div className="mt-8 flex flex-wrap gap-2">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-6 py-3 text-xs font-black uppercase tracking-[0.2em] transition-all duration-200 focus:outline-none cursor-pointer ${
                selectedCategory === tab.id
                  ? 'bg-[#7B52DE] text-white shadow-lg shadow-[#7B52DE]/10'
                  : 'border border-white/10 bg-white/5 text-white/50 hover:border-[#7B52DE] hover:text-white'
              }`}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* PRODUCTS DIRECT DYNAMIC GRID */}
        <div className="mt-8">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onSelectProduct={(prod) => setSelectedProduct(prod)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 py-16 px-4 text-center">
              <span className="text-3xl">🏜️</span>
              <h3 className="mt-4 text-base font-bold uppercase tracking-wider text-white">No se acoplaron Vapers</h3>
              <p className="mt-2 text-xs text-slate-400 max-w-sm mx-auto">
                No tenemos ningún producto que rinda con la combinación de filtros de marca <span className="text-[#A78BFA]">"{selectedBrand}"</span> en la categoría elegida. Prueba reiniciando filtros.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedBrand('Todos');
                }}
                className="mt-6 rounded-full border border-white/10 bg-slate-900 px-6 py-2.5 text-xs font-bold text-white transition-all hover:bg-slate-800"
              >
                Restaurar Categorías
              </button>
            </div>
          )}
        </div>

      </main>

      {/* POLICY & DOCUMENTATION ACCORDIONS */}
      <FAQSection />

      {/* FLOATING ACTION MESSENGER CONTROLLER */}
      <WhatsAppButton onSendWhatsApp={handleSendWhatsApp} />

      {/* CART OVERLAY SLIDE-OUT DRAWER */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onSendWhatsApp={handleSendWhatsApp}
        products={products}
      />

      {/* PRODUCT EXPAND AREA MODAL */}
      {selectedProduct && (() => {
        const liveProduct = products.find(p => p.id === selectedProduct.id) || selectedProduct;
        return (
          <ProductDetailsModal
            product={liveProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
            onSendWhatsApp={handleSendWhatsApp}
            onAddReview={handleAddReview}
          />
        );
      })()}

      {/* FOOTER CONTAINER */}
      <footer className="mt-auto border-t border-white/10 bg-[#07050f] py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            
            <div className="md:col-span-2">
              <div className="flex items-center gap-4">
                <div className="relative flex h-24 w-24 items-center justify-center transition-all duration-300 hover:scale-115 hover:rotate-3 group/footer-logo">
                  <Logo showText={false} className="object-contain w-full h-full filter drop-shadow-[0_0_20px_rgba(123,82,222,0.7)] group-hover/footer-logo:drop-shadow-[0_0_30px_rgba(167,139,250,0.9)] transition-all duration-300" />
                </div>
                <div className="flex flex-col">
                  <span className="font-sans text-3xl sm:text-4xl font-black uppercase tracking-wider text-white leading-none flex items-center gap-1">
                    <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Wave</span>
                    <span className="bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-purple-400 bg-clip-text text-transparent font-black drop-shadow-[0_0_20px_rgba(167,139,250,0.5)]">Puff</span>
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.2em] text-[#A78BFA] uppercase mt-1 font-extrabold">
                    Premium Vapor
                  </span>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-400 max-w-sm">
                Wave Puff es una tienda boutique online dedicada al suministro exclusivo de cigarrillos electrónicos y accesorios originales. Garantizamos trazabilidad mediante sellos holográficos verificables de fábrica.
              </p>
              <div className="mt-6 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">
                  Atención Directa 2026 Wave Puff Corp.
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-white">Advertencia de Salud</h4>
              <div className="mt-4 rounded-xl border border-red-500/10 bg-red-500/5 p-3.5">
                <span className="font-mono text-[8px] font-black uppercase text-red-400 tracking-widest">PROHIBIDA VENTA A MENORES</span>
                <p className="mt-1 text-[10px] text-slate-400 leading-snug">
                  Los dispositivos distribuidos contienen nicotina, la cual es altamente adictiva. Producto de uso exclusivo para mayores de 18 años.
                </p>
              </div>
            </div>

          </div>

          <div className="mt-12 border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} Wave Puff. Todos los derechos reservados. Desarrollado con tecnología ultra-fresca.</p>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-1.5 text-slate-500 hover:text-[#A78BFA] transition-colors cursor-pointer bg-white/5 px-2.5 py-1.5 border border-white/10 text-[9px] font-mono tracking-wider uppercase"
              type="button"
            >
              <Lock className="h-3 w-3" />
              <span>Acceso Administrador</span>
            </button>
          </div>
        </div>
      </footer>

      {/* ADMIN WORKSPACE SYSTEM PANEL MODAL */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-6xl border border-white/10 bg-[#0c0a1a] p-6 shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-[#A78BFA] animate-pulse" />
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    Panel de Administración Wave Puff
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">Modifica precios, fotos, unidades de stock y descripciones.</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsAdminOpen(false);
                  setIsAdminVerified(false);
                  setEditingId(null);
                  setEditForm({});
                }}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sync Error Alert Banner */}
            {syncError && (
              <div className="mb-4 bg-red-500/10 border border-red-500/20 px-4 py-2 flex items-center gap-2 text-red-400 font-mono text-xs">
                <AlertCircle className="h-4 w-4 shrink-0 animate-bounce" />
                <span className="flex-1"><strong>Sincronización:</strong> {syncError}</span>
                <button 
                  onClick={() => setSyncError(null)}
                  className="text-[10px] uppercase font-black tracking-wider hover:text-white cursor-pointer px-1.5 py-0.5 border border-red-500/30 bg-red-500/5"
                >
                  Omitir
                </button>
              </div>
            )}

            {/* Admin Verification Input View */}
            {!isAdminVerified ? (
              <div className="flex flex-col items-center justify-center py-12 max-w-md mx-auto w-full text-center">
                <div className="h-12 w-12 rounded-full bg-[#7B52DE]/10 flex items-center justify-center border border-[#7B52DE]/30 mb-4 text-[#A78BFA]">
                  <Lock className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-black uppercase tracking-wider text-white font-bold">Código de Administrador Requerido</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Por favor introduce la contraseña para verificar tu identidad y realizar ediciones.
                </p>

                <div className="mt-6 w-full relative">
                  <input
                    type="password"
                    placeholder="Contraseña de Administrador"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      setAdminError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (verifyAdminPassword(adminPassword)) {
                          setIsAdminVerified(true);
                          sessionStorage.setItem('wave_puff_admin_verified', 'true');
                        } else {
                          setAdminError('Contraseña incorrecta. Intente de nuevo.');
                        }
                      }
                    }}
                    className="w-full rounded-none border border-white/10 bg-black/60 px-4 py-3 text-xs text-white text-center outline-none focus:border-[#7B52DE]"
                    autoFocus
                  />
                  {adminError && (
                    <div className="mt-2 text-xs text-red-400 font-mono flex items-center gap-1 justify-center">
                      <AlertCircle className="h-3 w-3" />
                      <span>{adminError}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-3 w-full">
                  <button
                    onClick={() => {
                      if (verifyAdminPassword(adminPassword)) {
                        setIsAdminVerified(true);
                        sessionStorage.setItem('wave_puff_admin_verified', 'true');
                      } else {
                        setAdminError('Contraseña incorrecta. Intente de nuevo.');
                      }
                    }}
                    className="flex-1 bg-[#7B52DE] hover:bg-[#8B5CF6] text-white py-2.5 text-xs font-black uppercase tracking-widest cursor-pointer"
                  >
                    Ingresar
                  </button>
                  <button
                    onClick={() => setIsAdminOpen(false)}
                    className="flex-1 border border-white/10 hover:border-white/20 text-slate-300 py-2.5 text-xs font-black uppercase tracking-widest cursor-pointer"
                  >
                    Salir
                  </button>
                </div>
              </div>
            ) : (
              /* Verified Workspace Panel View */
              <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-6 min-h-[400px]">
                
                {/* Product List Selector Column */}
                <div className="w-full md:w-5/12 flex flex-col border-r border-white/5 pr-0 md:pr-6 overflow-hidden max-h-[450px] md:max-h-[50vh]">
                  <div className="flex items-center justify-between mb-3 shrink-0">
                    <div className="flex flex-col">
                      <span className="text-xs font-mono font-bold uppercase text-[#A78BFA] tracking-wider">Dispositivos ({products.length})</span>
                      <span className="text-[8px] text-slate-500 font-mono">Haz clic en el estado para alternarlo rápido</span>
                    </div>
                    <button
                      onClick={startCreating}
                      className="flex items-center gap-1 rounded bg-[#7B52DE]/20 hover:bg-[#7B52DE]/30 border border-[#7B52DE]/30 px-2 py-1 text-[9px] font-black text-white uppercase cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Agregar</span>
                    </button>
                  </div>

                  {/* Search filter input */}
                  <div className="relative mb-3 shrink-0">
                    <input
                      type="text"
                      placeholder="Buscar producto por nombre o marca..."
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                      className="w-full rounded-none border border-white/10 bg-black/40 pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-[#7B52DE]"
                    />
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                    {adminSearch && (
                      <button
                        onClick={() => setAdminSearch('')}
                        className="absolute right-2.5 top-1.5 text-slate-400 hover:text-white text-[10px] font-mono cursor-pointer"
                      >
                        [limpiar]
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 flex-grow overflow-y-auto pr-1">
                    {products
                      .filter((p) => {
                        if (!adminSearch.trim()) return true;
                        const query = adminSearch.toLowerCase();
                        return p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query);
                      })
                      .map((p) => {
                        const isCurrentlyActive = p.isAvailable !== false;
                        const hasStock = p.stock > 0;
                        
                        let badgeText = 'Disponible';
                        let badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20';
                        let badgeTitle = 'Activo y con stock. Haz clic para agotarlo (Stock 0)';

                        if (!isCurrentlyActive) {
                          badgeText = 'Inactivo';
                          badgeStyle = 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20 hover:bg-zinc-500/20';
                          badgeTitle = 'Oculto en el catálogo. Haz clic para activar (Stock 15)';
                        } else if (!hasStock) {
                          badgeText = 'Agotado';
                          badgeStyle = 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20';
                          badgeTitle = 'Activo pero sin stock. Haz clic para abastecer (Stock 15)';
                        }

                        return (
                          <div 
                            key={p.id}
                            onClick={() => !isAdminSaving && startEditing(p)}
                            className={`p-3 border transition-colors flex items-center justify-between gap-3 ${isAdminSaving ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${editingId === p.id ? 'border-[#7B52DE] bg-[#7B52DE]/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              {/* Tiny image thumbnail */}
                              <div className="h-8 w-8 rounded-none bg-black border border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                                {p.image ? (
                                  <img src={p.image} alt="" className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                                ) : (
                                  <span className="text-[9px] text-slate-600 font-mono">PUFF</span>
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <h5 className="text-xs font-black text-white truncate uppercase tracking-wide">{p.name}</h5>
                                <div className="flex items-center flex-wrap gap-2 mt-1 font-mono text-[9px] text-slate-400">
                                  <span>Stock: <strong className={p.stock <= 5 ? 'text-amber-500' : 'text-white'}>{p.stock}</strong></span>
                                  <span>·</span>
                                  <span className="text-[#A78BFA]">${p.price.toLocaleString('es-CO')}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Quick Actions & Status */}
                            <div className="flex items-center gap-2 shrink-0">
                              {/* Inventory status toggler badge */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleProductAvailability(p.id);
                                }}
                                disabled={isAdminSaving}
                                title={badgeTitle}
                                className={`px-2 py-0.5 text-[8px] font-bold uppercase border cursor-pointer select-none transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${badgeStyle}`}
                              >
                                {badgeText}
                              </button>

                              <div className="flex items-center gap-0.5">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startEditing(p);
                                  }}
                                  disabled={isAdminSaving}
                                  title="Editar"
                                  className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteProduct(p.id);
                                  }}
                                  disabled={isAdminSaving}
                                  title="Eliminar"
                                  className="p-1 text-slate-400 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* FACTORY RESET TRIGGER */}
                  <div className="mt-4 pt-4 border-t border-white/5 shrink-0">
                    <button
                      onClick={handleResetToDefaults}
                      disabled={isAdminSaving}
                      className="w-full flex items-center justify-center gap-1.5 border border-red-500/15 bg-red-500/5 hover:bg-red-500/10 text-red-400 py-2.5 text-[9px] font-mono tracking-widest uppercase cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAdminSaving ? (
                        <Loader2 className="h-3 w-3 animate-spin text-red-400" />
                      ) : (
                        <RotateCcw className="h-3 w-3" />
                      )}
                      <span>{isAdminSaving ? 'Restableciendo...' : 'Restablecer Todo de Fábrica'}</span>
                    </button>
                  </div>
                </div>

                {/* Editor form panel */}
                <div className="flex-1 flex flex-col border-t border-white/5 md:border-t-0 pt-6 md:pt-0 overflow-y-auto max-h-[500px] md:max-h-[50vh]">
                  {editingId ? (
                    <div className="space-y-4 pr-1">
                      <div className="flex flex-col gap-2 border-b border-white/5 pb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-[#A78BFA] uppercase tracking-widest">
                            {products.find(p => p.id === editForm.id) ? 'Editando Datos de Producto' : 'Creando Producto Nuevo'}
                          </span>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditForm({});
                            }}
                            className="border border-white/10 hover:border-white/20 text-slate-300 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider cursor-pointer"
                          >
                            Cerrar
                          </button>
                        </div>

                        {/* ACTION BUTTONS GRID */}
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <button
                            onClick={() => handleSaveProduct(false)}
                            disabled={isAdminSaving}
                            className="flex items-center gap-1.5 bg-[#7B52DE] hover:bg-[#8B5CF6] text-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wider cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isAdminSaving ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Save className="h-3 w-3" />
                            )}
                            <span>Guardar y Cerrar</span>
                          </button>

                          {!products.find(p => p.id === editForm.id) && (
                            <button
                              onClick={() => handleSaveProduct(true)}
                              disabled={isAdminSaving}
                              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wider cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Guarda este producto y prepara el formulario para agregar otro en la misma categoría ágilmente"
                            >
                              {isAdminSaving ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Sparkles className="h-3 w-3 text-emerald-300" />
                              )}
                              <span>Guardar y Agregar Otro</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* TEMPLATE QUICK LOAD SELECTOR PANEL */}
                      {!products.find(p => p.id === editForm.id) && (
                        <div className="bg-[#7B52DE]/10 border border-[#7B52DE]/20 p-3 rounded-none flex flex-col sm:flex-row items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4.5 w-4.5 text-[#A78BFA] shrink-0 animate-pulse" />
                            <div>
                              <span className="text-[10px] font-mono font-black text-white uppercase tracking-wider block">⚡ ¿Agregar rápido? Cargar Plantilla</span>
                              <span className="text-[8px] font-mono text-slate-400 block">Pre-rellena el vaper, cápsula o batería con datos promedio en 1 click.</span>
                            </div>
                          </div>
                          <select
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '') return;
                              const t = ADMIN_TEMPLATES[Number(val)];
                              if (!t) return;
                              setEditForm({
                                ...editForm,
                                name: t.name,
                                brand: t.brand,
                                category: t.category,
                                categoryLabel: t.categoryLabel,
                                price: t.price,
                                originalPrice: t.originalPrice,
                                stock: t.stock,
                                puffs: t.puffs,
                                nicotine: t.nicotine,
                                battery: t.battery,
                                capacity: t.capacity,
                                description: t.description,
                                features: [...t.features],
                                colors: JSON.parse(JSON.stringify(t.colors)),
                                isAvailable: true,
                                isNew: true
                              });
                            }}
                            className="text-[9px] font-mono font-black uppercase tracking-widest bg-[#0c0a1a] text-white border border-[#7B52DE]/30 px-3 py-1.5 outline-none focus:border-[#8B5CF6] cursor-pointer"
                            defaultValue=""
                          >
                            <option value="">-- CARGAR PLANTILLA --</option>
                            {ADMIN_TEMPLATES.map((t, idx) => (
                              <option key={idx} value={idx}>{t.name} ({t.brand})</option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1.5">Nombre del Producto *</label>
                          <input
                            type="text"
                            value={editForm.name || ''}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full rounded-none border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-[#7B52DE]"
                            placeholder="Ej. WAKA TRIPLE MANGO 10K"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1.5">Marca *</label>
                          <input
                            type="text"
                            value={editForm.brand || ''}
                            onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                            className="w-full rounded-none border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-[#7B52DE]"
                            placeholder="Ej. Waka, Ease, Importado"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1.5">Precio de Venta ($ COP) *</label>
                          <input
                            type="number"
                            value={editForm.price || 0}
                            onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                            className="w-full rounded-none border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-[#7B52DE]"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1.5">Precio Original / Tachado ($ COP)</label>
                          <input
                            type="number"
                            value={editForm.originalPrice || 0}
                            onChange={(e) => setEditForm({ ...editForm, originalPrice: Number(e.target.value) })}
                            className="w-full rounded-none border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-[#7B52DE]"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1.5">Unidades en Stock *</label>
                          <input
                            type="number"
                            value={editForm.stock || 0}
                            onChange={(e) => {
                              const newStock = Number(e.target.value);
                              setEditForm({
                                ...editForm,
                                stock: newStock
                              });
                            }}
                            className="w-full rounded-none border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-[#7B52DE]"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1.5">Categoría *</label>
                          <select
                            value={editForm.category || 'vapers'}
                            onChange={(e) => {
                              const val = e.target.value as any;
                              const labelMap: Record<string, string> = {
                                vapers: 'Vapers',
                                capsulas: 'Cápsulas',
                                baterias: 'Baterías'
                              };
                              setEditForm({ ...editForm, category: val, categoryLabel: labelMap[val] });
                            }}
                            className="w-full rounded-none border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none focus:border-[#7B52DE]"
                          >
                            <option value="vapers">Vapers (Cigarrillo)</option>
                            <option value="capsulas">Cápsulas / Pods</option>
                            <option value="baterias">Baterías / Dispositivo</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1.5">Descripción del Producto *</label>
                        <textarea
                          rows={3}
                          value={editForm.description || ''}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="w-full rounded-none border border-white/10 bg-black/40 p-3 text-xs text-white outline-none focus:border-[#7B52DE]"
                          placeholder="Introduce descripciones detalladas del funcionamiento y sabores..."
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest">URL de la Foto o Imagen Base64</label>
                          <span className="text-[8px] text-[#A78BFA] font-mono">Pega link o código base64</span>
                        </div>
                        <textarea
                          rows={2}
                          value={editForm.image || ''}
                          onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                          className="w-full rounded-none border border-white/10 bg-black/40 p-3 text-xs text-white font-mono outline-none focus:border-[#7B52DE]"
                          placeholder="Pega la URL de la imagen ej. https://... o un Base64..."
                        />
                        {editForm.image && (
                          <div className="mt-2 flex items-center gap-3 bg-white/5 border border-white/10 p-2">
                            <span className="text-[9px] font-mono text-slate-400">Vista Previa:</span>
                            <div className="h-10 w-10 overflow-hidden bg-black flex items-center justify-center border border-white/10">
                              {editForm.image.includes('.') || editForm.image.includes('/') || editForm.image.startsWith('data:') ? (
                                <img src={editForm.image} alt="preview" className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="h-6 w-6 rounded-full" style={{ background: editForm.image }} />
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* BADGES & STOCK AVAILABILITY TOGGLES */}
                      <div className="flex flex-wrap gap-4 pt-2 pb-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none bg-white/[0.02] border border-white/10 px-3 py-2" title="Desactivar oculta el producto del catálogo principal o lo muestra como agotado">
                          <input
                            type="checkbox"
                            checked={editForm.isAvailable !== false}
                            onChange={(e) => {
                              setEditForm({
                                ...editForm,
                                isAvailable: e.target.checked
                              });
                            }}
                            className="rounded-none border-white/10 accent-[#7B52DE]"
                          />
                          <span className="text-[10px] font-mono font-black text-white uppercase tracking-widest">Habilitado en Catálogo</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none bg-white/[0.02] border border-white/10 px-3 py-2">
                          <input
                            type="checkbox"
                            checked={editForm.isPopular || false}
                            onChange={(e) => setEditForm({ ...editForm, isPopular: e.target.checked })}
                            className="rounded-none border-white/10 accent-[#7B52DE]"
                          />
                          <span className="text-[10px] font-mono font-black text-white uppercase tracking-widest">Sabor Popular (Badge)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none bg-white/[0.02] border border-white/10 px-3 py-2">
                          <input
                            type="checkbox"
                            checked={editForm.isNew || false}
                            onChange={(e) => setEditForm({ ...editForm, isNew: e.target.checked })}
                            className="rounded-none border-white/10 accent-[#7B52DE]"
                          />
                          <span className="text-[10px] font-mono font-black text-white uppercase tracking-widest">Producto Nuevo (Badge)</span>
                        </label>
                      </div>

                      {/* FLAVORS / EDITIONS MANAGER */}
                      <div className="border-t border-white/5 pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-[10px] font-mono font-black text-slate-300 uppercase tracking-widest">Sabores / Ediciones Disponibles *</label>
                          <button
                            type="button"
                            onClick={() => {
                              const currentColors = editForm.colors || [];
                              setEditForm({
                                ...editForm,
                                colors: [...currentColors, { name: 'Nuevo Sabor', hex: '#7B52DE', image: '' }]
                              });
                            }}
                            className="flex items-center gap-1 rounded bg-[#7B52DE]/20 hover:bg-[#7B52DE]/30 border border-[#7B52DE]/30 px-2 py-1 text-[9px] font-black text-white uppercase cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Agregar Sabor</span>
                          </button>
                        </div>
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                          {(editForm.colors || []).map((color, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-2 bg-white/[0.02] border border-white/5 p-2 items-center">
                              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <input
                                  type="text"
                                  placeholder="Nombre del Sabor"
                                  value={color.name}
                                  onChange={(e) => {
                                    const updatedColors = [...(editForm.colors || [])];
                                    updatedColors[idx] = { ...color, name: e.target.value };
                                    setEditForm({ ...editForm, colors: updatedColors });
                                  }}
                                  className="w-full rounded-none border border-white/10 bg-black/40 px-2 py-1 text-xs text-white outline-none focus:border-[#7B52DE]"
                                />
                                <div className="flex items-center gap-1.5 w-full">
                                  <input
                                    type="color"
                                    value={color.hex.startsWith('#') && color.hex.length === 7 ? color.hex : '#7B52DE'}
                                    onChange={(e) => {
                                      const updatedColors = [...(editForm.colors || [])];
                                      updatedColors[idx] = { ...color, hex: e.target.value };
                                      setEditForm({ ...editForm, colors: updatedColors });
                                    }}
                                    className="w-8 h-6 bg-transparent border-none cursor-pointer shrink-0"
                                  />
                                  <input
                                    type="text"
                                    placeholder="#HEX (ej. #7B52DE)"
                                    value={color.hex}
                                    onChange={(e) => {
                                      const updatedColors = [...(editForm.colors || [])];
                                      updatedColors[idx] = { ...color, hex: e.target.value };
                                      setEditForm({ ...editForm, colors: updatedColors });
                                    }}
                                    className="flex-1 rounded-none border border-white/10 bg-black/40 px-2 py-1 text-xs text-white outline-none focus:border-[#7B52DE]"
                                  />
                                </div>
                                <input
                                  type="text"
                                  placeholder="URL Foto individual (Opcional)"
                                  value={color.image || ''}
                                  onChange={(e) => {
                                    const updatedColors = [...(editForm.colors || [])];
                                    updatedColors[idx] = { ...color, image: e.target.value };
                                    setEditForm({ ...editForm, colors: updatedColors });
                                  }}
                                  className="w-full rounded-none border border-white/10 bg-black/40 px-2 py-1 text-xs text-white outline-none focus:border-[#7B52DE]"
                                />
                              </div>
                              <button
                                type="button"
                                disabled={(editForm.colors || []).length <= 1}
                                onClick={() => {
                                  const updatedColors = (editForm.colors || []).filter((_, i) => i !== idx);
                                  setEditForm({ ...editForm, colors: updatedColors });
                                }}
                                className="text-slate-400 hover:text-red-400 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors cursor-pointer p-1"
                                title="Eliminar Sabor"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* FEATURES BULLET POINTS MANAGER */}
                      <div className="border-t border-white/5 pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-[10px] font-mono font-black text-slate-300 uppercase tracking-widest">Características Clave (Bullet Points)</label>
                          <button
                            type="button"
                            onClick={() => {
                              const currentFeatures = editForm.features || [];
                              setEditForm({
                                ...editForm,
                                features: [...currentFeatures, 'Nueva característica premium']
                              });
                            }}
                            className="flex items-center gap-1 rounded bg-[#7B52DE]/20 hover:bg-[#7B52DE]/30 border border-[#7B52DE]/30 px-2 py-1 text-[9px] font-black text-white uppercase cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Agregar Característica</span>
                          </button>
                        </div>
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                          {(editForm.features || []).map((feat, idx) => (
                            <div key={idx} className="flex gap-2 bg-white/[0.02] border border-white/5 p-2 items-center">
                              <input
                                type="text"
                                placeholder="Describa la característica..."
                                value={feat}
                                onChange={(e) => {
                                    const updatedFeats = [...(editForm.features || [])];
                                    updatedFeats[idx] = e.target.value;
                                    setEditForm({ ...editForm, features: updatedFeats });
                                }}
                                className="flex-1 rounded-none border border-white/10 bg-black/40 px-2 py-1 text-xs text-white outline-none focus:border-[#7B52DE]"
                              />
                              <button
                                type="button"
                                disabled={(editForm.features || []).length <= 1}
                                onClick={() => {
                                  const updatedFeats = (editForm.features || []).filter((_, i) => i !== idx);
                                  setEditForm({ ...editForm, features: updatedFeats });
                                }}
                                className="text-slate-400 hover:text-red-400 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors cursor-pointer p-1"
                                title="Eliminar Característica"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* EXTRA DETAILED SPECIFICATIONS (PUFFS, NICOTINE, ETC) */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/5">
                        <div>
                          <label className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest mb-1">Duración (Puffs)</label>
                          <input
                            type="number"
                            placeholder="Ej. 10000"
                            value={editForm.puffs || ''}
                            onChange={(e) => setEditForm({ ...editForm, puffs: e.target.value ? Number(e.target.value) : undefined })}
                            className="w-full rounded-none border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-white outline-none focus:border-[#7B52DE]"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest mb-1">Nicotina</label>
                          <input
                            type="text"
                            placeholder="Ej. 5% o 0%"
                            value={editForm.nicotine || ''}
                            onChange={(e) => setEditForm({ ...editForm, nicotine: e.target.value })}
                            className="w-full rounded-none border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-white outline-none focus:border-[#7B52DE]"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest mb-1">Batería</label>
                          <input
                            type="text"
                            placeholder="Ej. 650mAh"
                            value={editForm.battery || ''}
                            onChange={(e) => setEditForm({ ...editForm, battery: e.target.value })}
                            className="w-full rounded-none border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-white outline-none focus:border-[#7B52DE]"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest mb-1">Capacidad</label>
                          <input
                            type="text"
                            placeholder="Ej. 18ml"
                            value={editForm.capacity || ''}
                            onChange={(e) => setEditForm({ ...editForm, capacity: e.target.value })}
                            className="w-full rounded-none border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-white outline-none focus:border-[#7B52DE]"
                          />
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 border border-dashed border-white/10 rounded-lg">
                      <Settings className="h-8 w-8 text-slate-600 mb-2 animate-pulse" />
                      <h5 className="text-xs font-black uppercase text-white mb-1">Editor de Productos</h5>
                      <p className="text-[11px] max-w-sm leading-relaxed">
                        Selecciona un dispositivo para editar sus textos, precios, stock o imágenes de sabores. O haz clic en "Agregar" para crear uno nuevo.
                      </p>
                      <button
                        onClick={startCreating}
                        className="mt-4 flex items-center gap-1.5 bg-[#7B52DE]/20 border border-[#7B52DE]/30 hover:bg-[#7B52DE]/30 px-4 py-2 text-xs font-black text-white uppercase cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Crear Nuevo</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Panel footer operations */}
            {isAdminVerified && (
              <div className="border-t border-white/10 mt-6 pt-4 flex justify-between items-center gap-4 shrink-0">
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                  <Unlock className="h-3.5 w-3.5 animate-pulse" />
                  <span>Sesión Autorizada Exitosamente</span>
                </div>
                <button
                  onClick={() => {
                    setIsAdminOpen(false);
                    setIsAdminVerified(false);
                    setEditingId(null);
                    setEditForm({});
                  }}
                  className="bg-[#120f26] border border-white/10 hover:border-white/20 text-white px-6 py-2.5 text-xs font-black uppercase tracking-widest cursor-pointer transition-colors"
                >
                  Cerrar Panel
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
