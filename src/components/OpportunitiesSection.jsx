import React, { useState } from 'react';
import { 
  Target, GraduationCap, FileText, Filter, Search, CheckCircle2, 
  ArrowRight, Building2, MapPin, Award, BookOpen, Clock, Briefcase, 
  Sparkles, Check, X, Download, FileCheck, Star, RefreshCw, Eye, Edit3,
  AlertTriangle, Lightbulb, UserCheck, ChevronRight, Code, Layers, Save, Lock, MessageSquare, Trophy, HeartHandshake
} from 'lucide-react';

export default function OpportunitiesSection() {
  const [selectedCategory, setSelectedCategory] = useState('Mercado Laboral');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedModal, setAppliedModal] = useState(null);

  // Filters State per category
  const [filters, setFilters] = useState({
    // Mercado Laboral
    discipline: 'ALL',
    roleLevel: 'ALL',
    jobModality: 'ALL',
    // Becas
    coverage: 'ALL',
    academicLevel: 'ALL',
    becaModality: 'ALL',
  });

  // ==================== "CREA TU CV" STATE ====================
  // Mandatory initial 4 CV Sections submitted by student
  const [cvInfoSubmitted, setCvInfoSubmitted] = useState(true);
  const [cvSavedFeedback, setCvSavedFeedback] = useState(false);

  const [cvData, setCvData] = useState({
    fullName: 'Mateo Benítez',
    education: 'Universidad Aethera • Ingeniería de Sistemas (7mo Ciclo) • Promedio Ponderado: 17.2 (Tercio Superior)',
    experience: 'Practicante de Desarrollo Web en NovaTech (6 meses) • Tutor de Programación en Universidad Aethera',
    projects: 'Plataforma LinkUP (Red Universitaria React/Node), API REST de Gestión Educativa, Dashboard de Analítica SQL',
    technicalSkills: 'React.js, Node.js, Python, SQL, Docker, Diagramación UML, Git/GitHub, TailwindCSS',
  });

  // Sequential Filters (Paso 1: Categoría -> Paso 2: Nivel -> Paso 3: Puesto/Área)
  const [cvTargetCategory, setCvTargetCategory] = useState('Puesto Laboral');
  const [cvRoleLevel, setCvRoleLevel] = useState('Prácticas Preprofesionales'); // Para Puesto Laboral
  const [cvBecaLevel, setCvBecaLevel] = useState('Pregrado'); // Para Becas & Estudios
  const [cvTargetRole, setCvTargetRole] = useState('Arquitecto de Software'); // Para Puesto Laboral
  const [cvTargetBecaArea, setCvTargetBecaArea] = useState('Beca de Excelencia Académica'); // Para Becas

  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedCvText, setCopiedCvText] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      discipline: 'ALL',
      roleLevel: 'ALL',
      jobModality: 'ALL',
      coverage: 'ALL',
      academicLevel: 'ALL',
      becaModality: 'ALL',
    });
    setSearchQuery('');
  };

  const handleSaveCvInfo = (e) => {
    e.preventDefault();
    setCvInfoSubmitted(true);
    setCvSavedFeedback(true);
    setTimeout(() => setCvSavedFeedback(false), 3000);
  };

  const categories = [
    { 
      id: 'Mercado Laboral', 
      label: 'Mercado Laboral', 
      icon: Target, 
      color: 'border-amber-500/40 text-amber-300 bg-amber-500/10', 
      activeGlow: 'ring-2 ring-amber-400 bg-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.25)]',
      desc: 'Ofertas laborales, prácticas profesionales y vacantes trainee'
    },
    { 
      id: 'Becas', 
      label: 'Becas & Estudios', 
      icon: GraduationCap, 
      color: 'border-blue-500/40 text-blue-300 bg-blue-500/10', 
      activeGlow: 'ring-2 ring-blue-400 bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.25)]',
      desc: 'Financiamientos de estudio, certificaciones y becas de excelencia'
    },
    { 
      id: 'Crea tu CV', 
      label: 'Crea tu CV', 
      icon: FileText, 
      color: 'border-purple-500/40 text-purple-300 bg-purple-500/10', 
      activeGlow: 'ring-2 ring-purple-400 bg-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.25)]',
      desc: 'Ingresa tu información y descubre vacíos a desarrollar según tus filtros'
    },
  ];

  // Dynamic Analysis & Feedback Generator evaluating student's 4 sections
  const getCvDiagnostic = () => {
    if (cvTargetCategory === 'Puesto Laboral') {
      if (cvTargetRole === 'Arquitecto de Software') {
        if (cvRoleLevel === 'Prácticas Preprofesionales' || cvRoleLevel === 'Prácticas Profesionales') {
          return {
            targetLabel: `${cvTargetRole} (${cvRoleLevel})`,
            score: 85,
            feedbackSummary: `Hola ${cvData.fullName.split(' ')[0]}, tu perfil para ${cvTargetRole} en nivel ${cvRoleLevel} destaca por una base sólida en backend, diagramación UML y un excelente promedio universitario. Sin embargo, para maximizar tus probabilidades de ser contratado en empresas como Globant o BBVA, necesitas acreditar trabajo colaborativo con CI/CD y desplegar un proyecto en producción con contenedores Docker.`,
            completed: [
              `[Education] ${cvData.education.substring(0, 60)}...`,
              `[Technical Skills] Fundamentos de Node.js, Python, SQL y diagramación UML detectados.`,
              `[Projects] Plataforma LinkUP y API REST registradas en tus proyectos.`
            ],
            missing: [
              `[Experience] Falta demostrar experiencia previa en pipelines CI/CD automatizados.`,
              `[Technical Skills] Falta Certificación Oficial Cloud (AWS Practitioner / Azure).`,
              `[Projects] Falta desplegar un proyecto en contenedores Docker en producción.`
            ],
            recommendations: [
              { category: 'Cursos & Certificaciones', badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30', title: 'Beca Formación TI en Cloud Computing (AWS)', actionText: 'Inscribirme al Curso', desc: 'Curso de 6 meses 100% subvencionado con voucher de certificación oficial para incluir en tu CV.' },
              { category: 'Grupos & Comunidades', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30', title: 'Club de Desarrollo de Software & IA', actionText: 'Unirme al Grupo', desc: 'Participa en proyectos colaborativos con Docker y Git Flow junto a compañeros de ciclos superiores.' },
              { category: 'Mentorías Senior', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', title: 'Revisión Técnica con Carlos Gutiérrez (Globant)', actionText: 'Agendar Mentoría', desc: 'Recibe feedback directo sobre la arquitectura y diagramas UML de tus proyectos personales.' },
              { category: 'Concursos & Hackathons', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30', title: 'Hackathon Nacional de Arquitectura 2026', actionText: 'Participar en Concurso', desc: 'Diseña una arquitectura escalable en 48h y demuestra tus habilidades prácticas a reclutadores.' }
            ]
          };
        } else {
          return {
            targetLabel: `${cvTargetRole} (${cvRoleLevel})`,
            score: 70,
            feedbackSummary: `Hola ${cvData.fullName.split(' ')[0]}, postular a un nivel ${cvRoleLevel} en Arquitectura de Software requiere demostrar liderazgo técnico y proyectos con métricas cuantificables de rendimiento. Tu CV posee buena experiencia previa, pero carece de certificaciones de arquitectura avanzada y registros de optimización de infraestructura.`,
            completed: [
              `[Experience] ${cvData.experience.substring(0, 60)}...`,
              `[Technical Skills] Stack básico en React, Node.js y Docker verificado.`
            ],
            missing: [
              `[Technical Skills] Falta Certificación Senior en Arquitectura de Microservicios.`,
              `[Projects] Falta métrica de impacto cuantificable (% reducción latencia o ahorro).`,
              `[Experience] Falta liderazgo documentado liderando equipos ágiles.`
            ],
            recommendations: [
              { category: 'Cursos & Certificaciones', badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30', title: 'Programa Avanzado de Microservicios & Cloud', actionText: 'Postular al Curso', desc: 'Capacitación intensiva en Kubernetes y resiliencia de software para postulantes Senior.' },
              { category: 'Concursos & Hackathons', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30', title: 'Desafío de Innovación & Arquitectura de Datos', actionText: 'Unirme a la Competencia', desc: 'Lidera un equipo y genera métricas de impacto real para colocar en tu portafolio.' }
            ]
          };
        }
      } else if (cvTargetRole === 'Data Analyst / Data Scientist') {
        return {
          targetLabel: `${cvTargetRole} (${cvRoleLevel})`,
          score: 75,
          feedbackSummary: `Hola ${cvData.fullName.split(' ')[0]}, tu perfil cuenta con una base sólida de ingeniería y conocimientos de SQL y Python. Para destacar en vacantes de analítica de datos en empresas como Globant o Google, necesitas construir dashboards interactivos públicos y demostrar experiencia en limpieza de datos complejos.`,
          completed: [
            `[Education] Formación en ingeniería con sólidos fundamentos de base de datos.`,
            `[Technical Skills] Manejo de SQL y Python detectado en tus habilidades.`
          ],
          missing: [
            `[Projects] Falta portafolio público con dashboards interactivos en Power BI / Tableau.`,
            `[Experience] Falta experiencia en limpieza de datasets masivos y modelos predictivos.`
          ],
          recommendations: [
            { category: 'Seminarios & Masterclass', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', title: 'Masterclass Gratuita: LLMs & Data Warehousing', actionText: 'Inscribirme al Taller', desc: 'Construye un dashboard interactivo en vivo y añade el certificado oficial a tu CV.' },
            { category: 'Mentorías Senior', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30', title: 'Mentoría con Elena Bustamante (Google Data Lead)', actionText: 'Agendar Mentoría', desc: 'Aprende a estructurar un portafolio de analítica enfocado en problemas reales de negocio.' }
          ]
        };
      } else {
        return {
          targetLabel: `${cvTargetRole} (${cvRoleLevel})`,
          score: 78,
          feedbackSummary: `Hola ${cvData.fullName.split(' ')[0]}, tus habilidades en desarrollo frontend y React te dan una excelente ventaja. Para vacantes de UX/UI, los reclutadores buscan ver el proceso de investigación y pruebas con usuarios, no solo prototipos visuales.`,
          completed: [
            `[Projects] Proyectos web funcionales registrados.`,
            `[Technical Skills] Dominio de HTML/CSS/Tailwind y componentes React.`
          ],
          missing: [
            `[Projects] Falta documentación de un Case Study UX completo en Figma o Behance.`,
            `[Experience] Falta metodología probada realizando pruebas de usabilidad con usuarios.`
          ],
          recommendations: [
            { category: 'Mentoría & Feedback', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30', title: 'Revisión con Mateo Rivas (Design Lead en NovaTech)', actionText: 'Pedir Feedback UX', desc: 'Obtén una evaluación detallada de tus casos de estudio y usabilidad en Figma.' }
          ]
        };
      }
    } else {
      // BECAS & ESTUDIOS
      return {
        targetLabel: `${cvTargetBecaArea} (${cvBecaLevel})`,
        score: 88,
        feedbackSummary: `Hola ${cvData.fullName.split(' ')[0]}, tu récord académico con promedio de 17.2 y primer puesto en Hackathon es sumamente competitivo. Para asegurar la adjudicación de la beca, el comité evaluador exige constancia acreditada de compromiso social y una carta de recomendación docente.`,
        completed: [
          `[Education] ${cvData.education} (Excelente récord académico).`,
          `[Projects] Hackathon y proyectos de innovación universitarios registrados.`
        ],
        missing: [
          `[Experience] Falta acreditación oficial de 50h de Voluntariado o Tutorías.`,
          `[Education] Falta Carta de Recomendación firmada por un investigador o docente.`
        ],
        recommendations: [
          { category: 'Voluntariado & Impacto Social', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', title: 'Voluntariado de Tutorías Estudiantiles LinkUP', actionText: 'Postular al Voluntariado', desc: 'Enséñale a alumnos de 1er ciclo y obtén tu certificado oficial de 50 horas de servicio social.' },
          { category: 'Grupos de Investigación', badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30', title: 'Círculo de Investigación & Proyectos Académicos', actionText: 'Explorar Grupos', desc: 'Colabora en publicaciones para conseguir tu carta de recomendación de un docente.' }
        ]
      };
    }
  };

  const activeDiagnostic = getCvDiagnostic();

  // Opportunities Dataset
  const opportunitiesData = {
    'Mercado Laboral': [
      {
        id: 101,
        title: 'Desarrollador Junior / Arquitecto de Software Trainee',
        company: 'NovaTech Solutions',
        discipline: 'Software / TI',
        roleLevel: 'Trainee / Practicante',
        modality: 'Remoto',
        salary: '2,000 S/',
        location: 'Lima / Remoto',
        description: 'Desarrollo de microservicios en Python/Node.js, diseño de diagramas UML y optimización de consultas SQL.'
      },
      {
        id: 102,
        title: 'Data Analyst Junior (BI & Analytics)',
        company: 'Globant',
        discipline: 'Data Science',
        roleLevel: 'Junior',
        modality: 'Híbrido',
        salary: '2,800 S/',
        location: 'Distrito Gaia',
        description: 'Modelado de datos en Power BI, consultas avanzadas SQL y limpieza de datasets para reportes ejecutivos.'
      },
      {
        id: 103,
        title: 'Diseñador UX/UI Trainee',
        company: 'Aethera Systems',
        discipline: 'Diseño UX/UI',
        roleLevel: 'Trainee / Practicante',
        modality: 'Remoto',
        salary: '1,800 S/',
        location: 'Remoto LATAM',
        description: 'Wireframing en Figma, pruebas de usabilidad con usuarios reales y desarrollo de sistemas de diseño.'
      },
      {
        id: 104,
        title: 'Asistente de Finanzas y Consultoría Tech',
        company: 'BBVA Continental',
        discipline: 'Finanzas & Negocios',
        roleLevel: 'Junior',
        modality: 'Presencial',
        salary: '2,500 S/',
        location: 'Centro Financiero',
        description: 'Análisis de datos financieros, evaluación de riesgos de crédito y automatización de procesos con Excel/Python.'
      },
      {
        id: 105,
        title: 'DevOps Cloud Junior',
        company: 'Rappi',
        discipline: 'Software / TI',
        roleLevel: 'Junior',
        modality: 'Remoto',
        salary: '3,200 S/',
        location: 'Remoto LATAM',
        description: 'Configuración de pipelines CI/CD en GitHub Actions, contenedores Docker y despliegues en AWS.'
      }
    ],
    'Becas': [
      {
        id: 201,
        title: 'Beca Talento Tech Aethera 2026',
        company: 'Fundación Aethera',
        coverage: '80% Cobertura',
        academicLevel: 'Pregrado',
        modality: 'Presencial / Híbrido',
        benefit: '80% Descuento Pensión',
        description: 'Financiamiento parcial para cursos de arquitectura de software, cloud computing y desarrollo profesional.'
      },
      {
        id: 202,
        title: 'Beca Formación Profesional en TI',
        company: 'Global Tech Institute',
        coverage: '100% Cobertura',
        academicLevel: 'Certificación',
        modality: 'Virtual',
        benefit: '100% Gratuita + Certificado',
        description: 'Programa intensivo de 6 meses en ciberseguridad y devops respaldado por socios tecnológicos de la región.'
      },
      {
        id: 203,
        title: 'Beca Excelencia Académica e Investigación',
        company: 'Campus Nexus',
        coverage: '100% Cobertura',
        academicLevel: 'Pregrado',
        modality: 'Presencial / Híbrido',
        benefit: 'Manutención + Matrícula',
        description: 'Dirigida a estudiantes en el tercio superior interesados en liderar laboratorios de innovación.'
      },
      {
        id: 204,
        title: 'Beca Maestría en Ciencia de Datos Aplicada',
        company: 'Universidad Internacional Aethera',
        coverage: '50% Cobertura',
        academicLevel: 'Posgrado / Maestría',
        modality: 'Virtual',
        benefit: '50% Cobertura de Colegiatura',
        description: 'Acceso a programa oficial de posgrado con doble titulación en modelado predictivo e IA.'
      }
    ]
  };

  // Filter Logic
  const getFilteredItems = () => {
    const rawList = opportunitiesData[selectedCategory] || [];
    return rawList.filter(item => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchCompany = item.company.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        if (!matchTitle && !matchCompany && !matchDesc) return false;
      }

      if (selectedCategory === 'Mercado Laboral') {
        if (filters.discipline !== 'ALL' && item.discipline !== filters.discipline) return false;
        if (filters.roleLevel !== 'ALL' && item.roleLevel !== filters.roleLevel) return false;
        if (filters.jobModality !== 'ALL' && item.modality !== filters.jobModality) return false;
      } else if (selectedCategory === 'Becas') {
        if (filters.coverage !== 'ALL' && item.coverage !== filters.coverage) return false;
        if (filters.academicLevel !== 'ALL' && item.academicLevel !== filters.academicLevel) return false;
        if (filters.becaModality !== 'ALL' && item.modality !== filters.becaModality) return false;
      }

      return true;
    });
  };

  const filteredItems = getFilteredItems();

  const handleDownloadCv = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleCopyCvText = () => {
    const cvFormattedText = `
==================================================
CURRÍCULUM VITAE - ${cvData.fullName.toUpperCase()}
Meta: ${activeDiagnostic.targetLabel.toUpperCase()}
==================================================

1. EDUCATION (EDUCACIÓN):
${cvData.education}

2. EXPERIENCE (EXPERIENCIA):
${cvData.experience}

3. PROJECTS (PROYECTOS):
${cvData.projects}

4. TECHNICAL SKILLS (HABILIDADES TÉCNICAS):
${cvData.technicalSkills}
    `.trim();

    navigator.clipboard.writeText(cvFormattedText);
    setCopiedCvText(true);
    setTimeout(() => setCopiedCvText(false), 2500);
  };

  return (
    <div className="flex-1 p-6 sm:p-8 max-w-6xl mx-auto w-full animate-fadeIn space-y-8 text-slate-200">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-wider uppercase">
          OPORTUNIDADES & CV
        </h1>
        <p className="text-slate-400 text-sm sm:text-base font-medium max-w-2xl mx-auto">
          Postula a convocatorias del Mercado Laboral y Becas de Estudio, y construye tu CV detectando exactamente lo que necesitas desarrollar.
        </p>
      </div>

      {/* TOP 3 CATEGORIES SELECTOR GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-6 rounded-3xl border backdrop-blur-md flex flex-col items-start justify-between text-left transition-all cursor-pointer min-h-[140px] ${
                isSelected
                  ? `${cat.activeGlow} border-white/60 text-white`
                  : `${cat.color} opacity-80 hover:opacity-100 hover:scale-[1.02]`
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="p-3 rounded-2xl bg-slate-900/60 shadow-md">
                  <Icon className="w-7 h-7" />
                </div>
                {cat.id !== 'Crea tu CV' ? (
                  <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-slate-900/80 text-cyan-400 border border-slate-700">
                    {opportunitiesData[cat.id]?.length || 0} convocatorias
                  </span>
                ) : (
                  <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-purple-500/30 text-purple-300 border border-purple-500/40">
                    ✨ Carga tus 4 Secciones
                  </span>
                )}
              </div>
              <div className="mt-3">
                <span className="font-black text-lg sm:text-xl block text-white">{cat.label}</span>
                <span className="text-xs text-slate-400 font-medium block mt-0.5">{cat.desc}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ==================== VISTA MERCADO LABORAL & BECAS ==================== */}
      {(selectedCategory === 'Mercado Laboral' || selectedCategory === 'Becas') && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* CONTEXTUAL FILTERS PANEL */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-4">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-400" />
                <h2 className="font-bold text-white text-base sm:text-lg">
                  Filtros para <span className="text-cyan-400 underline">{selectedCategory}</span>
                </h2>
              </div>

              {/* GLOBAL SEARCH INPUT */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Buscar en ${selectedCategory}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* DYNAMIC FILTER SELECTORS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* 1. MERCADO LABORAL FILTERS */}
              {selectedCategory === 'Mercado Laboral' && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      🎓 Disciplina / Área:
                    </label>
                    <select
                      value={filters.discipline}
                      onChange={(e) => handleFilterChange('discipline', e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="ALL">Todas las Disciplinas</option>
                      <option value="Software / TI">Software / TI</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Diseño UX/UI">Diseño UX/UI</option>
                      <option value="Finanzas & Negocios">Finanzas & Negocios</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      💼 Puesto / Nivel:
                    </label>
                    <select
                      value={filters.roleLevel}
                      onChange={(e) => handleFilterChange('roleLevel', e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="ALL">Todos los Niveles</option>
                      <option value="Trainee / Practicante">Trainee / Practicante</option>
                      <option value="Junior">Junior</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      🌐 Modalidad de Trabajo:
                    </label>
                    <select
                      value={filters.jobModality}
                      onChange={(e) => handleFilterChange('jobModality', e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="ALL">Todas las Modalidades</option>
                      <option value="Remoto">Remoto</option>
                      <option value="Híbrido">Híbrido</option>
                      <option value="Presencial">Presencial</option>
                    </select>
                  </div>
                </>
              )}

              {/* 2. BECAS FILTERS */}
              {selectedCategory === 'Becas' && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      💰 Tipo de Cobertura:
                    </label>
                    <select
                      value={filters.coverage}
                      onChange={(e) => handleFilterChange('coverage', e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="ALL">Todas las Coberturas</option>
                      <option value="100% Cobertura">100% Cobertura Completa</option>
                      <option value="80% Cobertura">80% Cobertura Parcial</option>
                      <option value="50% Cobertura">50% Cobertura</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      🎓 Nivel Académico:
                    </label>
                    <select
                      value={filters.academicLevel}
                      onChange={(e) => handleFilterChange('academicLevel', e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="ALL">Todos los Niveles</option>
                      <option value="Pregrado">Pregrado</option>
                      <option value="Posgrado / Maestría">Posgrado / Maestría</option>
                      <option value="Certificación">Certificación / Cursos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      🌐 Modalidad:
                    </label>
                    <select
                      value={filters.becaModality}
                      onChange={(e) => handleFilterChange('becaModality', e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="ALL">Todas las Modalidades</option>
                      <option value="Virtual">Virtual</option>
                      <option value="Presencial / Híbrido">Presencial / Híbrido</option>
                    </select>
                  </div>
                </>
              )}

            </div>

          </div>

          {/* FILTERED RESULTS LIST */}
          <div className="space-y-4">
            
            <div className="flex items-center justify-between px-2">
              <span className="font-bold text-white text-base">
                Convocatorias en <span className="text-cyan-400">{selectedCategory}</span>
              </span>
              <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                {filteredItems.length} resultados encontrados
              </span>
            </div>

            {filteredItems.length === 0 ? (
              <div className="p-10 bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800 text-center space-y-3">
                <Filter className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="font-bold text-white text-base">No se encontraron convocatorias para los filtros seleccionados</h3>
                <p className="text-xs text-slate-400">Prueba cambiando o limpiando los criterios de selección.</p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Restablecer Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4 hover:border-blue-500/40 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="px-2.5 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[11px] font-bold rounded-lg">
                          {item.company}
                        </span>

                        <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-extrabold rounded-lg">
                          {item.salary || item.benefit}
                        </span>
                      </div>

                      <h3 className="font-black text-white text-base sm:text-lg leading-snug">
                        {item.title}
                      </h3>

                      <div className="flex flex-wrap gap-3 text-xs font-medium text-slate-400 pt-1">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-cyan-400" /> {item.modality || item.location}</span>
                        {item.discipline && <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-cyan-400" /> {item.discipline}</span>}
                        {item.academicLevel && <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-cyan-400" /> {item.academicLevel}</span>}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed pt-1">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Convocatoria Activa</span>

                      <button
                        onClick={() => setAppliedModal(item)}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Postular / Ver detalles</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      )}

      {/* ==================== VISTA CREA TU CV (MANDATORY CV UPLOAD FIRST, THEN FILTERS) ==================== */}
      {selectedCategory === 'Crea tu CV' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* PASO MANDATORIO DE INGRESO DE INFORMACIÓN DEL CV */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Edit3 className="w-6 h-6 text-purple-400" />
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Paso Inicial: Ingresa la Información de tu CV
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

            {/* FORMULARIO DE LAS 4 SECCIONES REQUERIDAS */}
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
                    placeholder="Ej. Universidad Aethera, Ingeniería de Sistemas (7mo ciclo), Promedio: 17.2, Tercio Superior..."
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
                    placeholder="Ej. Practicante de Desarrollo Web en NovaTech (6 meses), Tutor de Algoritmos..."
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
                    placeholder="Ej. Plataforma LinkUP (React/Node), API REST de Comercio, Dashboard de Analítica..."
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
                    placeholder="Ej. React.js, Node.js, Python, SQL, Docker, Diagramas UML, Git/GitHub..."
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none focus:border-purple-500 resize-none"
                  ></textarea>
                </div>

              </div>

              {/* ACTION BOTÓN: GUARDAR E HABILITAR FILTROS */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
                <p className="text-xs text-slate-400 font-medium">
                  Al guardar tus 4 secciones, el motor de LinkUP analizará la compatibilidad exacta con tus metas.
                </p>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black text-xs rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
                >
                  <Save className="w-4 h-4" />
                  <span>{cvSavedFeedback ? '¡Información Guardada!' : 'Guardar Información y Activar Filtros ✨'}</span>
                </button>
              </div>

            </form>

          </div>

          {/* SINO SE HA INGRESADO LA INFORMACIÓN, MUESTRA MENSAJE DE BLOQUEO */}
          {!cvInfoSubmitted ? (
            <div className="p-8 bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800 text-center space-y-3">
              <Lock className="w-10 h-10 text-amber-400 mx-auto" />
              <h3 className="font-bold text-white text-lg">Ingresa primero las 4 secciones de tu CV</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Guarda tus datos de Education, Experience, Projects y Technical Skills en el panel superior para desbloquear la guía de análisis y filtros.
              </p>
            </div>
          ) : (
            /* FILTROS SECUENCIALES & ANÁLISIS DE BRECHAS DESBLOQUEADO */
            <div className="space-y-8 animate-fadeIn">
              
              {/* PANEL DE FILTROS SECUENCIALES */}
              <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
                
                <div className="border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      Filtros de Postulación para Analizar tu CV
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                    Selecciona en orden la convocatoria a la que aspiras para comparar tus 4 secciones ingresadas con las exigencias del puesto.
                  </p>
                </div>

                {/* TRES PASOS DE FILTRADO SECUENCIAL */}
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

                {/* RESULTADO DEL DIAGNÓSTICO EVALUANDO LAS 4 SECCIONES DEL ESTUDIANTE */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                  
                  {/* CARD DE SCORE */}
                  <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400 block">Nivel de Compatibilidad de tu CV</span>
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

                  {/* LO QUE YA TIENES */}
                  <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Lo que YA TIENES listo en tus 4 secciones ({activeDiagnostic.completed.length}):</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {activeDiagnostic.completed.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* LO QUE TE FALTA */}
                  <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Lo que TE FALTA DESARROLLAR ({activeDiagnostic.missing.length}):</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {activeDiagnostic.missing.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-amber-400 font-bold">⚠️</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

              </div>

              {/* SECCIÓN DE FEEDBACK AUTOMÁTICO & OPORTUNIDADES PARA RESOLVERLAS */}
              <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
                
                {/* CABECERA CON FEEDBACK AUTOMÁTICO QUALITATIVO */}
                <div className="space-y-3 border-b border-slate-800 pb-5">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-purple-400" />
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      Feedback Automático de tu Perfil & Diagnóstico
                    </h3>
                  </div>

                  {/* PANEL DE SÍNTESIS DE FEEDBACK */}
                  <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-slate-200 text-xs leading-relaxed space-y-2">
                    <div className="flex items-center gap-2 font-bold text-purple-300 text-sm">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>Informe de Evaluación Personalizado:</span>
                    </div>
                    <p>{activeDiagnostic.feedbackSummary}</p>
                  </div>
                </div>

                {/* TITULO DE OPORTUNIDADES */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-amber-400" />
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      ¿Cómo te ayudamos a cubrir tus vacíos en LinkUP?
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    Acciones y oportunidades directas para resolver tus brechas (Cursos, Voluntariados, Concursos, Mentorías y Comunidades):
                  </p>
                </div>

                {/* TARJETAS DE OPORTUNIDADES CATEGORIZADAS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {activeDiagnostic.recommendations.map((sol, index) => (
                    <div key={index} className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all shadow-md">
                      
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${sol.badgeColor}`}>
                            {sol.category}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Recomendado</span>
                        </div>

                        <h4 className="font-extrabold text-white text-base leading-snug">{sol.title}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{sol.desc}</p>
                      </div>

                      <button
                        onClick={() => alert(`Accediendo a la oportunidad en LinkUP: ${sol.title}`)}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>{sol.actionText}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                    </div>
                  ))}
                </div>

              </div>

              {/* VISTA PREVIA ATS DEL CV GENERADO */}
              <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-black text-white text-base sm:text-lg flex items-center gap-2">
                    <Eye className="w-5 h-5 text-purple-400" />
                    <span>Vista Previa del CV Generado (Format ATS)</span>
                  </h3>
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                    4 Secciones Verificadas
                  </span>
                </div>

                <div className="bg-slate-950/90 rounded-2xl p-6 border border-slate-800 text-slate-300 text-xs space-y-4 font-sans shadow-inner">
                  
                  {/* HEADER */}
                  <div className="border-b border-slate-800 pb-3 text-center space-y-1">
                    <h2 className="text-xl font-black text-white tracking-wide">{cvData.fullName}</h2>
                    <p className="text-xs font-bold text-purple-400">{activeDiagnostic.targetLabel}</p>
                    <p className="text-[10px] text-slate-400">Lima, Perú • mateo.benitez@aethera.edu.pe • github.com/mbenitez-tech</p>
                  </div>

                  {/* 1. EDUCATION */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-blue-400 border-b border-slate-800/80 pb-0.5">
                      1. Education (Educación)
                    </h4>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{cvData.education}</p>
                  </div>

                  {/* 2. EXPERIENCE */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-emerald-400 border-b border-slate-800/80 pb-0.5">
                      2. Experience (Experiencia)
                    </h4>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{cvData.experience}</p>
                  </div>

                  {/* 3. PROJECTS */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-amber-400 border-b border-slate-800/80 pb-0.5">
                      3. Projects (Proyectos)
                    </h4>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{cvData.projects}</p>
                  </div>

                  {/* 4. TECHNICAL SKILLS */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-purple-400 border-b border-slate-800/80 pb-0.5">
                      4. Technical Skills (Habilidades Técnicas)
                    </h4>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{cvData.technicalSkills}</p>
                  </div>

                </div>

                {/* ACCIONES DE DESCARGA & COPIADO */}
                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleDownloadCv}
                    className="w-full sm:flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {downloadSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        <span>¡CV Generado y Descargado (.PDF)!</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Descargar CV Optimizado</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCopyCvText}
                    className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
                  >
                    <FileCheck className="w-4 h-4 text-cyan-400" />
                    <span>{copiedCvText ? '¡Copiado ATS!' : 'Copiar Texto ATS'}</span>
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* POSTULACIÓN MODAL */}
      {appliedModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-slate-200 animate-fadeIn">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold rounded-md">
                  {selectedCategory}
                </span>
                <h3 className="font-extrabold text-white text-lg mt-2">{appliedModal.title}</h3>
              </div>
              <button onClick={() => setAppliedModal(null)} className="text-slate-400 font-bold hover:text-white text-xl cursor-pointer">✕</button>
            </div>

            <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700 space-y-2 text-xs">
              <p><strong className="text-white">Institución/Empresa:</strong> {appliedModal.company}</p>
              <p><strong className="text-white">Modalidad:</strong> {appliedModal.modality || appliedModal.location}</p>
              <p><strong className="text-white">Beneficio/Remuneración:</strong> {appliedModal.salary || appliedModal.benefit}</p>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed">{appliedModal.description}</p>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Tu perfil en LinkUP cumple con los requisitos iniciales recomendados.</span>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button onClick={() => setAppliedModal(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 cursor-pointer">
                Cerrar
              </button>
              <button 
                onClick={() => {
                  alert(`¡Postulación enviada exitosamente para ${appliedModal.title}!`);
                  setAppliedModal(null);
                }} 
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] cursor-pointer"
              >
                Confirmar Postulación ✨
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
