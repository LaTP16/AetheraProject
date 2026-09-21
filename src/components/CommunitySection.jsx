import React, { useState } from 'react';
import { MessageSquare, Users, Share2, Heart, MessageCircle, Send, Search, Building2, Briefcase, Mail, Linkedin, UserCheck, Sparkles, Copy, Check, Plus, Code, Layers, Stethoscope, BookOpen, ShieldAlert, X, HelpCircle } from 'lucide-react';

export default function CommunitySection() {
  const [activeSubCategory, setActiveSubCategory] = useState('TODOS');
  
  // CONEXIÓN SEARCH STATE
  const [targetRole, setTargetRole] = useState('Arquitecto de Software');
  const [targetCompany, setTargetCompany] = useState('Globant');
  const [copiedContact, setCopiedContact] = useState(null);

  // GRUPOS STATE & DATA
  const [groupCategoryFilter, setGroupCategoryFilter] = useState('TODOS');
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState('Software / TI');
  const [newGroupObjective, setNewGroupObjective] = useState('');
  const [newGroupModality, setNewGroupModality] = useState('Virtual');

  const [groupsList, setGroupsList] = useState([
    {
      id: 1,
      name: 'Club de Desarrollo de Software & IA',
      category: 'Software / TI',
      objective: 'Comunidad de aprendizaje colaborativo en programación, Python, React y proyectos de código abierto para portafolio.',
      membersCount: 48,
      modality: 'Virtual (Discord & Meet)',
      joined: false,
      tagBg: 'bg-[#2A5C70] text-white',
      creator: 'Mateo Benítez'
    },
    {
      id: 2,
      name: 'Taller de Diseño Arquitectónico & Urbanismo',
      category: 'Arquitectura',
      objective: 'Espacio para compartir renders, revisión de maquetas, Revit, AutoCAD y metodologías sostenibles de diseño.',
      membersCount: 32,
      modality: 'Híbrido (Campus & Zoom)',
      joined: false,
      tagBg: 'bg-[#8B5CF6] text-white',
      creator: 'Camila Rojas'
    },
    {
      id: 3,
      name: 'Comunidad de Enfermería & Salud Pública',
      category: 'Enfermería',
      objective: 'Intercambio de casos clínicos, prácticas de anatomía, guías de internado y primeros auxilios avanzados.',
      membersCount: 29,
      modality: 'Presencial (Laboratorios)',
      joined: false,
      tagBg: 'bg-[#059669] text-white',
      creator: 'Lucía Fernández'
    },
    {
      id: 4,
      name: 'Círculo de Estudios de Derecho & Litigio',
      category: 'Derecho',
      objective: 'Debates de jurisprudencia, análisis de casos constitucionales y prácticas de oratoria jurídica para exámenes.',
      membersCount: 21,
      modality: 'Virtual',
      joined: false,
      tagBg: 'bg-[#D97706] text-white',
      creator: 'Gonzalo Silva'
    }
  ]);

  // ==================== FOROS (PREGUNTAS Y DEBATES) ====================
  const [showCreateForumModal, setShowCreateForumModal] = useState(false);
  const [newForumTitle, setNewForumTitle] = useState('');
  const [newForumTag, setNewForumTag] = useState('#entrevistas-tech');
  const [newForumContext, setNewForumContext] = useState('');
  const [replyInput, setReplyInput] = useState({});

  const [forumThreads, setForumThreads] = useState([
    {
      id: 1,
      title: '¿Alguien con experiencia en entrevistas técnicas de Arquitectura de Software para estudiantes sin experiencia previa?',
      context: '¡Hola comu! 👋 Estoy en 7mo ciclo de Sistemas y pasé a la fase técnica para un puesto de Software Architect Trainee en Globant. Me dijeron que me pedirán diagramar microservicios e identificar cuellos de botella en tiempo real. ¿Qué tipo de preguntas suelen hacer y cómo me sugieren practicar para no ponerme nervioso?',
      tag: '#entrevistas-tech',
      author: 'Mateo Benítez',
      role: 'Estudiante de Sistemas • 7mo Semestre',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      time: 'Hace 2 horas',
      answers: [
        {
          id: 101,
          author: 'Carlos Gutiérrez',
          role: 'Lead Software Architect en Globant',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
          time: 'Hace 1 hora',
          content: '¡Hola Mateo! Como líder técnico en Globant, te doy 3 consejos de oro: 1) Enfócate en la escalabilidad básica (explicar cuándo usar un Load Balancer y Caché con Redis). 2) Justifica siempre tus decisiones ("uso PostgreSQL aquí porque necesito consistencia ACID"). 3) Practica dibujando diagramas en Excalidraw expresando tus ideas en voz alta. ¡Éxitos!'
        },
        {
          id: 102,
          author: 'Andrea Silva',
          role: 'Estudiante de Sistemas • 9no Semestre',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
          time: 'Hace 45 min',
          content: 'Te recomiendo el canal de YouTube "ByteByteGo" y leer el libro "Designing Data-Intensive Applications". Te da ejemplos visuales muy claros para responder preguntas sobre bases de datos y colas de mensajes.'
        }
      ]
    },
    {
      id: 2,
      title: '¿Cómo balancear las prácticas pre-profesionales de 30 horas semanales con 5 cursos exigentes sin colapsar?',
      context: 'Empecé mis prácticas profesionales la semana pasada de 8:00am a 2:00pm y en las tardes tengo clases presenciales hasta las 10:00pm. Siento que no me alcanza el día para hacer tareas y descansar. ¿Cómo organizan sus bloques de estudio y descanso los fines de semana quienes trabajan y estudian?',
      tag: '#estudios-y-prácticas',
      author: 'Camila Rojas',
      role: 'Estudiante de Arquitectura • 6to Semestre',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      time: 'Hace 5 horas',
      answers: [
        {
          id: 201,
          author: 'Mariana Alarcón',
          role: 'Arquitecta de Soluciones en BBVA',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
          time: 'Hace 3 horas',
          content: 'Mi regla de oro durante mi último año: 1) Bloquear religiosamente los domingos por la mañana únicamente para repasar los temas más pesados con la técnica Pomodoro. 2) Negociar días de home office en tus prácticas en semanas de exámenes finales. ¡No intentes estudiar a las 11pm cuando tu cerebro ya está exhausto!'
        }
      ]
    },
    {
      id: 3,
      title: 'Duda con el examen de suficiencia profesional vs Tesis: ¿Cuál conviene más según tus metas?',
      context: 'Estoy evaluando si sustentar tesis de investigación o dar el examen de titulación profesional. Me gustaría saber el impacto real que tiene haber hecho tesis al momento de postular a maestrías en el extranjero vs el mercado laboral técnico local.',
      tag: '#tesis-vs-examen',
      author: 'Diego Pérez',
      role: 'Estudiante de Ingeniería • 8vo Semestre',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      time: 'Hace 1 día',
      answers: [
        {
          id: 301,
          author: 'Valeria Ríos',
          role: 'Recruiting Lead en Google',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
          time: 'Hace 18 horas',
          content: 'Si tu meta es una maestría internacional o becas como Fulbright o Chevening, la TESIS es un requisito con un peso enorme por las publicaciones académicas. Para la industria tech corporativa local, el examen de titulación te permite obtener el título más rápido.'
        }
      ]
    }
  ]);

  // DATASET DE RECLUTADORES & MENTORES
  const recruitersData = [
    {
      id: 1,
      name: 'Sofía Mendoza',
      role: 'Senior Tech Recruiter',
      company: 'Globant',
      specialty: 'Arquitectura de Software, Cloud & DevOps Junior',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
      email: 'sofia.mendoza@globant.com',
      linkedin: 'linkedin.com/in/sofiamendoza-recruiter'
    },
    {
      id: 2,
      name: 'Renato Castillo',
      role: 'Talent Acquisition Lead',
      company: 'BBVA',
      specialty: 'Ingeniería de Sistemas, Data Science & Backend',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      email: 'renato.castillo@bbva.com',
      linkedin: 'linkedin.com/in/renatocastillohr'
    },
    {
      id: 3,
      name: 'Valeria Ríos',
      role: 'University Relations & Recruiting Manager',
      company: 'Google',
      specialty: 'Programas de Pasantías y Roles Junior Tech',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
      email: 'valeriarios@google.com',
      linkedin: 'linkedin.com/in/valeriarios-recruiting'
    }
  ];

  const workingProfessionalsData = [
    {
      id: 101,
      name: 'Carlos Gutiérrez',
      currentRole: 'Lead Software Architect',
      company: 'Globant',
      experience: '4 años en el puesto • Ex-alumno Universidad Aethera',
      bio: 'Apasionado por apoyar a nuevos talentos en diseño de sistemas y preparación de entrevistas técnicas.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      email: 'carlos.gutierrez.tech@gmail.com',
      linkedin: 'linkedin.com/in/cgutierrez-arch'
    },
    {
      id: 102,
      name: 'Mariana Alarcón',
      currentRole: 'Arquitecta de Soluciones Cloud',
      company: 'BBVA',
      experience: '3 años de experiencia • Titulada 2023',
      bio: 'Te ayudo a revisar tu CV para convocatorias en banca y fintech. ¡Escríbeme con confianza!',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      email: 'marianalarcon.dev@outlook.com',
      linkedin: 'linkedin.com/in/marianalarcon-cloud'
    },
    {
      id: 103,
      name: 'Jorge Benavides',
      currentRole: 'Senior Frontend & Software Architect',
      company: 'Rappi',
      experience: '5 años de experiencia • Tutor LinkUP',
      bio: 'Mentor en React, TypeScript y patrones de arquitectura limpia. Abierto a chats de orientación profesional.',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
      email: 'jorge.benavides@rappi.com',
      linkedin: 'linkedin.com/in/jbenavides-tech'
    }
  ];

  const topCards = [
    { id: 'Foros', title: 'Foros', icon: MessageSquare, description: 'Preguntas, contexto y respuestas comunitarias', color: 'bg-[#CBDDE6]', hoverColor: 'hover:bg-[#B9D3E0]' },
    { id: 'Grupos', title: 'Grupos', icon: Users, description: 'Comunidades por carrera y creación de grupos', color: 'bg-[#CBDDE6]', hoverColor: 'hover:bg-[#B9D3E0]' },
    { id: 'Conexión', title: 'Conexión', icon: Share2, description: 'Contacto con Reclutadores y Mentores Profesionales', color: 'bg-[#CBDDE6]', hoverColor: 'hover:bg-[#B9D3E0]' },
  ];

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedContact(type);
    setTimeout(() => setCopiedContact(null), 2000);
  };

  const handleToggleJoinGroup = (groupId) => {
    setGroupsList(groupsList.map(g => {
      if (g.id === groupId) {
        const nextJoined = !g.joined;
        return {
          ...g,
          joined: nextJoined,
          membersCount: nextJoined ? g.membersCount + 1 : g.membersCount - 1
        };
      }
      return g;
    }));
  };

  const handleCreateGroupSubmit = (e) => {
    e.preventDefault();
    if (!newGroupName.trim() || !newGroupObjective.trim()) return;

    const newGroupObj = {
      id: Date.now(),
      name: newGroupName,
      category: newGroupCategory,
      objective: newGroupObjective,
      membersCount: 1,
      modality: newGroupModality,
      joined: true,
      tagBg: 'bg-[#2C5D71] text-white',
      creator: 'Mateo Benítez (Tú)'
    };

    setGroupsList([newGroupObj, ...groupsList]);
    setNewGroupName('');
    setNewGroupObjective('');
    setShowCreateGroupModal(false);
  };

  const handleAddForumReply = (threadId) => {
    const text = replyInput[threadId];
    if (!text || !text.trim()) return;

    const newAnswerObj = {
      id: Date.now(),
      author: 'Mateo Benítez (Tú)',
      role: 'Estudiante de Sistemas',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      time: 'Hace un momento',
      content: text
    };

    setForumThreads(forumThreads.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          answers: [...t.answers, newAnswerObj]
        };
      }
      return t;
    }));

    setReplyInput({ ...replyInput, [threadId]: '' });
  };

  const handleCreateForumSubmit = (e) => {
    e.preventDefault();
    if (!newForumTitle.trim() || !newForumContext.trim()) return;

    const newThreadObj = {
      id: Date.now(),
      title: newForumTitle,
      context: newForumContext,
      tag: newForumTag,
      author: 'Mateo Benítez (Tú)',
      role: 'Estudiante de Sistemas',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      time: 'Hace un momento',
      answers: []
    };

    setForumThreads([newThreadObj, ...forumThreads]);
    setNewForumTitle('');
    setNewForumContext('');
    setShowCreateForumModal(false);
  };

  const filteredRecruiters = recruitersData.filter(r => {
    const roleMatch = !targetRole || r.role.toLowerCase().includes(targetRole.toLowerCase()) || r.specialty.toLowerCase().includes(targetRole.toLowerCase());
    const companyMatch = !targetCompany || r.company.toLowerCase().includes(targetCompany.toLowerCase());
    return roleMatch || companyMatch;
  });

  const filteredProfessionals = workingProfessionalsData.filter(p => {
    const roleMatch = !targetRole || p.currentRole.toLowerCase().includes(targetRole.toLowerCase()) || p.bio.toLowerCase().includes(targetRole.toLowerCase());
    const companyMatch = !targetCompany || p.company.toLowerCase().includes(targetCompany.toLowerCase());
    return roleMatch || companyMatch;
  });

  const filteredGroups = groupCategoryFilter === 'TODOS'
    ? groupsList
    : groupsList.filter(g => g.category === groupCategoryFilter);

  return (
    <div className="flex-1 p-6 sm:p-8 max-w-6xl mx-auto w-full space-y-8 animate-fadeIn">
      
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-wider">
          COMUNIDAD
        </h1>
        <p className="text-white/90 text-sm sm:text-base font-medium mt-1">
          Foros de preguntas y respuestas, comunidades académicas y red de conexión con reclutadores y mentores
        </p>
      </div>

      {/* TOP 3 QUICK ACCESS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topCards.map((card) => {
          const Icon = card.icon;
          const isSelected = activeSubCategory === card.id || (activeSubCategory === 'TODOS' && card.id === 'Foros');

          return (
            <div
              key={card.id}
              onClick={() => setActiveSubCategory(card.id)}
              className={`${card.color} ${card.hoverColor} p-6 sm:p-8 rounded-3xl shadow-xl border border-white/40 cursor-pointer transition-all transform hover:-translate-y-1 text-slate-800 flex flex-col items-start justify-between min-h-[160px] group ${
                isSelected ? 'ring-4 ring-white/80 scale-[1.02] bg-[#AECBD8]' : ''
              }`}
            >
              <div className="p-3 bg-[#2C5D71] text-white rounded-2xl shadow-md group-hover:scale-110 transition-transform">
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-extrabold text-2xl text-slate-900 mt-4 tracking-tight">{card.title}</h3>
                <p className="text-xs text-slate-600 font-semibold mt-1">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ==================== VISTA ESPECIALIZADA: FOROS ==================== */}
      {(activeSubCategory === 'Foros' || activeSubCategory === 'TODOS') && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* HEADER DE FOROS & BOTÓN CREAR PREGUNTA */}
          <div className="bg-[#CBDDE6] rounded-3xl p-6 sm:p-8 shadow-xl border border-white/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-[#2C5D71]" />
                <h2 className="text-2xl font-black text-[#1F4555]">
                  Foro de Preguntas & Debates
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
                Haz tus preguntas con contexto detallado y recibe respuestas e ideas útiles de tus compañeros y mentores.
              </p>
            </div>

            <button
              onClick={() => setShowCreateForumModal(true)}
              className="px-5 py-3 bg-[#2C5D71] hover:bg-[#1E4353] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg flex items-center gap-2 shrink-0 transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Hacer una Pregunta / Crear Hilo</span>
            </button>
          </div>

          {/* LISTADO DE PREGUNTAS / THREADS */}
          <div className="space-y-6">
            {forumThreads.map((thread) => (
              <div
                key={thread.id}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-5 hover:shadow-2xl transition-all"
              >
                
                {/* THREAD HEADER & QUESTION */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={thread.avatar}
                        alt={thread.author}
                        className="w-9 h-9 rounded-full object-cover border border-slate-300"
                      />
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900">{thread.author}</h4>
                        <p className="text-[10px] text-slate-500">{thread.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold px-3 py-1 rounded-full uppercase bg-teal-100 text-[#2C5D71]">
                        {thread.tag}
                      </span>
                      <span className="text-xs text-slate-400">{thread.time}</span>
                    </div>
                  </div>

                  {/* PREGUNTA PRINCIPAL / TITULO */}
                  <h3 className="font-black text-slate-900 text-lg sm:text-xl leading-snug">
                    {thread.title}
                  </h3>

                  {/* CONTEXTO DETALLADO */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-1">
                    <p className="font-bold text-[#1F4555]">Contexto de la duda:</p>
                    <p>{thread.context}</p>
                  </div>
                </div>

                {/* RESPUESTAS / HILO DE APORTES */}
                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#1F4555]">
                    <MessageSquare className="w-4 h-4 text-[#2C5D71]" />
                    <span>{thread.answers.length} Respuestas y Aportes:</span>
                  </div>

                  {/* LISTA DE RESPUESTAS */}
                  <div className="space-y-3">
                    {thread.answers.map((answer) => (
                      <div
                        key={answer.id}
                        className="p-4 bg-[#EAF2F6] rounded-2xl border border-[#B4D3E0] space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={answer.avatar}
                            alt={answer.author}
                            className="w-7 h-7 rounded-full object-cover border border-[#2C5D71]"
                          />
                          <span className="font-extrabold text-xs text-slate-900">{answer.author}</span>
                          <span className="text-[10px] text-slate-500">• {answer.role}</span>
                          <span className="text-[10px] text-slate-400 ml-auto">{answer.time}</span>
                        </div>

                        <p className="text-xs text-slate-800 font-medium leading-relaxed pl-9">
                          {answer.content}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* FORMULARIO PARA RESPONDER AL HILO */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Escribe tu aporte, respuesta o solución para esta duda..."
                      value={replyInput[thread.id] || ''}
                      onChange={(e) => setReplyInput({ ...replyInput, [thread.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddForumReply(thread.id);
                      }}
                      className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#2C5D71]"
                    />
                    <button
                      onClick={() => handleAddForumReply(thread.id)}
                      className="px-4 py-2.5 bg-[#2C5D71] hover:bg-[#1E4353] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Responder</span>
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ==================== VISTA ESPECIALIZADA: GRUPOS ==================== */}
      {activeSubCategory === 'Grupos' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* HEADER DE GRUPOS & BOTÓN CREAR GRUPO */}
          <div className="bg-[#CBDDE6] rounded-3xl p-6 sm:p-8 shadow-xl border border-white/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-[#2C5D71]" />
                <h2 className="text-2xl font-black text-[#1F4555]">
                  Comunidades & Grupos Estudiantiles
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
                Explora grupos de estudio por carreras (Software, Arquitectura, Enfermería, etc.) o crea tu propio grupo para coordinar con compañeros.
              </p>
            </div>

            <button
              onClick={() => setShowCreateGroupModal(true)}
              className="px-5 py-3 bg-[#2C5D71] hover:bg-[#1E4353] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg flex items-center gap-2 shrink-0 transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Crear Nuevo Grupo</span>
            </button>
          </div>

          {/* CHIPS DE FILTRO POR CARRERA */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-white uppercase tracking-wider mr-2">Filtrar área:</span>
            {['TODOS', 'Software / TI', 'Arquitectura', 'Enfermería', 'Derecho'].map((cat) => (
              <button
                key={cat}
                onClick={() => setGroupCategoryFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  groupCategoryFilter === cat
                    ? 'bg-white text-[#193F4E] shadow-md ring-2 ring-[#2C5D71]'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* LISTADO DE GRUPOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 flex flex-col justify-between hover:shadow-2xl transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${group.tagBg}`}>
                      {group.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      👥 {group.membersCount} miembros
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
                    {group.name}
                  </h3>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                    <p className="font-bold text-[#1F4555]">🎯 Objetivo del grupo:</p>
                    <p className="text-slate-700 leading-relaxed">{group.objective}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-600">Modalidad: <span className="text-[#2C5D71]">{group.modality}</span></p>
                    {group.creator && <p className="text-[10px] text-slate-400">Creado por: {group.creator}</p>}
                  </div>

                  <button
                    onClick={() => handleToggleJoinGroup(group.id)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${
                      group.joined
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-[#2C5D71] hover:bg-[#1E4353] text-white'
                    }`}
                  >
                    {group.joined ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Unido al Grupo ✓</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Unirme al Grupo</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ==================== VISTA ESPECIALIZADA: CONEXIÓN ==================== */}
      {activeSubCategory === 'Conexión' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* SEARCH & TARGET INPUT FORM */}
          <div className="bg-[#CBDDE6] rounded-3xl p-6 sm:p-8 shadow-xl border border-white/40 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-300 pb-3">
              <Sparkles className="w-6 h-6 text-[#2C5D71]" />
              <h2 className="text-xl sm:text-2xl font-black text-[#1F4555]">
                Red de Conexión Laboral & Mentores
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              Ingresa el puesto al que aspiras y las empresas donde planeas trabajar. LinkUP te conectará directamente con reclutadores activos y profesionales/mentores trabajando en esa área.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#1F4555] uppercase tracking-wider mb-1">
                  🎯 Puesto al que aspiras:
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="Ej. Arquitecto de Software, Analista de Datos..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white text-slate-800 font-semibold text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2C5D71]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F4555] uppercase tracking-wider mb-1">
                  🏢 Empresa o lugar donde planeas trabajar:
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    placeholder="Ej. Globant, BBVA, Google, Rappi..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white text-slate-800 font-semibold text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2C5D71]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECCIÓN 1: RECLUTADORES PARA EL PUESTO */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-2">
                <span>👔 Reclutadores para el puesto</span>
                <span className="text-xs px-3 py-1 bg-white/20 rounded-full font-bold text-white">
                  {filteredRecruiters.length} encontrados
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filteredRecruiters.map((recruiter) => (
                <div key={recruiter.id} className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 flex flex-col justify-between hover:shadow-2xl transition-all space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={recruiter.avatar} alt={recruiter.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-[#2C5D71] shadow-sm" />
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">{recruiter.name} <span className="text-blue-600 text-xs">✓</span></h4>
                        <p className="text-xs font-bold text-[#2C5D71]">{recruiter.role}</p>
                        <p className="text-[11px] font-semibold text-slate-600">🏢 {recruiter.company}</p>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                      <span className="font-bold text-slate-700">Especialidad: </span>
                      <span className="text-slate-600">{recruiter.specialty}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contacto directo:</p>
                    <div className="flex items-center justify-between p-2.5 bg-[#EAF2F6] rounded-xl text-xs">
                      <span className="font-medium text-[11px] truncate">✉️ {recruiter.email}</span>
                      <button onClick={() => handleCopy(recruiter.email, `rec-${recruiter.id}`)} className="p-1.5 bg-white text-[#2C5D71] rounded-lg shadow-xs cursor-pointer">
                        {copiedContact === `rec-${recruiter.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <a href={`https://${recruiter.linkedin}`} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 bg-[#0077B5] hover:bg-[#005E93] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer">
                      <Linkedin className="w-4 h-4 fill-white" />
                      <span>Contactar en LinkedIn</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECCIÓN 2: MENTORES Y PROFESIONALES TRABAJANDO EN EL SECTOR */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-2">
                <span>💼 Mentores y Profesionales Trabajando en el Sector</span>
                <span className="text-xs px-3 py-1 bg-white/20 rounded-full font-bold text-white">
                  {filteredProfessionals.length} disponibles
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filteredProfessionals.map((pro) => (
                <div key={pro.id} className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 flex flex-col justify-between hover:shadow-2xl transition-all space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={pro.avatar} alt={pro.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-600 shadow-sm" />
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">{pro.name}</h4>
                        <p className="text-xs font-bold text-emerald-800">{pro.currentRole}</p>
                        <p className="text-[11px] font-semibold text-slate-600">🏢 {pro.company}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs">
                      <p className="font-bold text-emerald-900 mb-1">🎓 Experiencia & Mentoria:</p>
                      <p className="text-slate-700 leading-relaxed">{pro.bio}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contactar para orientación:</p>
                    <div className="flex items-center justify-between p-2.5 bg-[#EAF2F6] rounded-xl text-xs">
                      <span className="font-medium text-[11px] truncate">✉️ {pro.email}</span>
                      <button onClick={() => handleCopy(pro.email, `pro-${pro.id}`)} className="p-1.5 bg-white text-[#2C5D71] rounded-lg shadow-xs cursor-pointer">
                        {copiedContact === `pro-${pro.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <a href={`https://${pro.linkedin}`} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 bg-[#2C5D71] hover:bg-[#1E4353] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer">
                      <Linkedin className="w-4 h-4" />
                      <span>Conectar en LinkedIn</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* MODAL HACER PREGUNTA / CREAR HILO EN FORO */}
      {showCreateForumModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-200 animate-fadeIn">
            
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-[#2C5D71]" />
                <h3 className="font-black text-slate-900 text-xl">Hacer una Pregunta o Abrir Debate</h3>
              </div>
              <button
                onClick={() => setShowCreateForumModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateForumSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Título de la Pregunta / Debate:
                </label>
                <input
                  type="text"
                  required
                  value={newForumTitle}
                  onChange={(e) => setNewForumTitle(e.target.value)}
                  placeholder="Ej. ¿Alguien sabe cómo preparar el portafolio para la vacante Trainee?"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#2C5D71]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Etiqueta / Tema:
                </label>
                <select
                  value={newForumTag}
                  onChange={(e) => setNewForumTag(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs focus:outline-none"
                >
                  <option value="#entrevistas-tech">#entrevistas-tech</option>
                  <option value="#estudios-y-prácticas">#estudios-y-prácticas</option>
                  <option value="#tesis-vs-examen">#tesis-vs-examen</option>
                  <option value="#consejo-carrera">#consejo-carrera</option>
                  <option value="#salud-y-estudio">#salud-y-estudio</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Contexto Detallado y Explicación:
                </label>
                <textarea
                  rows={4}
                  required
                  value={newForumContext}
                  onChange={(e) => setNewForumContext(e.target.value)}
                  placeholder="Escribe el trasfondo de tu pregunta, dudas específicas o lo que has intentado hasta el momento..."
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-300 text-slate-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#2C5D71] resize-none"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForumModal(false)}
                  className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2C5D71] hover:bg-[#1E4353] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Publicar Pregunta ✨
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL CREAR NUEVO GRUPO */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-200 animate-fadeIn">
            
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-[#2C5D71]" />
                <h3 className="font-black text-slate-900 text-xl">Crear Nuevo Grupo</h3>
              </div>
              <button
                onClick={() => setShowCreateGroupModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateGroupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nombre del Grupo / Comunidad:
                </label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Ej. Grupo de Estudio de Enfermería Pediátrica..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#2C5D71]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Área / Carrera:
                  </label>
                  <select
                    value={newGroupCategory}
                    onChange={(e) => setNewGroupCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs focus:outline-none"
                  >
                    <option value="Software / TI">Software / TI</option>
                    <option value="Arquitectura">Arquitectura</option>
                    <option value="Enfermería">Enfermería</option>
                    <option value="Derecho">Derecho</option>
                    <option value="General / Otras">General / Otras</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Modalidad:
                  </label>
                  <select
                    value={newGroupModality}
                    onChange={(e) => setNewGroupModality(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs focus:outline-none"
                  >
                    <option value="Virtual">Virtual (Online)</option>
                    <option value="Presencial">Presencial (Campus)</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Descripción de su Objetivo:
                </label>
                <textarea
                  rows={3}
                  required
                  value={newGroupObjective}
                  onChange={(e) => setNewGroupObjective(e.target.value)}
                  placeholder="Explica qué temas se estudiarán, horarios sugeridos y metas del grupo..."
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-300 text-slate-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#2C5D71] resize-none"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateGroupModal(false)}
                  className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2C5D71] hover:bg-[#1E4353] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Publicar y Crear Grupo ✨
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
