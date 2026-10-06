import re

def rewrite_opportunities():
    path = r'c:\Users\USER\Desktop\AetheraProject\src\components\OpportunitiesSection.jsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the start of the 'Crea tu CV' block
    start_str = "      {/* ==================== VISTA CREA TU CV"
    end_str = "      {/* POSTULACIÓN MODAL"
    
    start_idx = content.find(start_str)
    end_idx = content.find(end_str)
    
    if start_idx == -1 or end_idx == -1:
        print("Could not find blocks.")
        return

    new_block = """      {/* ==================== VISTA CREA TU CV ==================== */}
      {selectedCategory === 'Crea tu CV' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* 1. FILTROS DE POSTULACIÓN */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
            
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  1. Filtros de Postulación para Analizar tu CV
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                Selecciona en orden la convocatoria a la que aspiras para comparar tus 4 secciones ingresadas con las exigencias del puesto.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* PASO 1 */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-purple-400 uppercase tracking-wider">Paso 1: Categoría</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">Obligatorio</span>
                </div>
                <label className="block text-xs font-bold text-white">¿A qué postularás?</label>
                <select
                  value={cvTargetCategory}
                  onChange={(e) => setCvTargetCategory(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-purple-500/50 text-white font-extrabold text-xs focus:outline-none focus:border-purple-400 cursor-pointer"
                >
                  <option value="Puesto Laboral">💼 Puesto Laboral / Empleo</option>
                  <option value="Becas & Estudios">🎓 Becas & Financiamientos de Estudio</option>
                </select>
              </div>

              {/* PASO 2 */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-cyan-400 uppercase tracking-wider">Paso 2: Nivel</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">Obligatorio</span>
                </div>
                <label className="block text-xs font-bold text-white">Nivel al que aspiras:</label>
                {cvTargetCategory === 'Puesto Laboral' ? (
                  <select
                    value={cvRoleLevel}
                    onChange={(e) => setCvRoleLevel(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-cyan-500/50 text-white font-extrabold text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="Prácticas Preprofesionales">🌱 Prácticas Preprofesionales</option>
                    <option value="Prácticas Profesionales">🎓 Prácticas Profesionales</option>
                    <option value="Junior">⚡ Nivel Junior</option>
                    <option value="Semi-Senior / Senior">🔥 Nivel Semi-Senior / Senior</option>
                  </select>
                ) : (
                  <select
                    value={cvBecaLevel}
                    onChange={(e) => setCvBecaLevel(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-cyan-500/50 text-white font-extrabold text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="Pregrado">📘 Pregrado Universitario</option>
                    <option value="Posgrado / Maestría">📙 Posgrado / Maestría</option>
                    <option value="Certificación">📜 Certificación / Curso Especializado</option>
                  </select>
                )}
              </div>

              {/* PASO 3 */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider">Paso 3: Puesto / Área</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">Obligatorio</span>
                </div>
                <label className="block text-xs font-bold text-white">Puesto o Área objetivo:</label>
                {cvTargetCategory === 'Puesto Laboral' ? (
                  <select
                    value={cvTargetRole}
                    onChange={(e) => setCvTargetRole(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-amber-500/50 text-white font-extrabold text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="Arquitecto de Software">💻 Arquitecto de Software</option>
                    <option value="Data Analyst / Data Scientist">📊 Data Analyst / Data Scientist</option>
                    <option value="Diseñador UX/UI">🎨 Diseñador UX/UI</option>
                    <option value="DevOps & Cloud Engineer">☁️ DevOps & Cloud Engineer</option>
                    <option value="Finanzas & Negocios Tech">💼 Finanzas & Negocios Tech</option>
                  </select>
                ) : (
                  <select
                    value={cvTargetBecaArea}
                    onChange={(e) => setCvTargetBecaArea(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-amber-500/50 text-white font-extrabold text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="Beca de Excelencia Académica">🌟 Beca de Excelencia Académica</option>
                    <option value="Beca Formación TI / Certificación">🚀 Beca Formación TI / Certificación</option>
                    <option value="Beca de Investigación & Posgrado">🔬 Beca de Investigación & Posgrado</option>
                    <option value="Beca de Intercambio Internacional">🌎 Beca de Intercambio Internacional</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* 2. INGRESA LA INFORMACIÓN DE TU CV */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Edit3 className="w-6 h-6 text-emerald-400" />
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    2. Paso Inicial: Ingresa la Información de tu CV
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                  Para analizar qué oportunidades encajan con tu perfil y qué te falta desarrollar, primero completa o actualiza las 4 secciones fundamentales de tu CV:
                </p>
              </div>

              {cvInfoSubmitted && (
                <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-extrabold flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Información Cargada ✓</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveCvInfo} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                
                {/* 1. EDUCATION */}
                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
                  <label className="block font-black text-blue-400 uppercase tracking-wider text-xs flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    <span>1. Education (Educación & Pertenencia Académica):</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={cvData.education}
                    onChange={(e) => setCvData({ ...cvData, education: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none focus:border-blue-500 resize-none"
                  ></textarea>
                </div>

                {/* 2. EXPERIENCE */}
                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
                  <label className="block font-black text-emerald-400 uppercase tracking-wider text-xs flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    <span>2. Experience (Experiencia Laboral o Prácticas):</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={cvData.experience}
                    onChange={(e) => setCvData({ ...cvData, experience: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none focus:border-emerald-500 resize-none"
                  ></textarea>
                </div>

                {/* 3. PROJECTS */}
                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
                  <label className="block font-black text-amber-400 uppercase tracking-wider text-xs flex items-center gap-1.5">
                    <Code className="w-4 h-4" />
                    <span>3. Projects (Proyectos Destacados & Repositorios):</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={cvData.projects}
                    onChange={(e) => setCvData({ ...cvData, projects: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none focus:border-amber-500 resize-none"
                  ></textarea>
                </div>

                {/* 4. TECHNICAL SKILLS */}
                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
                  <label className="block font-black text-purple-400 uppercase tracking-wider text-xs flex items-center gap-1.5">
                    <Layers className="w-4 h-4" />
                    <span>4. Technical Skills (Habilidades Técnicas & Herramientas):</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={cvData.technicalSkills}
                    onChange={(e) => setCvData({ ...cvData, technicalSkills: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none focus:border-purple-500 resize-none"
                  ></textarea>
                </div>

              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
                <p className="text-xs text-slate-400 font-medium">
                  Al guardar tus 4 secciones, el motor de LinkUP analizará la compatibilidad exacta con tus metas.
                </p>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black text-xs rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
                >
                  <Save className="w-4 h-4" />
                  <span>{cvSavedFeedback ? '¡Información Guardada!' : 'Guardar Información y Recibir Feedback ✨'}</span>
                </button>
              </div>

            </form>
          </div>

          {/* 3. RESULTADO, FEEDBACK Y OPORTUNIDADES (Aparece si se envió info) */}
          {cvInfoSubmitted && (
            <div className="space-y-8 animate-fadeIn">
              
              <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-amber-400" />
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      3. Feedback de IA & Oportunidades Sugeridas
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                  <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400 block">Nivel de Compatibilidad</span>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-black text-cyan-400">{activeDiagnostic.score}%</span>
                      <div className="flex-1 bg-slate-700 h-3 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full" style={{ width: `${activeDiagnostic.score}%` }}></div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      Evaluando tus 4 secciones para: <span className="text-white font-bold">{activeDiagnostic.targetLabel}</span>
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Lo que YA TIENES ({activeDiagnostic.completed.length}):</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {activeDiagnostic.completed.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-snug"><span className="text-emerald-400 font-bold">✓</span><span>{req}</span></li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Lo que TE FALTA ({activeDiagnostic.missing.length}):</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {activeDiagnostic.missing.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-snug"><span className="text-amber-400 font-bold">⚠️</span><span>{req}</span></li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* SINTESIS DEL FEEDBACK */}
                <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-slate-200 text-xs leading-relaxed space-y-2">
                  <div className="flex items-center gap-2 font-bold text-purple-300 text-sm">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Informe de Evaluación Personalizado:</span>
                  </div>
                  <p>{activeDiagnostic.feedbackSummary}</p>
                </div>

                <div className="pt-4 space-y-4">
                  <h4 className="font-bold text-white text-sm">Opciones de Oportunidades Sugeridas:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {activeDiagnostic.recommendations.map((sol, index) => (
                      <div key={index} className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all shadow-md">
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${sol.badgeColor}`}>{sol.category}</span>
                          </div>
                          <h4 className="font-extrabold text-white text-base leading-snug">{sol.title}</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">{sol.desc}</p>
                        </div>
                        <button onClick={() => alert(`Accediendo a la oportunidad en LinkUP: ${sol.title}`)} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
                          <span>{sol.actionText}</span> <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* 4. VISTA PREVIA ATS Y DESCARGA */}
              <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-black text-white text-base sm:text-lg flex items-center gap-2">
                    <Eye className="w-5 h-5 text-purple-400" />
                    <span>4. Vista Previa del CV Generado (Formato ATS)</span>
                  </h3>
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                    4 Secciones Verificadas
                  </span>
                </div>

                <div className="bg-slate-950/90 rounded-2xl p-6 border border-slate-800 text-slate-300 text-xs space-y-4 font-sans shadow-inner">
                  <div className="border-b border-slate-800 pb-3 text-center space-y-1">
                    <h2 className="text-xl font-black text-white tracking-wide">{cvData.fullName}</h2>
                    <p className="text-xs font-bold text-purple-400">{activeDiagnostic.targetLabel}</p>
                    <p className="text-[10px] text-slate-400">Lima, Perú • mateo.benitez@aethera.edu.pe • github.com/mbenitez-tech</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-blue-400 border-b border-slate-800/80 pb-0.5">1. Education (Educación)</h4>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{cvData.education}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-emerald-400 border-b border-slate-800/80 pb-0.5">2. Experience (Experiencia)</h4>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{cvData.experience}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-amber-400 border-b border-slate-800/80 pb-0.5">3. Projects (Proyectos)</h4>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{cvData.projects}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-purple-400 border-b border-slate-800/80 pb-0.5">4. Technical Skills (Habilidades Técnicas)</h4>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{cvData.technicalSkills}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                  <button onClick={handleDownloadCv} className="w-full sm:flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer">
                    {downloadSuccess ? (
                      <><CheckCircle2 className="w-4 h-4 text-emerald-300" /><span>¡CV Generado y Descargado (.PDF)!</span></>
                    ) : (
                      <><Download className="w-4 h-4" /><span>Descargar CV en PDF (Formato Harvard)</span></>
                    )}
                  </button>
                  <button onClick={handleCopyCvText} className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0">
                    <FileCheck className="w-4 h-4 text-cyan-400" />
                    <span>{copiedCvText ? '¡Copiado ATS!' : 'Copiar Texto ATS'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
\n"""

    new_content = content[:start_idx] + new_block + content[end_idx:]
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Done rewriting CV block!")

rewrite_opportunities()
