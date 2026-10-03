import React from 'react';
import { 
  User, MapPin, Briefcase, Moon, AlertTriangle, 
  TrendingDown, Calendar, Clock, Activity, BookOpen 
} from 'lucide-react';

const StudentProfile = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-slate-50 min-h-screen font-sans">
      
      {/* Header Profile */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Estudiante STU_AE_002288</h1>
            <p className="text-slate-500 flex items-center gap-2">
              <BookOpen size={16} /> UNI_HORIZONTE | Etapa Intermedia
            </p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="mt-4 md:mt-0 px-4 py-2 bg-orange-100 border border-orange-200 rounded-lg flex items-center gap-2 text-orange-700">
          <AlertTriangle size={20} />
          <span className="font-semibold">Alerta de Deserción: Media</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Contexto */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Activity size={20} className="text-slate-500" /> Contexto Personal
            </h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-600">
                <MapPin size={18} className="text-blue-500" />
                <span>Migrante Interno (Red de apoyo: Limitada)</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600">
                <Briefcase size={18} className="text-purple-500" />
                <span>Trabaja Part-time (25 hrs/semana)</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600">
                <Moon size={18} className="text-indigo-500" />
                <span>Duerme ~6.9 hrs diarias</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Salud Mental</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Estrés</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-md font-medium">Moderado (13)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Ansiedad</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-md font-medium">Baja (2)</span>
              </div>
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm flex items-start gap-2">
                <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                <p>Reporta fuerte sobrecarga por evaluaciones académicas.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Rendimiento y Servicios */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Rendimiento Academico */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingDown size={20} className="text-slate-500" /> Rendimiento Académico
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { p: "Periodo 1", grade: "5.27", att: "91%" },
                { p: "Periodo 2", grade: "5.34", att: "88%" },
                { p: "Periodo 3", grade: "4.84", att: "74%", alert: true },
                { p: "Periodo 4", grade: "4.65", att: "79%", alert: true },
              ].map((term, i) => (
                <div key={i} className={`p-4 rounded-xl border ${term.alert ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-200'} text-center`}>
                  <p className="text-sm text-slate-500 mb-1">{term.p}</p>
                  <p className={`text-2xl font-bold ${term.alert ? 'text-orange-600' : 'text-slate-800'}`}>{term.grade}</p>
                  <p className="text-xs text-slate-500 mt-1">Asist: {term.att}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500 mt-4 italic">Se observa una caída de 0.69 puntos y menor asistencia al asumir 25 horas de trabajo part-time.</p>
          </div>

          {/* Historial de Atenciones */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-slate-500" /> Interacciones con Servicios
            </h2>
            <div className="space-y-4">
              
              <div className="relative pl-6 border-l-2 border-slate-200 pb-4">
                <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-slate-800">Solicitud por Presión Académica</h3>
                    <p className="text-sm text-slate-500 mt-1">Canal Digital • Derivado a Consejería</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md font-bold flex items-center gap-1">
                      <Clock size={12} /> 43 días de espera
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative pl-6 border-l-2 border-slate-200">
                <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-slate-800">Solicitud por Presión Académica</h3>
                    <p className="text-sm text-slate-500 mt-1">Vía Telefónica • Derivado a Consejería</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md font-bold flex items-center gap-1">
                      <Clock size={12} /> 45 días de espera
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
