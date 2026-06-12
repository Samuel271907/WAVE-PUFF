import React, { useState } from 'react';
import Logo from './Logo';
import { ShieldAlert, ChevronRight, XCircle } from 'lucide-react';

interface AgeVerificationGateProps {
  onVerified: () => void;
}

export default function AgeVerificationGate({ onVerified }: AgeVerificationGateProps) {
  const [hasDeclined, setHasDeclined] = useState(false);

  const handleAccept = () => {
    localStorage.setItem('wave_puff_age_verified', 'true');
    onVerified();
  };

  const handleDecline = () => {
    setHasDeclined(true);
  };

  if (hasDeclined) {
    return (
      <div 
        id="age-gate-declined-screen"
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05030a] px-4 text-center selection:bg-red-500 selection:text-white"
      >
        {/* Neon Backdrop Glow */}
        <div className="absolute top-1/2 left-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[80px]" />
        
        <div className="relative max-w-md border border-red-500/20 bg-[#0c0814]/85 p-8 md:p-10 text-center backdrop-blur-xl shadow-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
            <XCircle className="h-8 w-8" />
          </div>

          <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-400">
            Acceso Denegado
          </span>
          <h2 className="mt-2 text-2xl font-black uppercase text-white tracking-tight">
            Se requiere ser mayor de edad
          </h2>
          <p className="mt-4 text-xs leading-relaxed text-slate-400">
            Lo sentimos, nuestro catálogo de vapes, destilados nacionales, importados y accesorios está estrictamente reservado para mayores de 18 años por regulaciones legales y de salud.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setHasDeclined(false)}
              className="flex-1 border border-white/10 bg-white/5 py-3 text-xs font-black uppercase tracking-widest text-[#F0F0F0] hover:bg-white/10 transition-colors"
            >
              Volver a intentar
            </button>
            <a
              href="https://www.google.com"
              className="flex-1 bg-red-600 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-red-700 transition-colors inline-block text-center"
            >
              Salir del Sitio
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="age-verification-gate"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05030a] px-4 selection:bg-[#7B52DE] selection:text-white overflow-y-auto"
    >
      {/* Background Neon Glow Rings */}
      <div className="absolute top-1/4 left-1/2 h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-[#7B52DE]/10 blur-[100px]" />
      <div className="absolute bottom-1/4 left-1/4 h-[350px] w-[350px] rounded-full bg-[#A78BFA]/5 blur-[120px]" />

      <div className="relative w-full max-w-lg border border-white/10 bg-[#0c0814]/90 p-8 md:p-12 text-center backdrop-blur-xl shadow-2xl">
        
        {/* LOGO AREA - GORGEOUS 3D POPPING STYLE WITHOUT BOX CONTAINER */}
        <div className="mx-auto mb-4 flex h-48 w-48 items-center justify-center transition-transform duration-500 hover:scale-115 hover:rotate-3 transform-gpu">
          <Logo showText={false} className="h-full w-full object-contain filter drop-shadow-[0_0_30px_rgba(123,82,222,0.85)] hover:drop-shadow-[0_0_45px_rgba(167,139,250,1.0)] transition-all duration-300" />
        </div>

        <div className="flex flex-col items-center mb-6">
          <span className="font-sans text-4xl sm:text-5xl font-black tracking-tight uppercase text-white leading-none flex items-center gap-1">
            <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">Wave</span>
            <span className="bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#C084FC] bg-clip-text text-transparent font-black drop-shadow-[0_0_25px_rgba(167,139,250,0.6)]">Puff</span>
          </span>
          <span className="font-mono text-[11px] tracking-[0.25em] text-[#A78BFA] uppercase mt-1.5 font-extrabold">
            Premium Vapor
          </span>
        </div>

        <span className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-[#A78BFA]">
          Verificación de Edad Obligatoria
        </span>
        
        <h2 className="mt-3 text-3xl font-black uppercase text-white tracking-tight md:text-4xl">
          ¿Eres Mayor de Edad?
        </h2>
        
        <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-400">
          Este sitio web contiene vaporizadores, cápsulas de destilado y accesorios de vapeo de uso restringido. <br className="hidden sm:inline" />
          <strong className="text-white font-medium">Debes tener al menos 18 años para visualizar este catálogo.</strong>
        </p>

        <div className="mt-8 space-y-4">
          <button
            onClick={handleAccept}
            className="group flex w-full items-center justify-center gap-2 bg-[#7B52DE] py-4 text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-[#6d44cf] transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-[#7B52DE]/10 cursor-pointer"
          >
            <span>SÍ, SOY MAYOR DE 18 AÑOS</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          
          <button
            onClick={handleDecline}
            className="w-full border border-white/10 bg-white/5 py-3 text-xs font-black uppercase tracking-[0.15em] text-slate-400 hover:text-white hover:bg-white/15 transition-all cursor-pointer"
          >
            NO, SOY MENOR DE EDAD
          </button>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 flex items-start gap-2.5 text-left text-[11px] text-slate-500 leading-snug">
          <ShieldAlert className="h-4 w-4 text-[#A78BFA]/60 shrink-0 mt-0.5" />
          <span>Al presionar ingresar declaras ser mayor de edad, aceptas nuestro tratamiento de datos y confirmas que entiendes los riesgos de salud asociados al consumo de nicotina y derivados.</span>
        </div>

      </div>
    </div>
  );
}
