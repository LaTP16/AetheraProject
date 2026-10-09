import React from 'react';
import { Calendar } from 'lucide-react';

export default function CalendarModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-800/50 backdrop-blur-md flex items-center justify-center p-4 lg:p-10 animate-fadeIn" onClick={onClose}>
      <div className="bg-white border border-slate-200 rounded-3xl max-w-6xl w-full p-6 lg:p-8 shadow-2xl relative flex flex-col max-h-full text-[#333A42]" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 text-[#333A42] font-bold flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer z-10 border border-slate-200">
          ✕
        </button>
        
        {/* Header del Calendario */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#1D63B8]/10 border border-blue-500/30 flex items-center justify-center text-[#1D63B8] shadow-md">
              <Calendar className="w-6 h-6"/>
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-[#0D2538] tracking-tight">Calendario Académico 2026</h2>
              <p className="text-sm font-bold text-[#1D63B8]">Vista Anual de Eventos • Dataset 7</p>
            </div>
          </div>
          
          {/* Leyenda */}
          <div className="flex flex-wrap gap-3 bg-slate-100/80 p-3 rounded-xl border border-slate-200 shadow-sm text-xs font-bold text-[#333A42]">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Inicio/Fin Semestre</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div> Exámenes (Parciales/Finales)</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Semanas de Bienestar</div>
          </div>
        </div>

        {/* Grid de Meses */}
        <div className="overflow-y-auto custom-scrollbar pr-2 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'Enero', days: 31, offset: 4 }, { name: 'Febrero', days: 28, offset: 0 }, { name: 'Marzo', days: 31, offset: 0 },
              { name: 'Abril', days: 30, offset: 3 }, { name: 'Mayo', days: 31, offset: 5 }, { name: 'Junio', days: 30, offset: 1 },
              { name: 'Julio', days: 31, offset: 3 }, { name: 'Agosto', days: 31, offset: 6 }, { name: 'Septiembre', days: 30, offset: 2 },
              { name: 'Octubre', days: 31, offset: 4 }, { name: 'Noviembre', days: 30, offset: 0 }, { name: 'Diciembre', days: 31, offset: 2 }
            ].map((month, mIdx) => (
              <div key={month.name} className="bg-slate-100 rounded-2xl p-4 border border-slate-200 shadow-sm">
                <h3 className="font-extrabold text-[#0D2538] text-center mb-3 border-b border-slate-200 pb-2">{month.name}</h3>
                
                {/* Días de la semana */}
                <div className="grid grid-cols-7 gap-1 text-[9px] font-black text-[#4A5568] text-center mb-1">
                  <div>L</div><div>M</div><div>M</div><div>J</div><div>V</div><div>S</div><div>D</div>
                </div>
                
                {/* Números de días */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold">
                  {Array.from({ length: month.offset }).map((_, i) => (
                    <div key={`empty-${i}`}></div>
                  ))}
                  
                  {Array.from({ length: month.days }).map((_, i) => {
                    const day = i + 1;
                    let dayClass = "hover:bg-slate-200 text-[#333A42] rounded-md py-1 transition-colors cursor-pointer";
                    let title = "";

                    if (mIdx === 4 && day >= 4 && day <= 9) { dayClass = "bg-red-500 text-white font-bold rounded-md py-1 shadow-sm"; title = "Exámenes Parciales"; }
                    else if (mIdx === 6 && day >= 6 && day <= 11) { dayClass = "bg-red-500 text-white font-bold rounded-md py-1 shadow-sm"; title = "Exámenes Finales"; }
                    else if (mIdx === 9 && day >= 5 && day <= 10) { dayClass = "bg-red-500 text-white font-bold rounded-md py-1 shadow-sm"; title = "Exámenes Parciales S2"; }
                    else if (mIdx === 11 && day >= 7 && day <= 12) { dayClass = "bg-red-500 text-white font-bold rounded-md py-1 shadow-sm"; title = "Exámenes Finales S2"; }
                    else if (mIdx === 5 && day >= 10 && day <= 14) { dayClass = "bg-emerald-500 text-white font-bold rounded-md py-1 shadow-sm"; title = "Semana de Bienestar"; }
                    else if (mIdx === 10 && day >= 2 && day <= 6) { dayClass = "bg-emerald-500 text-white font-bold rounded-md py-1 shadow-sm"; title = "Semana de Bienestar S2"; }
                    else if ((mIdx === 2 && day === 15) || (mIdx === 7 && day === 10)) { dayClass = "bg-blue-500 text-white font-bold rounded-md py-1 shadow-sm"; title = "Inicio de Clases"; }

                    return (
                      <div key={day} className={dayClass} title={title}>
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
