import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight, MessageSquareCode } from 'lucide-react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, selectedColor: string, newQty: number) => void;
  onRemoveItem: (productId: string, selectedColor: string) => void;
  onSendWhatsApp: (message: string) => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onSendWhatsApp,
}: CartSidebarProps) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    let message = `🌊 *PEDIDO WAVE PUFF* 🌊\n`;
    message += `-------------------------------\n`;
    message += `🛒 *Detalle de mi Carrito:*\n\n`;

    cartItems.forEach((item, idx) => {
      const lineTotal = item.product.price * item.quantity;
      message += `${idx + 1}. *${item.product.name}*\n`;
      message += `   · Sabor/Color: ${item.selectedColor}\n`;
      message += `   · Cantidad: ${item.quantity}\n`;
      message += `   · Unidad: $${item.product.price.toLocaleString('es-CO')} COP\n`;
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
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedColor}`}
                className="flex gap-4 rounded-none border border-white/10 bg-white/[0.02] p-4 transition-all hover:border-[#7B52DE]/50"
              >
                {/* Micro preview */}
                <div
                  className="h-14 w-14 shrink-0 rounded-none border border-white/10 flex items-center justify-center overflow-hidden bg-black/45"
                >
                  {item.product.image && (item.product.image.includes('.') || item.product.image.includes('/') || item.product.image.startsWith('data:')) ? (
                    <img 
                      src={item.product.image} 
                      className="h-full w-full object-cover" 
                      alt={item.product.name} 
                      referrerPolicy="no-referrer" 
                    />
                  ) : (
                    <div className="h-11 w-6 border border-white/20 bg-black/80 flex items-center justify-center" style={{ backgroundColor: item.product.image || '#7B52DE' }}>
                      <span className="text-[5px] text-white/40 uppercase">WP</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs font-black text-white uppercase tracking-wider truncate max-w-[160px]">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id, item.selectedColor)}
                        className="text-white/30 transition-colors hover:text-[#7B52DE] cursor-pointer"
                        title="Eliminar"
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-[9px] font-mono text-[#A78BFA] uppercase tracking-wider mt-0.5 block">
                      Variante: {item.selectedColor}
                    </span>
                  </div>

                  {/* Quantity controls & Line subtotal row */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-none border border-white/10 bg-[#050505] p-0.5">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.product.id, item.selectedColor, item.quantity - 1)}
                        className="p-1 text-white/40 hover:text-white cursor-pointer"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2.5 font-mono text-xs font-black text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.product.id, item.selectedColor, item.quantity + 1)}
                        className="p-1 text-white/40 hover:text-white cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black tracking-tight text-white">
                        ${(item.product.price * item.quantity).toLocaleString('es-CO')}
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

            <button
              onClick={handleCheckout}
              className="flex w-full items-center justify-center gap-2 rounded-none bg-emerald-600 py-4 font-sans text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-emerald-500 cursor-pointer"
            >
              <MessageSquareCode className="h-5 w-5 shrink-0" />
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
