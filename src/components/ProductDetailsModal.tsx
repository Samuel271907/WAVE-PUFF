import React, { useState, useMemo } from 'react';
import { X, Star, CheckCircle, Plus, Check, MessageSquare, Heart, Shield, Award } from 'lucide-react';
import { Product, Review } from '../types';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, selectedColor: string, e: React.MouseEvent) => void;
  onSendWhatsApp: (message: string) => void;
  onAddReview?: (productId: string, review: Review) => void;
}

export default function ProductDetailsModal({
  product,
  onClose,
  onAddToCart,
  onSendWhatsApp,
  onAddReview,
}: ProductDetailsModalProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');
  const [isAdded, setIsAdded] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [localReviews, setLocalReviews] = useState<Review[]>(product.reviews);
  const [liked, setLiked] = useState(false);

  // Compute stats on local reviews state
  const computedRating = useMemo(() => {
    if (localReviews.length === 0) return 0;
    const sum = localReviews.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / localReviews.length).toFixed(1));
  }, [localReviews]);

  const activeColor = product.colors[selectedColorIndex] || { name: 'Estándar', hex: '#6366f1' };
  const activeImage = activeColor.image || product.image;

  const handleAdd = (e: React.MouseEvent) => {
    onAddToCart(product, activeColor.name, e);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const handleWhatsAppOrder = () => {
    const textMsg = `¡Hola Wave Puff! 🌊 Me gustaría pedir el vapeador *${product.name}* en el sabor/color: *${activeColor.name}*. El precio indicado en su web es de $${product.price.toLocaleString('es-CO')} COP. ¿Tienen disponibilidad para envío inmediato?`;
    onSendWhatsApp(textMsg);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    const newReview: Review = {
      id: `lr-${Date.now()}`,
      name: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString().split('T')[0],
      verified: true, // Auto-verified for live simulated loop
    };

    setLocalReviews([newReview, ...localReviews]);
    setReviewName('');
    setReviewComment('');
    setReviewRating(5);

    if (onAddReview) {
      onAddReview(product.id, newReview);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/85 p-4 backdrop-blur-md">
      {/* Container Box */}
      <div className="relative flex h-full max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-none border border-white/10 bg-[#050505] shadow-2xl">
        
        {/* TOP STATUS ROW */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#050505] py-4 px-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#A78BFA] font-black">
              Lab Specification ID
            </span>
            {(product.stock === 0 || product.isAvailable === false) ? (
              <>
                <span className="h-1.5 w-1.5 bg-red-500 rounded-full" />
                <span className="font-mono text-[9px] text-red-400 uppercase tracking-widest font-bold">
                  Agotado
                </span>
              </>
            ) : (
              <>
                <span className="h-1.5 w-1.5 bg-emerald-500 animate-pulse rounded-full" />
                <span className="font-mono text-[9px] text-emerald-400 uppercase tracking-widest font-bold">
                  Disponible
                </span>
              </>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-none border border-white/10 bg-[#050505] text-white/60 transition-colors hover:border-[#7B52DE] hover:text-[#7B52DE] cursor-pointer"
            type="button"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* CONTENT ZONE - SCROLLABLE */}
        <div className="flex-grow overflow-y-auto p-6 lg:p-8">
          <div className="grid gap-8 lg:grid-cols-12">
            
            {/* LEFT SIDE: PRODUCT PHOTO OR SIMULATION */}
            <div className="relative flex flex-col items-center justify-center lg:col-span-5">
              <div
                className="absolute inset-4 rounded-full opacity-10 blur-3xl"
                style={{ background: (activeImage.includes('.') || activeImage.includes('/')) ? '#7B52DE' : activeImage }}
              />
              
              <div className="relative flex aspect-square w-full max-w-[340px] items-center justify-center rounded-none border border-white/10 bg-[#050505] p-0 shadow-2xl overflow-hidden">
                {(activeImage.includes('.') || activeImage.includes('/')) ? (
                  <div className="relative h-full w-full flex flex-col items-center justify-center p-0">
                    <img 
                      key={activeImage}
                      src={activeImage} 
                      alt={product.name} 
                      referrerPolicy="no-referrer" 
                      className="h-full w-full object-cover rounded-none animate-fade-in"
                    />
                    {product.category === 'vapers' && product.puffs && (
                      <span className="absolute bottom-4 z-20 rounded-none bg-[#050505]/90 backdrop-blur-sm border border-white/10 py-1.5 px-3.5 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#A78BFA]">
                        {product.puffs.toLocaleString()} PUFFS
                      </span>
                    )}
                  </div>
                ) : (
                  <>
                    <div
                      key={selectedColorIndex}
                      className="absolute inset-4 rounded-none opacity-20 blur-xl animate-fade-in"
                      style={{ background: activeColor.hex }}
                    />
                    
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="h-44 w-28 rounded-none bg-[#050505] border-2 border-white/15 p-2 flex flex-col justify-between shadow-2xl">
                        <div className="h-3 w-3/4 mx-auto bg-white/20" />
                        <div
                          key={selectedColorIndex}
                          className="h-24 w-full rounded-none animate-fade-in"
                          style={{ background: activeColor.hex }}
                        />
                        <div className="h-2.5 w-full bg-white/10" />
                      </div>
                      
                      {product.category === 'vapers' && product.puffs && (
                        <span className="mt-5 rounded-none bg-[#050505] border border-white/10 py-1 px-3.5 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#A78BFA]">
                          {product.puffs.toLocaleString()} PUFFS
                        </span>
                      )}
                    </div>
                  </>
                )}

                {/* Like Button */}
                <button
                  type="button"
                  onClick={() => setLiked(!liked)}
                  className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-none border border-white/10 bg-[#050505]/85 text-white/50 transition-colors hover:border-[#7B52DE] hover:text-[#7B52DE]"
                >
                  <Heart className={`h-4.5 w-4.5 ${liked ? 'fill-[#7B52DE] text-[#7B52DE] border-none' : ''}`} />
                </button>
              </div>

              {/* Badges details bottom */}
              <div className="mt-6 w-full">
                <div className="rounded-none border border-white/10 bg-white/5 p-3.5 text-center">
                  <div className="flex justify-center text-[#A78BFA] mb-1.5">
                    <Award className="h-4 w-4" />
                  </div>
                  <div className="font-mono text-[8px] uppercase tracking-widest text-white/40">Fabricante</div>
                  <div className="text-xs font-black uppercase tracking-wider text-white mt-1">{product.brand}</div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: INTERACTIVE BUYER HUB */}
            <div className="flex flex-col lg:col-span-7">
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#A78BFA]">
                {product.categoryLabel} Edition
              </span>
              <h2 className="mt-1 text-2xl font-black italic uppercase tracking-tighter text-white lg:text-3xl">
                {product.name}
              </h2>

              {/* Price row */}
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-baseline gap-2.5">
                  {product.originalPrice && (
                    <span className="text-base font-bold line-through text-white/40">
                      ${product.originalPrice.toLocaleString('es-CO')}
                    </span>
                  )}
                  <span className="text-2xl font-black tracking-tighter text-[#7B52DE]">
                    ${product.price.toLocaleString('es-CO')}
                  </span>
                </div>
                <span className="rounded-none bg-[#7B52DE]/10 border border-[#7B52DE]/30 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-[#A78BFA]">
                  Envío Gratis Disp.
                </span>
              </div>

              {/* Description explanation */}
              <p className="mt-5 text-sm leading-relaxed text-white/60 font-medium select-text">
                {product.description}
              </p>

              {/* Color options picker */}
              <div className="mt-6">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                  Sabor Seleccionado: <span className="text-[#A78BFA]">{activeColor.name}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.colors.map((color, idx) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColorIndex(idx)}
                      className={`flex items-center gap-2 rounded-none border px-3.5 py-2.5 transition-all cursor-pointer ${
                        selectedColorIndex === idx
                          ? 'border-[#7B52DE] bg-[#7B52DE]/5 text-white shadow-md'
                          : 'border-white/10 bg-white/5 text-white/50 hover:border-[#7B52DE] hover:text-white'
                      }`}
                      type="button"
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-none shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-xs uppercase font-black tracking-wider">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* TAB SELECTION */}
              <div className="mt-8 flex border-b border-white/10">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`border-b-2 py-2 px-4 text-xs font-black uppercase tracking-[0.2em] transition-all focus:outline-none cursor-pointer ${
                    activeTab === 'specs'
                      ? 'border-[#7B52DE] text-[#A78BFA]'
                      : 'border-transparent text-white/40 hover:text-white'
                  }`}
                  type="button"
                >
                  Especificaciones
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`relative border-b-2 py-2 px-4 text-xs font-black uppercase tracking-[0.2em] transition-all focus:outline-none cursor-pointer ${
                    activeTab === 'reviews'
                      ? 'border-[#7B52DE] text-[#A78BFA]'
                      : 'border-transparent text-white/40 hover:text-white'
                  }`}
                  type="button"
                >
                  Reseñas ({localReviews.length})
                  <span className="absolute top-1.5 right-0.5 h-1.5 w-1.5 rounded-full bg-[#7B52DE]" />
                </button>
              </div>

              {/* TABS CONTENT BLOCK */}
              <div className="mt-6 flex-1 min-h-[220px]">
                {activeTab === 'specs' ? (
                  <div className="space-y-4">
                    <div className="w-full">
                      {product.category === 'vapers' && product.puffs ? (
                        <div className="rounded-none bg-white/5 p-4 border border-white/10">
                          <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest block mb-1">Rendimiento</span>
                          <div className="text-sm font-black uppercase text-white mt-0.5">Hasta {product.puffs.toLocaleString()} Puffs</div>
                        </div>
                      ) : product.capacity ? (
                        <div className="rounded-none bg-white/5 p-4 border border-white/10">
                          <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest block mb-1">Capacidad</span>
                          <div className="text-sm font-black uppercase text-white mt-0.5">{product.capacity}</div>
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A78BFA] mb-3">Key Features Matrix</h4>
                      <ul className="grid grid-cols-1 gap-2.5 text-xs text-white/60 sm:grid-cols-2">
                        {product.features.map((feat) => (
                          <li key={feat} className="flex items-center gap-2">
                            <span className="h-2 w-2 bg-[#7B52DE]/80 shrink-0" />
                            <span className="font-medium">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Review stats Summary and Form */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between p-4 rounded-none bg-white/5 border border-white/10">
                      <div>
                        <div className="font-mono text-[9px] text-white/30 uppercase tracking-[0.15em]">Calificación Promedio</div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-3xl font-black tracking-tighter text-white">{computedRating.toFixed(1)}</span>
                          <div className="flex flex-col">
                            <div className="flex items-center text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(computedRating) ? 'fill-current' : 'text-white/10'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] uppercase font-bold text-white/40 mt-1">Sabor verificado por {localReviews.length} vaperos</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="h-px bg-white/10 sm:h-12 sm:w-px" />
                      
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Sellos Originales Verificados</span>
                      </div>
                    </div>

                    {/* NEW REVIEW FORM */}
                    <form onSubmit={handleAddReview} className="space-y-3.5 rounded-none border border-white/10 bg-white/[0.02] p-4">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A78BFA]">Dejar una reseña</div>
                      
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <input
                            type="text"
                            required
                            placeholder="Nombre y apellido"
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            className="w-full rounded-none border border-white/10 bg-[#050505] px-4 py-2.5 text-xs text-white uppercase tracking-wider outline-none placeholder:text-white/30 focus:border-[#7B52DE]"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#A78BFA]">Estrellas:</span>
                          <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((stars) => (
                              <button
                                key={stars}
                                type="button"
                                onClick={() => setReviewRating(stars)}
                                className={`text-sm cursor-pointer ${
                                  reviewRating >= stars ? 'text-amber-400' : 'text-white/20'
                                  }`}
                              >
                                <Star className={`h-4 w-4 ${reviewRating >= stars ? 'fill-current' : ''}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <textarea
                          required
                          rows={2}
                          placeholder="Tu opinión sobre la intensidad, golpe y duración..."
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          className="w-full rounded-none border border-white/10 bg-[#050505] p-3 text-xs text-white outline-none placeholder:text-white/30 focus:border-[#7B52DE]"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="bg-[#7B52DE] hover:bg-white hover:text-black text-white px-6 py-2.5 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all active:scale-95 font-black"
                        >
                          Publicar
                        </button>
                      </div>
                    </form>

                    {/* REVIEWS LIST */}
                    <div className="divide-y divide-white/10 h-64 overflow-y-auto pr-1">
                      {localReviews.length > 0 ? (
                        localReviews.map((rev) => (
                          <div key={rev.id} className="py-4 first:pt-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black uppercase tracking-wide text-white">{rev.name}</span>
                                {rev.verified && (
                                  <span className="rounded-none bg-emerald-500/10 py-0.5 px-2 text-[8px] font-bold text-emerald-400 uppercase border border-emerald-500/10">
                                    Verificado
                                  </span>
                                )}
                              </div>
                              <span className="font-mono text-[9px] text-white/30">{rev.date}</span>
                            </div>

                            <div className="flex items-center text-amber-500 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-2.5 w-2.5 ${i < rev.rating ? 'fill-current' : 'text-white/10'}`}
                                />
                              ))}
                            </div>

                            <p className="mt-2 text-xs text-white/50 italic leading-relaxed font-semibold">
                              "{rev.comment}"
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center text-xs text-white/30 uppercase tracking-widest font-bold">
                          Sin comentarios de momento.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* BOTTOM ORDER FOOTER ROW */}
        <div className="grid grid-cols-2 gap-4 border-t border-white/10 bg-[#050505] py-5 px-6">
          <button
            onClick={handleAdd}
            disabled={product.stock === 0 || product.isAvailable === false}
            className={`flex items-center justify-center gap-2 rounded-none py-4 px-4 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
              product.stock === 0 || product.isAvailable === false
                ? 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-500 text-white border-none font-black'
                : 'border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-[#7B52DE] font-black'
            }`}
            type="button"
          >
            {product.stock === 0 || product.isAvailable === false ? (
              <>
                <span>Agotado</span>
              </>
            ) : isAdded ? (
              <>
                <Check className="h-4 w-4" />
                <span>Agregado al Carrito</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Agregar al Carrito</span>
              </>
            )}
          </button>

          <button
            onClick={handleWhatsAppOrder}
            disabled={product.stock === 0 || product.isAvailable === false}
            className={`flex items-center justify-center gap-2 rounded-none font-sans text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all cursor-pointer ${
              product.stock === 0 || product.isAvailable === false
                ? 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-600/10'
            }`}
            type="button"
          >
            <svg 
              viewBox="0 0 24 24" 
              className="h-4.5 w-4.5 shrink-0 fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.012 0C5.398 0 .051 5.348.047 11.965a11.916 11.916 0 0 0 1.6 5.94L0 24l6.19-1.623a11.93 11.93 0 0 0 5.817 1.516l.005.001c6.612 0 11.961-5.348 11.965-11.967A11.97 11.97 0 0 0 12.012 0zm6.586 16.924c-.262.738-1.522 1.425-2.098 1.482-.538.053-1.078.27-3.424-.672-2.33-.935-3.768-3.278-3.884-3.432-.117-.154-.973-1.292-.973-2.46 0-1.17.61-1.74.828-1.972.218-.232.473-.29.63-.29.157 0 .315.001.454.007.143.006.339-.053.53.409.193.468.657 1.6.716 1.717.059.117.098.253.02.409-.079.156-.118.27-.236.409-.118.139-.247.31-.354.419-.118.115-.242.242-.104.478.138.232.613 1.01 1.314 1.636.903.805 1.66 1.054 1.895 1.172.236.117.375.098.514-.058.14-.156.593-.689.75-.973.157-.283.315-.236.53-.157.217.078 1.378.65 1.614 1.064.237.117.315.275.275.393z"/>
            </svg>
            <span>Pedir por WhatsApp</span>
          </button>
        </div>

      </div>
    </div>
  );
}
