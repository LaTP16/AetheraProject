import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, BookMarked, ClipboardCheck, Trophy, CheckCircle2, ArrowLeft, ArrowRight, Search, 
  MapPin, Clock, Play, Pause, RotateCcw, Timer, Sparkles, Send, Bot, RefreshCw, 
  BookOpen, Lightbulb, MessageSquare, HelpCircle, ChevronRight, Check
} from 'lucide-react';

export default function LearningSection({ addNotification }) {
  // NAVIGATION STATE
  const [activeView, setActiveView] = useState('HOME');

  // TUTOR IA STATE
  const [topicInput, setTopicInput] = useState('');
  const [activeTopic, setActiveTopic] = useState('');
  const [tutorMode, setTutorMode] = useState('socrates'); // 'socrates' | 'feynman'
  const [tutorMessages, setTutorMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoadingTutor, setIsLoadingTutor] = useState(false);
  const tutorChatEndRef = useRef(null);

  // Auto-scroll tutor chat
  useEffect(() => {
    tutorChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [tutorMessages, isLoadingTutor]);

  // Handle start study session with AI Tutor
  const handleStartTutorSession = async (modeToUse) => {
    const selectedMode = modeToUse || tutorMode;
    const cleanTopic = topicInput.trim();
    if (!cleanTopic) return;

    setActiveTopic(cleanTopic);
    setTutorMode(selectedMode);
    setIsLoadingTutor(true);

    const initialAiPlaceholder = {
      id: Date.now(),
      sender: 'ai',
      text: selectedMode === 'socrates' 
        ? `Invocando al filósofo Sócrates para reflexionar sobre "${cleanTopic}"...` 
        : `Llamando a Richard Feynman para analizar "${cleanTopic}"...`,
      isInitial: true
    };
    setTutorMessages([initialAiPlaceholder]);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/learning/tutor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: cleanTopic,
          mode: selectedMode,
          messages: []
        })
      });

      if (!response.ok) throw new Error('Error al conectar con el Tutor IA');
      const data = await response.json();

      setTutorMessages([
        {
          id: Date.now(),
          sender: 'ai',
          text: data.reply || (selectedMode === 'socrates' 
            ? `Dime, mi estimado amigo: cuando piensas en "${cleanTopic}", ¿cuál consideras que es su principio fundamental y por qué?`
            : `¡Hola! Me alegra que abordemos "${cleanTopic}". Imagina que tengo 10 años: ¿cómo me explicarías con tus propias palabras qué es y para qué sirve?`),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
      setTutorMessages([
        {
          id: Date.now(),
          sender: 'ai',
          text: selectedMode === 'socrates'
            ? `Saludos. Reflexionemos sobre "${cleanTopic}". Dime: ¿qué es lo primero que das por sentado al hablar de este tema, y estás seguro de que es realmente así?`
            : `¡Hola! Exploremos "${cleanTopic}". Trata de explicarme en dos frases sencillas sin tecnicismos qué significa este concepto.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoadingTutor(false);
    }
  };

  // Send message inside active session
  const handleSendTutorMessage = async (e) => {
    if (e) e.preventDefault();
    const text = chatInput.trim();
    if (!text || !activeTopic || isLoadingTutor) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...tutorMessages, userMsg];
    setTutorMessages(updatedMessages);
    setChatInput('');
    setIsLoadingTutor(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/learning/tutor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: activeTopic,
          mode: tutorMode,
          messages: updatedMessages.map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      if (!response.ok) throw new Error('Error en respuesta del tutor');
      const data = await response.json();

      setTutorMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
      setTutorMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: tutorMode === 'socrates'
            ? 'Interesante razonamiento. Ahora profundicemos: si lo que dices es cierto, ¿qué contradicción podría surgir en un caso extremo?'
            : 'Noto una idea interesante en tu explicación, pero intenta simplificar un poco más: ¿qué metáfora de la vida real usarías para ejemplificarlo?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoadingTutor(false);
    }
  };

  // Switch tutor mode or reset
  const handleSwitchTutorMode = (newMode) => {
    if (newMode === tutorMode) return;
    setTutorMode(newMode);
    if (activeTopic) {
      // Re-init with same topic in the new mode
      handleStartTutorSession(newMode);
    }
  };

  const handleResetTopic = () => {
    setActiveTopic('');
    setTutorMessages([]);
    setChatInput('');
  };

  // RETO DIARIO STATE
  const [dailyStartTime, setDailyStartTime] = useState('18:00');
  const [dailyPlace, setDailyPlace] = useState('Biblioteca Central');
  const [habitSaved, setHabitSaved] = useState(false);
  const [streakCount, setStreakCount] = useState(5);
  const [scheduledCommitment, setScheduledCommitment] = useState(null);

  // Proximity notification checker
  useEffect(() => {
    if (!scheduledCommitment || scheduledCommitment.notifiedApproaching) return;

    const checkProximity = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      const [targetH, targetM] = scheduledCommitment.time.split(':').map(Number);
      const currentTotal = currentHours * 60 + currentMinutes;
      const targetTotal = targetH * 60 + targetM;

      const diff = targetTotal - currentTotal;

      if (diff <= 15 && diff >= 0) {
        if (addNotification) {
          addNotification({
            title: '⏰ ¡Recordatorio Próximo!',
            message: `Tu compromiso de estudio en ${scheduledCommitment.place} comienza pronto (${scheduledCommitment.time} hrs).`,
            iconType: 'bell'
          });
        }
        setScheduledCommitment(prev => ({ ...prev, notifiedApproaching: true }));
      }
    };

    const timer = setInterval(checkProximity, 3000);
    checkProximity();
    return () => clearInterval(timer);
  }, [scheduledCommitment, addNotification]);

  const handleSaveHabit = (e) => {
    e.preventDefault();
    setHabitSaved(true);

    const timeVal = dailyStartTime || '18:00';
    const placeVal = dailyPlace || 'Biblioteca Central';

    if (addNotification) {
      addNotification({
        title: '¡Compromiso Registrado! 🎯',
        message: `Estudio agendado a las ${timeVal} hrs en ${placeVal}.`,
        iconType: 'clock'
      });
    }

    setScheduledCommitment({
      time: timeVal,
      place: placeVal,
      notifiedApproaching: false
    });

    setTimeout(() => setHabitSaved(false), 3000);
  };

  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleModifyTimer = (mins) => {
    setTimeLeft(mins * 60);
    setIsTimerActive(false);
  };

  // MOCK MINI-CALENDARIO RACHA
  const weekDays = [
    { day: 'L', done: true },
    { day: 'M', done: true },
    { day: 'X', done: true },
    { day: 'J', done: true },
    { day: 'V', done: true },
    { day: 'S', done: false },
    { day: 'D', done: false },
  ];

  // FILTERS STATE
  const [carrera, setCarrera] = useState('');
  const [semestre, setSemestre] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const categories = [
    {
      id: 'CURSOS',
      title: 'Cursos',
      icon: GraduationCap,
      description: 'Accede a cursos y contenidos para tu desarrollo académico y profesional'
    },
    {
      id: 'RECURSOS',
      title: 'Recursos',
      icon: BookMarked,
      description: 'Encuentra apuntes, guías, plantillas y material de apoyo'
    },
    {
      id: 'PRACTICA',
      title: 'Práctica',
      icon: ClipboardCheck,
      description: 'Pon a prueba tus conocimientos con ejercicios, simulaciones y evaluación'
    }
  ];

  const handleCategoryClick = (id) => {
    setActiveView(id);
    setHasSearched(false);
    setCarrera('');
    setSemestre('');
  };

  const handleSearch = () => {
    if (carrera && semestre) {
      setHasSearched(true);
    }
  };

  const mockCourses = [
    {
      id: 1,
      title: 'Fundamentos de Arquitectura de Software',
      instructor: 'Ing. Carlos Gutiérrez',
      level: 'Intermedio',
      duration: '12 horas'
    },
    {
      id: 2,
      title: 'Desarrollo Web Frontend',
      instructor: 'Mariana Alarcón',
      level: 'Básico',
      duration: '8 horas'
    },
    {
      id: 3,
      title: 'Patrones de Diseño (GoF)',
      instructor: 'Comunidad LinkUP Tech',
      level: 'Avanzado',
      duration: '15 horas'
    }
  ];

  if (activeView === 'CURSOS') {
    return (
      <div className="flex-1 p-6 sm:p-10 max-w-5xl mx-auto w-full flex flex-col animate-fadeIn min-h-[80vh]">
        <button 
          onClick={() => setActiveView('HOME')}
          className="flex items-center gap-2 text-[#4A5568] hover:text-[#1D63B8] font-bold text-sm mb-6 transition-colors w-fit cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a Inicio
        </button>

        <div className="space-y-3 mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-[#0D2538] tracking-wider uppercase">
            Catálogo de Cursos
          </h1>
          <p className="text-[#4A5568] text-base font-semibold">
            Filtra por tu carrera y semestre para encontrar el contenido adecuado.
          </p>
        </div>

        {/* FILTERS */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl mb-8 flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-2/5">
            <label className="block text-xs font-bold text-[#4A5568] uppercase mb-2">Carrera</label>
            <select 
              value={carrera}
              onChange={(e) => { setCarrera(e.target.value); setHasSearched(false); }}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 text-[#0D2538] font-bold text-sm border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="">Selecciona tu carrera...</option>
              <option value="Ingeniería de Software">Ingeniería de Software</option>
              <option value="Ciencias de la Computación">Ciencias de la Computación</option>
              <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
              <option value="Ingeniería Informática">Ingeniería Informática</option>
            </select>
          </div>
          <div className="w-full md:w-2/5">
            <label className="block text-xs font-bold text-[#4A5568] uppercase mb-2">Semestre</label>
            <select 
              value={semestre}
              onChange={(e) => { setSemestre(e.target.value); setHasSearched(false); }}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 text-[#0D2538] font-bold text-sm border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="">Semestre...</option>
              <option value="1">1er Semestre</option>
              <option value="2">2do Semestre</option>
              <option value="3">3er Semestre</option>
              <option value="4">4to Semestre</option>
              <option value="5">5to Semestre</option>
              <option value="6">6to Semestre</option>
              <option value="7">7mo Semestre</option>
              <option value="8">8vo Semestre</option>
              <option value="9">9no Semestre</option>
              <option value="10">10mo Semestre</option>
            </select>
          </div>
          <div className="w-full md:w-1/5">
            <button 
              onClick={handleSearch}
              disabled={!carrera || !semestre}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${(!carrera || !semestre) ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg cursor-pointer'}`}
            >
              <Search className="w-4 h-4" />
              Buscar
            </button>
          </div>
        </div>

        {/* RESULTS OR EMPTY STATE */}
        {hasSearched ? (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-extrabold text-[#0D2538] border-b border-slate-200 pb-2">
              Resultados para {carrera} - Semestre {semestre}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCourses.map(course => (
                <div key={course.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col">
                  <div className="w-14 h-14 rounded-2xl bg-[#1D63B8]/10 text-[#1D63B8] border border-blue-500/30 flex items-center justify-center mb-5">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <h3 className="font-extrabold text-[#0D2538] text-lg mb-2 group-hover:text-[#1D63B8] transition-colors leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-sm font-medium text-[#4A5568] mb-4">
                    👨‍🏫 {course.instructor}
                  </p>
                  
                  <div className="pt-4 border-t border-slate-100 space-y-2 mb-6 flex-1">
                    <p className="text-xs font-bold text-[#1D63B8]">⏱️ {course.duration}</p>
                    <p className="text-xs font-medium text-[#4A5568]">📊 Nivel: {course.level}</p>
                  </div>
                  <button className="w-full mt-auto py-2.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-[#0D2538] font-bold text-sm rounded-xl transition-colors cursor-pointer">
                    Ver Detalles
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 mt-10">
            <Search className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-400">Selecciona tus filtros</h3>
            <p className="text-sm font-medium text-slate-400">Los cursos se mostrarán cuando selecciones tu carrera y semestre.</p>
          </div>
        )}
      </div>
    );
  }

  // HOME VIEW
  const mockRecursos = [
    { id: 1, title: 'Guía Definitiva de React & Hooks', type: 'PDF • 45 páginas', size: '2.4 MB', icon: BookMarked },
    { id: 2, title: 'Plantilla de Organización Semanal', type: 'Excel / Notion', size: 'Plantilla', icon: ClipboardCheck },
    { id: 3, title: 'Cheat Sheet de Comandos Git', type: 'PDF • 2 páginas', size: '0.8 MB', icon: BookMarked },
    { id: 4, title: 'Apuntes de Cálculo Diferencial', type: 'PDF • Apuntes comunitarios', size: '15 MB', icon: BookMarked }
  ];

  const mockPractica = [
    { id: 1, title: 'Simulador de Entrevistas Técnicas', type: 'Quiz Interactivo', level: 'Intermedio', time: '45 mins' },
    { id: 2, title: 'Examen de Prueba: Estructuras de Datos', type: 'Cuestionario', level: 'Básico', time: '60 mins' },
    { id: 3, title: 'Reto de Código: Algoritmos de Búsqueda', type: 'Plataforma Online', level: 'Avanzado', time: '90 mins' },
    { id: 4, title: 'Laboratorio Práctico de SQL', type: 'Entorno Virtual', level: 'Básico', time: '120 mins' }
  ];

  if (activeView === 'RECURSOS') {
    return (
      <div className="flex-1 p-6 sm:p-10 max-w-5xl mx-auto w-full flex flex-col animate-fadeIn min-h-[80vh]">
        <button 
          onClick={() => setActiveView('HOME')}
          className="flex items-center gap-2 text-[#4A5568] hover:text-[#1D63B8] font-bold text-sm mb-6 transition-colors w-fit cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a Inicio
        </button>

        <div className="space-y-3 mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-[#0D2538] tracking-wider uppercase">
            Recursos y Materiales
          </h1>
          <p className="text-[#4A5568] text-base font-semibold">
            Descarga guías, plantillas y apuntes compartidos por la comunidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockRecursos.map(rec => (
            <div key={rec.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all flex items-start gap-4 cursor-pointer hover:border-blue-300">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <rec.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-[#0D2538] text-lg mb-1">{rec.title}</h3>
                <p className="text-sm font-medium text-[#4A5568]">{rec.type}</p>
                <span className="inline-block mt-2 text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md">{rec.size}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeView === 'PRACTICA') {
    return (
      <div className="flex-1 p-6 sm:p-10 max-w-5xl mx-auto w-full flex flex-col animate-fadeIn min-h-[80vh]">
        <button 
          onClick={() => setActiveView('HOME')}
          className="flex items-center gap-2 text-[#4A5568] hover:text-[#1D63B8] font-bold text-sm mb-6 transition-colors w-fit cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a Inicio
        </button>

        <div className="space-y-3 mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-[#0D2538] tracking-wider uppercase">
            Espacio de Práctica
          </h1>
          <p className="text-[#4A5568] text-base font-semibold">
            Pon a prueba tus conocimientos con simuladores y retos interactivos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {mockPractica.map(prac => (
            <div key={prac.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between hover:border-amber-400 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider bg-amber-100 text-amber-700">
                    {prac.level}
                  </span>
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {prac.time}
                  </span>
                </div>
                <h3 className="font-extrabold text-[#0D2538] text-xl group-hover:text-amber-500 transition-colors">{prac.title}</h3>
                <p className="text-sm font-medium text-[#4A5568]">{prac.type}</p>
              </div>
              <button className="mt-6 w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-900 font-bold text-sm rounded-xl shadow-sm transition-colors cursor-pointer">
                Iniciar Práctica
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 sm:p-10 max-w-5xl mx-auto w-full flex flex-col items-center justify-center space-y-12 animate-fadeIn min-h-[80vh]">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl sm:text-5xl font-black text-[#0D2538] tracking-wider uppercase">
          APRENDIZAJE
        </h1>
        <p className="text-[#4A5568] text-base sm:text-lg font-semibold tracking-wide">
          Aprende, practica y desarrolla tus habilidades con Inteligencia Artificial
        </p>
      </div>

      {/* SECCIÓN 2: INTERACCIÓN IA - TUTOR DE APRENDIZAJE (SÓCRATES & FEYNMAN) */}
      <div className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-indigo-100 relative overflow-hidden">
        {/* Glow decorativo de fondo */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-indigo-200/30 to-amber-200/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-6">
          
          {/* Cabecera del Módulo IA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-[#0D2538] tracking-wide">
                    Tutor Virtual de Aprendizaje (IA)
                  </h2>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                    Gemini Activo
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Domina cualquier concepto a través de preguntas reflexivas o explicaciones simplificadas.
                </p>
              </div>
            </div>

            {/* Botón de Cambiar / Reiniciar si ya hay una sesión activa */}
            {activeTopic && (
              <button
                type="button"
                onClick={handleResetTopic}
                className="self-start sm:self-auto text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Ingresar nuevo tema</span>
              </button>
            )}
          </div>

          {/* PASO 1: INPUT DE TEMA Y SELECTOR DE TUTOR */}
          {!activeTopic ? (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Campo de Entrada (Input de Tema) */}
              <div>
                <label className="block text-xs font-black uppercase text-[#0D2538] tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>¿Qué tema o concepto deseas estudiar hoy?</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder="Ej: Patrones de Diseño, Entropía en Termodinámica, Teorema de Bayes, Recursión..."
                    className="flex-1 bg-slate-50 border-2 border-slate-200 focus:border-indigo-600 focus:bg-white rounded-2xl px-5 py-3.5 text-sm font-semibold text-[#0D2538] outline-none transition-all shadow-inner"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleStartTutorSession();
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleStartTutorSession()}
                    disabled={!topicInput.trim()}
                    className={`px-7 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                      topicInput.trim()
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer active:scale-95'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span>Comenzar Tutoría</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Selector de Tutor IA (Modo de Estudio) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase text-[#0D2538] tracking-wider flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-indigo-600" />
                    <span>Selecciona tu Tutor Virtual (Modo de Estudio):</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    Podrás alternar en cualquier momento
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* MODO 1: SÓCRATES */}
                  <div
                    onClick={() => setTutorMode('socrates')}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      tutorMode === 'socrates'
                        ? 'bg-gradient-to-br from-indigo-50/80 to-blue-50/80 border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-lg">
                          Modo 1 • Método Mayéutico
                        </span>
                        {tutorMode === 'socrates' && (
                          <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                            ✓
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-black text-[#0D2538] mb-1 flex items-center gap-2">
                        <span>🏛️ Sócrates</span>
                      </h3>
                      <p className="text-xs text-[#4A5568] leading-relaxed font-medium">
                        <strong>Comportamiento:</strong> No da respuestas directas. Formula preguntas reflexivas e incisivas sobre el tema para que desarrolles el hábito de razonar y descubrir las respuestas por ti mismo.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-indigo-100 flex items-center justify-between text-[11px] font-bold text-indigo-600">
                      <span>Ideal para: Pensamiento crítico y deducción</span>
                      <span>Seleccionar →</span>
                    </div>
                  </div>

                  {/* MODO 2: FEYNMAN */}
                  <div
                    onClick={() => setTutorMode('feynman')}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      tutorMode === 'feynman'
                        ? 'bg-gradient-to-br from-amber-50/80 to-orange-50/80 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-lg">
                          Modo 2 • Técnica de Feynman
                        </span>
                        {tutorMode === 'feynman' && (
                          <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                            ✓
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-black text-[#0D2538] mb-1 flex items-center gap-2">
                        <span>⚛️ Richard Feynman</span>
                      </h3>
                      <p className="text-xs text-[#4A5568] leading-relaxed font-medium">
                        <strong>Comportamiento:</strong> Te guía para que expliques conceptos o fórmulas en palabras ultra sencillas (como a un niño de 10 años) y diagnostica vacíos en tu comprensión.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-[11px] font-bold text-amber-700">
                      <span>Ideal para: Claridad conceptual y analogías</span>
                      <span>Seleccionar →</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* PASO 2: SESIÓN INTERACTIVA CON EL TUTOR IA */
            <div className="space-y-4 animate-fadeIn">
              
              {/* BARRA DE ESTADO / CONTROL DE LA SESIÓN */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base shadow-sm ${
                    tutorMode === 'socrates' ? 'bg-indigo-600' : 'bg-amber-500'
                  }`}>
                    {tutorMode === 'socrates' ? '🏛️' : '⚛️'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tema en estudio:</span>
                      <span className="text-sm font-black text-[#0D2538] bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                        {activeTopic}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">
                      Tutor activo: <strong className={tutorMode === 'socrates' ? 'text-indigo-700' : 'text-amber-700'}>
                        {tutorMode === 'socrates' ? 'Sócrates (Método Mayéutico)' : 'Richard Feynman (Técnica de Feynman)'}
                      </strong>
                    </p>
                  </div>
                </div>

                {/* BOTONES PARA CAMBIAR DE TUTOR / MÉTODO */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSwitchTutorMode('socrates')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                      tutorMode === 'socrates'
                        ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400'
                        : 'bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    <span>🏛️ Modo Sócrates</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchTutorMode('feynman')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                      tutorMode === 'feynman'
                        ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                        : 'bg-white border border-slate-200 text-slate-600 hover:text-amber-700 hover:bg-amber-50'
                    }`}
                  >
                    <span>⚛️ Modo Feynman</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetTopic}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:border-red-300 text-slate-500 hover:text-red-600 transition-colors cursor-pointer flex items-center gap-1"
                    title="Ingresar otro tema de estudio"
                  >
                    <span>Otro tema</span>
                  </button>
                </div>
              </div>

              {/* CAJA DE CONVERSACIÓN / HISTORIAL */}
              <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-4 h-[380px] overflow-y-auto space-y-3.5 shadow-inner">
                {tutorMessages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fadeIn`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-[10px] font-black uppercase text-slate-400">
                          {isUser ? 'Tú (Estudiante)' : (tutorMode === 'socrates' ? 'Sócrates' : 'Richard Feynman')}
                        </span>
                        {msg.timestamp && (
                          <span className="text-[9px] text-slate-400">
                            • {msg.timestamp}
                          </span>
                        )}
                      </div>

                      <div
                        className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-sm ${
                          isUser
                            ? 'bg-[#1D63B8] text-white rounded-br-xs'
                            : tutorMode === 'socrates'
                            ? 'bg-white text-[#0D2538] border border-indigo-200 rounded-bl-xs'
                            : 'bg-white text-[#0D2538] border border-amber-200 rounded-bl-xs'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}

                {isLoadingTutor && (
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-white px-3 py-2 rounded-xl border border-indigo-100 w-fit animate-pulse">
                    <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
                    <span>
                      {tutorMode === 'socrates' 
                        ? 'Sócrates está formulando una pregunta reflexiva...' 
                        : 'Feynman está diagnosticando tu explicación...'}
                    </span>
                  </div>
                )}
                <div ref={tutorChatEndRef} />
              </div>

              {/* INPUT DE INTERACCIÓN */}
              <form onSubmit={handleSendTutorMessage} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={
                    tutorMode === 'socrates'
                      ? 'Escribe tu respuesta o reflexión al dilema socrático...'
                      : 'Explica el concepto con tus propias palabras o haz tu analogía...'
                  }
                  disabled={isLoadingTutor}
                  className="flex-1 bg-white border-2 border-slate-200 focus:border-indigo-600 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-[#0D2538] outline-none transition-colors shadow-sm disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isLoadingTutor}
                  className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md ${
                    chatInput.trim() && !isLoadingTutor
                      ? tutorMode === 'socrates'
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer active:scale-95'
                        : 'bg-amber-500 hover:bg-amber-400 text-white cursor-pointer active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>Responder</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>
          )}

        </div>
      </div>

      {/* SECTION: RETO DIARIO & CRONÓMETRO */}
      <div className="w-full bg-white backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* IZQUIERDA: Planificación y Racha */}
          <div className="space-y-6 flex flex-col justify-center">
            {/* Cabecera del Reto */}
            <div className="flex flex-col items-start space-y-2 pb-2">
              <div className="flex items-center gap-3">
                <Trophy className="w-10 h-10 text-amber-400 drop-shadow-sm" />
                <h2 className="font-extrabold text-[#0D2538] text-2xl uppercase tracking-wide">
                  Tu Reto Diario
                </h2>
              </div>
              <p className="text-sm font-medium text-[#4A5568] max-w-md">
                ¡Mantén la constancia! Configura tu lugar y hora, y cumple tus objetivos semanales.
              </p>
            </div>

            {/* Mini Calendario de Racha */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
              <div className="flex gap-2">
                {weekDays.map((d, i) => (
                  <div key={i} className={`w-8 h-11 sm:w-10 sm:h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 shadow-sm transition-transform hover:scale-105 ${d.done ? 'bg-amber-400 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>
                    <span className="text-[10px] font-black">{d.day}</span>
                    {d.done ? <CheckCircle2 className="w-4 h-4 text-white" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-200" />}
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center justify-center bg-white px-5 py-2 rounded-xl shadow-sm border border-amber-100 min-w-[100px]">
                <span className="text-2xl font-black text-amber-500 leading-none">{streakCount}</span>
                <span className="text-[9px] font-extrabold text-amber-600 uppercase tracking-wider mt-1">Días Seguidos</span>
              </div>
            </div>

            {/* Formulario Hora Inicio y Lugar */}
            <form onSubmit={handleSaveHabit} className="space-y-5 pt-3 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-[10px] font-bold text-[#4A5568] uppercase mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#1D63B8]" /> Hora Inicio:
                  </label>
                  <input
                    type="time"
                    value={dailyStartTime}
                    onChange={(e) => setDailyStartTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 text-[#0D2538] font-bold text-xs border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-[10px] font-bold text-[#4A5568] uppercase mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#1D63B8]" /> Lugar:
                  </label>
                  <input
                    type="text"
                    value={dailyPlace}
                    onChange={(e) => setDailyPlace(e.target.value)}
                    placeholder="Ej. Biblioteca Central"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 text-[#0D2538] font-bold text-xs border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#1D63B8] hover:bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                <span>{habitSaved ? '¡Compromiso Registrado! ✓' : 'Fijar Compromiso de Estudio'}</span>
              </button>
            </form>
          </div>

          {/* DERECHA: Cronómetro */}
          <div className="flex flex-col items-center justify-center bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-inner">
            <Timer className="w-8 h-8 text-blue-500 mb-2 drop-shadow-sm" />
            <h3 className="text-sm font-extrabold text-slate-500 uppercase tracking-widest mb-6">
              Cronómetro de Estudio
            </h3>

            {/* Display de tiempo */}
            <div className="text-7xl sm:text-8xl font-black text-[#0D2538] tabular-nums tracking-tighter mb-8 drop-shadow-md">
              {formatTime(timeLeft)}
            </div>

            {/* Botones rápidos */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {[5, 15, 25, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleModifyTimer(mins)}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-[#1D63B8] hover:border-blue-300 hover:bg-blue-50 shadow-sm transition-all active:scale-95"
                >
                  {mins} min
                </button>
              ))}
            </div>

            {/* Controles del Cronómetro */}
            <div className="flex gap-4">
              <button 
                onClick={() => setIsTimerActive(!isTimerActive)} 
                className="w-16 h-16 rounded-full bg-[#1D63B8] hover:bg-blue-600 flex items-center justify-center text-white shadow-xl hover:shadow-2xl transition-all active:scale-95 transform hover:-translate-y-1"
              >
                {isTimerActive ? (
                  <Pause className="w-7 h-7 fill-current" />
                ) : (
                  <Play className="w-7 h-7 fill-current ml-1" />
                )}
              </button>
              <button 
                onClick={() => handleModifyTimer(25)} 
                className="w-16 h-16 rounded-full bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 shadow-md transition-all active:scale-95 transform hover:-translate-y-1"
                title="Reiniciar a 25 min (Pomodoro)"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 3 MAIN CATEGORY CARDS */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="p-8 rounded-3xl cursor-pointer transition-all duration-300 flex flex-col items-center text-center border shadow-xl hover:shadow-2xl transform hover:-translate-y-2 bg-white border-slate-200 hover:border-blue-400 group"
            >
              <div className="w-20 h-20 rounded-2xl bg-[#1D63B8]/10 border border-blue-500/30 text-[#1D63B8] flex items-center justify-center shadow-md mb-6 group-hover:bg-[#1D63B8] group-hover:text-white transition-colors">
                <Icon className="w-10 h-10" />
              </div>
              <h3 className="font-extrabold text-2xl text-[#0D2538] tracking-tight mb-3">
                {cat.title}
              </h3>
              <p className="text-sm font-medium text-[#4A5568] leading-relaxed mb-6">
                {cat.description}
              </p>
              <div className="mt-auto pt-4 border-t border-slate-100 w-full flex justify-center">
                <span className="text-sm font-bold text-[#1D63B8] flex items-center gap-2">
                  Explorar contenidos
                  <span className="w-6 h-6 rounded-full bg-[#1D63B8]/10 text-[#1D63B8] flex items-center justify-center text-lg group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
