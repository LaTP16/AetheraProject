import React, { useState } from 'react';
import { 
  Home, Target, Users, Heart, BookOpen, User, Bell, Sparkles, Send, Video, Edit3, MessageSquare, Share2
} from 'lucide-react';
import OpportunitiesSection from './components/OpportunitiesSection';
import CommunitySection from './components/CommunitySection';
import WellnessSection from './components/WellnessSection';
import LearningSection from './components/LearningSection';

export default function App() {
  const [activeTab, setActiveTab] = useState('INICIO');

  // INICIO STATE
  const [userQuery, setUserQuery] = useState('Últimamente necesito buscar empleo en el área de Análisis de Datos pero no sé por dónde comenzar');
  const [aiResponse, setAiResponse] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [selectedCardModal, setSelectedCardModal] = useState(null);

  const navItems = [
    { id: 'INICIO', label: 'INICIO', icon: Home },
    { id: 'OPORTUNIDADES', label: 'OPORTUNIDADES', icon: Target },
    { id: 'COMUNIDAD', label: 'COMUNIDAD', icon: Users },
    { id: 'BIENESTAR', label: 'BIENESTAR', icon: Heart },
    { id: 'APRENDIZAJE', label: 'APRENDIZAJE', icon: BookOpen },
    { id: 'PERFIL', label: 'PERFIL', icon: User },
  ];

  const newsCards = [
    { id: 1, title: 'Nuevas Becas Disponibles para estudiar en el extranjero', category: 'Beca Internacional', tag: '¡Nueva Beca!', details: 'Convocatorias abiertas para maestría y pasantías en Europa y Latinoamérica con cobertura del 80% al 100%.' },
    { id: 2, title: 'Recomendaciones para estudiar y organizar tu tiempo', category: 'Técnicas de Estudio', tag: 'Guía Recomendada', details: 'Aprende la técnica Pomodoro avanzada y cómo evitar la sobrecarga cognitiva en semanas de exámenes.' },
    { id: 3, title: 'Últimas Novedades en Tecnología e Inteligencia Artificial', category: 'Tecnología', tag: 'Tendencia Tech', details: 'Descubre las herramientas de IA generativa y análisis de datos que están transformando la industria actual.' },
    { id: 4, title: 'Aumentan las ofertas Laborales en Data Science y Análisis', category: 'Empleabilidad', tag: 'Mercado Laboral', details: 'Las empresas buscan perfiles junior en Python, SQL y Power BI. Conoce las vacantes universitarias activas.' },
    { id: 5, title: '¡Tú puedes bro! Consejos de Salud Mental y Motivación', category: 'Bienestar Estudiantil', tag: 'Apoyo 24/7', details: 'Espacio de regulación emocional y recordatorio: tu bienestar vale más que cualquier nota.' },
    { id: 6, title: 'Nuevas comunidades de acompañamiento en vivo', category: 'Comunidad LinkUP', tag: 'Red Estudiantil', details: 'Únete a las salas grupales de estudio en vivo y conecta con compañeros de distintas carreras.' }
  ];

  const handleAskAI = () => {
    if (!userQuery.trim()) return;
    setLoadingAI(true);
    setTimeout(() => {
      setLoadingAI(false);
      setAiResponse({
        text: '¡Hola Mateo! Para comenzar en Análisis de Datos, te sugiero esta ruta personalizada en 3 pasos:',
        steps: [
          '1. Dominar Fundamentos: Refuerza SQL básico y manipulación de datos en Python (Pandas/NumPy).',
          '2. Crear 2 Proyectos Reales: Desarrolla un dashboard interactivo en Power BI o Tableau con datos abiertos.',
          '3. Postular a Vacantes Junior: Aplica a las convocatorias de la sección de Oportunidades en LinkUP.'
        ]
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#4C8FA8]">
      
      {/* ==================== LEFT SIDEBAR NAVIGATION ==================== */}
      <aside className="w-full lg:w-72 bg-[#92BAC8]/80 backdrop-blur-md border-r border-[#7DA8B8] flex flex-col justify-between shrink-0 shadow-lg">
        <div>
          {/* LOGO LINKUP */}
          <div className="p-6 flex items-center gap-3 border-b border-[#7DA8B8]">
            <div className="w-11 h-11 rounded-2xl bg-[#2C5D71] flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-2xl text-slate-900 tracking-tight leading-none">LinkUP</h1>
              <p className="text-[11px] font-semibold text-[#1A4050] mt-1">Plataforma Estudiantil</p>
            </div>
          </div>

          {/* NAV MENU */}
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#B6D6E2] text-[#163847] shadow-md border border-[#8FBAC9]'
                      : 'text-[#1E4353] hover:bg-[#A3CAD7]/60 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#163847]' : 'text-[#2C5667]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* SIDEBAR FOOTER USER INFO */}
        <div className="p-4 m-4 bg-[#A3CAD7]/50 rounded-2xl border border-[#8FBAC9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2C5D71] text-white flex items-center justify-center font-bold text-sm">
              MB
            </div>
            <div>
              <p className="font-bold text-xs text-[#163847]">Mateo Benítez</p>
              <p className="text-[10px] text-[#244E60]">Estudiante de Sistemas</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ==================== MAIN CONTENT CANVAS ==================== */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#4C8FA8]">
        
        {/* TOP HEADER */}
        <header className="px-6 py-4 flex items-center justify-between border-b border-[#629EB4]">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 bg-white/20 text-white rounded-full">
              Semestre 2026-1
            </span>
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <a href="#about" className="text-sm font-semibold text-white hover:text-slate-100 transition-colors">About Us</a>
            <a href="#service" className="text-sm font-semibold text-white hover:text-slate-100 transition-colors">Service</a>
            <a href="#contact" className="text-sm font-semibold text-white hover:text-slate-100 transition-colors">Contact</a>
            
            <button className="p-2 text-white hover:bg-white/20 rounded-xl relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full"></span>
            </button>

            <div className="w-9 h-9 rounded-full bg-white/20 border-2 border-white flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                alt="User Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* CONDITIONALLY RENDER ALL 6 TABS */}
        {activeTab === 'INICIO' && (
          <div className="flex-1 p-6 sm:p-8 max-w-6xl mx-auto w-full space-y-8">
            <div className="text-center pt-2">
              <h1 className="text-3xl sm:text-5xl font-black tracking-wider text-white uppercase drop-shadow-xs">BIENVENIDO MATEO</h1>
              <p className="text-white/80 text-sm mt-1">¿En qué área o reto universitario te gustaría enfocar hoy?</p>
            </div>

            <div className="bg-[#CBDDE6] rounded-3xl p-6 sm:p-8 shadow-xl border border-white/40 max-w-3xl mx-auto">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-[#2C5D71]" />
                <label className="font-bold text-[#1F4555] text-sm sm:text-base">Ingrese su Consulta:</label>
              </div>

              <textarea
                rows={3}
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="w-full p-4 rounded-2xl bg-[#EAF2F6] text-slate-800 font-medium text-sm border border-slate-300 shadow-inner focus:outline-none"
              ></textarea>

              <button onClick={handleAskAI} disabled={loadingAI} className="mt-3 px-6 py-3 bg-[#2C5D71] hover:bg-[#1E4353] text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 ml-auto">
                {loadingAI ? 'Consultando IA...' : 'Orientarme con IA ✨'}
              </button>

              {aiResponse && (
                <div className="mt-5 p-5 bg-[#F2F8FA] rounded-2xl border border-[#A4C7D5] text-xs sm:text-sm space-y-2">
                  <p className="font-bold text-[#2C5D71]">{aiResponse.text}</p>
                  <ul className="space-y-1.5 pl-2">{aiResponse.steps.map((step, idx) => <li key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200">{step}</li>)}</ul>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">Seccion de Noticias & Novedades</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {newsCards.map((card) => (
                  <div key={card.id} onClick={() => setSelectedCardModal(card)} className="bg-[#EBD6B0] hover:bg-[#E3CA9B] p-6 rounded-2xl shadow-lg border-2 border-[#D6C29E] cursor-pointer transition-all transform hover:-translate-y-1 flex flex-col justify-between min-h-[160px]">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 bg-[#2C5D71] text-white text-[10px] font-bold rounded-md mb-3">{card.category}</span>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">{card.title}</h3>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-[#D0BA93]">
                      <span className="font-semibold text-slate-700">{card.tag}</span>
                      <span className="font-bold text-[#2C5D71]">Leer más →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'OPORTUNIDADES' && <OpportunitiesSection />}
        
        {activeTab === 'COMUNIDAD' && <CommunitySection />}

        {activeTab === 'BIENESTAR' && <WellnessSection />}

        {activeTab === 'APRENDIZAJE' && <LearningSection />}

        {activeTab === 'PERFIL' && (
          <div className="flex-1 p-6 sm:p-8 max-w-6xl mx-auto w-full space-y-6">
            <div>
              <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-wider">MI PERFIL</h1>
              <p className="text-white/90 text-sm font-medium mt-1">Información académica y profesional</p>
            </div>

            <div className="bg-[#CBDDE6] rounded-3xl p-6 sm:p-8 shadow-xl border border-white/40 space-y-6">
              <div className="flex items-center gap-4 border-b border-slate-300 pb-6">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" alt="Mateo" className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md" />
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Mateo Benítez</h2>
                  <p className="text-sm font-bold text-[#2C5D71]">Ingeniería de Sistemas • 7mo Semestre</p>
                  <p className="text-xs text-slate-600 mt-1">Universidad Aethera • Código: STU_AE_012253</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-semibold">Promedio Acumulado</span>
                  <p className="text-2xl font-black text-[#2C5D71]">4.5 / 5.0</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-semibold">Créditos Aprobados</span>
                  <p className="text-2xl font-black text-[#2C5D71]">112 / 160</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL DETALLE DE NOTICIA */}
      {selectedCardModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#F6EFE3] rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-[#D0BA93] space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-1 bg-[#2C5D71] text-white text-xs font-bold rounded-md">
                  {selectedCardModal.category}
                </span>
                <h3 className="font-bold text-slate-900 text-lg mt-2">{selectedCardModal.title}</h3>
              </div>
              <button onClick={() => setSelectedCardModal(null)} className="text-slate-500 font-bold hover:text-slate-800 text-xl">✕</button>
            </div>

            <p className="text-slate-700 text-sm leading-relaxed">{selectedCardModal.details}</p>

            <div className="pt-3 border-t border-[#D0BA93] flex justify-end gap-2">
              <button onClick={() => setSelectedCardModal(null)} className="px-4 py-2 bg-slate-300 hover:bg-slate-400 text-slate-800 font-bold text-xs rounded-xl">
                Cerrar
              </button>
              <button onClick={() => setSelectedCardModal(null)} className="px-4 py-2 bg-[#2C5D71] hover:bg-[#1E4353] text-white font-bold text-xs rounded-xl shadow-md">
                Explorar Recurso
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
