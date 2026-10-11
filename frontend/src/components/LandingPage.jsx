import React, { useState, useMemo } from 'react';
import { ArrowRight, Search, GraduationCap, Users, Sparkles, Check, ChevronDown } from 'lucide-react';
import studentsData from '../data/students.json';

const LandingPage = ({ onLogin }) => {
  const [studentId, setStudentId] = useState('');
  const [selectedStageTab, setSelectedStageTab] = useState('early'); // 'early', 'middle', 'final'
  const [searchQuery, setSearchQuery] = useState('');
  const [displayLimit, setDisplayLimit] = useState(40);

  const stageConfig = {
    early: {
      label: 'Inicio',
      sublabel: 'Primeros Ciclos',
      badge: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
      activeTab: 'bg-emerald-600 text-white shadow-md',
      tagColor: 'text-emerald-700 bg-emerald-50'
    },
    middle: {
      label: 'Intermedia',
      sublabel: 'Ciclos Medios',
      badge: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
      activeTab: 'bg-[#1D63B8] text-white shadow-md',
      tagColor: 'text-[#1D63B8] bg-blue-50'
    },
    final: {
      label: 'Final',
      sublabel: 'Último Año',
      badge: 'bg-purple-500/10 text-purple-700 border-purple-500/30',
      activeTab: 'bg-purple-600 text-white shadow-md',
      tagColor: 'text-purple-700 bg-purple-50'
    }
  };

  const universityNames = {
    'UNI_HORIZONTE': 'Universidad Horizonte',
    'UNI_NOVA_AETHER': 'Universidad Nova Aether',
    'INST_NEXUS': 'Instituto Nexus'
  };

  // Grouped counts for badges
  const stageCounts = useMemo(() => {
    const counts = { early: 0, middle: 0, final: 0 };
    studentsData.forEach(s => {
      if (counts[s.stage] !== undefined) counts[s.stage]++;
    });
    return counts;
  }, []);

  // Filter students based on active stage tab and search query
  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return studentsData.filter(student => {
      if (student.stage !== selectedStageTab) return false;
      if (!query) return true;
      return (
        student.id.toLowerCase().includes(query) ||
        (student.name && student.name.toLowerCase().includes(query)) ||
        (student.institution && student.institution.toLowerCase().includes(query))
      );
    });
  }, [selectedStageTab, searchQuery]);

  const displayedStudents = useMemo(() => {
    return filteredStudents.slice(0, displayLimit);
  }, [filteredStudents, displayLimit]);

  const handleSelectStudent = (id) => {
    setStudentId(id);
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    if (studentId.trim()) {
      onLogin(studentId.trim());
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#333A42] font-mono-tech relative overflow-hidden flex flex-col">
      
      {/* Background Dots */}
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
          font-size: 32px;
          line-height: 1;
          letter-spacing: -2px;
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="relative z-10 w-full max-w-[1280px] mx-auto px-6 py-6 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex flex-col items-start cursor-pointer group">
          <div className="flex items-center gap-3">
            <img src="/linkup-logo.png" alt="LinkUP Logo" className="w-12 h-12 object-contain brightness-0" />
            <div className="flex items-center -space-x-0.5">
              <span className="mlh-logo-letter text-[#1D63B8]">Link</span>
              <span className="mlh-logo-letter text-[#F5B82E]">UP</span>
            </div>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#0D2538] leading-none mt-1 ml-[60px]">
            Plataforma Estudiantil
          </span>
        </div>

        {/* CENTER LINKS */}
        <div className="hidden lg:flex items-center gap-10 text-[13px] font-semibold text-[#333A42] w-full justify-end">
          <a href="#" className="hover:text-[#1D63B8] transition-colors">About us</a>
          <a href="#" className="hover:text-[#1D63B8] transition-colors">Services</a>
          <a href="#" className="hover:text-[#1D63B8] transition-colors">Contact</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="relative z-10 w-full max-w-[1280px] mx-auto px-6 py-8 lg:py-12 flex flex-col lg:flex-row items-stretch justify-between gap-12">
        
        {/* LEFT COLUMN: TEXT & SELECTOR */}
        <div className="w-full lg:w-[60%] flex flex-col items-start gap-6">
          <h1 className="text-[44px] lg:text-[60px] font-bold text-[#0D2538] leading-[1.12] tracking-tight">
            <span className="text-[#1D63B8] block">El Sistema de</span>
            Acompañamiento<br />
            Estudiantil
          </h1>

          <p className="text-[16px] lg:text-[18px] font-normal text-[#333A42] leading-[1.5] max-w-[48ch]">
            LinkUP integra los perfiles académicos y de bienestar de Ciudad Aethera. Una red de prevención unificada para aprender, crecer y superar el estrés.
          </p>

          {/* INPUT FORM DE INGRESO DIRECTO */}
          <form 
            onSubmit={handleLogin}
            className="w-full max-w-[580px] flex flex-col sm:flex-row items-stretch gap-3"
          >
            <input 
              type="text" 
              placeholder="Código seleccionado o escribe ID (Ej: STU_AE_002288)..." 
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="flex-1 bg-white border-2 border-slate-300 focus:border-[#1D63B8] outline-none text-[#0D2538] font-bold px-5 py-3.5 rounded-xl shadow-sm transition-colors text-sm font-mono"
            />
            <button 
              type="submit"
              disabled={!studentId.trim()}
              className={`group font-bold text-[15px] px-7 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md whitespace-nowrap ${
                studentId.trim()
                  ? 'bg-[#F5B82E] hover:bg-[#e0a624] text-[#0D2538] cursor-pointer active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Ingresar</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* SECCIÓN: ESCOGE UN ESTUDIANTE (CATÁLOGO DE 2,278 CÓDIGOS) */}
          <div className="w-full max-w-[580px] mt-2 pt-5 border-t border-slate-200/90 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#1D63B8]" />
                  <h3 className="text-sm font-black uppercase text-[#0D2538] tracking-wider">
                    Escoge un estudiante
                  </h3>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Catálogo con los <span className="font-bold text-[#1D63B8]">2,278 códigos</span> registrados en Ciudad Aethera.
                </p>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 text-[11px] font-bold text-slate-600">
                <Users className="w-3.5 h-3.5 text-[#1D63B8]" />
                <span>{studentsData.length.toLocaleString()} estudiantes</span>
              </div>
            </div>

            {/* PESTAÑAS POR ETAPAS (INICIO, INTERMEDIA, FINAL) */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-200/70 rounded-2xl mb-3">
              {(['early', 'middle', 'final']).map((stageKey) => {
                const conf = stageConfig[stageKey];
                const isActive = selectedStageTab === stageKey;
                const count = stageCounts[stageKey];
                return (
                  <button
                    key={stageKey}
                    type="button"
                    onClick={() => {
                      setSelectedStageTab(stageKey);
                      setDisplayLimit(40);
                    }}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? conf.activeTab
                        : 'text-slate-600 hover:text-[#0D2538] hover:bg-white/60'
                    }`}
                  >
                    <span>{conf.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-300 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* BUSCADOR RÁPIDO */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Buscar en etapa ${stageConfig[selectedStageTab].label} por código o nombre...`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setDisplayLimit(40);
                }}
                className="w-full bg-white border border-slate-200 focus:border-[#1D63B8] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0D2538] font-medium outline-none shadow-inner transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* RESUMEN DE COINCIDENCIAS */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2 px-1">
              <span>
                Mostrando <strong className="text-[#0D2538]">{displayedStudents.length}</strong> de <strong className="text-[#0D2538]">{filteredStudents.length}</strong> resultados en <span className="font-bold text-[#1D63B8]">{stageConfig[selectedStageTab].label}</span>
              </span>
              {studentId && (
                <span className="font-bold text-[#1D63B8] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Seleccionado: {studentId}
                </span>
              )}
            </div>

            {/* LISTA DESPLEGABLE / VIRTUALIZADA SCROLLABLE */}
            <div className="max-h-[300px] overflow-y-auto pr-1 space-y-2 rounded-2xl border border-slate-200 bg-white/70 p-2 shadow-inner">
              {displayedStudents.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No se encontraron estudiantes para "{searchQuery}" en la etapa {stageConfig[selectedStageTab].label}.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {displayedStudents.map((stu) => {
                    const isSelected = studentId === stu.id;
                    const conf = stageConfig[stu.stage] || stageConfig.early;
                    return (
                      <div
                        key={stu.id}
                        onClick={() => handleSelectStudent(stu.id)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-50 border-[#1D63B8] ring-2 ring-[#1D63B8]/30 shadow-md'
                            : 'bg-white hover:bg-slate-50/90 border-slate-200 hover:border-blue-300 shadow-xs'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                              {stu.id}
                            </span>
                            <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded border ${conf.badge}`}>
                              {conf.label}
                            </span>
                          </div>
                          <h4 className="font-bold text-[#0D2538] text-xs leading-tight truncate">
                            {stu.name || 'Estudiante'}
                          </h4>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">
                            {universityNames[stu.institution] || stu.institution || 'Universidad Nova Aether'}
                          </p>
                        </div>

                        <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[9px] text-slate-400 font-medium">
                            {isSelected ? '✓ Seleccionado' : 'Clic para elegir'}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onLogin(stu.id);
                            }}
                            className="text-[10px] font-bold text-[#1D63B8] hover:text-blue-700 flex items-center gap-0.5"
                          >
                            <span>Entrar</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* CARGAR MÁS SI HAY MÁS EN ESTA PESTAÑA */}
              {displayedStudents.length < filteredStudents.length && (
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setDisplayLimit((prev) => prev + 40)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-[#0D2538] font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ChevronDown className="w-4 h-4" />
                    <span>Cargar más ({filteredStudents.length - displayedStudents.length} restantes)</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: IMAGES */}
        <div className="w-full lg:w-[40%] flex justify-end relative">
          
          {/* Decorative Blueprint Square Background */}
          <div className="absolute -inset-4 bg-[#F5B82E]/10 border border-[#F5B82E]/30 rounded-xl -z-10 translate-x-4 translate-y-4"></div>
          <div className="absolute -inset-4 bg-[#1D63B8]/10 border border-[#1D63B8]/30 rounded-xl -z-10 -translate-x-4 -translate-y-4"></div>

          <div className="relative w-full max-w-[500px] min-h-[580px] rounded-xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100 flex items-center justify-center">
            {/* Fallback pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#1D63B8 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
            
            {/* Main Single Image */}
            <img 
              src="/hero_image.png" 
              alt="Estudiante interactuando con interfaz holográfica en Ciudad Aethera" 
              className="absolute inset-0 w-full h-full object-cover rounded-xl transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>

      </main>

      {/* METRICS & UNIVERSITIES SECTION */}
      <section className="relative z-10 w-full max-w-[1280px] mx-auto px-6 py-20 mt-12 border-t border-slate-200/60">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Left Column: Metric */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <div className="text-[72px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-[#D92B27] to-[#F5B82E]">
              57%
            </div>
            <h3 className="text-[22px] font-bold text-[#0D2538] leading-tight">
              reporta sobrecarga en semanas de evaluación
            </h3>
            <p className="text-[#1D63B8] font-bold text-xs uppercase tracking-widest border-l-4 border-[#1D63B8] pl-3 mt-1">
              (Correlación con caída de rendimiento)
            </p>
            <p className="text-slate-500 mt-4 text-[14px] leading-[1.6]">
              LinkUP integra datos en tiempo real para identificar perfiles en riesgo y activar protocolos de bienestar antes de la deserción.
            </p>
          </div>

          {/* Right Column: Institutions */}
          <div className="w-full lg:w-2/3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Instituciones Aliadas en Ciudad Aethera</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Nova Aether */}
              <div className="group flex flex-col gap-3 cursor-pointer">
                <div className="w-full h-40 overflow-hidden rounded-lg shadow-sm border border-slate-200 relative">
                  <img src="/nova_aether.png" alt="Universidad Nova Aether" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-[#1D63B8]/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div>
                  <h5 className="font-bold text-[#0D2538] text-[13px]">Universidad Nova Aether</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">Excelencia & Conocimiento</p>
                </div>
              </div>

              {/* Nexus */}
              <div className="group flex flex-col gap-3 cursor-pointer">
                <div className="w-full h-40 overflow-hidden rounded-lg shadow-sm border border-slate-200 relative">
                  <img src="/nexus.png" alt="Instituto Nexus" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-[#F5B82E]/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div>
                  <h5 className="font-bold text-[#0D2538] text-[13px]">Instituto Nexus</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">Hack the Future</p>
                </div>
              </div>

              {/* Horizonte */}
              <div className="group flex flex-col gap-3 cursor-pointer">
                <div className="w-full h-40 overflow-hidden rounded-lg shadow-sm border border-slate-200 relative">
                  <img src="/horizonte.png" alt="Universidad Horizonte" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-[#D92B27]/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div>
                  <h5 className="font-bold text-[#0D2538] text-[13px]">Universidad Horizonte</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">Innovación Social</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
