const fs = require('fs');
let code = fs.readFileSync('C:/Users/USER/Desktop/AetheraProject/src/components/LearningSection.jsx', 'utf8');

const recursosView = `
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
`;

// Insert the new views right before the final `return` block (which is the HOME view).
// We find where `if (activeView === 'CURSOS')` block ends.
const splitIndex = code.lastIndexOf('      {/* MAIN HOME VIEW */}');
if (splitIndex !== -1) {
  // If we already have a comment for it
}

// Since we know the HOME return starts after the CURSOS return
const targetSearch = `  return (
    <div className="flex-1 p-6 sm:p-10`;

code = code.replace(targetSearch, recursosView + '\n' + targetSearch);

fs.writeFileSync('C:/Users/USER/Desktop/AetheraProject/src/components/LearningSection.jsx', code);
console.log('LearningSection.jsx updated with Recursos y Practica views.');
