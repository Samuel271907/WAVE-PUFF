import React, { useState } from 'react';
import { Star, Eye, Plus, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onAddToCart: (product: Product, selectedColor: string, e: React.MouseEvent) => void;
  onSelectProduct: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onSelectProduct }: ProductCardProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const activeColorName = product.colors[selectedColorIndex]?.name || 'Estándar';
  const activeImage = product.colors[selectedColorIndex]?.image || product.image;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdded(true);
    onAddToCart(product, activeColorName, e);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-none border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:border-[#7B52DE]/60 hover:shadow-2xl hover:shadow-[#7B52DE]/5">
      
      {/* FLOATING STATUS BADGES */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
        {product.isPopular && (
          <span className="rounded-none bg-[#7B52DE]/15 border border-[#7B52DE]/30 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.2em] text-[#A78BFA]">
            Popular
          </span>
        )}
        {product.isNew && (
          <span className="rounded-none bg-[#A78BFA]/15 border border-[#A78BFA]/30 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.2em] text-[#A78BFA]">
            Nuevo
          </span>
        )}
        {product.stock <= 8 && (
          <span className="rounded-none bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.2em] text-amber-500">
            Últimas {product.stock}UDS
          </span>
        )}
      </div>

      {/* PRODUCT IMAGE GRADIENT OR REAL IMAGE VISUAL */}
      <div
        onClick={() => onSelectProduct(product)}
        className="relative flex aspect-square cursor-pointer items-center justify-center p-0 bg-white/[0.01]"
      >
        {/* Colorful visual aura */}
        <div 
          className="absolute inset-16 -z-10 rounded-full blur-[60px] opacity-15 transition-all duration-500 group-hover:scale-125" 
          style={{ background: (activeImage.includes('.') || activeImage.includes('/')) ? '#7B52DE' : activeImage }} 
        />
        
        {/* Brutalist device silhouette / Real Image Asset */}
        {(activeImage.includes('.') || activeImage.includes('/')) ? (
          <div className="relative flex h-full w-full items-center justify-center rounded-none border-b border-white/10 bg-[#050505] p-0 shadow-xl transition-all duration-500 overflow-hidden">
            <div
              className="absolute inset-2 rounded-none opacity-20 blur-xl bg-[#7B52DE]"
            />
            <img 
              key={activeImage}
              src={activeImage} 
              alt={product.name} 
              referrerPolicy="no-referrer" 
              className="relative z-10 h-full w-full object-cover rounded-none animate-fade-in"
            />
            {/* Quick Specifications Overlay */}
            <div className="absolute bottom-3 left-0 right-0 z-20 text-center">
              <span className="rounded-none bg-[#050505]/90 border border-white/10 py-1 px-3 text-[8px] font-black uppercase tracking-[0.2em] text-[#A78BFA]">
                {product.puffs ? `${product.puffs} Puffs` : product.capacity}
              </span>
            </div>
          </div>
        ) : (
          <div className="relative flex h-full w-full items-center justify-center rounded-none border-b border-white/10 bg-[#050505] p-4 shadow-xl transition-all duration-500">
            <div
              className="absolute inset-2 rounded-none opacity-40 blur-xl"
              style={{ background: activeImage }}
            />
            
            <div className="relative z-10 flex flex-col items-center">
              {/* Elegant stylized custom SVG representation of flavor and model */}
              <div className="h-28 w-16 rounded-none bg-[#050505] border border-white/20 p-2 flex flex-col justify-between shadow-2xl">
                <div className="h-1.5 w-1/2 mx-auto bg-white/40" /> {/* Drip tip */}
                <div
                  key={selectedColorIndex}
                  className="h-14 w-full rounded-none animate-fade-in"
                  style={{ background: product.colors[selectedColorIndex]?.hex || activeImage }}
                />
                <span className="font-mono text-[7px] text-center text-white/30 block uppercase tracking-tighter">WP-LAB</span>
              </div>
            </div>

            {/* Quick Specifications Overlay */}
            <div className="absolute bottom-3 left-0 right-0 text-center">
              <span className="rounded-none bg-[#050505]/90 border border-white/10 py-1 px-3 text-[8px] font-black uppercase tracking-[0.2em] text-[#A78BFA]">
                {product.puffs ? `${product.puffs} Puffs` : product.capacity}
              </span>
            </div>
          </div>
        )}

        {/* Eye Details Hover Icon */}
        <div className="absolute inset-0 flex items-center justify-center bg-[#050505]/65 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-none border border-white/20 bg-[#050505] text-white shadow-2xl transition-all hover:scale-110 hover:border-[#7B52DE]">
            <Eye className="h-5 w-5 text-[#7B52DE]" />
          </div>
        </div>
      </div>

      {/* INFO ZONE */}
      <div className="flex flex-1 flex-col p-6 border-t border-white/10">
        <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">
          {product.brand} · {product.categoryLabel}
        </span>
        
        <h3
          onClick={() => onSelectProduct(product)}
          className="cursor-pointer text-sm font-black uppercase tracking-wider text-white transition-colors hover:text-[#7B52DE]"
        >
          {product.name}
        </h3>

        {/* Reviews Summary */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center text-amber-500">
            <Star className="h-3 w-3 fill-current" />
            <span className="ml-[4px] font-mono text-xs font-bold text-white">{product.rating.toFixed(1)}</span>
          </div>
          <span className="font-mono text-[10px] text-white/30 uppercase">({product.reviewsCount} Reseñas)</span>
        </div>

        {/* Flavor Selector Swatches */}
        <div className="mt-4 flex-grow">
          <div className="text-[9px] font-black uppercase tracking-[0.15em] text-white/40">
            Edición / Sabor: <span className="text-white/80">{activeColorName}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {product.colors.map((color, idx) => (
              <button
                key={color.name}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColorIndex(idx);
                }}
                className={`relative flex h-6 w-6 items-center justify-center rounded-none border transition-all cursor-pointer ${
                  selectedColorIndex === idx
                    ? 'border-[#7B52DE] scale-105'
                    : 'border-white/10 hover:border-white/30'
                }`}
                title={color.name}
                type="button"
              >
                <span
                  className="h-4 w-4 rounded-none"
                  style={{ backgroundColor: color.hex }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* BOTTOM PRICE & ACTION */}
        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] leading-none mb-1">PRECIO</span>
            <div className="flex items-baseline gap-2">
              {product.originalPrice && (
                <span className="text-xs font-bold line-through text-white/40">
                  ${product.originalPrice.toLocaleString('es-CO')}
                </span>
              )}
              <span className="text-lg font-black tracking-tighter text-white">
                ${product.price.toLocaleString('es-CO')}
              </span>
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`flex h-10 items-center justify-center rounded-none px-4.5 text-[10px] font-black uppercase tracking-[0.15em] transition-all cursor-pointer ${
              product.stock === 0
                ? 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 border-none'
                : 'bg-[#7B52DE] text-white hover:bg-white hover:text-black hover:shadow-lg hover:shadow-[#7B52DE]/10 border-none font-black'
            }`}
            type="button"
          >
            {isAdded ? (
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5" />
                <span>Agregado</span>
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Plus className="h-3.5 w-3.5" />
                <span>Agregar</span>
              </span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
