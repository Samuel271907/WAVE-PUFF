import { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, Flame, Sparkles, X } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data';
import Logo from './Logo';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onSelectProduct: (product: Product) => void;
}

export default function Header({ cartCount, onOpenCart, onSelectProduct }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [logoError, setLogoError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.categoryLabel.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
    setSearchResults(filtered);
  }, [searchQuery]);

  // Close search auto-results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectResult = (product: Product) => {
    onSelectProduct(product);
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#050505]/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LOGO AREA */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-[45px] w-[45px] items-center justify-center border border-white/10 bg-[#151515] p-[2px] transition-transform duration-300 hover:rotate-6 overflow-hidden">
            <Logo showText={false} className="w-[45px] h-[45px]" />
            {/* Pulsing glow point matching logo purple theme */}
            <span className="absolute -top-1 -right-1 flex h-2 w-2 z-10">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A78BFA] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#7B52DE]"></span>
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="font-sans text-2xl font-black tracking-tighter uppercase text-white leading-none">
              Wave<span className="text-transparent" style={{ WebkitTextStroke: '1px #7B52DE' }}>Puff</span>
            </span>
            <span className="hidden font-mono text-[9px] tracking-[0.2em] text-[#A78BFA] uppercase sm:block mt-0.5 font-bold">
              Premium Vapor
            </span>
          </div>
        </div>

        {/* COMPACT INTUITIVE NAVIGATION */}
        <nav className="hidden lg:flex gap-8 text-[11px] font-black uppercase tracking-[0.25em] text-white/50">
          <a href="#catalog-anchor" className="hover:text-[#7B52DE] transition-colors">The Lab</a>
          <a href="#catalog-anchor" className="hover:text-[#7B52DE] transition-colors text-[#7B52DE]">Devices</a>
          <a href="#catalog-anchor" className="hover:text-[#7B52DE] transition-colors">Elixirs</a>
          <a href="#catalog-anchor" className="hover:text-[#7B52DE] transition-colors">VIP Club</a>
        </nav>

        {/* SEARCH WITH AUTOCOMPLETE */}
        <div ref={containerRef} className="relative mx-4 hidden max-w-md flex-1 md:block">
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar vaper, sales, sabores exclusivos..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              className="w-full rounded-none border border-white/10 bg-white/5 py-2.5 pr-10 pl-10 text-xs uppercase tracking-wider font-bold text-white outline-none transition-all placeholder:text-white/30 focus:border-[#7B52DE]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-3 flex items-center text-white/50 hover:text-[#7B52DE]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Autocomplete Results Overlay */}
          {showResults && searchQuery.trim() !== '' && (
            <div className="absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-none border border-white/15 bg-[#050505] p-2 shadow-2xl shadow-black/80 backdrop-blur-xl">
              <div className="px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-[#7B52DE]">
                Sugerencias ({searchResults.length})
              </div>
              <div className="max-h-80 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelectResult(product)}
                      className="flex w-full items-center gap-3 rounded-none p-2.5 text-left transition-colors hover:bg-white/5 border-b border-white/5 last:border-b-0"
                    >
                      {/* Product dynamic color block as representation */}
                      <div
                        className="h-10 w-10 shrink-0 rounded-none shadow-inner"
                        style={{ background: product.image }}
                      />
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <h4 className="truncate text-xs font-bold uppercase tracking-wide text-white">
                            {product.name}
                          </h4>
                          <span className="text-xs font-black text-[#7B52DE]">
                            ${product.price.toLocaleString('es-CO')}
                          </span>
                        </div>
                        <p className="truncate text-[10px] uppercase font-bold tracking-wider text-white/40">
                          {product.brand} · {product.categoryLabel}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-6 text-center text-xs text-white/50 uppercase font-bold tracking-widest">
                    No encontramos ningún vape para <span className="text-[#A78BFA]">"{searchQuery}"</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ACTIONS & NAVIGATION */}
        <div className="flex items-center gap-4">
          
          {/* Sabor exótico indicator */}
          <div className="hidden items-center gap-1.5 rounded-none border border-[#7B52DE]/30 bg-[#7B52DE]/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#7B52DE] lg:flex">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Envío Gratis &gt; $45.000</span>
          </div>

          {/* CART TRIGGER BUTTON */}
          <button
            id="open-cart-btn"
            onClick={onOpenCart}
            className="group relative flex h-10 w-10 items-center justify-center rounded-none border border-white/10 bg-[#050505] transition-all hover:border-[#7B52DE] hover:bg-white/5"
            aria-label="Abrir Carrito"
          >
            <ShoppingBag className="h-4.5 w-4.5 text-white/70 transition-colors group-hover:text-[#7B52DE]" />
            
            {/* Dynamic Animated item counter */}
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center bg-gradient-to-tr from-[#7B52DE] to-[#A78BFA] text-[9px] font-black text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH BAR */}
      <div className="border-t border-white/5 bg-[#050505] p-3 md:hidden">
        <div ref={containerRef} className="relative w-full">
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-3.5 w-3.5 text-white/40" />
            </div>
            <input
              type="text"
              placeholder="Buscar vapers, marcas..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              className="w-full rounded-none border border-white/10 bg-white/5 py-2 pr-10 pl-10 text-xs uppercase tracking-widest font-bold text-white placeholder:text-white/30 focus:border-[#7B52DE]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-3 flex items-center text-white/50"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Autocomplete Results Mobile Overlay */}
          {showResults && searchQuery.trim() !== '' && (
            <div className="absolute left-0 z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0c0a15] p-2 shadow-2xl backdrop-blur-xl">
              <div className="max-h-60 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelectResult(product)}
                      className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-white/5"
                    >
                      <div
                        className="h-8 w-8 shrink-0 rounded shadow-inner"
                        style={{ background: product.image }}
                      />
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <h4 className="truncate text-xs font-semibold text-white">
                            {product.name}
                          </h4>
                          <span className="text-xs font-bold text-[#7B52DE]">
                            ${product.price.toLocaleString('es-CO')}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-4 text-center text-xs text-slate-400">
                    No se encontraron resultados
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
