import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, BookMarked, ClipboardCheck, Trophy, CheckCircle2, ArrowLeft, ArrowRight, Search, 
  MapPin, Clock, Play, Pause, RotateCcw, Timer, Sparkles, Send, Bot, RefreshCw, 
  BookOpen, Lightbulb, MessageSquare, HelpCircle, ChevronRight, Check,
  UploadCloud, FileText, Image as ImageIcon, Trash2, ExternalLink, AlertCircle, Video, Book, Globe,
  CheckCircle, XCircle, FileQuestion, ListOrdered, BookCheck, Layers, FileUp, Eye
} from 'lucide-react';

export default function LearningSection({ addNotification }) {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // NAVIGATION STATE
  const [activeView, setActiveView] = useState('HOME');

  // AI SUB-TABS: 'tutor' | 'recommendations' | 'documents'
  const [aiTab, setAiTab] = useState('tutor');

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

  // RECOMENDADOR DE FUENTES STATE
  const [recTopicInput, setRecTopicInput] = useState('');
  const [recResults, setRecResults] = useState(null);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const [recError, setRecError] = useState(null);
  const [recCategoryFilter, setRecCategoryFilter] = useState('TODOS');

  // ESTUDIO CON MATERIAL PROPIO (DOCUMENTOS) STATE
  const [sourcesList, setSourcesList] = useState([]);
  const [activeSourceId, setActiveSourceId] = useState(null);
  const [isLoadingSources, setIsLoadingSources] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [studyAction, setStudyAction] = useState(null);
  const [studyResult, setStudyResult] = useState(null);
  const [studyQuiz, setStudyQuiz] = useState(null);
  const [userQuizAnswers, setUserQuizAnswers] = useState({});
  const [isLoadingStudy, setIsLoadingStudy] = useState(false);
  const [studyError, setStudyError] = useState(null);
  const [customQuestionInput, setCustomQuestionInput] = useState('');
  const fileInputRef = useRef(null);

  // Cargar fuentes almacenadas al montar
  useEffect(() => {
    const fetchSources = async () => {
      try {
        setIsLoadingSources(true);
        const res = await fetch(`${apiUrl}/api/learning/sources`);
        if (res.ok) {
          const data = await res.json();
          const list = data.sources || [];
          setSourcesList(list);
          if (list.length > 0 && !activeSourceId) {
            setActiveSourceId(list[0].id);
          }
        }
      } catch (err) {
        console.error('Error al cargar fuentes:', err);
      } finally {
        setIsLoadingSources(false);
      }
    };
    fetchSources();
  }, [apiUrl]);

  // Handler para subir archivo
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validación 1: Tamaño (máximo 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('El archivo supera el tamaño máximo permitido de 15MB.');
      if (addNotification) {
        addNotification({
          title: 'Archivo demasiado grande',
          message: 'El tamaño máximo permitido para subir es 15MB.',
          iconType: 'bell'
        });
      }
      return;
    }

    // Validación 2: Archivo vacío
    if (file.size === 0) {
      setUploadError('El archivo seleccionado está vacío (0 bytes).');
      return;
    }

    // Validación 3: Formato compatible
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Formato no compatible. Por favor sube archivos PDF o imágenes (PNG, JPG, WEBP).');
      if (addNotification) {
        addNotification({
          title: 'Formato no compatible',
          message: 'Solo se admiten documentos PDF e imágenes.',
          iconType: 'bell'
        });
      }
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${apiUrl}/api/learning/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar el archivo');
      }

      setSourcesList(prev => [data.source, ...prev]);
      setActiveSourceId(data.source.id);
      setStudyResult(null);
      setStudyQuiz(null);
      if (addNotification) {
        addNotification({
          title: '¡Material Cargado con Éxito! 📄',
          message: `"${file.name}" ha sido analizado por la IA y está listo para estudiar.`,
          iconType: 'check'
        });
      }
    } catch (err) {
      console.error('Error al subir:', err);
      setUploadError(err.message || 'Error al conectar con el servidor.');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  // Handler para eliminar fuente
  const handleDeleteSource = async (id, name, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm(`¿Estás seguro de que deseas eliminar "${name}"?`)) return;

    try {
      const res = await fetch(`${apiUrl}/api/learning/sources/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSourcesList(prev => {
          const next = prev.filter(s => s.id !== id);
          if (activeSourceId === id) {
            setActiveSourceId(next.length > 0 ? next[0].id : null);
            setStudyResult(null);
            setStudyQuiz(null);
          }
          return next;
        });
        if (addNotification) {
          addNotification({
            title: 'Fuente Eliminada',
            message: `Se ha eliminado "${name}".`,
            iconType: 'bell'
          });
        }
      } else {
        const data = await res.json();
        alert(data.error || 'No se pudo eliminar la fuente.');
      }
    } catch (err) {
      console.error('Error al eliminar fuente:', err);
    }
  };

  // Handler para acciones interactivas de estudio
  const handleStudyAction = async (actionType, customQuery = null) => {
    if (!activeSourceId) {
      alert('Por favor selecciona o sube una fuente primero.');
      return;
    }

    setIsLoadingStudy(true);
    setStudyError(null);
    setStudyAction(actionType);
    if (actionType !== 'quiz') {
      setStudyQuiz(null);
    } else {
      setStudyResult(null);
      setUserQuizAnswers({});
    }

    try {
      const res = await fetch(`${apiUrl}/api/learning/study`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: activeSourceId,
          action: actionType,
          query: customQuery
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar la sesión de estudio.');
      }

      if (actionType === 'quiz') {
        setStudyQuiz(data.result);
        setStudyResult(null);
      } else {
        setStudyResult(data.result);
        setStudyQuiz(null);
      }
    } catch (err) {
      console.error('Error en sesión interactiva:', err);
      setStudyError(err.message || 'No se pudo procesar la solicitud.');
    } finally {
      setIsLoadingStudy(false);
    }
  };

  // Handler para recomendaciones de fuentes
  const handleGetRecommendations = async (e) => {
    if (e) e.preventDefault();
    const clean = recTopicInput.trim();
    if (!clean) return;

    setIsLoadingRecs(true);
    setRecError(null);
    setRecResults(null);

    try {
      const res = await fetch(`${apiUrl}/api/learning/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: clean })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al obtener recomendaciones');
      }

      setRecResults(data);
      if (addNotification) {
        addNotification({
          title: 'Recomendaciones Listas 🎯',
          message: `Fuentes de estudio encontradas para "${clean}".`,
          iconType: 'check'
        });
      }
    } catch (err) {
      console.error('Error en recomendaciones:', err);
      setRecError(err.message || 'No se pudieron generar recomendaciones.');
    } finally {
      setIsLoadingRecs(false);
    }
  };

  // Helper para renderizar citas [Página X] o [Sección] con estilo resaltado
  const renderFormattedStudyText = (text) => {
    if (!text) return null;
    return (
      <div className="space-y-3 text-sm leading-relaxed text-[#0D2538]">
        {text.split('\n\n').map((paragraph, pIdx) => {
          const parts = paragraph.split(/(\[Página\s+\d+[^\]]*\]|\[Sección[^\]]*\]|\[Diagrama[^\]]*\])/gi);
          return (
            <p key={pIdx} className="whitespace-pre-line">
              {parts.map((part, i) => {
                if (/^\[(Página|Sección|Diagrama)/i.test(part)) {
                  return (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 mx-1 px-2.5 py-0.5 rounded-lg text-xs font-black bg-blue-100 text-[#1D63B8] border border-blue-200 shadow-xs align-baseline"
                    >
                      📍 {part.replace(/[[\]]/g, '')}
                    </span>
                  );
                }
                return part;
              })}
            </p>
          );
        })}
      </div>
    );
  };


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

          {/* SUB-TABS DE NAVEGACIÓN IA */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
            <button
              type="button"
              onClick={() => setAiTab('tutor')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                aiTab === 'tutor'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Tutor Socrático & Feynman</span>
            </button>

            <button
              type="button"
              onClick={() => setAiTab('recommendations')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                aiTab === 'recommendations'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Recomendador de Fuentes</span>
              <span className="text-[10px] bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                Videos • Libros • Webs
              </span>
            </button>

            <button
              type="button"
              onClick={() => setAiTab('documents')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                aiTab === 'documents'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Estudio con Material Propio</span>
              <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                PDF / Imágenes
              </span>
            </button>
          </div>

          {/* VISTA 1: TUTOR VIRTUAL (SÓCRATES & FEYNMAN) */}
          {aiTab === 'tutor' && (
            <>
              {/* PASO 1: INPUT DE TEMA Y SELECTOR DE TUTOR */}
              {!activeTopic ? (
                <div className="space-y-6 animate-fadeIn">
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

                  {/* Selector de Tutor IA */}
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
            </>
          )}

          {/* VISTA 2: RECOMENDADOR DE FUENTES (VIDEOS, LIBROS, WEBS) */}
          {aiTab === 'recommendations' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-gradient-to-r from-indigo-50/60 to-blue-50/60 p-5 rounded-2xl border border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-[#0D2538] flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <span>Curador y Recomendador Académico Inteligente</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Ingresa lo que deseas aprender y la IA organizará recursos verificados en <strong>Videos</strong>, <strong>Libros canónicos</strong> y <strong>Páginas web oficiales</strong>.
                  </p>
                </div>
              </div>

              {/* Formulario de Búsqueda */}
              <form onSubmit={handleGetRecommendations} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={recTopicInput}
                  onChange={(e) => setRecTopicInput(e.target.value)}
                  placeholder="¿Qué tema deseas aprender? (Ej. Redes Neuronales, SQL Avanzado, Cálculo Integral, Microeconomía...)"
                  className="flex-1 bg-slate-50 border-2 border-slate-200 focus:border-indigo-600 focus:bg-white rounded-2xl px-5 py-3.5 text-sm font-semibold text-[#0D2538] outline-none transition-all shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!recTopicInput.trim() || isLoadingRecs}
                  className={`px-7 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                    recTopicInput.trim() && !isLoadingRecs
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isLoadingRecs ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Curando fuentes...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Recomendar Fuentes</span>
                    </>
                  )}
                </button>
              </form>

              {/* Mensaje de Error */}
              {recError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                  <span>{recError}</span>
                </div>
              )}

              {/* Loading State */}
              {isLoadingRecs && (
                <div className="p-12 text-center flex flex-col items-center justify-center space-y-3 bg-slate-50 rounded-2xl border border-slate-200 animate-pulse">
                  <Sparkles className="w-8 h-8 text-indigo-600 animate-spin" />
                  <p className="text-sm font-black text-[#0D2538]">Buscando y verificando recursos de alta calidad...</p>
                  <p className="text-xs text-slate-500 max-w-md">Clasificando videos pedagógicos, bibliografía recomendada y sitios web oficiales sin enlaces ficticios.</p>
                </div>
              )}

              {/* Resultados */}
              {recResults && !isLoadingRecs && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Resumen del tema */}
                  <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200 flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black uppercase text-indigo-900 tracking-wider">
                        Enfoque de Estudio Recomendado para: {recResults.topic}
                      </h4>
                      <p className="text-xs text-indigo-950 font-medium mt-1 leading-relaxed">
                        {recResults.summary}
                      </p>
                    </div>
                  </div>

                  {/* Filtro de Categoría */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black uppercase text-slate-400 mr-2">Filtrar por:</span>
                    {[
                      { id: 'TODOS', label: 'Todos los recursos' },
                      { id: 'video', label: `🎬 Videos (${recResults.videos?.length || 0})` },
                      { id: 'libro', label: `📖 Libros (${recResults.libros?.length || 0})` },
                      { id: 'web', label: `🌐 Páginas Web (${recResults.webs?.length || 0})` }
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setRecCategoryFilter(f.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          recCategoryFilter === f.id
                            ? 'bg-[#1D63B8] text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Grid de Recursos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Videos */}
                    {(recCategoryFilter === 'TODOS' || recCategoryFilter === 'video') &&
                      recResults.videos?.map((item, idx) => (
                        <div key={`v-${idx}`} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md hover:shadow-lg transition-all flex flex-col justify-between hover:border-red-300 group">
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                                <Video className="w-3 h-3" />
                                Video / Canal
                              </span>
                            </div>
                            <h4 className="font-extrabold text-[#0D2538] text-sm group-hover:text-red-600 transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-xs text-[#4A5568] leading-relaxed">
                              {item.description}
                            </p>
                            <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 text-[11px] text-red-950 font-medium">
                              <strong className="block text-red-800 font-bold mb-0.5">💡 Utilidad de aprendizaje:</strong>
                              {item.usefulness}
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            {item.link ? (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                              >
                                <span>Ver Recurso</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            ) : (
                              <span className="text-[11px] font-bold text-slate-400 italic">
                                Disponible en plataformas educativas
                              </span>
                            )}
                          </div>
                        </div>
                      ))}

                    {/* Libros */}
                    {(recCategoryFilter === 'TODOS' || recCategoryFilter === 'libro') &&
                      recResults.libros?.map((item, idx) => (
                        <div key={`l-${idx}`} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md hover:shadow-lg transition-all flex flex-col justify-between hover:border-purple-300 group">
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                                <Book className="w-3 h-3" />
                                Libro Canónico
                              </span>
                            </div>
                            <h4 className="font-extrabold text-[#0D2538] text-sm group-hover:text-purple-600 transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-xs text-[#4A5568] leading-relaxed">
                              {item.description}
                            </p>
                            <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-[11px] text-purple-950 font-medium">
                              <strong className="block text-purple-800 font-bold mb-0.5">💡 Utilidad académica:</strong>
                              {item.usefulness}
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            {item.link ? (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                              >
                                <span>Consultar Libro</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            ) : (
                              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 w-full text-center">
                                Referencia bibliográfica verificada
                              </span>
                            )}
                          </div>
                        </div>
                      ))}

                    {/* Páginas Web */}
                    {(recCategoryFilter === 'TODOS' || recCategoryFilter === 'web') &&
                      recResults.webs?.map((item, idx) => (
                        <div key={`w-${idx}`} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md hover:shadow-lg transition-all flex flex-col justify-between hover:border-blue-300 group">
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-[#1D63B8] px-2.5 py-1 rounded-full flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                Página Web Oficial
                              </span>
                            </div>
                            <h4 className="font-extrabold text-[#0D2538] text-sm group-hover:text-[#1D63B8] transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-xs text-[#4A5568] leading-relaxed">
                              {item.description}
                            </p>
                            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-[11px] text-blue-950 font-medium">
                              <strong className="block text-blue-800 font-bold mb-0.5">💡 Utilidad para el estudio:</strong>
                              {item.usefulness}
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            {item.link ? (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-2 bg-[#1D63B8] hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                              >
                                <span>Abrir Sitio Web</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            ) : (
                              <span className="text-[11px] font-bold text-slate-400 italic">
                                Documentación abierta disponible
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VISTA 3: ESTUDIO CON MATERIAL PROPIO (PDF / IMÁGENES) */}
          {aiTab === 'documents' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Header de la sección de documentos */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-emerald-950 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <span>Carga, Gestión y Estudio Interactivo de Material</span>
                  </h3>
                  <p className="text-xs text-emerald-800 mt-1">
                    Sube archivos PDF o imágenes (apuntes, lecturas, esquemas). La IA interpretará su contenido y te permitirá solicitar <strong>resúmenes</strong>, <strong>paso a paso</strong>, <strong>ejemplos</strong>, <strong>preguntas de práctica</strong> y <strong>cuestionarios</strong> con citas de página.
                  </p>
                </div>
              </div>

              {/* SECCIÓN A: ZONA DE CARGA & GESTIÓN DE FUENTES */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Zona de Drop / Carga de Archivo (4 cols) */}
                <div className="lg:col-span-5 flex flex-col space-y-4">
                  <div
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-6 text-center flex flex-col items-center justify-center transition-all ${
                      isUploading 
                        ? 'border-indigo-400 bg-indigo-50/50 cursor-wait' 
                        : 'border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/30 cursor-pointer'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
                      className="hidden"
                      disabled={isUploading}
                    />

                    {isUploading ? (
                      <div className="py-6 space-y-3 flex flex-col items-center">
                        <Sparkles className="w-10 h-10 text-emerald-600 animate-spin" />
                        <p className="text-sm font-black text-[#0D2538]">Analizando documento con IA...</p>
                        <p className="text-xs text-slate-500">Extrayendo texto, esquemas y páginas del material.</p>
                      </div>
                    ) : (
                      <div className="py-4 space-y-2 flex flex-col items-center">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1 shadow-sm">
                          <UploadCloud className="w-7 h-7" />
                        </div>
                        <h4 className="font-extrabold text-[#0D2538] text-sm">
                          Haz clic para subir o arrastra tu material
                        </h4>
                        <p className="text-xs text-slate-500 font-medium max-w-xs">
                          Admite <strong>PDF</strong> e <strong>Imágenes</strong> (PNG, JPG, WEBP).
                        </p>
                        <span className="inline-block text-[10px] font-black uppercase tracking-wider text-slate-400 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                          Tamaño máximo: 15 MB
                        </span>
                      </div>
                    )}
                  </div>

                  {uploadError && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{uploadError}</span>
                    </div>
                  )}
                </div>

                {/* Lista de Fuentes Cargadas (7 cols) */}
                <div className="lg:col-span-7 flex flex-col space-y-3">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-emerald-600" />
                      <span>Fuentes Almacenadas ({sourcesList.length}):</span>
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      Selecciona una para interactuar
                    </span>
                  </div>

                  {sourcesList.length === 0 ? (
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center flex flex-col items-center justify-center">
                      <FileQuestion className="w-10 h-10 text-slate-300 mb-2" />
                      <p className="text-sm font-bold text-slate-400">No hay fuentes subidas todavía.</p>
                      <p className="text-xs text-slate-400 mt-0.5">Sube un PDF o imagen a la izquierda para comenzar.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                      {sourcesList.map((src) => {
                        const isActive = src.id === activeSourceId;
                        const isPdf = src.mimeType === 'application/pdf';
                        return (
                          <div
                            key={src.id}
                            onClick={() => {
                              setActiveSourceId(src.id);
                              setStudyResult(null);
                              setStudyQuiz(null);
                            }}
                            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isActive
                                ? 'bg-emerald-50/90 border-emerald-500 shadow-md ring-2 ring-emerald-400/20'
                                : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-emerald-300'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                isPdf ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                              }`}>
                                {isPdf ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-extrabold text-xs text-[#0D2538] truncate max-w-[200px] sm:max-w-[280px]">
                                    {src.originalName}
                                  </h4>
                                  {isActive && (
                                    <span className="text-[9px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase">
                                      Activa
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  {isPdf ? `PDF • ${src.pages || 1} pág(s)` : 'Imagen'} • {(src.size / (1024 * 1024)).toFixed(1)} MB
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => handleDeleteSource(src.id, src.originalName, e)}
                              className="text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Eliminar fuente"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>

              {/* SECCIÓN B: WORKBENCH DE APRENDIZAJE INTERACTIVO SOBRE LA FUENTE ACTIVA */}
              {sourcesList.length > 0 && activeSourceId && (
                <div className="bg-slate-50 rounded-3xl p-6 sm:p-7 border-2 border-emerald-100 space-y-6">
                  
                  {/* Banner de la Fuente Activa */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                        📖
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Material Seleccionado:</span>
                          <span className="text-sm font-black text-[#0D2538]">
                            {sourcesList.find(s => s.id === activeSourceId)?.originalName}
                          </span>
                        </div>
                        {sourcesList.find(s => s.id === activeSourceId)?.summary && (
                          <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
                            {sourcesList.find(s => s.id === activeSourceId)?.summary}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Botones de Acciones Interactivas */}
                  <div>
                    <span className="block text-xs font-black uppercase text-[#0D2538] tracking-wider mb-2.5">
                      ¿Qué deseas solicitar a partir de este material?
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleStudyAction('summary')}
                        disabled={isLoadingStudy}
                        className={`p-3 rounded-2xl font-black text-xs flex flex-col items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                          studyAction === 'summary' && !studyQuiz
                            ? 'bg-[#1D63B8] text-white border-blue-600 shadow-md ring-2 ring-blue-400/30'
                            : 'bg-white hover:bg-slate-100 border-slate-200 text-[#0D2538]'
                        }`}
                      >
                        <span className="text-lg">📌</span>
                        <span>Resumen</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStudyAction('step_by_step')}
                        disabled={isLoadingStudy}
                        className={`p-3 rounded-2xl font-black text-xs flex flex-col items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                          studyAction === 'step_by_step'
                            ? 'bg-[#1D63B8] text-white border-blue-600 shadow-md ring-2 ring-blue-400/30'
                            : 'bg-white hover:bg-slate-100 border-slate-200 text-[#0D2538]'
                        }`}
                      >
                        <span className="text-lg">🪜</span>
                        <span>Paso a Paso</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStudyAction('examples')}
                        disabled={isLoadingStudy}
                        className={`p-3 rounded-2xl font-black text-xs flex flex-col items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                          studyAction === 'examples'
                            ? 'bg-[#1D63B8] text-white border-blue-600 shadow-md ring-2 ring-blue-400/30'
                            : 'bg-white hover:bg-slate-100 border-slate-200 text-[#0D2538]'
                        }`}
                      >
                        <span className="text-lg">💡</span>
                        <span>Ejemplos</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStudyAction('practice_questions')}
                        disabled={isLoadingStudy}
                        className={`p-3 rounded-2xl font-black text-xs flex flex-col items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                          studyAction === 'practice_questions'
                            ? 'bg-[#1D63B8] text-white border-blue-600 shadow-md ring-2 ring-blue-400/30'
                            : 'bg-white hover:bg-slate-100 border-slate-200 text-[#0D2538]'
                        }`}
                      >
                        <span className="text-lg">❓</span>
                        <span>Preguntas Práctica</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStudyAction('quiz')}
                        disabled={isLoadingStudy}
                        className={`p-3 rounded-2xl font-black text-xs flex flex-col items-center justify-center gap-1.5 transition-all border cursor-pointer col-span-2 sm:col-span-1 ${
                          studyAction === 'quiz'
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400/30'
                            : 'bg-white hover:bg-emerald-50 border-emerald-300 text-emerald-800'
                        }`}
                      >
                        <span className="text-lg">🎯</span>
                        <span>Cuestionario (Quiz)</span>
                      </button>
                    </div>
                  </div>

                  {/* Pregunta Libre sobre el Documento */}
                  <div className="pt-2">
                    <span className="block text-xs font-black uppercase text-[#0D2538] tracking-wider mb-2">
                      O realiza una pregunta específica sobre el contenido:
                    </span>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (customQuestionInput.trim()) {
                          handleStudyAction('custom_question', customQuestionInput.trim());
                        }
                      }}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        value={customQuestionInput}
                        onChange={(e) => setCustomQuestionInput(e.target.value)}
                        placeholder="Ej. ¿Qué conclusión se explica en la página 3? ¿Cómo se define el concepto X?"
                        disabled={isLoadingStudy}
                        className="flex-1 bg-white border-2 border-slate-200 focus:border-emerald-600 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#0D2538] outline-none shadow-sm disabled:opacity-60"
                      />
                      <button
                        type="submit"
                        disabled={!customQuestionInput.trim() || isLoadingStudy}
                        className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md ${
                          customQuestionInput.trim() && !isLoadingStudy
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer active:scale-95'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <span>Consultar</span>
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>

                  {/* Estado de Carga */}
                  {isLoadingStudy && (
                    <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-2 animate-pulse">
                      <Sparkles className="w-7 h-7 text-emerald-600 animate-spin" />
                      <p className="text-xs font-black text-[#0D2538]">
                        Analizando el documento y citando páginas relevantes...
                      </p>
                    </div>
                  )}

                  {/* Error State */}
                  {studyError && (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{studyError}</span>
                    </div>
                  )}

                  {/* RESULTADO A: Cuestionario Interactivo (Quiz) */}
                  {studyQuiz && !isLoadingStudy && (
                    <div className="bg-white rounded-2xl p-6 border-2 border-emerald-200 shadow-md space-y-6 animate-fadeIn">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <div>
                          <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                            🎯 Cuestionario Interactivo
                          </span>
                          <h3 className="text-base font-black text-[#0D2538] mt-1.5">
                            {studyQuiz.quizTitle}
                          </h3>
                        </div>

                        {Object.keys(userQuizAnswers).length > 0 && (
                          <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 flex items-center gap-2 self-start sm:self-auto">
                            <span className="text-xs font-bold text-slate-500">Puntaje:</span>
                            <span className="text-base font-black text-emerald-700">
                              {studyQuiz.questions.filter(q => userQuizAnswers[q.id] === q.correctIndex).length} de {studyQuiz.questions.length} correctas
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-6">
                        {studyQuiz.questions.map((q, qIndex) => {
                          const selected = userQuizAnswers[q.id];
                          const hasAnswered = selected !== undefined;
                          const isCorrect = selected === q.correctIndex;

                          return (
                            <div key={q.id || qIndex} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                              <div className="flex items-start gap-3">
                                <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                                  {qIndex + 1}
                                </span>
                                <p className="font-bold text-sm text-[#0D2538]">{q.question}</p>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                                {q.options.map((opt, optIndex) => {
                                  const isSelectedOption = selected === optIndex;
                                  const isTheCorrectOption = optIndex === q.correctIndex;

                                  let btnStyle = 'bg-white border-slate-200 hover:border-emerald-300 text-slate-700';
                                  if (hasAnswered) {
                                    if (isSelectedOption && isCorrect) {
                                      btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-400/30';
                                    } else if (isSelectedOption && !isCorrect) {
                                      btnStyle = 'bg-rose-100 border-rose-500 text-rose-900 font-bold ring-2 ring-rose-400/30';
                                    } else if (isTheCorrectOption) {
                                      btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold';
                                    } else {
                                      btnStyle = 'bg-white/60 border-slate-200 text-slate-400 opacity-70';
                                    }
                                  }

                                  return (
                                    <button
                                      key={optIndex}
                                      type="button"
                                      onClick={() => {
                                        if (!hasAnswered) {
                                          setUserQuizAnswers(prev => ({ ...prev, [q.id]: optIndex }));
                                        }
                                      }}
                                      disabled={hasAnswered}
                                      className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-start gap-2.5 ${btnStyle} ${hasAnswered ? 'cursor-default' : 'cursor-pointer hover:shadow-xs'}`}
                                    >
                                      <span className="font-black text-slate-400 shrink-0">
                                        {String.fromCharCode(65 + optIndex)}.
                                      </span>
                                      <span className="flex-1">{opt}</span>
                                      {hasAnswered && isTheCorrectOption && (
                                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                      )}
                                      {hasAnswered && isSelectedOption && !isCorrect && (
                                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>

                              {hasAnswered && (
                                <div className={`p-4 rounded-xl border text-xs space-y-1.5 animate-fadeIn ${
                                  isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
                                }`}>
                                  <p className="font-bold flex items-center gap-1.5">
                                    {isCorrect ? '✨ ¡Correcto!' : '⚠️ Explicación:'}
                                  </p>
                                  <p className="leading-relaxed">{q.explanation}</p>
                                  {q.sourceCitation && (
                                    <div className="pt-1 flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
                                      <span>📍 Referencia en la fuente:</span>
                                      <span className="bg-white px-2 py-0.5 rounded border border-emerald-200">
                                        {q.sourceCitation}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* RESULTADO B: Texto Estructurado (Resumen, Paso a Paso, Ejemplos, etc.) */}
                  {studyResult && !isLoadingStudy && (
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <span className="text-xs font-black uppercase tracking-wider text-[#1D63B8] bg-blue-50 px-2.5 py-1 rounded-lg">
                          {studyAction === 'summary' && '📌 Resumen Estructurado'}
                          {studyAction === 'step_by_step' && '🪜 Explicación Paso a Paso'}
                          {studyAction === 'examples' && '💡 Ejemplos Prácticos'}
                          {studyAction === 'practice_questions' && '❓ Preguntas de Práctica'}
                          {studyAction === 'custom_question' && '💬 Respuesta Basada en el Documento'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-bold">
                          Respuestas basadas en la fuente
                        </span>
                      </div>

                      <div className="pt-2">
                        {renderFormattedStudyText(studyResult)}
                      </div>
                    </div>
                  )}

                </div>
              )}

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
