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

        <svg 
          viewBox="0 0 24 24" 
          className="h-6 w-6 fill-current transition-transform duration-300 group-hover:rotate-12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.012 0C5.398 0 .051 5.348.047 11.965a11.916 11.916 0 0 0 1.6 5.94L0 24l6.19-1.623a11.93 11.93 0 0 0 5.817 1.516l.005.001c6.612 0 11.961-5.348 11.965-11.967A11.97 11.97 0 0 0 12.012 0zm6.586 16.924c-.262.738-1.522 1.425-2.098 1.482-.538.053-1.078.27-3.424-.672-2.33-.935-3.768-3.278-3.884-3.432-.117-.154-.973-1.292-.973-2.46 0-1.17.61-1.74.828-1.972.218-.232.473-.29.63-.29.157 0 .315.001.454.007.143.006.339-.053.53.409.193.468.657 1.6.716 1.717.059.117.098.253.02.409-.079.156-.118.27-.236.409-.118.139-.247.31-.354.419-.118.115-.242.242-.104.478.138.232.613 1.01 1.314 1.636.903.805 1.66 1.054 1.895 1.172.236.117.375.098.514-.058.14-.156.593-.689.75-.973.157-.283.315-.236.53-.157.217.078 1.378.65 1.614 1.064.237.117.315.275.275.393z"/>
        </svg>
      </button>

    </div>
  );
}
