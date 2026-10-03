import React, { useState } from 'react';
import { GraduationCap, BookOpen, ClipboardCheck, Star, Edit3, Calendar, Clock, CheckCircle2, ArrowRight, Download, Sparkles, Trophy, BookMarked } from 'lucide-react';

export default function LearningSection() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [calendarModal, setCalendarModal] = useState(false);
  
  // RETO DIARIO STATE
  const [dailyDate, setDailyDate] = useState('2026-09-21');
  const [dailyTime, setDailyTime] = useState('18:00');
  const [habitSaved, setHabitSaved] = useState(false);
  const [streakCount, setStreakCount] = useState(5);

  const categories = [
    {
      id: 'CURSOS',
      title: 'Cursos',
      icon: GraduationCap,
      description: 'Accede a cursos y contenidos para tu desarrollo académico y profesional',
      badgeColor: 'bg-[#2A5C70] text-white'
    },
    {
      id: 'RECURSOS',
      title: 'Recursos',
      icon: BookMarked,
      description: 'Encuentra apuntes, guías, plantillas y material de apoyo',
      badgeColor: 'bg-[#2A5C70] text-white'
    },
    {
      id: 'PRACTICA',
      title: 'Práctica',
      icon: ClipboardCheck,
      description: 'Pon a prueba tus conocimientos con ejercicios, simulaciones y evaluación',
      badgeColor: 'bg-[#2A5C70] text-white'
    },
    {
      id: 'CALENDARIO',
      title: 'Calendario',
      icon: Calendar,
      description: 'Fechas clave, evaluaciones parciales y semanas de bienestar',
      badgeColor: 'bg-[#2A5C70] text-white'
    }
  ];

  // SAMPLES: RECOMENDADO PARA TI
  const recommendedItems = [
    {
      id: 1,
      category: 'CURSOS',
      categoryLabel: 'Curso Recomendado',
      title: 'Fundamentos de Arquitectura de Software',
      instructor: 'Ing. Carlos Gutiérrez • Globant',
      duration: '12 horas • 8 módulos',
      level: 'Principiante / Intermedio',
      icon: GraduationCap,
      tagBg: 'bg-teal-700 text-white'
    },
    {
      id: 2,
      category: 'PRACTICA',
      categoryLabel: 'Simulación & Quiz',
      title: 'Simulador de Examen: Métodos Numéricos 2026-1',
      instructor: 'Depto. de Ciencias Básicas',
      duration: '45 minutos • 20 preguntas',
      level: 'Evaluación Formativa',
      icon: ClipboardCheck,
      tagBg: 'bg-amber-700 text-white'
    },
    {
      id: 3,
      category: 'RECURSOS',
      categoryLabel: 'Guía de Estudio',
      title: 'Kit de Patrones de Diseño Gang of Four (GoF)',
      instructor: 'Comunidad LinkUP Tech',
      duration: 'PDF Interactivo + Ejemplos C#/Java',
      level: 'Avanzado',
      icon: BookMarked,
      tagBg: 'bg-indigo-700 text-white'
    },
    {
      id: 4,
      category: 'CURSOS',
      categoryLabel: 'Taller Práctico',
      title: 'SQL Avanzado y Optimización de Consultas para Data Science',
      instructor: 'Mariana Alarcón • BBVA',
      duration: '6 horas • Casos reales de banca',
      level: 'Intermedio',
      icon: GraduationCap,
      tagBg: 'bg-emerald-700 text-white'
    }
  ];

  // SAMPLES: MATERIAL DESTACADO
  const featuredMaterials = [
    {
      id: 101,
      category: 'RECURSOS',
      title: 'Resumen Completo en PDF: Cálculo Multivariable & Vectores',
      author: 'Camila Rojas (Top 1% ciclo anterior)',
      downloads: 342,
      format: 'PDF • 24 págs',
      badge: 'Más Descargado'
    },
    {
      id: 102,
      category: 'RECURSOS',
      title: 'Plantilla de Diagramación UML & Microservicios en Excalidraw',
      author: 'Mateo Benítez',
      downloads: 189,
      format: 'Plantilla .excalidraw',
      badge: 'Herramienta'
    },
    {
      id: 103,
      category: 'PRACTICA',
      title: 'Banco de 100 Preguntas Resueltas: Fundamentos de IA & Redes',
      author: 'Círculo de Estudios de Sistemas',
      downloads: 512,
      format: 'PDF + Solucionario',
      badge: 'Examen Final'
    },
    {
      id: 104,
      category: 'RECURSOS',
      title: 'Cheatsheet Interactivo: Comandos Básicos de Docker & Kubernetes',
      author: 'DevOps Community Aethera',
      downloads: 275,
      format: 'Guía Rápida PDF',
      badge: 'DevOps'
    }
  ];

  const handleSaveHabit = (e) => {
    e.preventDefault();
    setHabitSaved(true);
    setTimeout(() => setHabitSaved(false), 3000);
  };

  const filteredRecommended = activeFilter === 'ALL'
    ? recommendedItems
    : recommendedItems.filter(item => item.category === activeFilter);

  return (
    <div className="flex-1 p-6 sm:p-10 max-w-6xl mx-auto w-full space-y-8 animate-fadeIn">
      
      {/* HEADER SECTION & RETO DIARIO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT TITLE & SUBTITLE */}
        <div className="lg:col-span-8 space-y-2 text-center lg:text-left">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-wider uppercase">
            APRENDIZAJE
          </h1>
          <p className="text-slate-400 text-sm sm:text-base font-semibold tracking-wide">
            Aprende, practica y desarrolla tus habilidades
          </p>
        </div>

        {/* RIGHT CARD: RETO DIARIO */}
        <div className="lg:col-span-4 bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="font-extrabold text-white text-base uppercase tracking-wide">
                RETO DIARIO
              </h2>
            </div>
            <span className="text-[10px] font-black px-2.5 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full">
              🔥 Racha: {streakCount} días
            </span>
          </div>

          <p className="text-xs font-medium text-slate-300 leading-snug">
            Establece una fecha y hora para formar el hábito de estudio diario:
          </p>

          <form onSubmit={handleSaveHabit} className="space-y-3 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Fecha:</label>

                <input
                  type="date"
                  value={dailyDate}
                  onChange={(e) => setDailyDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-800 text-white font-bold text-xs border border-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Hora:</label>

                <input
                  type="time"
                  value={dailyTime}
                  onChange={(e) => setDailyTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-800 text-white font-bold text-xs border border-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-cyan-300" />
              <span>{habitSaved ? '¡Hábito Programado! ✓' : 'Fijar Recordatorio de Estudio'}</span>
            </button>
          </form>
        </div>

      </div>

      {/* 4 MAIN CATEGORY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeFilter === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => {
                if (cat.id === 'CALENDARIO') {
                  setCalendarModal(true);
                } else {
                  setActiveFilter(isSelected ? 'ALL' : cat.id);
                }
              }}
              className={`p-6 sm:p-8 rounded-3xl cursor-pointer transition-all duration-300 flex flex-col justify-between border shadow-xl hover:shadow-2xl transform hover:-translate-y-1.5 backdrop-blur-md ${
                isSelected && cat.id !== 'CALENDARIO'
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
                  {cat.id === 'CALENDARIO' ? 'Ver fechas (D7)' : (isSelected ? 'Filtrado activo' : 'Explorar contenidos')}
                </span>
                <span className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm border border-slate-700">
                  →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION 1: RECOMENDADO PARA TI */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-400 flex items-center justify-center shadow-md">
            <Star className="w-5 h-5 fill-amber-400 stroke-amber-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            Recomendado para ti
          </h2>
          {activeFilter !== 'ALL' && (
            <button
              onClick={() => setActiveFilter('ALL')}
              className="ml-auto text-xs font-bold px-3 py-1 bg-slate-800 text-slate-300 rounded-full hover:bg-slate-700 border border-slate-700"
            >
              Ver Todos ({recommendedItems.length})
            </button>
          )}
        </div>

        {/* 4 CARDS RECOMENDADO PARA TI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredRecommended.map((item) => {
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

                  <p className="text-xs font-medium text-slate-400">
                    👨‍🏫 {item.instructor}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 space-y-2">
                  <p className="text-[11px] font-bold text-cyan-400">
                    ⏱️ {item.duration}
                  </p>
                  <p className="text-[10px] font-medium text-slate-400">
                    📊 Nivel: {item.level}
                  </p>

                  <button className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                    <span>Empezar Cursos</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: MATERIAL DESTACADO */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-md">
            <Edit3 className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            Material Destacado
          </h2>
        </div>

        {/* 4 CARDS MATERIAL DESTACADO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredMaterials.map((mat) => (
            <div
              key={mat.id}
              className="bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 rounded-3xl p-5 shadow-xl hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 backdrop-blur-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase bg-blue-500/20 border border-blue-500/30 text-blue-400">
                    {mat.badge}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    📥 {mat.downloads} descargas
                  </span>
                </div>

                <h3 className="font-extrabold text-white text-base leading-snug">
                  {mat.title}
                </h3>

                <p className="text-xs font-medium text-slate-400">
                  👤 {mat.author}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 space-y-2">
                <p className="text-[11px] font-bold text-cyan-400">
                  📄 Formato: {mat.format}
                </p>

                <button
                  onClick={() => alert(`Descargando material: ${mat.title}`)}
                  className="w-full mt-2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Recurso</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL CALENDARIO (D7) - VISTA ANUAL */}
      {calendarModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 lg:p-10 animate-fadeIn" onClick={() => setCalendarModal(false)}>
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-6xl w-full p-6 lg:p-8 shadow-2xl relative flex flex-col max-h-full text-slate-200" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setCalendarModal(false)} className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer z-10 border border-slate-700">
              ✕
            </button>
            
            {/* Header del Calendario */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-md">
                  <Calendar className="w-6 h-6"/>
                </div>
                <div>
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">Calendario Académico 2026</h2>
                  <p className="text-sm font-bold text-blue-400">Vista Anual de Eventos • Dataset 7</p>
                </div>
              </div>
              
              {/* Leyenda */}
              <div className="flex flex-wrap gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700 shadow-sm text-xs font-bold text-slate-300">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Inicio/Fin Semestre</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div> Exámenes (Parciales/Finales)</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Semanas de Bienestar</div>
              </div>
            </div>

            {/* Grid de Meses */}
            <div className="overflow-y-auto custom-scrollbar pr-2 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Enero', days: 31, offset: 4 }, { name: 'Febrero', days: 28, offset: 0 }, { name: 'Marzo', days: 31, offset: 0 },
                  { name: 'Abril', days: 30, offset: 3 }, { name: 'Mayo', days: 31, offset: 5 }, { name: 'Junio', days: 30, offset: 1 },
                  { name: 'Julio', days: 31, offset: 3 }, { name: 'Agosto', days: 31, offset: 6 }, { name: 'Septiembre', days: 30, offset: 2 },
                  { name: 'Octubre', days: 31, offset: 4 }, { name: 'Noviembre', days: 30, offset: 0 }, { name: 'Diciembre', days: 31, offset: 2 }
                ].map((month, mIdx) => (
                  <div key={month.name} className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/80 shadow-sm">
                    <h3 className="font-extrabold text-white text-center mb-3 border-b border-slate-700 pb-2">{month.name}</h3>
                    
                    {/* Días de la semana */}
                    <div className="grid grid-cols-7 gap-1 text-[9px] font-black text-slate-400 text-center mb-1">
                      <div>L</div><div>M</div><div>M</div><div>J</div><div>V</div><div>S</div><div>D</div>
                    </div>
                    
                    {/* Números de días */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold">
                      {Array.from({ length: month.offset }).map((_, i) => (
                        <div key={`empty-${i}`}></div>
                      ))}
                      
                      {Array.from({ length: month.days }).map((_, i) => {
                        const day = i + 1;
                        let dayClass = "hover:bg-slate-700 text-slate-300 rounded-md py-1 transition-colors";
                        let title = "";

                        // Lógica de Eventos (Dataset 7)
                        // Parciales 1: Mayo 4-9
                        if (mIdx === 4 && day >= 4 && day <= 9) { dayClass = "bg-red-500 text-white font-bold rounded-md py-1 shadow-sm"; title = "Exámenes Parciales"; }
                        // Finales 1: Julio 6-11
                        else if (mIdx === 6 && day >= 6 && day <= 11) { dayClass = "bg-red-500 text-white font-bold rounded-md py-1 shadow-sm"; title = "Exámenes Finales"; }
                        // Parciales 2: Octubre 5-10
                        else if (mIdx === 9 && day >= 5 && day <= 10) { dayClass = "bg-red-500 text-white font-bold rounded-md py-1 shadow-sm"; title = "Exámenes Parciales S2"; }
                        // Finales 2: Diciembre 7-12
                        else if (mIdx === 11 && day >= 7 && day <= 12) { dayClass = "bg-red-500 text-white font-bold rounded-md py-1 shadow-sm"; title = "Exámenes Finales S2"; }
                        
                        // Bienestar 1: Junio 10-14
                        else if (mIdx === 5 && day >= 10 && day <= 14) { dayClass = "bg-emerald-500 text-white font-bold rounded-md py-1 shadow-sm"; title = "Semana de Bienestar"; }
                        // Bienestar 2: Noviembre 2-6
                        else if (mIdx === 10 && day >= 2 && day <= 6) { dayClass = "bg-emerald-500 text-white font-bold rounded-md py-1 shadow-sm"; title = "Semana de Bienestar S2"; }

                        // Inicio Clases: Mar 15, Ago 10
                        else if ((mIdx === 2 && day === 15) || (mIdx === 7 && day === 10)) { dayClass = "bg-blue-500 text-white font-bold rounded-md py-1 shadow-sm"; title = "Inicio de Clases"; }

                        return (
                          <div key={day} className={dayClass} title={title}>
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
