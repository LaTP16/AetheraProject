import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Target, Users, Heart, BookOpen, User, Bell, Sparkles, Send, Video, Edit3, MessageSquare, Share2, MapPin, Briefcase, Moon, AlertTriangle, Calendar
} from 'lucide-react';
import OpportunitiesSection from './components/OpportunitiesSection';
import CommunitySection from './components/CommunitySection';
import WellnessSection from './components/WellnessSection';
import LearningSection from './components/LearningSection';
import LandingPage from './components/LandingPage';
import CalendarModal from './components/CalendarModal';

const formatDistrict = (d) => {
  if (!d) return 'No especificado';
  const map = { 'DIST_GAIA': 'Distrito Gaia', 'DIST_NEBULA': 'Distrito Nebula', 'DIST_HORIZON': 'Distrito Horizon', 'DIST_VECTOR': 'Distrito Vector', 'DIST_QUANTUM': 'Distrito Quantum' };
  return map[d] || d;
};

const formatInstitution = (i) => {
  if (!i) return 'No especificado';
  const map = { 'UNI_HORIZONTE': 'Universidad Horizonte', 'UNI_NOVA_AETHER': 'Universidad Nova Aether', 'INST_NEXUS': 'Instituto Nexus' };
  return map[i] || i;
};

const formatDropoutAlert = (studentData) => {
  if (!studentData?.academic) return 'Baja';
  if (studentData.academic.some(a => a.dropout_alert === 'high')) return 'Alta';
  if (studentData.academic.some(a => a.dropout_alert === 'medium')) return 'Media';
  return 'Baja';
};

const formatPeriod = (p) => {
  if (!p) return '';
  return p.replace('PER_', 'Periodo ').replace('_', '-');
};

const formatReasonCode = (r) => {
  if (!r) return '';
  const map = { 'academic_pressure': 'Presión Académica', 'preventive_guidance': 'Orientación Preventiva', 'sleep_and_routine': 'Sueño y Rutina', 'career_concern': 'Inquietud Vocacional', 'social_support': 'Soporte Social' };
  return map[r] || r;
};

const formatChannel = (c) => {
  if (!c) return '';
  const map = { 'phone': 'Vía Celular', 'digital': 'Digital', 'in_person': 'Presencial' };
  return map[c] || c;
};

const formatOutcome = (o) => {
  if (!o) return '';
  const map = { 'counseling': 'Asesoramiento', 'self_guided': 'Auto Guiado', 'follow_up': 'Seguimiento', 'career_service': 'Servicio de Carrera', 'peer_support': 'Apoyo de Pares' };
  return map[o] || o;
};

const formatStage = (s) => {
  if (!s) return '';
  const map = { 'early': 'Primeros Ciclos', 'middle': 'Etapa Intermedia', 'final': 'Último Año' };
  return map[s] || s;
};

const formatBand = (band, isFeminine = false) => {
  if (!band) return '';
  const mapM = { 'low': 'Bajo', 'mild': 'Leve', 'moderate': 'Moderado', 'high': 'Alto' };
  const mapF = { 'low': 'Baja', 'mild': 'Leve', 'moderate': 'Moderada', 'high': 'Alta' };
  return isFeminine ? (mapF[band] || band) : (mapM[band] || band);
};

export default function App() {
  const [studentData, setStudentData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('INICIO');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const notificationRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // INICIO STATE
  const [userQuery, setUserQuery] = useState('Últimamente necesito buscar empleo en el área de Análisis de Datos pero no sé por dónde comenzar');
  const [aiResponse, setAiResponse] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [selectedCardModal, setSelectedCardModal] = useState(null);

  const handleLogin = async (id) => {
    setLoadingProfile(true);
    try {
      const res = await fetch(`http://localhost:3001/api/student/${id}`);
      if (res.ok) {
        const data = await res.json();
        setStudentData(data);
      } else {
        alert('ID de alumno no encontrado en la base de datos.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión con el backend (asegúrate de que el servidor express esté corriendo).');
    }
    setLoadingProfile(false);
  };

  if (!studentData) {
    return (
      <>
        <LandingPage onLogin={handleLogin} />
        {loadingProfile && (
          <div className="fixed inset-0 bg-white backdrop-blur-md z-[9999] flex items-center justify-center text-[#0D2538] text-xl font-bold">
            Cargando perfil desde la base de datos...
          </div>
        )}
      </>
    );
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

  let accent = {
    bg: 'bg-[#1D63B8]', text: 'text-[#1D63B8]', hoverBg: 'hover:bg-[#1D63B8]/10', hoverBorder: 'hover:border-[#1D63B8]/60', shadow: '29,99,184'
  };
  if (activeTab === 'OPORTUNIDADES') accent = { bg: 'bg-[#10B981]', text: 'text-[#10B981]', hoverBg: 'hover:bg-[#10B981]/10', hoverBorder: 'hover:border-[#10B981]/60', shadow: '16,185,129' };
  if (activeTab === 'COMUNIDAD') accent = { bg: 'bg-[#F97316]', text: 'text-[#F97316]', hoverBg: 'hover:bg-[#F97316]/10', hoverBorder: 'hover:border-[#F97316]/60', shadow: '249,115,22' };
  if (activeTab === 'BIENESTAR') accent = { bg: 'bg-[#D92B27]', text: 'text-[#D92B27]', hoverBg: 'hover:bg-[#D92B27]/10', hoverBorder: 'hover:border-[#D92B27]/60', shadow: '217,43,39' };
  if (activeTab === 'APRENDIZAJE') accent = { bg: 'bg-[#9333EA]', text: 'text-[#9333EA]', hoverBg: 'hover:bg-[#9333EA]/10', hoverBorder: 'hover:border-[#9333EA]/60', shadow: '147,51,234' };

  return (
    <div className={`flex flex-col lg:flex-row min-h-screen bg-[#FBF9F5] text-[#0D2538] relative overflow-hidden font-mono-tech `}>
      
      {/* Background Dots from Landing Page */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(120)].map((_, i) => {
          const randomAnim = Math.floor(Math.random() * 3) + 1;
          return (
            <div
              key={i}
              className="absolute rounded-full bg-[#1D63B8] opacity-0"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 5 + 3}px`,
                height: `${Math.random() * 5 + 3}px`,
                animation: `rise${randomAnim} ${Math.random() * 5 + 4}s linear infinite`,
                animationDelay: `-${Math.random() * 8}s`
              }}
            ></div>
          );
        })}
      </div>

      <style>{`
        @keyframes rise1 {
          0% { transform: translate(0, 100px); opacity: 0; }
          10% { opacity: 0.35; }
          90% { opacity: 0.35; }
          100% { transform: translate(-30px, -350px); opacity: 0; }
        }
        @keyframes rise2 {
          0% { transform: translate(0, 100px); opacity: 0; }
          10% { opacity: 0.25; }
          90% { opacity: 0.25; }
          100% { transform: translate(40px, -450px); opacity: 0; }
        }
        @keyframes rise3 {
          0% { transform: translate(0, 100px) scale(0.8); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translate(15px, -600px) scale(1.3); opacity: 0; }
        }
        .mlh-logo-letter {
          font-family: 'Inter', sans-serif;
          font-weight: 900;
          font-size: 28px;
          line-height: 1;
          letter-spacing: -2px;
        }
      `}</style>

      {/* ==================== LEFT SIDEBAR NAVIGATION ==================== */}
      <aside className="relative z-10 w-full lg:w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200 flex flex-col justify-between shrink-0 shadow-xl">
        <div>
          {/* LOGO LINKUP */}
          <div className="p-6 flex items-center gap-3 border-b border-slate-200">
            <img src="/linkup-logo.png" alt="LinkUP" className="w-10 h-10 object-contain shrink-0 brightness-0" />
            <div className="flex flex-col">
              <div className="flex items-center -space-x-0.5">
                <span className="mlh-logo-letter text-[#1D63B8]">Link</span>
                <span className="mlh-logo-letter text-[#F5B82E]">UP</span>
              </div>
              <p className="text-[10px] font-bold text-[#333A42] uppercase tracking-wider mt-1">Plataforma Estudiantil</p>
            </div>
          </div>

          {/* NAV MENU */}
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              let activeBg = 'bg-[#1D63B8]'; // INICIO / PERFIL
              if (item.id === 'OPORTUNIDADES') activeBg = 'bg-[#10B981]'; // Verde
              if (item.id === 'COMUNIDAD') activeBg = 'bg-[#F97316]'; // Naranja
              if (item.id === 'BIENESTAR') activeBg = 'bg-[#D92B27]'; // Rojo
              if (item.id === 'APRENDIZAJE') activeBg = 'bg-[#9333EA]'; // Morado

              let activeText = 'text-white';
              if (item.id === 'COMUNIDAD' || item.id === 'OPORTUNIDADES') activeText = 'text-[#0D2538]';

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? `${activeBg} ${activeText} shadow-sm`
                      : 'text-[#4A5568] hover:bg-slate-100 hover:text-[#0D2538]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? activeText : 'text-[#4A5568]'}`} />
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
        <header className={`px-6 py-4 flex items-center justify-between border-b border-slate-200/80 ${accent.bg} transition-colors duration-500 relative z-20 shadow-md`}>
          {/* LEFT: Date & Time */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white font-bold text-sm tracking-wide shadow-inner border border-white/20">
            <Calendar className="w-4 h-4 opacity-80" />
            <span>
              {currentTime.toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' }).replace(',', '')}
            </span>
            <span className="opacity-50">|</span>
            <span>
              {currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowCalendarModal(true)}
              className="p-3 text-[#0D2538] hover:text-[#0D2538] bg-white hover:bg-slate-50 rounded-2xl relative transition-all shadow-sm cursor-pointer group flex items-center justify-center border border-transparent"
              title="Calendario Académico"
            >
              <Calendar className="w-7 h-7 transform group-hover:scale-110 transition-transform" />
            </button>
            
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-3 text-[#0D2538] hover:text-[#0D2538] bg-white hover:bg-slate-50 rounded-2xl relative transition-all shadow-sm cursor-pointer group flex items-center justify-center border border-transparent"
                title="Notificaciones"
              >
                <Bell className="w-7 h-7 transform group-hover:scale-110 transition-transform" />
                <span 
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#0D2538] rounded-full animate-pulse ring-2 ring-white"
                ></span>
              </button>

            {/* NOTIFICATIONS DROPDOWN */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-fadeIn text-[#333A42]">
                <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-bold text-[#0D2538] text-sm">Notificaciones</h3>
                  <span className="text-xs bg-cyan-500/20 text-[#1D63B8] border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold">3 nuevas</span>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-800">
                  <div className="p-4 hover:bg-[#F8F7F4] transition-colors cursor-pointer flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[#1D63B8] shrink-0 mt-0.5">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-[#0D2538] font-bold mb-0.5">¡Match de Pasantía! 🚀</p>
                      <p className="text-xs text-[#4A5568] leading-snug">Tu perfil coincide al 92% con la oferta "Data Analyst Junior" en Globant. Postula ahora.</p>
                      <span className="text-[10px] text-slate-500 font-medium block mt-1">Hace 2 horas</span>
                    </div>
                  </div>

                  <div className="p-4 hover:bg-[#F8F7F4] transition-colors cursor-pointer flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-[#0D2538] font-bold mb-0.5">Recordatorio de Cita Médica</p>
                      <p className="text-xs text-[#4A5568] leading-snug">No olvides tu sesión de apoyo (Soporte Social) programada para mañana a las 10:00 AM.</p>
                      <span className="text-[10px] text-slate-500 font-medium block mt-1">Hace 5 horas</span>
                    </div>
                  </div>

                  <div className="p-4 hover:bg-[#F8F7F4] transition-colors cursor-pointer flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-[#0D2538] font-bold mb-0.5">Sobrecarga Detectada ⚠️</p>
                      <p className="text-xs text-[#4A5568] leading-snug">Estás cursando 29 créditos este periodo. Te recomendamos agendar una sesión de organización.</p>
                      <span className="text-[10px] text-slate-500 font-medium block mt-1">Ayer</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F8F7F4] px-4 py-2.5 border-t border-slate-200 text-center">
                  <button className="text-xs font-bold text-[#1D63B8] hover:text-blue-300">Ver todas las notificaciones</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

        {/* CONDITIONALLY RENDER ALL 6 TABS */}
        {activeTab === 'INICIO' && (
          <div className="flex-1 p-6 sm:p-8 max-w-6xl mx-auto w-full space-y-8 animate-fadeIn">
            <div className="text-center pt-2">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0D2538] uppercase">
                BIENVENIDO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D63B8] to-[#1D59AC]">{studentData?.survey?.full_name || studentData?.student_id || 'ESTUDIANTE'}</span>
              </h1>
              <p className="text-[#4A5568] text-sm mt-1">¿En qué área o reto universitario te gustaría enfocar hoy?</p>
            </div>

            <div className="bg-white backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-w-3xl mx-auto">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-[#1D63B8]" />
                <label className="font-bold text-[#333A42] text-sm sm:text-base">Ingrese su Consulta:</label>
              </div>

              <textarea
                rows={3}
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-100/60 text-[#0D2538] placeholder-slate-500 font-medium text-sm border border-slate-200 shadow-inner focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              ></textarea>

              <button 
                onClick={handleAskAI} 
                disabled={loadingAI} 
                className="mt-3 px-6 py-3 bg-[#1D63B8] hover:bg-[#2eb4dd] text-[#0D2538] font-bold text-sm rounded-xl shadow-sm flex items-center gap-2 ml-auto transition-all cursor-pointer"
              >
                {loadingAI ? 'Consultando IA...' : 'Orientarme con IA ✨'}
              </button>

              {aiResponse && (
                <div className="mt-5 p-5 bg-slate-100/40 rounded-2xl border border-blue-500/30 text-xs sm:text-sm space-y-2">
                  <p className="font-bold text-[#1D63B8]">{aiResponse.text}</p>
                  <ul className="space-y-1.5 pl-2">
                    {aiResponse.steps.map((step, idx) => (
                      <li key={idx} className="bg-white p-3 rounded-xl border border-slate-200 text-[#333A42]">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0D2538] tracking-wide">Sección de Noticias & Novedades</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {newsCards.map((card) => (
                  <div 
                    key={card.id} 
                    onClick={() => setSelectedCardModal(card)} 
                    className="bg-white hover:bg-slate-100/80 p-6 rounded-2xl shadow-xl border border-slate-200 hover:border-blue-500/40 cursor-pointer transition-all transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] flex flex-col justify-between min-h-[160px]"
                  >
                    <div>
                      <span className="inline-block px-2.5 py-0.5 bg-blue-500/20 text-[#1D63B8] border border-blue-500/30 text-[10px] font-bold rounded-md mb-3">
                        {card.category}
                      </span>
                      <h3 className="font-bold text-[#0D2538] text-sm leading-snug">{card.title}</h3>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-slate-200">
                      <span className="font-semibold text-[#4A5568]">{card.tag}</span>
                      <span className="font-bold text-[#1D63B8]">Leer más →</span>
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

        {activeTab === 'PERFIL' && studentData && (
          <div className="flex-1 p-6 sm:p-8 max-w-6xl mx-auto w-full space-y-6 overflow-y-auto h-[calc(100vh-80px)] animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-5xl font-black text-[#0D2538] uppercase tracking-wider">MI PERFIL</h1>
                <p className="text-[#4A5568] text-sm font-medium mt-1">Dashboard de Alerta y Bienestar Estudiantil</p>
              </div>
              <div className="px-4 py-2 bg-amber-500/20 border border-amber-500/40 rounded-xl flex items-center gap-2 text-amber-300 shadow-md">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm">Alerta de Deserción: {formatDropoutAlert(studentData)}</span>
              </div>
            </div>

            <div className="bg-white backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-200 pb-8">
                <div className="w-28 h-28 shrink-0 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center border-4 border-slate-900 shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                  <User className="w-14 h-14 text-[#0D2538]" />
                </div>
                <div className="flex-1 w-full text-center sm:text-left">
                  <h2 className="text-3xl md:text-4xl font-black text-[#0D2538] tracking-tight mb-4">{studentData.survey?.full_name || 'Estudiante'}</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 shadow-inner">
                      <p className="text-[10px] uppercase tracking-widest text-[#1D63B8] font-bold mb-1">Universidad</p>
                      <p className="text-sm font-black text-[#0D2538]">{formatInstitution(studentData.survey?.institution_id)}</p>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3 shadow-inner">
                      <p className="text-[10px] uppercase tracking-widest text-[#1D63B8] font-bold mb-1">Etapa Académica</p>
                      <p className="text-sm font-black text-[#0D2538] capitalize">{formatStage(studentData.survey?.academic_stage)}</p>
                    </div>
                    <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-3 shadow-inner">
                      <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold mb-1">Código Alumno</p>
                      <p className="text-sm font-mono font-black text-[#0D2538]">{studentData.student_id}</p>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 shadow-inner">
                      <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mb-1">Distrito</p>
                      <p className="text-sm font-black text-[#0D2538]">{formatDistrict(studentData.survey?.district_id)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Columna 1: Contexto */}
                <div className="space-y-4">
                  <div className="bg-[#F8F7F4] p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-[#1D63B8] mb-3 flex items-center gap-2"><User className="w-4 h-4"/> Contexto Personal</h3>
                    <ul className="space-y-3 text-sm font-medium text-[#333A42]">
                      <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#1D63B8]"/> {studentData.survey?.migration_status === 'internal_migrant' ? 'Estudiante Foráneo' : studentData.survey?.migration_status === 'local' ? 'Residente Local' : 'No especificado'}</li>
                      <li className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-[#1D63B8]"/> Trabajo: {studentData.survey?.work_hours_week || 0} hrs/sem</li>
                      <li className="flex items-center gap-2"><Moon className="w-4 h-4 text-[#1D63B8]"/> Duerme ~{studentData.survey?.sleep_hours || 0} hrs diarias</li>
                    </ul>
                  </div>

                  <div className="bg-[#F8F7F4] p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-[#1D63B8] mb-3 flex items-center gap-2"><Heart className="w-4 h-4"/> Salud Mental</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-[#333A42]">Estrés</span>
                        <span className="px-2 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-md text-xs">{formatBand(studentData.survey?.stress_band, false)} ({studentData.survey?.stress_score})</span>
                      </div>
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-[#333A42]">Ansiedad</span>
                        <span className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-md text-xs">{formatBand(studentData.survey?.anxiety_band, true)} ({studentData.survey?.anxiety_score})</span>
                      </div>
                      <div className="mt-3 p-3 bg-red-500/10 text-red-300 text-xs font-bold rounded-xl border border-red-500/30">
                        ⚠️ {studentData.survey?.wellbeing_note || 'Sin notas adicionales.'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Columna 2 y 3: Rendimiento y Servicios */}
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-[#F8F7F4] p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-[#1D63B8] mb-4 flex items-center gap-2"><BookOpen className="w-4 h-4"/> Historial Académico</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {studentData.academic?.slice(0,4).map((term, i) => (
                        <div key={i} className={`p-3 rounded-xl border ${term.dropout_alert === 'high' ? 'bg-red-500/10 border-red-500/30' : term.dropout_alert === 'medium' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white border-slate-200'} text-center`}>
                          <p className="text-xs font-bold text-[#4A5568]">{formatPeriod(term.period_id)}</p>
                          <p className={`text-xl font-black mt-1 ${term.dropout_alert === 'high' ? 'text-red-400' : term.dropout_alert === 'medium' ? 'text-amber-400' : 'text-[#1D63B8]'}`}>{term.average_grade}</p>
                          <p className="text-[10px] font-bold text-slate-500 mt-1">Asist: {(term.attendance_rate * 100).toFixed(0)}%</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#F8F7F4] p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-[#1D63B8] mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4"/> Uso de Servicios (Puntos de dolor)</h3>
                    <div className="space-y-3">
                      {studentData.services?.length > 0 ? studentData.services.map((srv, i) => (
                        <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl flex justify-between items-center">
                          <div>
                            <p className="font-bold text-[#0D2538] text-sm">Solicitud por {formatReasonCode(srv.reason_code)} ({formatChannel(srv.contact_channel)})</p>
                            <p className="text-xs font-semibold text-[#4A5568] mt-0.5">Derivado a {formatOutcome(srv.referral_outcome)}</p>
                          </div>
                          <span className={`px-2.5 py-1 text-xs font-black rounded-lg ${srv.wait_days > 15 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                            ⏱ {srv.wait_days} días espera
                          </span>
                        </div>
                      )) : (
                        <p className="text-sm text-[#4A5568]">No hay registros de solicitudes recientes.</p>
                      )}
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
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-[#333A42]">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-1 bg-blue-500/20 text-[#1D63B8] border border-blue-500/30 text-xs font-bold rounded-md">
                  {selectedCardModal.category}
                </span>
                <h3 className="font-bold text-[#0D2538] text-lg mt-2">{selectedCardModal.title}</h3>
              </div>
              <button onClick={() => setSelectedCardModal(null)} className="text-[#4A5568] font-bold hover:text-[#0D2538] text-xl">✕</button>
            </div>

            <p className="text-[#333A42] text-sm leading-relaxed">{selectedCardModal.details}</p>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button onClick={() => setSelectedCardModal(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-700 text-[#333A42] font-bold text-xs rounded-xl border border-slate-200">
                Cerrar
              </button>
              <button onClick={() => setSelectedCardModal(null)} className="px-4 py-2 bg-[#1D63B8] hover:bg-[#2eb4dd] text-[#0D2538] font-bold text-xs rounded-xl shadow-sm">
                Explorar Recurso
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CALENDAR MODAL */}
      {showCalendarModal && <CalendarModal onClose={() => setShowCalendarModal(false)} />}
    </div>
  );
}
