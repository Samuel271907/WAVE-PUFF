import { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, Flame, Sparkles, X } from 'lucide-react';
import { Product } from '../types';
import Logo from './Logo';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onSelectProduct: (product: Product) => void;
  products: Product[];
}

export default function Header({ cartCount, onOpenCart, onSelectProduct, products }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [logoError, setLogoError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.categoryLabel.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
    setSearchResults(filtered);
  }, [searchQuery, products]);

  // Close search auto-results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const clickedDesktopOutside = containerRef.current && !containerRef.current.contains(event.target as Node);
      const clickedMobileOutside = mobileContainerRef.current && !mobileContainerRef.current.contains(event.target as Node);
      
      const hasDesktop = !!containerRef.current;
      const hasMobile = !!mobileContainerRef.current;
      
      if ((!hasDesktop || clickedDesktopOutside) && (!hasMobile || clickedMobileOutside)) {
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
        
        {/* LOGO AREA - POPPING 3D EFFECT WITHOUT BOX CONTAINER */}
        <div className="flex items-center gap-4">
          <div className="relative group/logo flex h-[105px] w-[105px] md:h-[120px] md:w-[120px] -mt-3 -mb-8 md:-mb-10 items-center justify-center transition-all duration-300 hover:rotate-6 hover:scale-120 z-50 transform-gpu">
            <Logo showText={false} className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(123,82,222,0.85)] hover:drop-shadow-[0_0_35px_rgba(167,139,250,1.0)] transition-all duration-300" />
            {/* Pulsing glow point near the logo */}
            <span className="absolute top-2 right-2 flex h-4 w-4 z-10">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A78BFA] opacity-75"></span>
              <span className="relative inline-flex h-4 w-4 rounded-full bg-[#7B52DE] border border-white/40"></span>
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="font-sans text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase text-white leading-none flex items-center gap-1 hover:scale-105 transition-transform duration-300">
              <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">Wave</span>
              <span className="bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#C084FC] bg-clip-text text-transparent font-black drop-shadow-[0_0_25px_rgba(167,139,250,0.6)]">Puff</span>
            </span>
          </div>
        </div>

        {/* COMPACT INTUITIVE NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.25em] text-white/50 lg:ml-24">
          <a href="#catalog-anchor" className="relative -top-[2px] hover:text-[#7B52DE] transition-colors text-[#7B52DE]">Productos</a>
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
                      {/* Product dynamic image or color representation */}
                      <div className="h-10 w-10 shrink-0 rounded-none border border-white/10 bg-black overflow-hidden flex items-center justify-center relative">
                        {product.image && (product.image.includes('.') || product.image.includes('/') || product.image.startsWith('data:')) ? (
                          <img src={product.image} className={`h-full w-full object-cover ${(product.stock === 0 || product.isAvailable === false) ? 'grayscale opacity-40' : ''}`} alt="" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="h-6 w-3 border border-white/20" style={{ backgroundColor: product.image || '#7B52DE', opacity: (product.stock === 0 || product.isAvailable === false) ? 0.4 : 1 }} />
                        )}
                        {(product.stock === 0 || product.isAvailable === false) && (
                          <div className="absolute inset-0 bg-red-950/30 flex items-center justify-center">
                            <span className="text-[6px] font-black tracking-tighter text-red-400 bg-black/80 px-0.5 border border-red-500/30">OOS</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`truncate text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 ${
                            (product.stock === 0 || product.isAvailable === false) ? 'text-red-400 line-through' : 'text-white'
                          }`}>
                            <span>{product.name}</span>
                          </h4>
                          {(product.stock === 0 || product.isAvailable === false) ? (
                            <span className="text-[8px] font-black text-red-400 uppercase tracking-wider bg-red-500/10 border border-red-500/30 px-1 shrink-0">
                              Agotado
                            </span>
                          ) : (
                            <span className="text-xs font-black text-[#A78BFA] shrink-0">
                              ${product.price.toLocaleString('es-CO')}
                            </span>
                          )}
                        </div>
                        <p className="truncate text-[10px] uppercase font-bold tracking-wider text-white/40 mt-0.5">
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
        <div ref={mobileContainerRef} className="relative w-full">
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
                      {/* Product dynamic image or color representation */}
                      <div className="h-8 w-8 shrink-0 rounded border border-white/10 bg-black overflow-hidden flex items-center justify-center relative">
                        {product.image && (product.image.includes('.') || product.image.includes('/') || product.image.startsWith('data:')) ? (
                          <img src={product.image} className={`h-full w-full object-cover ${(product.stock === 0 || product.isAvailable === false) ? 'grayscale opacity-40' : ''}`} alt="" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="h-4 w-2 border border-white/20" style={{ backgroundColor: product.image || '#7B52DE', opacity: (product.stock === 0 || product.isAvailable === false) ? 0.4 : 1 }} />
                        )}
                        {(product.stock === 0 || product.isAvailable === false) && (
                          <div className="absolute inset-0 bg-red-950/30 flex items-center justify-center">
                            <span className="text-[5px] font-black text-red-400 bg-black/80 px-0.5">OOS</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className={`truncate text-xs font-semibold ${
                            (product.stock === 0 || product.isAvailable === false) ? 'text-red-400 line-through' : 'text-white'
                          }`}>
                            {product.name}
                          </h4>
                          {(product.stock === 0 || product.isAvailable === false) ? (
                            <span className="text-[7px] font-black text-red-400 uppercase tracking-wide bg-red-500/10 border border-red-500/30 px-1">
                              Agotado
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-[#A78BFA]">
                              ${product.price.toLocaleString('es-CO')}
                            </span>
                          )}
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
