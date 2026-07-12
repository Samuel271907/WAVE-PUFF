import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight, MessageSquareCode } from 'lucide-react';
import { CartItem, Product } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, selectedColor: string, newQty: number) => void;
  onRemoveItem: (productId: string, selectedColor: string) => void;
  onSendWhatsApp: (message: string) => void;
  products: Product[];
}

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onSendWhatsApp,
  products,
}: CartSidebarProps) {
  if (!isOpen) return null;

  // Resolve fresh prices and stocks in real-time
  const updatedCartItems = cartItems.map(item => {
    const freshProduct = products.find(p => p.id === item.product.id) || item.product;
    const isOOS = freshProduct.stock === 0 || freshProduct.isAvailable === false;
    return {
      ...item,
      freshProduct,
      isOOS,
    };
  });

  const hasAnyOOS = updatedCartItems.some(item => item.isOOS);
  const subtotal = updatedCartItems.reduce((acc, item) => acc + item.freshProduct.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0 || hasAnyOOS) return;

    let message = `🌊 *PEDIDO WAVE PUFF* 🌊\n`;
    message += `-------------------------------\n`;
    message += `🛒 *Detalle de mi Carrito:*\n\n`;

    updatedCartItems.forEach((item, idx) => {
      const lineTotal = item.freshProduct.price * item.quantity;
      message += `${idx + 1}. *${item.freshProduct.name}*\n`;
      message += `   · Sabor/Color: ${item.selectedColor}\n`;
      message += `   · Cantidad: ${item.quantity}\n`;
      message += `   · Unidad: $${item.freshProduct.price.toLocaleString('es-CO')} COP\n`;
      message += `   · Total Línea: $${lineTotal.toLocaleString('es-CO')} COP\n`;
      message += `   -------------------------------\n`;
    });

    message += `\n💵 *Total (sin envío):* $${subtotal.toLocaleString('es-CO')} COP\n`;
    message += `🚚 *Envío:* A coordinar por WhatsApp\n\n`;
    message += `💬 Por favor confirmen disponibilidad para coordinar datos de despacho. ¡Muchas gracias!`;

    onSendWhatsApp(message);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#050505]/80 backdrop-blur-sm">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* Slide frame */}
      <div className="flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#050505] shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 p-6 bg-[#050505]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-[#7B52DE]" />
            <h2 className="text-sm font-black uppercase text-white tracking-widest">Tu Carrito</h2>
            <span className="rounded-none border border-white/20 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] font-black text-[#A78BFA]">
              {cartItems.length}
            </span>
          </div>
          
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-none border border-white/10 text-white/60 transition-colors hover:border-[#7B52DE] hover:text-[#7B52DE] cursor-pointer"
            type="button"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>



        {/* CART LIST OR EMPTY */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {updatedCartItems.length > 0 ? (
            updatedCartItems.map((item) => (
              <div
                key={`${item.freshProduct.id}-${item.selectedColor}`}
                className={`flex gap-4 rounded-none border p-4 transition-all ${
                  item.isOOS 
                    ? 'border-red-500/30 bg-red-500/[0.02] hover:border-red-500/50' 
                    : 'border-white/10 bg-white/[0.02] hover:border-[#7B52DE]/50'
                }`}
              >
                {/* Micro preview */}
                <div
                  className={`h-14 w-14 shrink-0 rounded-none border flex items-center justify-center overflow-hidden bg-black/45 relative ${
                    item.isOOS ? 'border-red-500/20' : 'border-white/10'
                  }`}
                >
                  {item.freshProduct.image && (item.freshProduct.image.includes('.') || item.freshProduct.image.includes('/') || item.freshProduct.image.startsWith('data:')) ? (
                    <img 
                      src={item.freshProduct.image} 
                      className={`h-full w-full object-cover ${item.isOOS ? 'grayscale opacity-40' : ''}`} 
                      alt={item.freshProduct.name} 
                      referrerPolicy="no-referrer" 
                    />
                  ) : (
                    <div className="h-11 w-6 border border-white/20 bg-black/80 flex items-center justify-center" style={{ backgroundColor: item.freshProduct.image || '#7B52DE', opacity: item.isOOS ? 0.4 : 1 }}>
                      <span className="text-[5px] text-white/40 uppercase font-black">WP</span>
                    </div>
                  )}
                  {item.isOOS && (
                    <div className="absolute inset-0 bg-red-950/40 flex items-center justify-center">
                      <span className="text-[7px] font-black tracking-widest text-red-400 uppercase bg-black/80 px-1 border border-red-500/30">OOS</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className={`text-xs font-black uppercase tracking-wider truncate max-w-[160px] ${item.isOOS ? 'text-red-400 line-through' : 'text-white'}`}>
                        {item.freshProduct.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.freshProduct.id, item.selectedColor)}
                        className="text-white/30 transition-colors hover:text-red-400 cursor-pointer"
                        title="Eliminar"
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex flex-col gap-1 mt-0.5">
                      <span className="text-[9px] font-mono text-[#A78BFA] uppercase tracking-wider block">
                        Variante: {item.selectedColor}
                      </span>
                      {item.isOOS && (
                        <span className="inline-self-start bg-red-500/10 text-red-400 text-[8px] font-black px-1.5 py-0.5 border border-red-500/20 uppercase tracking-widest">
                          Agotado temporalmente
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity controls & Line subtotal row */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-none border border-white/10 bg-[#050505] p-0.5">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.freshProduct.id, item.selectedColor, item.quantity - 1)}
                        className="p-1 text-white/40 hover:text-white cursor-pointer"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2.5 font-mono text-xs font-black text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        disabled={item.isOOS}
                        onClick={() => onUpdateQuantity(item.freshProduct.id, item.selectedColor, item.quantity + 1)}
                        className={`p-1 text-white/40 hover:text-white cursor-pointer ${item.isOOS ? 'cursor-not-allowed opacity-20' : ''}`}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black tracking-tight text-white">
                        ${(item.freshProduct.price * item.quantity).toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            ))
          ) : (
            <div className="flex h-80 flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-none border border-white/10 bg-white/5 text-white/30 mb-5">
                <ShoppingBag className="h-7 w-7" />
              </div>
              <p className="text-xs font-black text-white uppercase tracking-widest">Carrito de Vapers Vacío</p>
              <p className="mt-2 text-[10px] text-white/45 max-w-xs uppercase font-bold tracking-tight">
                Elige de nuestro catálogo dinámico con las mejores caladas de lab garantizadas.
              </p>
              <button
                onClick={onClose}
                className="mt-6 bg-[#7B52DE] text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer"
              >
                Empezar a comprar
              </button>
            </div>
          )}
        </div>

        {/* FOOTER TOTALS & WhatsApp CHECKOUT */}
        {cartItems.length > 0 && (
          <div className="border-t border-white/10 bg-[#050505] p-6 space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-white/50">
                <span className="uppercase font-bold tracking-widest text-[9px]">Subtotal:</span>
                <span className="font-mono text-white">${subtotal.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex items-center justify-between text-white/50">
                <span className="uppercase font-bold tracking-widest text-[9px]">Envío:</span>
                <span className="font-sans text-white/60 text-[10px]">Por coordinar</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4 text-sm font-black uppercase tracking-wider">
                <span className="text-white text-xs">Total del pedido:</span>
                <span className="text-[#A78BFA] font-mono text-sm font-black">
                  ${subtotal.toLocaleString('es-CO')}
                </span>
              </div>
            </div>

            {hasAnyOOS && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 flex flex-col gap-1 rounded-none">
                <span className="text-[10px] font-black text-red-400 uppercase tracking-wider">Productos Agotados Detectados</span>
                <p className="text-[9px] text-white/60 font-mono uppercase tracking-tight">
                  Uno o más vapers en tu carrito no cuentan con stock disponible en este instante. Remuévelos para habilitar el pedido por WhatsApp.
                </p>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={hasAnyOOS}
              className={`flex w-full items-center justify-center gap-2 rounded-none py-4 font-sans text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all ${
                hasAnyOOS 
                  ? 'bg-zinc-800 border border-white/10 text-zinc-500 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-500 cursor-pointer'
              }`}
            >
              <svg 
                viewBox="0 0 24 24" 
                className="h-5 w-5 shrink-0 fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.012 0C5.398 0 .051 5.348.047 11.965a11.916 11.916 0 0 0 1.6 5.94L0 24l6.19-1.623a11.93 11.93 0 0 0 5.817 1.516l.005.001c6.612 0 11.961-5.348 11.965-11.967A11.97 11.97 0 0 0 12.012 0zm6.586 16.924c-.262.738-1.522 1.425-2.098 1.482-.538.053-1.078.27-3.424-.672-2.33-.935-3.768-3.278-3.884-3.432-.117-.154-.973-1.292-.973-2.46 0-1.17.61-1.74.828-1.972.218-.232.473-.29.63-.29.157 0 .315.001.454.007.143.006.339-.053.53.409.193.468.657 1.6.716 1.717.059.117.098.253.02.409-.079.156-.118.27-.236.409-.118.139-.247.31-.354.419-.118.115-.242.242-.104.478.138.232.613 1.01 1.314 1.636.903.805 1.66 1.054 1.895 1.172.236.117.375.098.514-.058.14-.156.593-.689.75-.973.157-.283.315-.236.53-.157.217.078 1.378.65 1.614 1.064.237.117.315.275.275.393z"/>
              </svg>
              <span>Enviar Pedido a WhatsApp</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-center font-mono text-[8px] text-white/30 uppercase tracking-widest leading-normal">
              Redirección automática segura para coordinar envíos nacionales inmediatos.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
