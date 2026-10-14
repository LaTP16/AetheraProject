import React, { useState } from 'react';
import { 
  Heart, Leaf, Stethoscope, Star, Sparkles, MessageCircle, BookOpen, 
  ShieldCheck, ArrowRight, UserCheck, ArrowLeft, Clock, MapPin, 
  Building2, Phone, Laptop, X, CheckCircle2, Users, Radio 
} from 'lucide-react';

export default function WellnessSection() {
  const [problemQuery, setProblemQuery] = useState('');
  const [derivationResult, setDerivationResult] = useState(null);
  const [isDeriving, setIsDeriving] = useState(false);
  
  // NEW STATES
  const [activeScreen, setActiveScreen] = useState('MAIN'); // 'MAIN' or 'CATEGORY_VIEW'
  const [activeCategory, setActiveCategory] = useState(null); // 'APOYO', 'RECURSOS', 'SERVICIOS'
  const [selectedItem, setSelectedItem] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Formatear horario en español (Mon-Sat -> Lunes a Sábado, Mon-Fri -> Lunes a Viernes)
  const formatSchedule = (scheduleStr) => {
    if (!scheduleStr) return 'Horario a coordinar';
    return scheduleStr
      .replace(/Mon-Sat/gi, 'Lunes a Sábado')
      .replace(/Mon-Fri/gi, 'Lunes a Viernes')
      .replace(/Sat-Sun/gi, 'Sábado y Domingo')
      .replace(/Mon/gi, 'Lunes')
      .replace(/Tue/gi, 'Martes')
      .replace(/Wed/gi, 'Miércoles')
      .replace(/Thu/gi, 'Jueves')
      .replace(/Fri/gi, 'Viernes')
      .replace(/Sat/gi, 'Sábado')
      .replace(/Sun/gi, 'Domingo')
      .replace(/(\d{2}:\d{2})-(\d{2}:\d{2})/, '$1 a $2 hrs');
  };

  // Extraer y traducir canales de atención en su propio apartado
  const getChannels = (locationStr) => {
    if (!locationStr) return [{ id: 'digital', label: 'Virtual / Online', icon: Laptop, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' }];
    const match = locationStr.match(/Canales:\s*([a-zA-Z_, ]+)/i);
    if (!match) return [{ id: 'digital', label: 'Virtual / Online', icon: Laptop, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' }];
    
    const raw = match[1].split(',').map(s => s.trim().toLowerCase());
    return raw.map(ch => {
      if (ch === 'in_person') {
        return { id: 'in_person', label: 'Presencial', icon: Building2, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      }
      if (ch === 'phone') {
        return { id: 'phone', label: 'Telefónico', icon: Phone, color: 'bg-blue-50 text-blue-700 border-blue-200' };
      }
      if (ch === 'digital') {
        return { id: 'digital', label: 'Virtual / Online', icon: Laptop, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      }
      return { id: ch, label: ch, icon: Radio, color: 'bg-slate-50 text-slate-700 border-slate-200' };
    });
  };

  // Extraer distrito en su propio apartado en español
  const getDistrict = (locationStr) => {
    if (!locationStr) return 'Distrito Central';
    const match = locationStr.match(/DIST_([A-Z]+)/i);
    if (!match) {
      const part = locationStr.split('-')[0].trim();
      return part || 'Distrito Central';
    }
    const name = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
    return `Distrito ${name}`;
  };

  // Formatear descripción traduciendo tecnicismos en inglés
  const formatDescription = (desc) => {
    if (!desc) return '';
    return desc
      .replace(/peer_support/gi, 'apoyo y orientación entre pares')
      .replace(/counseling/gi, 'orientación psicológica y acompañamiento')
      .replace(/career_guidance/gi, 'orientación vocacional y desarrollo profesional');
  };


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
    service_id: 'SRV_AE_001',
    category: 'SERVICIOS',
    categoryLabel: 'Servicios Universitarios',
    title: 'Espacio Brújula Orientación',
    description: 'Servicio de counseling enfocado en tu bienestar y desarrollo personal.',
    schedule: 'Mon-Fri 09:00-18:00',
    location: 'DIST_GAIA - Canales: in_person,digital',
    capacity: '42 atenciones semanales',
    eligibility: 'Aethera students; fictional orientation service',
    referralReqs: 'student_id, preferred channel, non-clinical reason code',
    icon: Stethoscope,
    tagBg: 'bg-cyan-800 text-[#0D2538]'
  },
  {
    service_id: 'SRV_AE_002',
    category: 'APOYO',
    categoryLabel: 'Apoyo de Pares',
    title: 'Espacio Brújula Pares',
    description: 'Servicio de peer_support enfocado en tu bienestar y desarrollo personal.',
    schedule: 'Mon-Sat 12:00-20:00',
    location: 'DIST_GAIA - Canales: in_person,phone',
    capacity: '55 atenciones semanales',
    eligibility: 'Aethera students; fictional orientation service',
    referralReqs: 'student_id, preferred channel, non-clinical reason code',
    icon: UserCheck,
    tagBg: 'bg-blue-700 text-[#0D2538]'
  },
  {
    service_id: 'SRV_AE_003',
    category: 'RECURSOS',
    categoryLabel: 'Orientación de Carrera',
    title: 'Espacio Brújula Trayectoria',
    description: 'Servicio de career_guidance enfocado en tu bienestar y desarrollo personal.',
    schedule: 'Mon-Fri 09:00-18:00',
    location: 'DIST_GAIA - Canales: in_person,digital',
    capacity: '68 atenciones semanales',
    eligibility: 'Aethera students; fictional orientation service',
    referralReqs: 'student_id, preferred channel, non-clinical reason code',
    icon: BookOpen,
    tagBg: 'bg-teal-700 text-[#0D2538]'
  },
  {
    service_id: 'SRV_AE_004',
    category: 'SERVICIOS',
    categoryLabel: 'Servicios Universitarios',
    title: 'Espacio Lumen Orientación',
    description: 'Servicio de counseling enfocado en tu bienestar y desarrollo personal.',
    schedule: 'Mon-Fri 09:00-18:00',
    location: 'DIST_NEBULA - Canales: in_person,digital',
    capacity: '53 atenciones semanales',
    eligibility: 'Aethera students; fictional orientation service',
    referralReqs: 'student_id, preferred channel, non-clinical reason code',
    icon: Stethoscope,
    tagBg: 'bg-cyan-800 text-[#0D2538]'
  },
  {
    service_id: 'SRV_AE_005',
    category: 'APOYO',
    categoryLabel: 'Apoyo de Pares',
    title: 'Espacio Lumen Pares',
    description: 'Servicio de peer_support enfocado en tu bienestar y desarrollo personal.',
    schedule: 'Mon-Sat 12:00-20:00',
    location: 'DIST_NEBULA - Canales: in_person,phone',
    capacity: '66 atenciones semanales',
    eligibility: 'Aethera students; fictional orientation service',
    referralReqs: 'student_id, preferred channel, non-clinical reason code',
    icon: UserCheck,
    tagBg: 'bg-blue-700 text-[#0D2538]'
  },
  {
    service_id: 'SRV_AE_006',
    category: 'RECURSOS',
    categoryLabel: 'Orientación de Carrera',
    title: 'Espacio Lumen Trayectoria',
    description: 'Servicio de career_guidance enfocado en tu bienestar y desarrollo personal.',
    schedule: 'Mon-Fri 09:00-18:00',
    location: 'DIST_NEBULA - Canales: in_person,digital',
    capacity: '79 atenciones semanales',
    eligibility: 'Aethera students; fictional orientation service',
    referralReqs: 'student_id, preferred channel, non-clinical reason code',
    icon: BookOpen,
    tagBg: 'bg-teal-700 text-[#0D2538]'
  },
  {
    service_id: 'SRV_AE_007',
    category: 'SERVICIOS',
    categoryLabel: 'Servicios Universitarios',
    title: 'Espacio Trama Orientación',
    description: 'Servicio de counseling enfocado en tu bienestar y desarrollo personal.',
    schedule: 'Mon-Fri 09:00-18:00',
    location: 'DIST_VECTOR - Canales: in_person,digital',
    capacity: '64 atenciones semanales',
    eligibility: 'Aethera students; fictional orientation service',
    referralReqs: 'student_id, preferred channel, non-clinical reason code',
    icon: Stethoscope,
    tagBg: 'bg-cyan-800 text-[#0D2538]'
  },
  {
    service_id: 'SRV_AE_008',
    category: 'APOYO',
    categoryLabel: 'Apoyo de Pares',
    title: 'Espacio Trama Pares',
    description: 'Servicio de peer_support enfocado en tu bienestar y desarrollo personal.',
    schedule: 'Mon-Sat 12:00-20:00',
    location: 'DIST_VECTOR - Canales: in_person,phone',
    capacity: '77 atenciones semanales',
    eligibility: 'Aethera students; fictional orientation service',
    referralReqs: 'student_id, preferred channel, non-clinical reason code',
    icon: UserCheck,
    tagBg: 'bg-blue-700 text-[#0D2538]'
  },
  {
    service_id: 'SRV_AE_009',
    category: 'RECURSOS',
    categoryLabel: 'Orientación de Carrera',
    title: 'Espacio Trama Trayectoria',
    description: 'Servicio de career_guidance enfocado en tu bienestar y desarrollo personal.',
    schedule: 'Mon-Fri 09:00-18:00',
    location: 'DIST_VECTOR - Canales: in_person,digital',
    capacity: '90 atenciones semanales',
    eligibility: 'Aethera students; fictional orientation service',
    referralReqs: 'student_id, preferred channel, non-clinical reason code',
    icon: BookOpen,
    tagBg: 'bg-teal-700 text-[#0D2538]'
  },
  {
    service_id: 'SRV_AE_010',
    category: 'SERVICIOS',
    categoryLabel: 'Servicios Universitarios',
    title: 'Espacio Umbral Orientación',
    description: 'Servicio de counseling enfocado en tu bienestar y desarrollo personal.',
    schedule: 'Mon-Fri 09:00-18:00',
    location: 'DIST_HORIZON - Canales: in_person,digital',
    capacity: '75 atenciones semanales',
    eligibility: 'Aethera students; fictional orientation service',
    referralReqs: 'student_id, preferred channel, non-clinical reason code',
    icon: Stethoscope,
    tagBg: 'bg-cyan-800 text-[#0D2538]'
  },
  {
    service_id: 'SRV_AE_011',
    category: 'APOYO',
    categoryLabel: 'Apoyo de Pares',
    title: 'Espacio Umbral Pares',
    description: 'Servicio de peer_support enfocado en tu bienestar y desarrollo personal.',
    schedule: 'Mon-Sat 12:00-20:00',
    location: 'DIST_HORIZON - Canales: in_person,phone',
    capacity: '88 atenciones semanales',
    eligibility: 'Aethera students; fictional orientation service',
    referralReqs: 'student_id, preferred channel, non-clinical reason code',
    icon: UserCheck,
    tagBg: 'bg-blue-700 text-[#0D2538]'
  },
  {
    service_id: 'SRV_AE_012',
    category: 'RECURSOS',
    categoryLabel: 'Orientación de Carrera',
    title: 'Espacio Umbral Trayectoria',
    description: 'Servicio de career_guidance enfocado en tu bienestar y desarrollo personal.',
    schedule: 'Mon-Fri 09:00-18:00',
    location: 'DIST_HORIZON - Canales: in_person,digital',
    capacity: '101 atenciones semanales',
    eligibility: 'Aethera students; fictional orientation service',
    referralReqs: 'student_id, preferred channel, non-clinical reason code',
    icon: BookOpen,
    tagBg: 'bg-teal-700 text-[#0D2538]'
  },
  {
    service_id: 'SRV_AE_013',
    category: 'SERVICIOS',
    categoryLabel: 'Servicios Universitarios',
    title: 'Espacio Nexo Orientación',
    description: 'Servicio de counseling enfocado en tu bienestar y desarrollo personal.',
    schedule: 'Mon-Fri 09:00-18:00',
    location: 'DIST_QUANTUM - Canales: in_person,digital',
    capacity: '86 atenciones semanales',
    eligibility: 'Aethera students; fictional orientation service',
    referralReqs: 'student_id, preferred channel, non-clinical reason code',
    icon: Stethoscope,
    tagBg: 'bg-cyan-800 text-[#0D2538]'
  },
  {
    service_id: 'SRV_AE_014',
    category: 'APOYO',
    categoryLabel: 'Apoyo de Pares',
    title: 'Espacio Nexo Pares',
    description: 'Servicio de peer_support enfocado en tu bienestar y desarrollo personal.',
    schedule: 'Mon-Sat 12:00-20:00',
    location: 'DIST_QUANTUM - Canales: in_person,phone',
    capacity: '99 atenciones semanales',
    eligibility: 'Aethera students; fictional orientation service',
    referralReqs: 'student_id, preferred channel, non-clinical reason code',
    icon: UserCheck,
    tagBg: 'bg-blue-700 text-[#0D2538]'
  },
  {
    service_id: 'SRV_AE_015',
    category: 'RECURSOS',
    categoryLabel: 'Orientación de Carrera',
    title: 'Espacio Nexo Trayectoria',
    description: 'Servicio de career_guidance enfocado en tu bienestar y desarrollo personal.',
    schedule: 'Mon-Fri 09:00-18:00',
    location: 'DIST_QUANTUM - Canales: in_person,digital',
    capacity: '112 atenciones semanales',
    eligibility: 'Aethera students; fictional orientation service',
    referralReqs: 'student_id, preferred channel, non-clinical reason code',
    icon: BookOpen,
    tagBg: 'bg-teal-700 text-[#0D2538]'
  }
];

  const handleDerive = async (e) => {
    e.preventDefault();
    if (!problemQuery.trim()) return;

    setIsDeriving(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/bienestar/chat`, {
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
          text: `${data.intro} ${data.steps.join(' ')}`,
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
                        {formatDescription(item.description)}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-200 space-y-2">
                      <p className="text-[11px] font-bold text-[#1D63B8]">
                        📅 {formatSchedule(item.schedule)}
                      </p>
                      <p className="text-[10px] font-medium text-[#4A5568] truncate">
                        📍 {getDistrict(item.location)}
                      </p>

                      <button 
                        onClick={() => {
                          setSelectedItem(item);
                          setBookingSuccess(false);
                        }} 
                        className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
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

      {/* MODAL PARA INDAGAR MÁS / DETALLES DE SERVICIO */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-slate-100 max-h-[92vh] overflow-y-auto">
            
            {/* Botón Cerrar */}
            <button 
              onClick={() => {
                setSelectedItem(null);
                setBookingSuccess(false);
              }}
              className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-[#0D2538] rounded-full transition-all cursor-pointer shadow-xs"
              title="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Cabecera del Servicio */}
            <div className="flex items-start gap-4 mb-5 pr-8">
              <div className="w-12 h-12 rounded-2xl bg-[#1D63B8]/10 text-[#1D63B8] border border-blue-200 flex items-center justify-center shrink-0 shadow-sm">
                <selectedItem.icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-[#1D63B8] border border-blue-200">
                  {selectedItem.categoryLabel || 'Servicio de Bienestar'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#0D2538] mt-1.5 leading-tight">
                  {selectedItem.title}
                </h2>
              </div>
            </div>
            
            {/* Descripción del Servicio traducida */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {formatDescription(selectedItem.description)}
              </p>
            </div>
            
            {/* Sección de Información de Acceso */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <ShieldCheck className="w-4 h-4 text-[#1D63B8]" />
                <h3 className="font-extrabold text-[#0D2538] text-sm uppercase tracking-wide">
                  Información de Acceso y Atención
                </h3>
              </div>
              
              {/* Cuadrícula de 4 apartados dedicados y estructurados */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* 1. HORARIO EN ESPAÑOL */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#1D63B8]" />
                    <span>Horario de Atención</span>
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#0D2538]">
                    {formatSchedule(selectedItem.schedule)}
                  </span>
                </div>

                {/* 2. DISTRITO (Apartado propio en español) */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#1D63B8]" />
                    <span>Distrito / Sede</span>
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#1D63B8] flex items-center gap-1">
                    📍 {getDistrict(selectedItem.location)}
                  </span>
                </div>

                {/* 3. CANALES DE ATENCIÓN (Apartado propio en español) */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <Radio className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Canales Disponibles</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {getChannels(selectedItem.location).map(ch => {
                      const ChannelIcon = ch.icon;
                      return (
                        <span
                          key={ch.id}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${ch.color}`}
                        >
                          <ChannelIcon className="w-3 h-3" />
                          <span>{ch.label}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* 4. CAPACIDAD SEMANAL */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>Capacidad Semanal</span>
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-slate-700">
                      {selectedItem.capacity}
                    </span>
                    <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
                      Disponible
                    </span>
                  </div>
                </div>

              </div>

              {/* Mensaje de Confirmación tras reservar */}
              {bookingSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    ¡Reserva confirmada con éxito! Te hemos asignado tu turno en {getDistrict(selectedItem.location)}.
                  </span>
                </div>
              )}
            </div>

            {/* Botón de Confirmación */}
            {!bookingSuccess ? (
              <button 
                onClick={() => setBookingSuccess(true)}
                className="w-full mt-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white font-black text-sm rounded-2xl transition-all shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmar Reserva / Acceder</span>
              </button>
            ) : (
              <button 
                onClick={() => {
                  setSelectedItem(null);
                  setBookingSuccess(false);
                }}
                className="w-full mt-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-[#0D2538] font-bold text-sm rounded-2xl transition-all cursor-pointer"
              >
                Cerrar Ventana
              </button>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
