import React, { useState } from 'react';
import { downloadHarvardPDF } from '../utils/pdfGenerator';
import { Sparkles, FileText, CheckCircle, Briefcase, GraduationCap, Code, ArrowRight, Download, Target } from 'lucide-react';

export default function CVModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);

  // Form State
  const [filters, setFilters] = useState({
    categoria: 'Puesto Laboral / Empleo',
    nivel: 'Prácticas Preprofesionales',
    puesto: 'Arquitecto de Software'
  });

  const [cvInfo, setCvInfo] = useState({
    education: 'Universidad Aethera • Ingeniería de Sistemas (7mo Ciclo) • Promedio Ponderado: 17.2 (Tercio Superior)',
    experience: 'Practicante de Desarrollo Web en NovaTech (6 meses) • Tutor de Programación en Universidad Aethera',
    projects: 'Plataforma LinkUP (Red Universitaria React/Node), API REST de Gestión Educativa, Dashboard de Analítica SQL',
    skills: 'React.js, Node.js, Python, SQL, Docker, Diagramación UML, Git/GitHub, TailwindCSS'
  });

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (step === 1) setStep(2);
    else if (step === 2) {
      setAnalyzing(true);
      setTimeout(() => {
        setAnalyzing(false);
        setStep(3);
      }, 2000);
    }
  };

  const handleDownloadPDF = () => {
    downloadHarvardPDF({
      fullName: 'Mateo Benítez',
      targetLabel: `${filters.puesto} (${filters.nivel})`,
      education: cvInfo.education,
      experience: cvInfo.experience,
      projects: cvInfo.projects,
      skills: cvInfo.skills
    });
  };

  const renderStep1 = () => (
    <div className="space-y-5 animate-fadeIn">
      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mb-4">
        <h4 className="font-bold text-blue-400 text-sm mb-1 flex items-center gap-2">
          <Target className="w-4 h-4" /> Filtros de Postulación
        </h4>
        <p className="text-xs text-slate-300">Selecciona en orden la convocatoria a la que aspiras para comparar tus secciones ingresadas con las exigencias del puesto.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Paso 1: Categoría <span className="text-red-400">*</span></label>
          <select 
            value={filters.categoria}
            onChange={(e) => setFilters({...filters, categoria: e.target.value})}
            className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-xl p-3 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option>💼 Puesto Laboral / Empleo</option>
            <option>🎓 Beca Académica</option>
            <option>🚀 Proyecto de Investigación</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Paso 2: Nivel <span className="text-red-400">*</span></label>
          <select 
            value={filters.nivel}
            onChange={(e) => setFilters({...filters, nivel: e.target.value})}
            className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-xl p-3 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option>🌱 Prácticas Preprofesionales</option>
            <option>🚀 Junior / Entry Level</option>
            <option>⭐ Semi-Senior</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Paso 3: Puesto / Área <span className="text-red-400">*</span></label>
          <input 
            type="text" 
            value={filters.puesto}
            onChange={(e) => setFilters({...filters, puesto: e.target.value})}
            className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-xl p-3 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Ej. Desarrollador Frontend, Data Analyst..."
          />
        </div>
      </div>

      <button onClick={handleNextStep} className="mt-6 w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2">
        Continuar al armado del CV <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-xl mb-2">
        <h4 className="font-bold text-cyan-400 text-sm mb-1 flex items-center gap-2">
          <FileText className="w-4 h-4" /> Paso Inicial: Ingresa la Información de tu CV
        </h4>
        <p className="text-xs text-slate-300">Para analizar qué oportunidades encajan con tu perfil y qué te falta desarrollar, primero completa o actualiza las 4 secciones fundamentales.</p>
      </div>

      <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-1"><GraduationCap className="w-3.5 h-3.5 text-blue-400"/> 1. Education</label>
          <textarea rows="2" value={cvInfo.education} onChange={(e) => setCvInfo({...cvInfo, education: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 rounded-lg p-2.5 text-xs focus:border-blue-500 focus:outline-none"></textarea>
        </div>
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-1"><Briefcase className="w-3.5 h-3.5 text-blue-400"/> 2. Experience</label>
          <textarea rows="2" value={cvInfo.experience} onChange={(e) => setCvInfo({...cvInfo, experience: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 rounded-lg p-2.5 text-xs focus:border-blue-500 focus:outline-none"></textarea>
        </div>
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-1"><Code className="w-3.5 h-3.5 text-blue-400"/> 3. Projects</label>
          <textarea rows="2" value={cvInfo.projects} onChange={(e) => setCvInfo({...cvInfo, projects: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 rounded-lg p-2.5 text-xs focus:border-blue-500 focus:outline-none"></textarea>
        </div>
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-1"><Sparkles className="w-3.5 h-3.5 text-blue-400"/> 4. Technical Skills</label>
          <textarea rows="2" value={cvInfo.skills} onChange={(e) => setCvInfo({...cvInfo, skills: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 rounded-lg p-2.5 text-xs focus:border-blue-500 focus:outline-none"></textarea>
        </div>
      </div>

      <p className="text-[10px] text-center text-slate-400 italic">Al guardar tus 4 secciones, el motor de LinkUP analizará la compatibilidad exacta con tus metas.</p>

      <button onClick={handleNextStep} disabled={analyzing} className="mt-4 w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2">
        {analyzing ? (
          <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Analizando tu perfil con IA...</>
        ) : (
          <>Guardar Información y Recibir Feedback ✨</>
        )}
      </button>
      
      <button onClick={() => setStep(1)} className="w-full py-2 text-slate-400 hover:text-white text-xs font-bold">Volver atrás</button>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4 animate-fadeIn">
      <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 text-center">
        <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
        <h3 className="font-black text-white text-lg">¡Análisis Completado!</h3>
        <p className="text-xs text-emerald-300 mt-1">Tu perfil tiene un <strong>85% de compatibilidad</strong> para "Arquitecto de Software - Prácticas".</p>
      </div>

      <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-3">
        <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2"><Sparkles className="w-4 h-4"/> Feedback y Sugerencias IA:</h4>
        <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
          <li><strong>Fortalezas:</strong> Buen background en metodologías ágiles y experiencia previa como practicante. El promedio ponderado es muy competitivo.</li>
          <li><strong>Áreas de Mejora:</strong> Para un rol de Arquitecto, deberías destacar más tus conocimientos en Patrones de Diseño (Ej. Microservicios) y Cloud (AWS/Azure).</li>
          <li><strong>Oportunidad Recomendada:</strong> Programa de Semillero Tecnológico en el Distrito Quantum (Postulación abierta).</li>
        </ul>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={handleDownloadPDF} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2">
          <Download className="w-4 h-4"/> Descargar PDF (Harvard)
        </button>
        <button onClick={() => {setStep(1); onClose();}} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all">
          Finalizar
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-700 relative overflow-hidden">
        
        {/* Decoracion de fondo */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-600/20 blur-3xl rounded-full pointer-events-none"></div>

        <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-base">Crear tu CV Dinámico</h3>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Asistente LinkUP IA</p>
            </div>
          </div>
          <button onClick={() => {setStep(1); onClose();}} className="text-slate-500 hover:text-white font-bold transition-colors">✕</button>
        </div>

        <div className="relative z-10">
          {/* Timeline Steps Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`h-1.5 w-12 rounded-full ${step >= 1 ? 'bg-blue-500' : 'bg-slate-800'}`}></div>
            <div className={`h-1.5 w-12 rounded-full ${step >= 2 ? 'bg-blue-500' : 'bg-slate-800'}`}></div>
            <div className={`h-1.5 w-12 rounded-full ${step >= 3 ? 'bg-blue-500' : 'bg-slate-800'}`}></div>
          </div>

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </div>
  );
}
