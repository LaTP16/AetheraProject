import React, { useState } from 'react';
import { Sparkles, FileText, CheckCircle } from 'lucide-react';

export default function CVModal({ isOpen, onClose }) {
  const [cvAnalyzing, setCvAnalyzing] = useState(false);
  const [cvAnalyzed, setCvAnalyzed] = useState(false);

  if (!isOpen) return null;

  const handleAnalyzeCV = () => {
    setCvAnalyzing(true);
    setTimeout(() => {
      setCvAnalyzing(false);
      setCvAnalyzed(true);
    }, 1500);
  };

  const handleClose = () => {
    setCvAnalyzed(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Analizador de CV con IA</h3>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>

        <div className="py-6">
          {!cvAnalyzed ? (
            <div className="text-center">
              <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 p-8 rounded-2xl cursor-pointer transition-colors bg-slate-50">
                <FileText className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">Arrastra tu archivo PDF de CV aquí</p>
                <p className="text-[11px] text-slate-400 mt-1">Formato PDF o DOCX (Máx. 5MB)</p>
              </div>

              <button
                onClick={handleAnalyzeCV}
                disabled={cvAnalyzing}
                className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {cvAnalyzing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Analizando tu perfil con IA...
                  </>
                ) : (
                  "Iniciar Análisis de Compatibilidad"
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  ¡Análisis Completado con Éxito!
                </div>
                <p className="text-xs text-emerald-900">
                  Tu perfil presenta una coincidencia del <strong>92%</strong> con la vacante de <em>Desarrollador Fullstack Junior</em> en NovaTech.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2">Recomendaciones de IA:</h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                  <li>Destaca tus proyectos universitarios con React y PostgreSQL.</li>
                  <li>Agrega palabras clave sobre metodologías ágiles en el resumen.</li>
                </ul>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors"
              >
                Cerrar y ver convocatorias
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
