import React, { useState } from 'react';
import { Heart, Leaf, Stethoscope, Star, Sparkles, MessageCircle, BookOpen, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';

export default function WellnessSection() {
  const [problemQuery, setProblemQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');
  const [derivationResult, setDerivationResult] = useState(null);
  const [isDeriving, setIsDeriving] = useState(false);

  const categories = [
    {
      id: 'APOYO',
      title: 'Apoyo',
      icon: Heart,
      description: 'Información y orientación hacia comunidades de apoyo general',
      bgColor: 'bg-[#98C2D1]',
      badgeColor: 'bg-[#2A5C70]'
    },
    {
      id: 'RECURSOS',
      title: 'Recursos',
      icon: Leaf,
      description: 'Guías, tips y herramientas para tu día a día',
      bgColor: 'bg-[#98C2D1]',
      badgeColor: 'bg-[#2A5C70]'
    },
    {
      id: 'SERVICIOS',
      title: 'Servicios',
      icon: Stethoscope,
      description: 'Si necesitas ayuda, aquí encontrarás información sobre servicios disponibles en tu universidad',
      bgColor: 'bg-[#98C2D1]',
      badgeColor: 'bg-[#2A5C70]'
    }
  ];

  const recommendations = [
    {
      id: 1,
      category: 'APOYO',
      categoryLabel: 'Apoyo Emocional',
      title: 'Taller de Manejo de Estrés y Ansiedad Académica',
      description: 'Sesiones semanales grupales guiadas por orientadores psicopedagógicos para abordar la carga de parciales.',
      schedule: 'Martes y Jueves • 16:00 hrs',
      location: 'Edificio de Bienestar / Vía Zoom',
      icon: Heart,
      tagBg: 'bg-teal-700 text-white'
    },
    {
      id: 2,
      category: 'RECURSOS',
      categoryLabel: 'Recursos & Guías',
      title: 'Kit Digital de Respiración y Mindfulness',
      description: 'Audios guiados de 5 y 10 minutos diseñados específicamente para momentos de alta tensión antes de exponer o rendir un examen.',
      schedule: 'Acceso 24/7 en línea',
      location: 'Descarga directa PDF / MP3',
      icon: Leaf,
      tagBg: 'bg-emerald-700 text-white'
    },
    {
      id: 3,
      category: 'SERVICIOS',
      categoryLabel: 'Servicios Universitarios',
      title: 'Centro de Atención Psicológica y Psicopedagógica',
      description: 'Consultas individuales y confidenciales con profesionales capacitados. Reserva tu cita sin costo para estudiantes.',
      schedule: 'Lunes a Viernes • 08:00 a 18:00',
      location: 'Consultorio 104 - Módulo A',
      icon: Stethoscope,
      tagBg: 'bg-cyan-800 text-white'
    },
    {
      id: 4,
      category: 'APOYO',
      categoryLabel: 'Red de Pares',
      title: 'Línea de Escucha Activa entre Estudiantes',
      description: 'Espacio seguro y anónimo atendido por compañeros capacitados en primeros auxilios emocionales y contención.',
      schedule: 'Todos los días • 18:00 a 23:00',
      location: 'Chat seguro en LinkUP',
      icon: UserCheck,
      tagBg: 'bg-blue-700 text-white'
    }
  ];

  const handleDerive = (e) => {
    e.preventDefault();
    if (!problemQuery.trim()) return;

    setIsDeriving(true);
    setTimeout(() => {
      setIsDeriving(false);
      const queryLower = problemQuery.toLowerCase();
      if (queryLower.includes('estrés') || queryLower.includes('ansiedad') || queryLower.includes('presión') || queryLower.includes('triste')) {
        setDerivationResult({
          recommendedCategory: 'APOYO',
          text: 'Te sugerimos conectar con la categoría "Apoyo Emocional". El Taller de Manejo de Estrés y la Red de Escucha Activa son tus mejores opciones inmediatas.',
          targetId: 1
        });
      } else if (queryLower.includes('examen') || queryLower.includes('estudiar') || queryLower.includes('tiempo') || queryLower.includes('sueño')) {
        setDerivationResult({
          recommendedCategory: 'RECURSOS',
          text: 'Te sugerimos revisar los "Recursos & Guías". El Kit Digital de Mindfulness e Higiene del Sueño te ayudará a regular el foco.',
          targetId: 2
        });
      } else {
        setDerivationResult({
          recommendedCategory: 'SERVICIOS',
          text: 'Basado en tu consulta, te recomendamos agendar una cita directa en "Servicios Universitarios" con el Centro de Atención Psicológica.',
          targetId: 3
        });
      }
    }, 600);
  };

  const filteredRecommendations = activeCategoryFilter === 'ALL'
    ? recommendations
    : recommendations.filter(r => r.category === activeCategoryFilter);

  return (
    <div className="flex-1 p-6 sm:p-10 max-w-6xl mx-auto w-full space-y-8 animate-fadeIn">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-wider uppercase">
          BIENESTAR
        </h1>
        <p className="text-slate-400 text-sm sm:text-base font-semibold tracking-wide">
          Cuídate de ti hoy, para llegar más lejos mañana
        </p>
      </div>

      {/* SEARCH / DERIVATION PROMPT BOX */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 max-w-3xl mx-auto transition-all">
        <form onSubmit={handleDerive} className="space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              ¿Qué problema tienes?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              (donde te ayudará a derivarte a las opciones)
            </p>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={problemQuery}
              onChange={(e) => setProblemQuery(e.target.value)}
              placeholder="Ej. Siento mucho estrés por la sobrecarga de exámenes finales y no sé cómo organizarme..."
              className="w-full p-4 rounded-2xl bg-slate-800/60 text-white placeholder-slate-500 font-medium text-sm border border-slate-700 focus:outline-none focus:border-blue-500 transition-all resize-none shadow-inner"
            ></textarea>
            <button
              type="submit"
              disabled={isDeriving}
              className="mt-3 w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 ml-auto transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>{isDeriving ? 'Analizando...' : 'Derivar Opciones de Apoyo ✨'}</span>
            </button>
          </div>
        </form>

        {/* DERIVATION RESULT BANNER */}
        {derivationResult && (
          <div className="mt-5 p-4 sm:p-5 bg-slate-800/80 rounded-2xl border border-cyan-500/30 space-y-2 animate-fadeIn text-slate-200">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Recomendación Inteligente de Derivación:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium pl-7">
              {derivationResult.text}
            </p>
            <div className="pt-2 pl-7 flex gap-2">
              <button
                onClick={() => setActiveCategoryFilter(derivationResult.recommendedCategory)}
                className="px-3.5 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-500 transition-colors"
              >
                Ver opciones de {derivationResult.recommendedCategory}
              </button>
              <button
                onClick={() => setDerivationResult(null)}
                className="px-3.5 py-1.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-lg hover:bg-slate-700 transition-colors border border-slate-700"
              >
                Limpiar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3 MAIN CATEGORY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeCategoryFilter === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => setActiveCategoryFilter(isSelected ? 'ALL' : cat.id)}
              className={`p-6 sm:p-8 rounded-3xl cursor-pointer transition-all duration-300 flex flex-col justify-between border shadow-xl hover:shadow-2xl transform hover:-translate-y-1.5 backdrop-blur-md ${
                isSelected
                  ? 'bg-blue-600/30 border-blue-400 ring-2 ring-blue-400/50 shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
              }`}
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-md">
                  <Icon className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="font-extrabold text-2xl text-white tracking-tight">
                    {cat.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-400 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-xs font-bold text-cyan-400">
                  {isSelected ? 'Filtrado activo' : 'Explorar sección'}
                </span>
                <span className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm border border-slate-700">
                  →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* RECOMENDADO PARA TI SECTION */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-400 flex items-center justify-center shadow-md">
            <Star className="w-5 h-5 fill-amber-400 stroke-amber-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            Recomendado para ti
          </h2>
          {activeCategoryFilter !== 'ALL' && (
            <button
              onClick={() => setActiveCategoryFilter('ALL')}
              className="ml-auto text-xs font-bold px-3 py-1 bg-slate-800 text-slate-300 rounded-full hover:bg-slate-700 border border-slate-700"
            >
              Ver Todos ({recommendations.length})
            </button>
          )}
        </div>

        {/* 4 SYNTHETIC EXAMPLE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredRecommendations.map((item) => {
            const ItemIcon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 rounded-3xl p-5 shadow-xl hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 group backdrop-blur-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider bg-blue-500/20 border border-blue-500/30 text-blue-400">
                      {item.categoryLabel}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400 border border-slate-700">
                      <ItemIcon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-extrabold text-white text-base leading-snug group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs font-medium text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 space-y-2">
                  <p className="text-[11px] font-bold text-cyan-400">
                    📅 {item.schedule}
                  </p>
                  <p className="text-[10px] font-medium text-slate-400 truncate">
                    📍 {item.location}
                  </p>

                  <button className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                    <span>Acceder</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
