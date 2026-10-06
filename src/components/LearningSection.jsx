import React, { useState, useEffect } from 'react';
import { GraduationCap, BookMarked, ClipboardCheck, Trophy, CheckCircle2, ArrowLeft, Search, CalendarDays, MapPin, Clock, Play, Pause, RotateCcw, Timer } from 'lucide-react';

export default function LearningSection() {
  // NAVIGATION STATE
  const [activeView, setActiveView] = useState('HOME');

  // RETO DIARIO STATE
  const [dailyDate, setDailyDate] = useState('2026-10-06');
  const [dailyStartTime, setDailyStartTime] = useState('18:00');
  const [dailyPlace, setDailyPlace] = useState('Biblioteca Central');
  const [habitSaved, setHabitSaved] = useState(false);
  const [streakCount, setStreakCount] = useState(5);

  // TIMER STATE
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutos en segundos
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

  const handleSaveHabit = (e) => {
    e.preventDefault();
    setHabitSaved(true);
    setTimeout(() => setHabitSaved(false), 3000);
  };

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
  return (
    <div className="flex-1 p-6 sm:p-10 max-w-5xl mx-auto w-full flex flex-col items-center justify-center space-y-12 animate-fadeIn min-h-[80vh]">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl sm:text-5xl font-black text-[#0D2538] tracking-wider uppercase">
          APRENDIZAJE
        </h1>
        <p className="text-[#4A5568] text-base sm:text-lg font-semibold tracking-wide">
          Aprende, practica y desarrolla tus habilidades
        </p>
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

            {/* Formulario Fechas, Horas y Lugar */}
            <form onSubmit={handleSaveHabit} className="space-y-5 pt-3 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-[10px] font-bold text-[#4A5568] uppercase mb-1.5 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" /> Fecha:
                  </label>
                  <input
                    type="date"
                    value={dailyDate}
                    onChange={(e) => setDailyDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 text-[#0D2538] font-bold text-xs border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-[10px] font-bold text-[#4A5568] uppercase mb-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Hora Inicio:
                  </label>
                  <input
                    type="time"
                    value={dailyStartTime}
                    onChange={(e) => setDailyStartTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 text-[#0D2538] font-bold text-xs border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-[10px] font-bold text-[#4A5568] uppercase mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Lugar:
                  </label>
                  <input
                    type="text"
                    value={dailyPlace}
                    onChange={(e) => setDailyPlace(e.target.value)}
                    placeholder="Ej. Biblioteca"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 text-[#0D2538] font-bold text-xs border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#1D63B8] hover:bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                <span>{habitSaved ? '¡Reto Guardado! ✓' : 'Fijar Compromiso de Estudio'}</span>
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
