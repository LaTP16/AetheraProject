import React, { useState } from 'react';
import { Sparkles, ArrowRight, BookOpen, GraduationCap, Building2 } from 'lucide-react';

const LandingPage = ({ onLogin }) => {
  const [studentId, setStudentId] = useState('');
  const [modal, setModal] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (studentId.trim() !== '') {
      onLogin(studentId);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex flex-col font-sans relative overflow-hidden">
      
      {/* Animaciones CSS */}
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

      {/* Elementos de fondo dinámicos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/30 blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-500/20 blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] animate-blob animation-delay-4000"></div>
        
        {Array.from({ length: 90 }).map((_, i) => (
          <div 
            key={"star-" + i} 
            className="star-continuous"
            style={{
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
              left: Math.random() * 100 + '%',
              animationDuration: (Math.random() * 25 + 15) + 's',
              animationDelay: '-' + (Math.random() * 30) + 's',
              opacity: Math.random() * 0.6 + 0.2
            }}
          ></div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <img src="/linkup-logo.png" alt="LinkUP Logo" className="w-11 h-11 object-contain shrink-0" />
          <span className="font-bold text-xl tracking-tight">LinkUP</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button onClick={() => setModal('about')} className="hover:text-white transition-colors border-b-2 border-transparent hover:border-blue-400 pb-1">About Us</button>
          <button onClick={() => setModal('services')} className="hover:text-white transition-colors border-b-2 border-transparent hover:border-blue-400 pb-1">Service</button>
          <button onClick={() => alert("Soporte Técnico: ayuda@linkup.edu")} className="hover:text-white transition-colors border-b-2 border-transparent hover:border-blue-400 pb-1">Contact</button>
        </nav>

        <button className="hidden md:block px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)]">
          Ver panel de control
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center mt-12">
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1] mb-6">
          Conecta, organiza y mejora tu vida universitaria — <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">con IA.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12">
          Análisis de bienestar, alertas tempranas y un centro de recursos personalizado, todo en un solo lugar.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-2xl relative">
          <div className="flex flex-col sm:flex-row items-center p-1.5 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl md:rounded-full shadow-2xl focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
            <input 
              type="text" 
              placeholder="Ingrese su ID de alumno..." 
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="flex-1 bg-transparent border-none text-white px-6 py-4 outline-none placeholder:text-slate-500 w-full"
            />
            <button 
              type="submit"
              className="w-full sm:w-auto px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-lg md:rounded-full transition-colors flex items-center justify-center gap-2"
            >
              Ingresar <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="mt-4 text-left px-4 flex items-start gap-2">
            <div className="mt-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <p className="text-sm text-slate-400">
              <span className="text-slate-300 font-semibold">Tip para el prototipo:</span> Ingresa el ID <strong className="text-emerald-400 font-mono tracking-wider cursor-pointer hover:underline" onClick={() => setStudentId('STU_AE_002288')}>STU_AE_002288</strong> para ver un perfil válido cruzado en los 3 datasets.
            </p>
          </div>
        </form>

      </main>

      {/* SECCIÓN MÁRQUETING / MÉTRICAS Y UNIVERSIDADES (Scroll) */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-4 py-16 mt-8">
        
        {/* Métrica Impactante */}
        <div className="flex justify-center mb-20 animate-fadeIn" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
          <div className="bg-slate-800/40 border border-blue-500/30 rounded-2xl p-6 sm:p-8 max-w-2xl flex flex-col sm:flex-row items-center gap-6 sm:gap-8 shadow-[0_0_40px_rgba(59,130,246,0.15)] backdrop-blur-md hover:border-blue-400/50 transition-colors">
            <div className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-cyan-300">
              57%
            </div>
            <div className="text-center sm:text-left border-t sm:border-t-0 sm:border-l border-slate-600/50 pt-4 sm:pt-0 sm:pl-8">
              <p className="text-slate-200 text-sm sm:text-base font-semibold leading-relaxed mb-2">
                Reporta sobrecarga grave en semanas de evaluación.
              </p>
              <p className="text-blue-400/80 text-xs font-bold uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></div>
                Correlación directa con caída de rendimiento
              </p>
            </div>
          </div>
        </div>

        {/* Instituciones Aliadas */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">Impulsado por el talento de Ciudad Aethera</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">LinkUP conecta e integra los perfiles académicos y de bienestar de las tres instituciones más prestigiosas, creando una red de prevención unificada.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {/* Nova Aether */}
          <div className="group rounded-3xl overflow-hidden bg-slate-900/60 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 shadow-xl hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] flex flex-col">
            <div className="h-48 overflow-hidden relative">
              <img src="/nova_aether.png" alt="Universidad Nova Aether" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-end">
              <h3 className="font-black text-white text-xl mb-1">Universidad Nova Aether</h3>
              <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">Excelencia • Conocimiento</p>
            </div>
          </div>

          {/* Nexus */}
          <div className="group rounded-3xl overflow-hidden bg-slate-900/60 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-500 shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] flex flex-col">
            <div className="h-48 overflow-hidden relative">
              <img src="/nexus.png" alt="Instituto Nexus" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-end">
              <h3 className="font-black text-white text-xl mb-1">Instituto Nexus</h3>
              <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Hack the Future</p>
            </div>
          </div>

          {/* Horizonte */}
          <div className="group rounded-3xl overflow-hidden bg-slate-900/60 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-500 shadow-xl hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] flex flex-col">
            <div className="h-48 overflow-hidden relative">
              <img src="/horizonte.png" alt="Universidad Horizonte" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-end">
              <h3 className="font-black text-white text-xl mb-1">Universidad Horizonte</h3>
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Bien Común • Innovación</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm py-8 mt-auto">
        <p className="text-center text-xs text-slate-500 font-medium mb-6 uppercase tracking-widest">
          Desarrollado para el desafío Ciudad Aethera
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <BookOpen className="w-8 h-8 text-slate-400 hover:text-blue-400 transition-colors" />
          <GraduationCap className="w-8 h-8 text-slate-400 hover:text-blue-400 transition-colors" />
          <Building2 className="w-8 h-8 text-slate-400 hover:text-blue-400 transition-colors" />
          <div className="font-bold text-xl text-slate-400 hover:text-blue-400 transition-colors">AETHERA</div>
          <div className="font-bold text-xl text-slate-400 hover:text-blue-400 transition-colors tracking-tighter">NEXUS</div>
        </div>
      </footer>

      {/* Modales */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModal(null)} className="absolute top-6 right-6 text-slate-400 hover:text-white font-bold text-xl">✕</button>
            
            {modal === 'about' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400"><Sparkles className="w-6 h-6"/></div>
                  <h2 className="text-3xl font-extrabold text-white">About LinkUP</h2>
                </div>
                <div>
                  <h3 className="text-blue-400 font-bold mb-2 uppercase tracking-wide text-sm">El Contexto</h3>
                  <p className="text-slate-300 leading-relaxed text-sm">LinkUP nace como una respuesta integral para el desafío Ciudad Aethera. La universidad moderna maneja miles de datos dispersos: notas, atenciones médicas y encuestas de estrés. Cuando un estudiante necesita ayuda, el sistema actual es reactivo y lento.</p>
                </div>
                <div>
                  <h3 className="text-blue-400 font-bold mb-2 uppercase tracking-wide text-sm">¿Qué resolvemos?</h3>
                  <p className="text-slate-300 leading-relaxed text-sm">Eliminamos las listas de espera de 45 días y las desconexiones institucionales. LinkUP unifica los perfiles, identifica estudiantes en riesgo de deserción mediante IA, y les brinda soporte inmediato antes de que sea demasiado tarde.</p>
                </div>
                <div>
                  <h3 className="text-blue-400 font-bold mb-2 uppercase tracking-wide text-sm">Objetivos</h3>
                  <ul className="list-disc pl-5 text-slate-300 text-sm space-y-1">
                    <li>Detección temprana de sobrecarga y estrés académico.</li>
                    <li>Reducción del tiempo de derivación a servicios psicológicos.</li>
                    <li>Acompañamiento autónomo a través de inteligencia artificial.</li>
                  </ul>
                </div>
              </div>
            )}

            {modal === 'services' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400"><BookOpen className="w-6 h-6"/></div>
                  <h2 className="text-3xl font-extrabold text-white">Nuestros Servicios</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <h3 className="text-white font-bold mb-1 flex items-center gap-2">🚀 Oportunidades</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">Alertas de becas, pasantías y recomendaciones laborales personalizadas según el perfil y la carrera del alumno.</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <h3 className="text-white font-bold mb-1 flex items-center gap-2">🧠 Aprendizaje</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">Módulo de tutoría con Inteligencia Artificial, técnicas de estudio comprobadas y seguimiento del rendimiento semestral.</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <h3 className="text-white font-bold mb-1 flex items-center gap-2">🤝 Comunidad</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">Foros moderados, salas de estudio grupales y redes de apoyo entre pares (peer-support) para combatir el aislamiento.</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <h3 className="text-white font-bold mb-1 flex items-center gap-2">💚 Bienestar</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">Canal directo para soporte emocional, gestión rápida de citas médicas y estrategias para el manejo de la ansiedad.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
