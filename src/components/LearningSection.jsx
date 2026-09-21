import React, { useState } from 'react';
import { GraduationCap, BookOpen, ClipboardCheck, Star, Edit3, Calendar, Clock, CheckCircle2, ArrowRight, Download, Sparkles, Trophy, BookMarked } from 'lucide-react';

export default function LearningSection() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  
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
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-wider uppercase drop-shadow-xs">
            APRENDIZAJE
          </h1>
          <p className="text-white/90 text-sm sm:text-base font-semibold tracking-wide">
            Aprende, practica y desarrolla tus habilidades
          </p>
        </div>

        {/* RIGHT CARD: RETO DIARIO */}
        <div className="lg:col-span-4 bg-[#CBDDE6] rounded-3xl p-6 shadow-xl border border-white/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              <h2 className="font-extrabold text-slate-900 text-base uppercase tracking-wide">
                RETO DIARIO
              </h2>
            </div>
            <span className="text-[10px] font-black px-2.5 py-0.5 bg-amber-400 text-slate-900 rounded-full shadow-xs">
              🔥 Racha: {streakCount} días
            </span>
          </div>

          <p className="text-xs font-semibold text-slate-700 leading-snug">
            Establece una fecha y hora para formar el hábito de estudio diario:
          </p>

          <form onSubmit={handleSaveHabit} className="space-y-3 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Fecha:</label>

                <input
                  type="date"
                  value={dailyDate}
                  onChange={(e) => setDailyDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white text-slate-800 font-bold text-xs border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Hora:</label>

                <input
                  type="time"
                  value={dailyTime}
                  onChange={(e) => setDailyTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white text-slate-800 font-bold text-xs border border-slate-300 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#2C5D71] hover:bg-[#1E4353] text-white font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{habitSaved ? '¡Hábito Programado! ✓' : 'Fijar Recordatorio de Estudio'}</span>
            </button>
          </form>
        </div>

      </div>

      {/* 3 MAIN CATEGORY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeFilter === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => setActiveFilter(isSelected ? 'ALL' : cat.id)}
              className={`p-6 sm:p-8 rounded-3xl cursor-pointer transition-all duration-300 flex flex-col justify-between border-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1.5 ${
                isSelected
                  ? 'bg-[#82B3C5] border-white ring-4 ring-white/40'
                  : 'bg-[#98C2D1] border-[#81AFC1] hover:bg-[#8EC0D0]'
              }`}
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#2A5C70] text-white flex items-center justify-center shadow-md">
                  <Icon className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="font-extrabold text-2xl text-slate-900 tracking-tight">
                    {cat.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#84B1C2]">
                <span className="text-xs font-bold text-[#193F4E]">
                  {isSelected ? 'Filtrado activo' : 'Explorar contenidos'}
                </span>
                <span className="w-7 h-7 rounded-full bg-white/40 text-slate-900 flex items-center justify-center font-bold text-sm">
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
          <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center shadow-md">
            <Star className="w-5 h-5 fill-slate-900 stroke-slate-900" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            Recomendado para ti
          </h2>
          {activeFilter !== 'ALL' && (
            <button
              onClick={() => setActiveFilter('ALL')}
              className="ml-auto text-xs font-bold px-3 py-1 bg-white/20 text-white rounded-full hover:bg-white/30"
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
                className="bg-[#A4CAD6] border-2 border-[#90BDCD] rounded-3xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${item.tagBg}`}>
                      {item.categoryLabel}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-white/40 flex items-center justify-center text-[#1C4758]">
                      <ItemIcon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-[#193E4E] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs font-semibold text-slate-700">
                    👨‍🏫 {item.instructor}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#8EBECF] space-y-2">
                  <p className="text-[11px] font-bold text-[#1C4758]">
                    ⏱️ {item.duration}
                  </p>
                  <p className="text-[10px] font-medium text-slate-600">
                    📊 Nivel: {item.level}
                  </p>

                  <button className="w-full mt-2 py-2 bg-[#2C5D71] hover:bg-[#1E4353] text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
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
          <div className="w-8 h-8 rounded-full bg-[#2C5D71] text-white flex items-center justify-center shadow-md">
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
              className="bg-[#A4CAD6] border-2 border-[#90BDCD] rounded-3xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase bg-[#2C5D71] text-white">
                    {mat.badge}
                  </span>
                  <span className="text-[10px] font-bold text-slate-600">
                    📥 {mat.downloads} descargas
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                  {mat.title}
                </h3>

                <p className="text-xs font-semibold text-slate-700">
                  👤 {mat.author}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#8EBECF] space-y-2">
                <p className="text-[11px] font-bold text-[#1C4758]">
                  📄 Formato: {mat.format}
                </p>

                <button
                  onClick={() => alert(`Descargando material: ${mat.title}`)}
                  className="w-full mt-2 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Recurso</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
