import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Landmark, Headphones } from 'lucide-react';
import { FAQ_ITEMS } from '../data';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="relative py-24 bg-[#0a0814] border-t border-white/10">
      
      {/* Visual neon circles matching the purple logo */}
      <div className="absolute top-1/2 right-1/4 -z-10 h-64 w-64 rounded-full bg-[#7B52DE]/5 blur-[100px]" />
      <div className="absolute bottom-1/4 left-1/4 -z-10 h-64 w-64 rounded-full bg-[#A78BFA]/5 blur-[100px]" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* TITLE */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-none border border-[#7B52DE]/30 bg-[#7B52DE]/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-[#A78BFA]">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Guía de Compra Pro</span>
          </div>
          
          <h2 className="mt-6 text-3xl font-black italic uppercase tracking-tighter text-white sm:text-4xl md:text-5xl">
            Garantías y Envíos
          </h2>
          <p className="mt-4 text-white/50 text-xs uppercase font-bold tracking-wider max-w-lg mx-auto leading-relaxed">
            Resolvemos tus dudas sobre despachos inmediatos nacionales, métodos de pago seguro y soporte personalizado Wave Puff.
          </p>
        </div>

        {/* ACCORDION ACCUMULATOR */}
        <div className="mt-14 space-y-3">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-none border border-white/10 bg-white/5 transition-all duration-200 hover:border-[#7B52DE]/40"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-white focus:outline-none cursor-pointer"
                  type="button"
                >
                  <span className="text-xs font-black uppercase tracking-wider pr-4">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-[#A78BFA]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-white/40" />
                  )}
                </button>

                <div
                  className={`transition-all duration-300 ${
                    isOpen ? 'max-h-56 p-5 border-t border-white/10 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                  } bg-[#050505]/40`}
                >
                  <p className="text-xs text-white/60 leading-relaxed font-semibold">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* EXTRA SERVICE HIGHLIGHTS */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-none border border-white/10 bg-white/5 p-6 text-center transition-colors hover:border-[#7B52DE]/40">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-none border border-white/15 bg-[#050505] text-[#7B52DE]">
              <Landmark className="h-4.5 w-4.5" />
            </div>
            <h3 className="mt-5 text-xs font-black text-white uppercase tracking-widest">Pagos Seguros</h3>
            <p className="mt-2.5 text-[11px] text-white/40 font-bold uppercase tracking-tight leading-normal">
              Acordamos transferencias directas mediante Bancolombia, Nequi, Daviplata o pago contra entrega nacional.
            </p>
          </div>

          <div className="rounded-none border border-white/10 bg-white/5 p-6 text-center transition-colors hover:border-[#A78BFA]/40">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-none border border-white/15 bg-[#050505] text-[#A78BFA]">
              <Headphones className="h-4.5 w-4.5" />
            </div>
            <h3 className="mt-5 text-xs font-black text-white uppercase tracking-widest">Atención al Cliente</h3>
            <p className="mt-2.5 text-[11px] text-white/40 font-bold uppercase tracking-tight leading-normal">
              Soporte personalizado pre y post venta directo por WhatsApp de Lunes a Sábados 8:00 - 20:00 para coordinar tus pedidos e inquietudes.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
