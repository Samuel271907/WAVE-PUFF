import { useState } from 'react';
import { ArrowRight, Flame, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import heroImg from '../assets/images/wave_puff_hero_1779664791366.png';
import { comboWavePuffImg } from '../base64Images';

interface HeroProps {
  onExploreClick: () => void;
  onWhatsAppConsult: (message: string) => void;
}

export default function Hero({ onExploreClick, onWhatsAppConsult }: HeroProps) {
  const [heroError, setHeroError] = useState(false);
  const handleConsult = () => {
    onWhatsAppConsult('¡Hola Wave Puff! Vi su página web y me gustaría recibir asesoría sobre qué vapeador me recomiendan según mis gustos.');
  };

  return (
    <section className="relative overflow-hidden bg-[#0a0814] pt-16 pb-20 md:pt-24 md:pb-32">
      {/* Background radial effects matching the logo's purple identity */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-[#7B52DE]/10 blur-[120px]" />
      <div className="absolute right-1/4 bottom-1/4 -z-10 h-72 w-72 rounded-full bg-[#A78BFA]/5 blur-[120px]" />
      
      {/* Decorative Wave Grid Backdrop */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-[0.02] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* LEFT COLUMN: BRAND VALUE PROP */}
          <div className="text-center lg:col-span-7 lg:text-left">
            
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black italic uppercase leading-[1.1] sm:leading-[0.95] md:leading-[0.85] tracking-tighter text-white">
              El Mejor Sabor
              <span className="block mt-2 text-transparent" style={{ WebkitTextStroke: '1px #7B52DE' }}>
                La Mejor Vibra de CTG
              </span>
            </h1>

            <p className="mt-8 max-w-lg text-sm leading-relaxed text-white/50 tracking-wide mx-auto lg:mx-0 text-center lg:text-left">
              Bienvenido a <strong className="text-white">Wave Puff</strong>. Explora nuestro catálogo y encuentra productos de calidad seleccionados para ti.
            </p>

            {/* CALL TO ACTIONS */}
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <button
                onClick={onExploreClick}
                className="bg-[#7B52DE] text-white px-10 py-5 font-black uppercase text-xs tracking-[0.2em] hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer shadow-lg shadow-[#7B52DE]/20 active:scale-95 text-center"
              >
                Categoría Sabores
              </button>

              <button
                onClick={handleConsult}
                className="border border-white/20 px-10 py-5 font-black uppercase text-xs tracking-[0.2em] text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer text-center"
              >
                Soporte WhatsApp
              </button>
            </div>

            {/* FLOATING BULLETS OF TRUST */}
            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3 border-t border-white/10 pt-10 text-left">
              <div>
                <div className="flex items-center gap-2 text-white">
                  <Truck className="h-4 w-4 text-[#A78BFA] shrink-0" />
                  <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#A78BFA]">Envío Seguro</span>
                </div>
                <p className="mt-2 text-[11px] text-white/40 leading-relaxed uppercase font-bold tracking-tight">Despacho express a nivel nacional.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-white">
                  <ShieldCheck className="h-4 w-4 text-[#7B52DE] shrink-0" />
                  <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#7B52DE]">100% Original</span>
                </div>
                <p className="mt-2 text-[11px] text-white/40 leading-relaxed uppercase font-bold tracking-tight">Garantía holográfica verificada.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-white">
                  <Flame className="h-4 w-4 text-[#A78BFA] shrink-0" />
                  <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#A78BFA]">Asesoría VIP</span>
                </div>
                <p className="mt-2 text-[11px] text-white/40 leading-relaxed uppercase font-bold tracking-tight">Soporte técnico directo de expertos.</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PREMIUM HERO IMAGE SHOWCASE */}
          <div className="relative flex justify-center lg:col-span-5">
            <div className="relative w-full max-w-[380px] sm:max-w-[420px]">
              {/* Outer neon ambient frames */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#7B52DE] to-[#A78BFA] opacity-15 blur-2xl animate-pulse" />
              
              {/* Brutalist image frame wrapper & mockup */}
              <div className="relative select-none overflow-hidden rounded-none border border-white/10 bg-white/5 p-4 shadow-2xl">
                <div className="overflow-hidden rounded-none border border-white/5 bg-[#050505] min-h-[250px]">
                  {!heroError ? (
                    <img
                      src={comboWavePuffImg}
                      alt="Colección Exótica Wave Puff"
                      className="aspect-[4/3] w-full object-contain p-3 transition-transform duration-700 hover:scale-[1.03]"
                      referrerPolicy="no-referrer"
                      onError={() => setHeroError(true)}
                    />
                  ) : (
                    /* Spectacular dynamic fallback showing beautiful mockups of product graphic */
                    <div className="relative aspect-[4/3] w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-tr from-[#0a0814] via-[#1a1236] to-[#0a0814] p-6 text-center">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#7B52DE]/20 via-transparent to-transparent pointer-events-none" />
                      
                      {/* Stylized floating vapor pods representation */}
                      <div className="relative flex gap-5 items-end mb-4">
                        {/* Pod 1 */}
                        <div className="w-10 h-24 bg-gradient-to-t from-[#7B52DE]/80 to-[#A78BFA] border border-white/20 relative rounded-md shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/40 rounded-sm" />
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-black text-black">10K</div>
                        </div>
                        {/* Pod 2 (Active/featured) */}
                        <div className="w-12 h-28 bg-gradient-to-t from-[#9333EA] to-[#C084FC] border border-white/30 relative rounded-md shadow-2xl skew-y-3 z-10 scale-105">
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-5 h-1.5 bg-black/50 rounded-sm" />
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-black text-white px-1 bg-[#120f26]/80 rounded border border-white/10 uppercase tracking-widest leading-none">WAKA</div>
                        </div>
                        {/* Pod 3 */}
                        <div className="w-9 h-20 bg-gradient-to-t from-[#6366F1]/80 to-[#818CF8] border border-white/25 relative rounded-md shadow-lg animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-1.5 bg-black/40 rounded-sm" />
                        </div>
                      </div>

                      <div className="z-10 mt-1">
                        <div className="text-[8px] font-black uppercase tracking-[0.25em] text-[#A78BFA] bg-[#7B52DE]/20 px-2 py-0.5 border border-[#7B52DE]/30 inline-block mb-1">
                          WAVE PUFF LABS ELIXIR
                        </div>
                        <h4 className="text-[11px] font-black text-white uppercase tracking-wider">
                          Elite Vaping Experience
                        </h4>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sub banner item detail inside mockup */}
                <div className="mt-4 rounded-none bg-white/5 p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[9px] text-[#A78BFA] uppercase tracking-[0.2em] font-black block">
                        Promoción Destacada
                      </span>
                      <h3 className="text-xs font-black text-white uppercase tracking-wider mt-1">
                        LEMONADE PREMIUM DESTILADO
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="line-through text-[10px] text-white/40 block leading-none font-bold">
                        $90.000
                      </span>
                      <span className="text-xs font-black text-[#A78BFA] block mt-0.5">
                        $85.000
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Little Floating Badge */}
              <div className="absolute -bottom-6 -right-4 flex rotate-3 items-center gap-2 rounded-none border border-white/15 bg-[#050505] p-3 shadow-2xl">
                <div className="flex h-8 w-8 items-center justify-center bg-[#7B52DE]/20 border border-[#7B52DE]/30">
                  <Flame className="h-4.5 w-4.5 text-[#7B52DE]" />
                </div>
                <div>
                  <div className="font-mono text-[8px] text-white/50 uppercase tracking-widest leading-none">LAB CERTIFIED</div>
                  <div className="text-[10px] font-black text-white uppercase tracking-wider mt-1">Elite Standard</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
