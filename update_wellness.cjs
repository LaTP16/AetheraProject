const fs = require('fs');

const frontendRecs = JSON.parse(fs.readFileSync('C:/Users/USER/Desktop/AetheraProject/Datasets/frontend_recs.json', 'utf8'));

// Format recommendations to include actual icon references as strings for the script to replace
const recsString = '[\n' + frontendRecs.map(r => `  {
    service_id: '${r.service_id}',
    category: '${r.category}',
    categoryLabel: '${r.categoryLabel}',
    title: '${r.title}',
    description: '${r.description}',
    schedule: '${r.schedule}',
    location: '${r.location}',
    capacity: '${r.capacity}',
    eligibility: '${r.eligibility}',
    referralReqs: '${r.referralReqs}',
    icon: ${r.category === 'SERVICIOS' ? 'Stethoscope' : (r.category === 'APOYO' ? 'UserCheck' : 'BookOpen')},
    tagBg: '${r.category === 'SERVICIOS' ? 'bg-cyan-800 text-[#0D2538]' : (r.category === 'APOYO' ? 'bg-blue-700 text-[#0D2538]' : 'bg-teal-700 text-[#0D2538]')}'
  }`).join(',\n') + '\n]';

const componentCode = `import React, { useState } from 'react';
import { Heart, Leaf, Stethoscope, Star, Sparkles, MessageCircle, BookOpen, ShieldCheck, ArrowRight, UserCheck, ArrowLeft } from 'lucide-react';

export default function WellnessSection() {
  const [problemQuery, setProblemQuery] = useState('');
  const [derivationResult, setDerivationResult] = useState(null);
  const [isDeriving, setIsDeriving] = useState(false);
  
  // NEW STATES
  const [activeScreen, setActiveScreen] = useState('MAIN'); // 'MAIN' or 'CATEGORY_VIEW'
  const [activeCategory, setActiveCategory] = useState(null); // 'APOYO', 'RECURSOS', 'SERVICIOS'
  const [selectedItem, setSelectedItem] = useState(null);

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

  const recommendations = ${recsString};

  const handleDerive = async (e) => {
    e.preventDefault();
    if (!problemQuery.trim()) return;

    setIsDeriving(true);
    try {
      const response = await fetch('http://localhost:3001/api/bienestar/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuery: problemQuery })
      });

      if (!response.ok) throw new Error('Error al conectar con la IA');

      const data = await response.json();

      if (data.isGibberish) {
        setDerivationResult({
          text: data.intro || 'No pudimos entender tu consulta. ¿Podrías ser más específico?',
          targetId: null
        });
      } else {
        setDerivationResult({
          text: \`\${data.intro} \${data.steps.join(' ')}\`,
          targetId: data.recommendedServiceId || null
        });
      }
    } catch (error) {
      console.error(error);
      setDerivationResult({
        text: 'Lo sentimos, hubo un error al procesar tu solicitud con el sistema RAG.',
        targetId: null
      });
    } finally {
      setIsDeriving(false);
    }
  };

  const openCategoryView = (catId) => {
    setActiveCategory(catId);
    setActiveScreen('CATEGORY_VIEW');
  };

  return (
    <div className="flex-1 p-6 sm:p-10 max-w-6xl mx-auto w-full space-y-8 animate-fadeIn">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-black text-[#0D2538] tracking-wider uppercase">
          BIENESTAR
        </h1>
        <p className="text-[#4A5568] text-sm sm:text-base font-semibold tracking-wide">
          Cuídate de ti hoy, para llegar más lejos mañana
        </p>
      </div>

      {activeScreen === 'MAIN' ? (
        <>
          {/* SEARCH / DERIVATION PROMPT BOX */}
          <div className="bg-white backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-w-3xl mx-auto transition-all">
            <form onSubmit={handleDerive} className="space-y-4">
              <div className="text-center space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold text-[#0D2538]">
                  ¿Qué problema tienes?
                </h2>
                <p className="text-xs sm:text-sm text-[#4A5568] font-medium">
                  (donde te ayudará a derivarte a las opciones)
                </p>
              </div>

              <div className="relative">
                <textarea
                  rows={3}
                  value={problemQuery}
                  onChange={(e) => setProblemQuery(e.target.value)}
                  placeholder="Ej. Siento mucho estrés por la sobrecarga de exámenes finales..."
                  className="w-full p-4 rounded-2xl bg-slate-100 text-[#0D2538] placeholder-slate-500 font-medium text-sm border border-slate-200 focus:outline-none focus:border-blue-500 transition-all resize-none shadow-inner"
                ></textarea>
                <button
                  type="submit"
                  disabled={isDeriving}
                  className="mt-3 w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-[#0D2538] font-bold text-sm rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 ml-auto transition-all active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>{isDeriving ? 'Analizando...' : 'Derivar Opciones de Apoyo ✨'}</span>
                </button>
              </div>
            </form>

            {/* DERIVATION RESULT BANNER */}
            {derivationResult && (
              <div className="mt-5 p-4 sm:p-5 bg-slate-100/80 rounded-2xl border border-cyan-500/30 space-y-2 animate-fadeIn text-[#333A42]">
                <div className="flex items-center gap-2 text-[#1D63B8] font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Recomendación Inteligente de Derivación:</span>
                </div>
                <p className="text-xs sm:text-sm text-[#333A42] font-medium pl-7">
                  {derivationResult.text}
                </p>
                <div className="pt-2 pl-7 flex gap-2">
                  {derivationResult.targetId && (
                    <button
                      onClick={() => {
                        const item = recommendations.find(r => r.service_id === derivationResult.targetId);
                        if(item) setSelectedItem(item);
                      }}
                      className="px-3.5 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-500 transition-colors"
                    >
                      Ver recomendación sugerida
                    </button>
                  )}
                  <button
                    onClick={() => setDerivationResult(null)}
                    className="px-3.5 py-1.5 bg-slate-200 text-[#333A42] font-bold text-xs rounded-lg hover:bg-slate-300 transition-colors border border-slate-300"
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
              return (
                <div
                  key={cat.id}
                  onClick={() => openCategoryView(cat.id)}
                  className="bg-white p-6 sm:p-8 rounded-3xl cursor-pointer transition-all duration-300 flex flex-col justify-between border border-slate-200 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 backdrop-blur-md"
                >
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#1D63B8]/10 border border-blue-500/30 text-[#1D63B8] flex items-center justify-center shadow-md">
                      <Icon className="w-8 h-8" />
                    </div>

                    <div>
                      <h3 className="font-extrabold text-2xl text-[#0D2538] tracking-tight">
                        {cat.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium text-[#4A5568] mt-2 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-200">
                    <span className="text-xs font-bold text-[#1D63B8]">
                      Ver todas las opciones
                    </span>
                    <span className="w-7 h-7 rounded-full bg-slate-100 text-[#0D2538] flex items-center justify-center font-bold text-sm border border-slate-200">
                      →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* CATEGORY VIEW SCREEN */}
          <div className="space-y-6">
            <button 
              onClick={() => setActiveScreen('MAIN')}
              className="flex items-center gap-2 text-[#4A5568] hover:text-[#1D63B8] font-bold transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al Inicio
            </button>
            
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D2538] tracking-wide">
                Catálogo completo: {categories.find(c => c.id === activeCategory)?.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendations.filter(r => r.category === activeCategory).map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={item.service_id}
                    className="bg-white border border-slate-200 hover:border-[#1D63B8] rounded-3xl p-5 shadow-xl hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 group backdrop-blur-md"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider bg-[#1D63B8]/10 border border-blue-500/30 text-[#1D63B8]">
                          {item.categoryLabel}
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[#1D63B8] border border-slate-200">
                          <ItemIcon className="w-4 h-4" />
                        </div>
                      </div>

                      <h3 className="font-extrabold text-[#0D2538] text-base leading-snug group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-xs font-medium text-[#4A5568] leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-200 space-y-2">
                      <p className="text-[11px] font-bold text-[#1D63B8]">
                        📅 {item.schedule}
                      </p>
                      <p className="text-[10px] font-medium text-[#4A5568] truncate">
                        📍 {item.location}
                      </p>

                      <button onClick={() => setSelectedItem(item)} className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-500 text-[#0D2538] text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                        <span>Indagar Más</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* MODAL PARA INDAGAR MÁS */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-fadeIn">
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"
            >
              x
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#1D63B8]">
                <selectedItem.icon className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-[#0D2538]">{selectedItem.title}</h2>
            </div>
            
            <p className="text-sm text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl">
              {selectedItem.description}
            </p>
            
            <div className="space-y-4">
              <h3 className="font-bold text-[#0D2538] text-sm border-b pb-1">Información de Acceso (Para Derivación)</h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase">Horario</span>
                  <span className="text-[#1D63B8] font-medium">{selectedItem.schedule}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase">Canales / Distrito</span>
                  <span className="text-[#1D63B8] font-medium">{selectedItem.location}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase">Capacidad Semanal</span>
                  <span className="text-slate-700">{selectedItem.capacity}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase">Elegibilidad</span>
                  <span className="text-slate-700">{selectedItem.eligibility}</span>
                </div>
              </div>

              <div className="mt-2 bg-blue-50 border border-blue-100 p-3 rounded-xl">
                <span className="block text-xs font-bold text-blue-400 uppercase">Requisitos para Derivación (Referral Info)</span>
                <span className="text-blue-800 text-sm font-medium">{selectedItem.referralReqs}</span>
              </div>
            </div>

            <button className="w-full mt-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-colors shadow-lg">
              Confirmar Reserva / Acceder
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
`;

fs.writeFileSync('C:/Users/USER/Desktop/AetheraProject/src/components/WellnessSection.jsx', componentCode);
console.log('Done!');
