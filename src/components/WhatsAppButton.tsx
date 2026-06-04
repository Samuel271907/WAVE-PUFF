import { useState, useEffect } from 'react';
import { MessageSquare, Flame } from 'lucide-react';

interface WhatsAppButtonProps {
  onSendWhatsApp: (message: string) => void;
}

export default function WhatsAppButton({ onSendWhatsApp }: WhatsAppButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show tooltips briefly after page loads to prompt interaction
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 4000);

    const closeTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 9000);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, []);

  const handleClick = () => {
    const defaultMsg = '¡Hola Wave Puff! estoy interesado en uno de sus productos y me gustaría recibir más información.';
    onSendWhatsApp(defaultMsg);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      
      {/* GLOWING TOOLTIP POPPER */}
      {showTooltip && (
        <div className="relative mb-3.5 max-w-[240px] rounded-2xl border border-emerald-500/20 bg-slate-950 p-3.5 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-1.5 right-2 text-slate-500 hover:text-white text-[10px] font-bold"
          >
            ×
          </button>
          
          <div className="flex items-start gap-2">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mt-0.5">
              <Flame className="h-3 w-3 animate-pulse" />
            </div>
            <div>
              <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-400">Asesor de Guardia</p>
              <p className="mt-0.5 text-[11px] font-semibold text-white leading-tight">
                ¡Hola! ¿Buscas algún sabor específico? Escríbeme ahora.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ROUND FLOATING ACTION BUTTON */}
      <button
        id="whatsapp-floating-trigger"
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-emerald-500 hover:shadow-emerald-500/30 focus:outline-none"
        aria-label="Contactar por WhatsApp"
        type="button"
      >
        {/* Pulsing ring outline background animation */}
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-emerald-500/60 opacity-20 duration-1000" />
        <span className="absolute inset-0 -z-10 animate-pulse rounded-full bg-emerald-400/30 opacity-40" />

        <MessageSquare className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
      </button>

    </div>
  );
}
