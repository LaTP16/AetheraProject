import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Calendar, Clock, BookOpen, Heart, ArrowRight, CheckCircle2, 
  RefreshCw, Check, AlertCircle, Send, ChevronDown, ChevronUp, ExternalLink,
  Target, Award, Lightbulb, ShieldAlert, Zap
} from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function StudyPlanSection({ 
  studentData, 
  onNavigateToTab, 
  onOpenCalendar,
  addNotification 
}) {
  const student = studentData?.survey || {};
  const studentId = studentData?.student_id || 'STU_AE_000059';

  // Formulario
  const [examDate, setExamDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [topics, setTopics] = useState('');
  const [dailyHours, setDailyHours] = useState('2 horas/día');
  const [context, setContext] = useState('');

  // Estados de IA
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [studyPlan, setStudyPlan] = useState(null);
  const [adjustmentText, setAdjustmentText] = useState('');
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Próximas tareas del calendario (para el widget de inicio)
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Tarjetas de noticias
  const [selectedNewsCard, setSelectedNewsCard] = useState(null);

  const newsCards = [
    { id: 1, title: 'Nuevas Becas Disponibles para estudiar en el extranjero', category: 'Beca Internacional', tag: '¡Nueva Beca!', details: 'Convocatorias abiertas para maestría y pasantías en Europa y Latinoamérica con cobertura del 80% al 100%.' },
    { id: 2, title: 'Recomendaciones para estudiar y organizar tu tiempo', category: 'Técnicas de Estudio', tag: 'Guía Recomendada', details: 'Aprende la técnica Pomodoro avanzada y cómo evitar la sobrecarga cognitiva en semanas de exámenes.' },
    { id: 3, title: 'Últimas Novedades en Tecnología e Inteligencia Artificial', category: 'Tecnología', tag: 'Tendencia Tech', details: 'Descubre las herramientas de IA generativa y análisis de datos que están transformando la industria actual.' },
    { id: 4, title: 'Aumentan las ofertas Laborales en Data Science y Análisis', category: 'Empleabilidad', tag: 'Mercado Laboral', details: 'Las empresas buscan perfiles junior en Python, SQL y Power BI. Conoce las vacantes universitarias activas.' },
    { id: 5, title: '¡Tú puedes bro! Consejos de Salud Mental y Motivación', category: 'Bienestar Estudiantil', tag: 'Apoyo 24/7', details: 'Espacio de regulación emocional y recordatorio: tu bienestar vale más que cualquier nota.' },
    { id: 6, title: 'Nuevas comunidades de acompañamiento en vivo', category: 'Comunidad LinkUP', tag: 'Red Estudiantil', details: 'Únete a las salas grupales de estudio en vivo y conecta con compañeros de distintas carreras.' }
  ];

  // Cargar eventos del calendario para el mini-widget
  const loadUpcomingEvents = async () => {
    try {
      setLoadingEvents(true);
      const res = await fetch(`${apiUrl}/api/calendar/events?studentId=${studentId}`);
      if (res.ok) {
        const data = await res.json();
        const evts = data.events || [];
        // Filtrar pendientes y ordenar
        const pending = evts.filter(e => e.completed === 0).slice(0, 4);
        setUpcomingEvents(pending);
      }
    } catch (e) {
      console.warn('No se pudieron cargar eventos:', e);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    loadUpcomingEvents();
  }, [studentId]);

  // Generar Plan con IA
  const handleGeneratePlan = async (e) => {
    if (e) e.preventDefault();
    if (!topics.trim() || !examDate) return;

    setLoading(true);
    setSyncSuccess(false);

    try {
      const res = await fetch(`${apiUrl}/api/study-plan/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examDate,
          topics,
          dailyHours,
          context,
          studentId
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error al generar plan');
      }

      const data = await res.json();
      setStudyPlan(data);

      if (addNotification) {
        addNotification({
          title: '¡Plan de Estudios Generado! 🎯',
          message: `La IA diseñó tu plan para "${topics}". Revísalo y sincronízalo a tu calendario.`,
          iconType: 'target'
        });
      }
    } catch (err) {
      console.error(err);
      alert('Hubo un problema generando el plan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Solicitar ajuste a la IA
  const handleRefinePlan = async () => {
    if (!adjustmentText.trim() || !studyPlan) return;

    setRefining(true);
    try {
      const res = await fetch(`${apiUrl}/api/study-plan/refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPlan: studyPlan,
          adjustmentRequest: adjustmentText
        })
      });

      if (!res.ok) throw new Error('Error al refinar');
      const data = await res.json();
      setStudyPlan(data);
      setAdjustmentText('');
      setSyncSuccess(false);
    } catch (err) {
      console.error(err);
      alert('No se pudo ajustar el plan: ' + err.message);
    } finally {
      setRefining(false);
    }
  };

  // Aceptar y sincronizar al Calendario
  const handleSyncToCalendar = async () => {
    if (!studyPlan || !Array.isArray(studyPlan.schedule)) return;

    setSyncing(true);
    try {
      // Mapear cada bloque del plan a un evento de calendario
      const eventsToSync = [];

      studyPlan.schedule.forEach((block) => {
        // Bloque principal de estudio
        eventsToSync.push({
          title: block.title || `Bloque de Estudio: ${studyPlan.planTitle}`,
          description: `Foco: ${block.focus || 'Estudio'}. Tareas: ${(block.tasks || []).join(' • ')}. Recomendación: ${block.learningTip || ''}`,
          date: block.date || examDate,
          time: block.time || '18:00 - 20:00',
          type: 'study',
          module: 'APRENDIZAJE'
        });

        // Si tiene wellnessTip sugerir una pausa activa vinculada
        if (block.wellnessTip) {
          eventsToSync.push({
            title: `Pausa Activa: ${block.focus || 'Desconexión'}`,
            description: block.wellnessTip,
            date: block.date || examDate,
            time: '19:00 - 19:15',
            type: 'wellness',
            module: 'BIENESTAR'
          });
        }
      });

      // Agregar evento del examen final
      eventsToSync.push({
        title: `EXAMEN / ENTREGA: ${topics.split('\n')[0].slice(0, 40)}`,
        description: `Fecha límite de examen. ¡Mucho éxito! Plan completado con LinkUP.`,
        date: examDate,
        time: '08:00 - 10:00',
        type: 'exam',
        module: 'APRENDIZAJE'
      });

      const res = await fetch(`${apiUrl}/api/calendar/events/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          events: eventsToSync
        })
      });

      if (!res.ok) throw new Error('Error en sincronización');

      setSyncSuccess(true);
      loadUpcomingEvents();

      if (addNotification) {
        addNotification({
          title: 'Sincronización Exitosa 📅',
          message: `Se agregaron ${eventsToSync.length} bloques de estudio y pausas activas a tu Calendario.`,
          iconType: 'heart'
        });
      }
    } catch (err) {
      console.error(err);
      alert('Error sincronizando al calendario: ' + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleQuickTopic = (t) => {
    setTopics(t);
  };

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 animate-fadeIn text-[#0D2538]">
      
      {/* ==================== HERO DE BIENVENIDA Y RESUMEN ==================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-500/10 text-[#1D63B8] border border-blue-500/20">
              Centro de Planificación Académica con IA
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0D2538] uppercase">
            HOLA, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D63B8] to-blue-600">{student.full_name || 'ESTUDIANTE'}</span>
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            Optimiza tu tiempo, reduce la ansiedad ante exámenes y genera un cronograma personalizado que integra técnicas de aprendizaje y pausas de bienestar.
          </p>
        </div>

        {/* BOTÓN RÁPIDO PARA ABRIR CALENDARIO */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCalendar}
            className="px-5 py-3 bg-white hover:bg-slate-50 text-[#1D63B8] border-2 border-[#1D63B8]/30 hover:border-[#1D63B8] rounded-2xl font-black text-xs tracking-wide flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 group"
          >
            <Calendar className="w-4 h-4 text-[#1D63B8] transform group-hover:scale-110 transition-transform" />
            <span>Ver Mi Calendario Completo</span>
          </button>
        </div>
      </div>

      {/* ==================== WIDGET SUPERIOR: PRÓXIMAS TAREAS ==================== */}
      {upcomingEvents.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/70 border border-blue-200/60 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#1D63B8]" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#0D2538]">
                Tus Próximos Bloques de Estudio y Tareas en Calendario
              </h3>
            </div>
            <button
              onClick={onOpenCalendar}
              className="text-xs font-bold text-[#1D63B8] hover:text-blue-800 transition-colors cursor-pointer"
            >
              Gestionar todo →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {upcomingEvents.map((evt) => (
              <div 
                key={evt.id}
                onClick={onOpenCalendar}
                className="bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200 hover:border-blue-400 cursor-pointer shadow-sm transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#1D63B8] border border-blue-100">
                    {evt.date}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">
                    {evt.time || 'Flexible'}
                  </span>
                </div>
                <p className="text-xs font-bold text-[#0D2538] truncate">{evt.title}</p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{evt.description || 'Sin notas'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== GRID PRINCIPAL: FORMULARIO Y RESULTADO ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMNA IZQUIERDA (5 COLS): FORMULARIO DEL PLAN */}
        <div className="lg:col-span-5 bg-white backdrop-blur-md rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200 space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-[#0D2538] leading-tight">
                Generador de Plan de Estudios
              </h2>
              <p className="text-xs text-slate-500">Personalizado con IA para tus exámenes y entregas</p>
            </div>
          </div>

          <form onSubmit={handleGeneratePlan} className="space-y-4">
            {/* Campo: Temas o Materia */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-xs uppercase tracking-wide text-slate-700">
                  Temas o Materia a Estudiar *
                </label>
                <span className="text-[10px] text-slate-400">Específico o general</span>
              </div>
              <textarea
                required
                rows={3}
                placeholder="Ej. Cálculo Multivariable: Integrales triples, coordenadas cilíndricas y teorema de Stokes..."
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                className="w-full p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner placeholder-slate-400"
              ></textarea>

              {/* Sugerencias Rápidas */}
              <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                <span className="text-[10px] font-bold text-slate-400">Atajos:</span>
                {[
                  'Cálculo Integral & Series',
                  'Estructuras de Datos (Árboles y Grafos)',
                  'Física II: Electromagnetismo',
                  'Econometría Básica'
                ].map((sug) => (
                  <button
                    type="button"
                    key={sug}
                    onClick={() => handleQuickTopic(sug)}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#1D63B8] text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Fila: Fecha y Horas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-xs uppercase tracking-wide text-slate-700 block mb-1">
                  Fecha del Examen / Entrega *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-xs uppercase tracking-wide text-slate-700 block mb-1">
                  Tiempo Diario Disponible
                </label>
                <select
                  value={dailyHours}
                  onChange={(e) => setDailyHours(e.target.value)}
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                >
                  <option value="1 hora/día">1 hora/día (Repaso ligero)</option>
                  <option value="2 horas/día">2 horas/día (Recomendado)</option>
                  <option value="3 horas/día">3 horas/día (Intensivo)</option>
                  <option value="4+ horas/día">4+ horas/día (Maratón)</option>
                </select>
              </div>
            </div>

            {/* Campo: Contexto o Indicaciones Opcionales */}
            <div>
              <label className="font-bold text-xs uppercase tracking-wide text-slate-700 block mb-1">
                Contexto Adicional o Preferencias (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. Me cuesta la teoría visual, prefiero ejercicios resueltos, trabajo de mañana..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            {/* BOTÓN SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#1D63B8] via-blue-600 to-[#1D59AC] hover:opacity-95 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-white" />
                  <span>Diseñando Estrategia con Gemini IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span>Generar Plan de Estudios con IA</span>
                </>
              )}
            </button>
          </form>

          {/* Información contextual del estudiante */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5 text-slate-600">
            <p className="font-bold text-[#0D2538] flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Personalización activa con tus datos de perfil:
            </p>
            <p className="text-[11px] leading-relaxed">
              La IA toma en cuenta tu nivel de estrés (<strong className="text-slate-800">{student.stress_band || 'moderado'}</strong>) y horas de sueño para calibrar la intensidad de los bloques y proteger tu salud mental.
            </p>
          </div>
        </div>

        {/* COLUMNA DERECHA (7 COLS): VISUALIZADOR DEL PLAN GENERADO O EMPTY STATE */}
        <div className="lg:col-span-7">
          {!studyPlan && !loading && (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center shadow-md space-y-4 flex flex-col items-center justify-center min-h-[460px]">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-[#1D63B8] mb-2 border border-blue-100 shadow-inner">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="text-xl font-black text-[#0D2538]">
                  Tu Plan de Estudios Estratégico aparecerá aquí
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Ingresa tu materia y fecha de examen para que el motor de IA de LinkUP construya tu cronograma diario con recomendaciones directas de <span className="font-bold text-[#9333EA]">Aprendizaje</span> y <span className="font-bold text-[#D92B27]">Bienestar</span>.
                </p>
              </div>

              {/* 3 Pilares destacados */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full pt-4 max-w-xl text-left">
                <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100">
                  <span className="text-[10px] font-black uppercase text-purple-700 block">Aprendizaje</span>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">Técnica Feynman & Sócrates</p>
                </div>
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <span className="text-[10px] font-black uppercase text-emerald-700 block">Bienestar</span>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">Pausas Activas & Antiestrés</p>
                </div>
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                  <span className="text-[10px] font-black uppercase text-blue-700 block">Calendario</span>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">Sincronización 1-Click</p>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-md text-center flex flex-col items-center justify-center min-h-[460px] space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-[#1D63B8] animate-spin"></div>
                <Sparkles className="w-6 h-6 text-yellow-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0D2538]">Analizando el temario con IA...</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Distribuyendo bloques pedagógicos, calculando descansos e integrando los módulos de Aprendizaje y Bienestar.
                </p>
              </div>
            </div>
          )}

          {/* PROPUESTA DEL PLAN DE ESTUDIOS GENERADA */}
          {studyPlan && !loading && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
              
              {/* ENCABEZADO DE LA PROPUESTA */}
              <div className="border-b border-slate-200 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-full border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Plan Generado con Éxito
                  </span>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {studyPlan.dailyHours}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Examen: {studyPlan.examDate}</span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-[#0D2538] leading-tight">
                  {studyPlan.planTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {studyPlan.summary}
                </p>
              </div>

              {/* INTEGRACIONES CRUZADAS: APRENDIZAJE Y BIENESTAR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* CAJA APRENDIZAJE */}
                <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-purple-800 font-black text-xs uppercase tracking-wider">
                      <BookOpen className="w-4 h-4 text-purple-700" />
                      Módulo Aprendizaje
                    </div>
                    <button
                      onClick={() => onNavigateToTab('APRENDIZAJE')}
                      className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ir al Tutor IA</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <p className="text-xs text-purple-950 font-medium">
                    {studyPlan.learningIntegration?.learningModuleAction || 'Aprovecha el Tutor Sócrates y Feynman para autoexaminarte.'}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {(studyPlan.learningIntegration?.recommendedTechniques || ['Método Feynman', 'Pomodoro']).map((tech, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-white text-purple-700 font-bold text-[10px] rounded-md border border-purple-200">
                        ✓ {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CAJA BIENESTAR */}
                <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-800 font-black text-xs uppercase tracking-wider">
                      <Heart className="w-4 h-4 text-red-600" />
                      Módulo Bienestar
                    </div>
                    <button
                      onClick={() => onNavigateToTab('BIENESTAR')}
                      className="text-[11px] font-bold text-red-700 hover:text-red-900 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Recursos</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <p className="text-xs text-red-950 font-medium">
                    {studyPlan.wellnessIntegration?.stressManagementTip || 'Practica respiración diafragmática 4-7-8 antes de tus bloques.'}
                  </p>

                  <div className="flex items-center gap-2 pt-1 text-[11px] font-bold text-red-700">
                    <Zap className="w-3.5 h-3.5" />
                    <span>{studyPlan.wellnessIntegration?.activePauses || 'Pausa de 10 min cada 50 min.'}</span>
                  </div>
                </div>

              </div>

              {/* CRONOGRAMA DÍA A DÍA */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm sm:text-base text-[#0D2538] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#1D63B8]" />
                    Cronograma y Distribución de Bloques ({studyPlan.schedule?.length || 0} sesiones)
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold">Listo para sincronizar</span>
                </div>

                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {(studyPlan.schedule || []).map((block, bIdx) => (
                    <div 
                      key={bIdx}
                      className="bg-slate-50 rounded-2xl p-4 border border-slate-200 hover:border-blue-400 transition-all space-y-2.5 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-[#1D63B8] text-white text-xs font-black flex items-center justify-center shrink-0">
                            {block.dayNumber || bIdx + 1}
                          </span>
                          <h4 className="font-bold text-sm text-[#0D2538]">{block.title}</h4>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                            📅 {block.date}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-[#1D63B8]">
                            ⏱ {block.time || block.duration}
                          </span>
                        </div>
                      </div>

                      {block.focus && (
                        <p className="text-xs font-bold text-[#1D63B8]">
                          Foco: <span className="text-slate-700 font-medium">{block.focus}</span>
                        </p>
                      )}

                      {/* Lista de tareas */}
                      {Array.isArray(block.tasks) && block.tasks.length > 0 && (
                        <div className="space-y-1 pl-1">
                          {block.tasks.map((task, tIdx) => (
                            <div key={tIdx} className="flex items-start gap-2 text-xs text-slate-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                              <span>{task}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tips de Aprendizaje y Bienestar inline */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-200/50 text-[11px]">
                        {block.learningTip && (
                          <div className="text-purple-800 bg-purple-50/60 p-2 rounded-xl">
                            💡 <strong>Aprendizaje:</strong> {block.learningTip}
                          </div>
                        )}
                        {block.wellnessTip && (
                          <div className="text-red-800 bg-red-50/60 p-2 rounded-xl">
                            🌿 <strong>Pausa:</strong> {block.wellnessTip}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BARRA DE ACCIÓN PRINCIPAL: SINCRONIZAR AL CALENDARIO */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-[#0D2538]">
                      ¿Te gusta este plan de estudio?
                    </h4>
                    <p className="text-xs text-slate-600">
                      Agrega automáticamente todas las sesiones y pausas a tu Calendario SQLite.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleSyncToCalendar}
                      disabled={syncing || syncSuccess}
                      className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-95 ${
                        syncSuccess
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#1D63B8] hover:bg-blue-700 text-white'
                      }`}
                    >
                      {syncing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Sincronizando...</span>
                        </>
                      ) : syncSuccess ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>¡Sincronizado al Calendario!</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="w-4 h-4" />
                          <span>Aceptar y Sincronizar al Calendario 📅</span>
                        </>
                      )}
                    </button>

                    {syncSuccess && (
                      <button
                        onClick={onOpenCalendar}
                        className="px-4 py-3.5 bg-white hover:bg-slate-100 text-[#1D63B8] border border-blue-300 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                      >
                        Abrir Calendario →
                      </button>
                    )}
                  </div>
                </div>

                {syncSuccess && (
                  <p className="text-xs text-emerald-800 font-bold bg-emerald-100/80 p-2 rounded-xl text-center border border-emerald-200">
                    🎉 Tus bloques han sido guardados en la base de datos de SQLite. Ya puedes verlos en el calendario interactivo.
                  </p>
                )}
              </div>

              {/* CAJA DE REVISIÓN Y AJUSTES CON IA */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <label className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#1D63B8]" />
                  ¿Deseas solicitar algún ajuste a la IA?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ej. Añade más tiempo para el bloque 2, o haz sesiones de 1 hora en lugar de 2..."
                    value={adjustmentText}
                    onChange={(e) => setAdjustmentText(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                  <button
                    onClick={handleRefinePlan}
                    disabled={refining || !adjustmentText.trim()}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {refining ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Ajustar</span>
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* ==================== SECCIÓN DE NOTICIAS & NOVEDADES LINKUP ==================== */}
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0D2538] tracking-wide">
              Noticias & Recursos Universitarios LinkUP
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Oportunidades, bienestar y avances tecnológicos para Ciudad Aethera</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {newsCards.map((card) => (
            <div 
              key={card.id} 
              onClick={() => setSelectedNewsCard(card)} 
              className="bg-white hover:bg-slate-50/90 p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500/40 cursor-pointer transition-all transform hover:-translate-y-1 hover:shadow-md flex flex-col justify-between min-h-[160px]"
            >
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-blue-500/10 text-[#1D63B8] border border-blue-500/20 text-[10px] font-bold rounded-md mb-2.5">
                  {card.category}
                </span>
                <h3 className="font-bold text-[#0D2538] text-sm leading-snug">{card.title}</h3>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                <span className="font-semibold text-slate-500">{card.tag}</span>
                <span className="font-bold text-[#1D63B8]">Leer más →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DETALLE DE NOTICIA */}
      {selectedNewsCard && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-slate-700 animate-fadeIn">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-1 bg-blue-500/10 text-[#1D63B8] border border-blue-500/20 text-xs font-bold rounded-md">
                  {selectedNewsCard.category}
                </span>
                <h3 className="font-bold text-[#0D2538] text-lg mt-2">{selectedNewsCard.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedNewsCard(null)} 
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">{selectedNewsCard.details}</p>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button 
                onClick={() => setSelectedNewsCard(null)} 
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cerrar
              </button>
              <button 
                onClick={() => setSelectedNewsCard(null)} 
                className="px-4 py-2 bg-[#1D63B8] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                Explorar Recurso
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
