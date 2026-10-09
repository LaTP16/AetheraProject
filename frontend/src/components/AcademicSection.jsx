import React from 'react';
import { BookOpen, Users, ExternalLink } from 'lucide-react';

export default function AcademicSection() {
  return (
    <section className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Mi Entorno Académico</h2>
              <p className="text-xs text-slate-500">Comunidad & Colaboración</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer">Ver todo</span>
        </div>

        {/* Grupos de estudio */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Grupos de Estudio Recomendados</h3>
          <div className="space-y-3">
            <div className="p-3.5 bg-slate-50 hover:bg-blue-50/50 rounded-2xl border border-slate-100 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500 text-white font-bold flex items-center justify-center text-xs">
                  CAL
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Cálculo Multivariable</p>
                  <p className="text-[11px] text-slate-500">14 integrantes • 2 tutorías esta semana</p>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-white text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200 text-xs font-semibold rounded-xl transition-all shadow-2xs">
                Unirme
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 hover:bg-blue-50/50 rounded-2xl border border-slate-100 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500 text-white font-bold flex items-center justify-center text-xs">
                  IA
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Fundamentos de IA</p>
                  <p className="text-[11px] text-slate-500">22 integrantes • Foro activo</p>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-white text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200 text-xs font-semibold rounded-xl transition-all shadow-2xs">
                Unirme
              </button>
            </div>
          </div>
        </div>

        {/* Discusiones en Foros */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Discusiones Recientes</h3>
          <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl border border-slate-100">
            <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-md mb-2">
              Proyecto Integrador
            </span>
            <p className="text-xs font-semibold text-slate-800 hover:text-blue-600 cursor-pointer">
              ¿Cómo estructurar la entrega final de la próxima semana?
            </p>
            <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" /> 8 respuestas
              </span>
              <span>Hace 25 min</span>
            </div>
          </div>
        </div>

        {/* Material Educativo */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Materiales Recomendados</h3>
          <div className="space-y-2">
            <a href="#" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-xs font-medium text-slate-700 transition-all">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Guía de Estudio: Métodos Numéricos
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>¿Buscas un tutor particular?</span>
        <span className="text-blue-600 font-bold hover:underline cursor-pointer">Solicitar aquí</span>
      </div>
    </section>
  );
}
