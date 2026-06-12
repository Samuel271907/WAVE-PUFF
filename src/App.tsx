import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, ArrowUpDown, ChevronDown, CheckCircle, Smartphone, MapPin, Sparkles, Flame, Percent } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetailsModal from './components/ProductDetailsModal';
import CartSidebar from './components/CartSidebar';
import FAQSection from './components/FAQSection';
import WhatsAppButton from './components/WhatsAppButton';
import { Product, CartItem } from './types';
import { PRODUCTS, BRANDS } from './data';
import Logo from './components/Logo';
import AgeVerificationGate from './components/AgeVerificationGate';

export default function App() {
  // STATE MANAGEMENT
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(() => {
    return localStorage.getItem('wave_puff_age_verified') === 'true';
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('wave_puff_cart');
    return saved ? JSON.parse(saved) : [];
  });
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

  // FILTER & SORT INTERACTION
  const filteredProducts = PRODUCTS.filter((product) => {
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
                {BRANDS.map((brand) => (
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
      />

      {/* PRODUCT EXPAND AREA MODAL */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onSendWhatsApp={handleSendWhatsApp}
        />
      )}

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

          <div className="mt-12 border-t border-white/5 pt-8 text-center text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} Wave Puff. Todos los derechos reservados. Desarrollado con tecnología ultra-fresca.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
