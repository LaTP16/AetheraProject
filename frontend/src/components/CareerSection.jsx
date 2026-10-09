import React from 'react';
import { Briefcase, Sparkles, FileText } from 'lucide-react';

export default function CareerSection({ onOpenCVModal }) {
  return (
    <section className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Desarrollo Profesional</h2>
              <p className="text-xs text-slate-500">Oportunidades & Empleabilidad</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-600 hover:underline cursor-pointer">Ver convocatorias</span>
        </div>

        {/* CTA Analizar CV con IA */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white mb-6 shadow-md shadow-emerald-600/15">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded-md mb-2">
            <Sparkles className="w-3 h-3" /> Potenciado por IA
          </span>
          <h3 className="font-bold text-sm">Analizar mi CV para Vacantes</h3>
          <p className="text-xs text-emerald-100 mt-1">
            Obtén feedback instantáneo y porcentaje de coincidencia con las convocatorias activas.
          </p>
          
          <button 
            onClick={onOpenCVModal}
            className="mt-4 w-full py-2.5 px-4 bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            Analizar mi CV con IA
          </button>
        </div>

        {/* Convocatorias Destacadas */}
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Convocatorias Destacadas</h3>
        <div className="space-y-3">
          
          <div className="p-4 bg-slate-50 hover:bg-emerald-50/30 rounded-2xl border border-slate-100 transition-all hover:border-emerald-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-md mb-1">
                  Nueva Beca
                </span>
                <h4 className="text-xs font-bold text-slate-900">Beca Talento Tech 2026</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Fundación Aethera • Cobertura 80%</p>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100">
                Cierra en 5 días
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
              <span className="text-emerald-700 font-medium text-[11px]">88% compatibilidad</span>
              <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors">
                Postular ahora
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-50 hover:bg-emerald-50/30 rounded-2xl border border-slate-100 transition-all hover:border-emerald-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 font-bold text-[10px] rounded-md mb-1">
                  Postulación Abierta
                </span>
                <h4 className="text-xs font-bold text-slate-900">Práctica Desarrollador Fullstack</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">NovaTech Solutions • Remoto</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
              <span className="text-emerald-700 font-medium text-[11px]">94% compatibilidad</span>
              <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors">
                Postular ahora
              </button>
            </div>
          </div>

        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>¿Buscas mentores de tu industria?</span>
        <span className="text-emerald-600 font-bold hover:underline cursor-pointer">Ver red de egresados</span>
      </div>
    </section>
  );
}
