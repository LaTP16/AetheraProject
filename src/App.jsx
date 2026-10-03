import React, { useState } from 'react';
import { 
  Home, Target, Users, Heart, BookOpen, User, Bell, Sparkles, Send, Video, Edit3, MessageSquare, Share2, MapPin, Briefcase, Moon, AlertTriangle
} from 'lucide-react';
import OpportunitiesSection from './components/OpportunitiesSection';
import CommunitySection from './components/CommunitySection';
import WellnessSection from './components/WellnessSection';
import LearningSection from './components/LearningSection';
import LandingPage from './components/LandingPage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('INICIO');
  const [showNotifications, setShowNotifications] = useState(false);

  // INICIO STATE
  const [userQuery, setUserQuery] = useState('Últimamente necesito buscar empleo en el área de Análisis de Datos pero no sé por dónde comenzar');
  const [aiResponse, setAiResponse] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [selectedCardModal, setSelectedCardModal] = useState(null);

  if (!isAuthenticated) {
    return <LandingPage onLogin={(id) => setIsAuthenticated(true)} />;
  }

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
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#070B14] text-white relative overflow-hidden font-sans">
      
      {/* Animaciones y elementos de fondo dinámicos idénticos a la Landing Page */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(50px, -70px) scale(1.15); }
          66% { transform: translate(-40px, 40px) scale(0.85); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes continuousFloat {
          0% { transform: translateY(110vh) translateX(0px); }
          100% { transform: translateY(-110vh) translateX(40px); }
        }
        .animate-blob { animation: blob 12s infinite alternate ease-in-out; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .star-continuous { 
          position: absolute; 
          background: white; 
          border-radius: 50%; 
          animation: continuousFloat linear infinite; 
        }
      `}</style>

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-500/15 blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-500/15 blur-[120px] animate-blob animation-delay-4000"></div>
        
        {Array.from({ length: 60 }).map((_, i) => (
          <div 
            key={"star-app-" + i} 
            className="star-continuous"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              animationDuration: (Math.random() * 25 + 15) + 's',
              animationDelay: '-' + (Math.random() * 30) + 's',
              opacity: Math.random() * 0.5 + 0.2
            }}
          ></div>
        ))}
      </div>

      {/* ==================== LEFT SIDEBAR NAVIGATION ==================== */}
      <aside className="relative z-10 w-full lg:w-72 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 flex flex-col justify-between shrink-0 shadow-2xl">
        <div>
          {/* LOGO LINKUP */}
          <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <img src="/linkup-logo.png" alt="LinkUP" className="w-11 h-11 object-contain shrink-0" />
            <div>
              <h1 className="font-extrabold text-2xl text-white tracking-tight leading-none">LinkUP</h1>
              <p className="text-[11px] font-semibold text-blue-400 mt-1">Plataforma Estudiantil</p>
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
                      ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400/40'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* ==================== MAIN CONTENT CANVAS ==================== */}
      <main className="relative z-10 flex-1 flex flex-col min-w-0 bg-transparent">
        
        {/* TOP HEADER */}
        <header className="px-6 py-4 flex items-center justify-end border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md relative z-20">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-3 text-cyan-400 hover:text-white bg-slate-800/80 hover:bg-blue-600/30 border border-slate-700 hover:border-blue-500/60 rounded-2xl relative transition-all shadow-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] cursor-pointer group flex items-center justify-center"
              title="Notificaciones"
            >
              <Bell className="w-7 h-7 transform group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-cyan-400 rounded-full animate-pulse ring-2 ring-slate-900 shadow-[0_0_10px_rgba(34,211,238,1)]"></span>
            </button>

            {/* NOTIFICATIONS DROPDOWN */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700 overflow-hidden z-50 animate-fadeIn text-slate-200">
                <div className="bg-slate-800/80 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
                  <h3 className="font-bold text-white text-sm">Notificaciones</h3>
                  <span className="text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold">3 nuevas</span>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-800">
                  <div className="p-4 hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-bold mb-0.5">¡Match de Pasantía! 🚀</p>
                      <p className="text-xs text-slate-400 leading-snug">Tu perfil coincide al 92% con la oferta "Data Analyst Junior" en Globant. Postula ahora.</p>
                      <span className="text-[10px] text-slate-500 font-medium block mt-1">Hace 2 horas</span>
                    </div>
                  </div>

                  <div className="p-4 hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-bold mb-0.5">Recordatorio de Cita Médica</p>
                      <p className="text-xs text-slate-400 leading-snug">No olvides tu sesión de apoyo (Soporte Social) programada para mañana a las 10:00 AM.</p>
                      <span className="text-[10px] text-slate-500 font-medium block mt-1">Hace 5 horas</span>
                    </div>
                  </div>

                  <div className="p-4 hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-bold mb-0.5">Sobrecarga Detectada ⚠️</p>
                      <p className="text-xs text-slate-400 leading-snug">Estás cursando 29 créditos este periodo. Te recomendamos agendar una sesión de organización.</p>
                      <span className="text-[10px] text-slate-500 font-medium block mt-1">Ayer</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 px-4 py-2.5 border-t border-slate-700 text-center">
                  <button className="text-xs font-bold text-blue-400 hover:text-blue-300">Ver todas las notificaciones</button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* CONDITIONALLY RENDER ALL 6 TABS */}
        {activeTab === 'INICIO' && (
          <div className="flex-1 p-6 sm:p-8 max-w-6xl mx-auto w-full space-y-8 animate-fadeIn">
            <div className="text-center pt-2">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
                BIENVENIDO <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">MATEO</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1">¿En qué área o reto universitario te gustaría enfocar hoy?</p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 max-w-3xl mx-auto">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <label className="font-bold text-slate-200 text-sm sm:text-base">Ingrese su Consulta:</label>
              </div>

              <textarea
                rows={3}
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-800/60 text-white placeholder-slate-500 font-medium text-sm border border-slate-700 shadow-inner focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              ></textarea>

              <button 
                onClick={handleAskAI} 
                disabled={loadingAI} 
                className="mt-3 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-2 ml-auto transition-all cursor-pointer"
              >
                {loadingAI ? 'Consultando IA...' : 'Orientarme con IA ✨'}
              </button>

              {aiResponse && (
                <div className="mt-5 p-5 bg-slate-800/40 rounded-2xl border border-blue-500/30 text-xs sm:text-sm space-y-2">
                  <p className="font-bold text-blue-400">{aiResponse.text}</p>
                  <ul className="space-y-1.5 pl-2">
                    {aiResponse.steps.map((step, idx) => (
                      <li key={idx} className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/60 text-slate-300">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">Sección de Noticias & Novedades</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {newsCards.map((card) => (
                  <div 
                    key={card.id} 
                    onClick={() => setSelectedCardModal(card)} 
                    className="bg-slate-900/60 hover:bg-slate-800/80 p-6 rounded-2xl shadow-xl border border-slate-800 hover:border-blue-500/40 cursor-pointer transition-all transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] flex flex-col justify-between min-h-[160px]"
                  >
                    <div>
                      <span className="inline-block px-2.5 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold rounded-md mb-3">
                        {card.category}
                      </span>
                      <h3 className="font-bold text-white text-sm leading-snug">{card.title}</h3>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-slate-800">
                      <span className="font-semibold text-slate-400">{card.tag}</span>
                      <span className="font-bold text-cyan-400">Leer más →</span>
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
          <div className="flex-1 p-6 sm:p-8 max-w-6xl mx-auto w-full space-y-6 overflow-y-auto h-[calc(100vh-80px)] animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-wider">MI PERFIL</h1>
                <p className="text-slate-400 text-sm font-medium mt-1">Dashboard de Alerta y Bienestar Estudiantil</p>
              </div>
              <div className="px-4 py-2 bg-amber-500/20 border border-amber-500/40 rounded-xl flex items-center gap-2 text-amber-300 shadow-md">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm">Alerta de Deserción: Media</span>
              </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
              <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" alt="Mateo" className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
                <div>
                  <h2 className="text-2xl font-black text-white">Mateo Benítez (Test Case)</h2>
                  <p className="text-sm font-bold text-blue-400">UNI_HORIZONTE • Etapa Intermedia</p>
                  <p className="text-xs text-slate-400 mt-1">Código: STU_AE_002288 • Distrito: DIST_GAIA</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Columna 1: Contexto */}
                <div className="space-y-4">
                  <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/60 shadow-sm">
                    <h3 className="font-bold text-blue-400 mb-3 flex items-center gap-2"><User className="w-4 h-4"/> Contexto Personal</h3>
                    <ul className="space-y-3 text-sm font-medium text-slate-300">
                      <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-400"/> Migrante Interno (Red Limitada)</li>
                      <li className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-cyan-400"/> Trabaja Part-time (25 hrs/sem)</li>
                      <li className="flex items-center gap-2"><Moon className="w-4 h-4 text-cyan-400"/> Duerme ~6.9 hrs diarias</li>
                    </ul>
                  </div>

                  <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/60 shadow-sm">
                    <h3 className="font-bold text-blue-400 mb-3 flex items-center gap-2"><Heart className="w-4 h-4"/> Salud Mental</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-300">Estrés</span>
                        <span className="px-2 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-md text-xs">Moderado (13)</span>
                      </div>
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-300">Ansiedad</span>
                        <span className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-md text-xs">Baja (2)</span>
                      </div>
                      <div className="mt-3 p-3 bg-red-500/10 text-red-300 text-xs font-bold rounded-xl border border-red-500/30">
                        ⚠️ Fuerte sobrecarga por evaluaciones académicas.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Columna 2 y 3: Rendimiento y Servicios */}
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/60 shadow-sm">
                    <h3 className="font-bold text-blue-400 mb-4 flex items-center gap-2"><BookOpen className="w-4 h-4"/> Historial Académico</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { p: "Periodo 1", grade: "5.27", att: "91%" },
                        { p: "Periodo 2", grade: "5.34", att: "88%" },
                        { p: "Periodo 3", grade: "4.84", att: "74%", alert: true },
                        { p: "Periodo 4", grade: "4.65", att: "79%", alert: true },
                      ].map((term, i) => (
                        <div key={i} className={`p-3 rounded-xl border ${term.alert ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-900/80 border-slate-700'} text-center`}>
                          <p className="text-xs font-bold text-slate-400">{term.p}</p>
                          <p className={`text-xl font-black mt-1 ${term.alert ? 'text-amber-400' : 'text-cyan-400'}`}>{term.grade}</p>
                          <p className="text-[10px] font-bold text-slate-500 mt-1">Asist: {term.att}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/60 shadow-sm">
                    <h3 className="font-bold text-blue-400 mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4"/> Uso de Servicios (Puntos de dolor)</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-900/80 border border-slate-700/80 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="font-bold text-white text-sm">Solicitud por Presión Académica (Digital)</p>
                          <p className="text-xs font-semibold text-slate-400 mt-0.5">Derivado a Consejería</p>
                        </div>
                        <span className="px-2.5 py-1 bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-black rounded-lg">⏱ 43 días espera</span>
                      </div>
                      <div className="p-3 bg-slate-900/80 border border-slate-700/80 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="font-bold text-white text-sm">Solicitud por Presión Académica (Teléfono)</p>
                          <p className="text-xs font-semibold text-slate-400 mt-0.5">Derivado a Consejería</p>
                        </div>
                        <span className="px-2.5 py-1 bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-black rounded-lg">⏱ 45 días espera</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL DETALLE DE NOTICIA */}
      {selectedCardModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold rounded-md">
                  {selectedCardModal.category}
                </span>
                <h3 className="font-bold text-white text-lg mt-2">{selectedCardModal.title}</h3>
              </div>
              <button onClick={() => setSelectedCardModal(null)} className="text-slate-400 font-bold hover:text-white text-xl">✕</button>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">{selectedCardModal.details}</p>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button onClick={() => setSelectedCardModal(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700">
                Cerrar
              </button>
              <button onClick={() => setSelectedCardModal(null)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                Explorar Recurso
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
