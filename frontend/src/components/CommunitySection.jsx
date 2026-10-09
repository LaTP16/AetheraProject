import React, { useState } from 'react';
import { MessageSquare, Users, Share2, Heart, MessageCircle, Send, Search, Building2, Briefcase, Mail, Linkedin, UserCheck, Sparkles, Copy, Check, Plus, Code, Layers, Stethoscope, BookOpen, ShieldAlert, X, HelpCircle } from 'lucide-react';

export default function CommunitySection() {
  const [activeSubCategory, setActiveSubCategory] = useState('TODOS');
  
  // CONEXIÓN SEARCH STATE
  const [targetRole, setTargetRole] = useState('TODOS');
  const [targetCompany, setTargetCompany] = useState('TODOS');
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
      tagBg: 'bg-[#2A5C70] text-[#0D2538]',
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
      tagBg: 'bg-[#8B5CF6] text-[#0D2538]',
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
      tagBg: 'bg-[#059669] text-[#0D2538]',
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
      tagBg: 'bg-[#D97706] text-[#0D2538]',
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
      title: '¿Tienen tips para organizar los tiempos entre el trabajo de medio tiempo y clases?',
      context: 'Hola comunidad, quería ampliar algo que compartí en mi encuesta de bienestar (Testimonio D4): "Entre clases y trabajo he tratado de ordenar mis tiempos al combinar turnos laborales con clases. La presión baja cuando priorizo tareas realistas. Estoy probando pausas breves y un horario más realista." Quería saber si a alguien más le funciona esto o si usan alguna app en específico para los horarios y pausas.',
      tag: '#estudios-y-prácticas',
      author: 'Usuario Anónimo (D4)',
      role: 'Testimonio Real • Dataset 4',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      time: 'Hace 2 horas',
      answers: [
        {
          id: 101,
          author: 'Andrea Silva',
          role: 'Estudiante de Sistemas',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
          time: 'Hace 45 min',
          content: 'A mí me pasaba igual. Las "pausas breves" que mencionas son la técnica Pomodoro. Yo uso la app Forest y me ayuda a no tocar el celular mientras hago tareas. Y para horarios realistas, Notion es tu mejor amigo.'
        }
      ]
    },
    {
      id: 2,
      title: 'Responsabilidades familiares y estudio (¿Qué servicios de la universidad existen para esto?)',
      context: 'Chicos, dejé este comentario en el buzón universitario (Testimonio D4): "He estado probando formas más saludables de estudiar cuando tengo muchas responsabilidades familiares. No siempre sé a qué servicio acudir." ¿Alguien sabe si el área de bienestar (Dataset 2) ofrece flexibilidad de horarios o si hay consejería familiar gratuita en el campus?',
      tag: '#salud-y-estudio',
      author: 'Usuario Anónimo (D4)',
      role: 'Testimonio Real • Dataset 4',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      time: 'Hace 5 horas',
      answers: [
        {
          id: 201,
          author: 'Dra. Elena Vargas',
          role: 'Coordinadora de Bienestar Estudiantil',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
          time: 'Hace 3 horas',
          content: '¡Hola! Qué bueno que lo compartes. Sí contamos con el servicio de "Soporte Social" (verificado en el Dataset 2 de servicios). Puedes sacar cita a través de la sección de Bienestar de LinkUP. Ellos pueden emitir un certificado para los profesores solicitando flexibilidad justificada.'
        }
      ]
    },
    {
      id: 3,
      title: 'Bajón emocional por notas bajas (Lidiando con el síndrome del impostor)',
      context: 'Les comparto mi testimonio anónimo (Dataset 4): "He estado probando formas más saludables de estudiar cuando una nota baja afecta mi confianza. No siempre sé a qué servicio acudir. Estoy probando pausas breves y un horario más realista." A veces una mala nota en parciales me tumba la confianza para el resto del ciclo. ¿Alguien ha llevado terapia psicológica con la red de la universidad?',
      tag: '#consejo-carrera',
      author: 'Usuario Anónimo (D4)',
      role: 'Testimonio Real • Dataset 4',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      time: 'Hace 1 día',
      answers: [
        {
          id: 301,
          author: 'Carlos Gutiérrez',
          role: 'Lead Software Architect',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
          time: 'Hace 18 horas',
          content: 'Es normal que una nota afecte, yo jalé mi primer curso de programación y ahora soy Arquitecto de Software. Lo de las pausas breves es clave. Sobre el psicólogo, en LinkUP en la pestaña Bienestar puedes pedir cita virtual, aunque a veces demoran unos 15 días (como vimos en el D2), te sugiero sacarla con anticipación en épocas de exámenes.'
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
    },
    {
      id: 4,
      name: 'Esteban Morales',
      role: 'Tech Talent Sourcer',
      company: 'Rappi',
      specialty: 'Desarrolladores Fullstack, React, Node.js & Mobile',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
      email: 'esteban.morales@rappi.com',
      linkedin: 'linkedin.com/in/estebanmorales-talent'
    },
    {
      id: 5,
      name: 'Luciana Alarcón',
      role: 'HR Business Partner',
      company: 'NovaTech Solutions',
      specialty: 'Diseñadores UX/UI, Product Managers & UX Research',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      email: 'luciana.a@novatech.io',
      linkedin: 'linkedin.com/in/lucianaalarcon-hr'
    },
    {
      id: 6,
      name: 'Gabriel Sotomayor',
      role: 'People & Culture Lead',
      company: 'Aethera Systems',
      specialty: 'DevOps & Cloud Engineers, Ciberseguridad & Infraestructura',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      email: 'gabriel.s@aetherasystems.com',
      linkedin: 'linkedin.com/in/gabrielsotomayor-people'
    },
    {
      id: 7,
      name: 'Dra. Patricia Paredes',
      role: 'Head of Clinical Recruitment',
      company: 'Hospital Central Gaia',
      specialty: 'Enfermería Especializada, Salud Pública & Gestión Médica',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150',
      email: 'p.paredes@hospitalgaia.org',
      linkedin: 'linkedin.com/in/patriciaparedes-salud'
    },
    {
      id: 8,
      name: 'Dr. Fernando Vidal',
      role: 'Socio Director de Talentos Legal',
      company: 'Estudio Jurídico Aethera',
      specialty: 'Abogados Junior, Litigio Corporativo & Derecho Marítimo',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
      email: 'fvidal@aetheralaw.com',
      linkedin: 'linkedin.com/in/fernandovidal-legal'
    }
  ];

  const workingProfessionalsData = [
    {
      id: 101,
      name: 'Carlos Gutiérrez',
      currentRole: 'Lead Software Architect',
      company: 'Globant',
      experience: '4 años en el puesto • Ex-alumno Universidad Aethera',
      bio: 'Apasionado por apoyar a nuevos talentos en diseño de sistemas distribuidos y preparación de entrevistas técnicas.',
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
    },
    {
      id: 104,
      name: 'Elena Bustamante',
      currentRole: 'Senior Data Scientist & AI Lead',
      company: 'Google',
      experience: '4 años de experiencia • Ex-alumna Aethera',
      bio: 'Especialista en Machine Learning y Big Data. Ofrezco retroalimentación de proyectos analíticos y portfolio.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
      email: 'elena.bustamante@google.com',
      linkedin: 'linkedin.com/in/elenabustamante-ds'
    },
    {
      id: 105,
      name: 'Mateo Rivas',
      currentRole: 'Diseñador UX/UI Lead',
      company: 'NovaTech Solutions',
      experience: '3 años de experiencia',
      bio: 'Revisión de portafolios en Figma, pruebas de usabilidad y orientación sobre cómo ingresar al mundo UX.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      email: 'mrivas.ux@novatech.io',
      linkedin: 'linkedin.com/in/mateorivas-ux'
    },
    {
      id: 106,
      name: 'Kevin Salazar',
      currentRole: 'DevOps & Cloud Engineer Senior',
      company: 'Aethera Systems',
      experience: '6 años de experiencia',
      bio: 'Asesoría en CI/CD, Docker, Kubernetes y preparación para certificaciones AWS y Terraform.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
      email: 'ksalazar@aetherasystems.com',
      linkedin: 'linkedin.com/in/kevinsalazar-devops'
    },
    {
      id: 107,
      name: 'Lic. Carmen Espinoza',
      currentRole: 'Enfermera Lead en UCI & Salud Pública',
      company: 'Hospital Central Gaia',
      experience: '7 años de experiencia • Mentora Académica',
      bio: 'Te oriento sobre rotaciones de internado, ética médica y preparación para oposiciones y SERUMS.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
      email: 'cespinoza@hospitalgaia.org',
      linkedin: 'linkedin.com/in/carmenespinoza-salud'
    },
    {
      id: 108,
      name: 'Abog. Ricardo Palma',
      currentRole: 'Abogado Corporativo & Senior Legal Specialist',
      company: 'Estudio Jurídico Aethera',
      experience: '5 años de experiencia • Licenciado con honores',
      bio: 'Orientación en redacción de contratos, sustentación de tesis en Derecho y preparación para entrevistas jurídicas.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      email: 'rpalma@aetheralaw.com',
      linkedin: 'linkedin.com/in/ricardopalma-law'
    }
  ];

  const topCards = [
    { id: 'Foros', title: 'Foros', icon: MessageSquare, description: 'Preguntas, contexto y respuestas comunitarias', color: 'bg-white border border-slate-200', hoverColor: 'hover:border-blue-500/40 hover:bg-slate-100/60' },
    { id: 'Grupos', title: 'Grupos', icon: Users, description: 'Comunidades por carrera y creación de grupos', color: 'bg-white border border-slate-200', hoverColor: 'hover:border-blue-500/40 hover:bg-slate-100/60' },
    { id: 'Conexión', title: 'Conexión', icon: Share2, description: 'Contacto con Reclutadores y Mentores Profesionales', color: 'bg-white border border-slate-200', hoverColor: 'hover:border-blue-500/40 hover:bg-slate-100/60' },
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
      tagBg: 'bg-[#2C5D71] text-[#0D2538]',
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
    const roleMatch = targetRole === 'TODOS' || 
      r.role.toLowerCase().includes(targetRole.toLowerCase()) || 
      r.specialty.toLowerCase().includes(targetRole.toLowerCase()) ||
      (targetRole === 'Arquitecto de Software' && (r.specialty.includes('Arquitectura') || r.role.includes('Tech'))) ||
      (targetRole === 'Data Analyst / Data Scientist' && (r.specialty.includes('Data') || r.role.includes('Data'))) ||
      (targetRole === 'Desarrollador Fullstack / Backend' && (r.specialty.includes('Backend') || r.specialty.includes('Fullstack'))) ||
      (targetRole === 'Diseñador UX/UI' && (r.specialty.includes('UX') || r.role.includes('UX'))) ||
      (targetRole === 'DevOps & Cloud Engineer' && (r.specialty.includes('DevOps') || r.specialty.includes('Cloud'))) ||
      (targetRole === 'Enfermería & Salud' && (r.specialty.includes('Enfermería') || r.role.includes('Clinical'))) ||
      (targetRole === 'Derecho & Legal' && (r.specialty.includes('Legal') || r.specialty.includes('Abogados')));
      
    const companyMatch = targetCompany === 'TODOS' || r.company.toLowerCase().includes(targetCompany.toLowerCase());
    return roleMatch && companyMatch;
  });

  const filteredProfessionals = workingProfessionalsData.filter(p => {
    const roleMatch = targetRole === 'TODOS' || 
      p.currentRole.toLowerCase().includes(targetRole.toLowerCase()) || 
      p.bio.toLowerCase().includes(targetRole.toLowerCase()) ||
      (targetRole === 'Arquitecto de Software' && (p.currentRole.includes('Architect') || p.currentRole.includes('Arquitectura'))) ||
      (targetRole === 'Data Analyst / Data Scientist' && (p.currentRole.includes('Data') || p.bio.includes('Data'))) ||
      (targetRole === 'Desarrollador Fullstack / Backend' && (p.currentRole.includes('Frontend') || p.bio.includes('React'))) ||
      (targetRole === 'Diseñador UX/UI' && (p.currentRole.includes('UX') || p.bio.includes('Figma'))) ||
      (targetRole === 'DevOps & Cloud Engineer' && (p.currentRole.includes('Cloud') || p.currentRole.includes('DevOps'))) ||
      (targetRole === 'Enfermería & Salud' && (p.currentRole.includes('Enfermera') || p.bio.includes('internado'))) ||
      (targetRole === 'Derecho & Legal' && (p.currentRole.includes('Abogado') || p.bio.includes('Derecho')));

    const companyMatch = targetCompany === 'TODOS' || p.company.toLowerCase().includes(targetCompany.toLowerCase());
    return roleMatch && companyMatch;
  });

  const filteredGroups = groupCategoryFilter === 'TODOS'
    ? groupsList
    : groupsList.filter(g => g.category === groupCategoryFilter);

  return (
    <div className="flex-1 p-6 sm:p-8 max-w-6xl mx-auto w-full space-y-8 animate-fadeIn">
      
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-wider">
          COMUNIDAD
        </h1>
        <p className="text-[#4A5568] text-sm sm:text-base font-medium mt-1">
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
              className={`${card.color} ${card.hoverColor} bg-white backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 cursor-pointer transition-all transform hover:-translate-y-1 text-black flex flex-col items-start justify-between min-h-[160px] group ${
                isSelected ? 'ring-2 ring-[#F97316] bg-orange-50 shadow-md' : 'bg-white'
              }`}
            >
              <div className="p-3 bg-[#1D63B8]/10 border border-blue-500/30 text-[#1D63B8] rounded-2xl shadow-md group-hover:scale-110 transition-transform">
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-extrabold text-2xl text-[#0D2538] mt-4 tracking-tight">{card.title}</h3>
                <p className="text-xs text-[#4A5568] font-medium mt-1">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ==================== VISTA ESPECIALIZADA: FOROS ==================== */}
      {(activeSubCategory === 'Foros' || activeSubCategory === 'TODOS') && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* HEADER DE FOROS & BOTÓN CREAR PREGUNTA */}
          <div className="bg-white backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-[#1D63B8]" />
                <h2 className="text-2xl font-black text-[#0D2538]">
                  Foro de Preguntas & Debates
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#4A5568] font-medium mt-1">
                Haz tus preguntas con contexto detallado y recibe respuestas e ideas útiles de tus compañeros y mentores.
              </p>
            </div>

            <button
              onClick={() => setShowCreateForumModal(true)}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-[#0D2538] font-bold text-xs sm:text-sm rounded-2xl shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-2 shrink-0 transition-all active:scale-95 cursor-pointer"
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
                className="bg-white backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-5 hover:border-blue-500/30 transition-all"
              >
                
                {/* THREAD HEADER & QUESTION */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={thread.avatar}
                        alt={thread.author}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="font-extrabold text-xs text-[#0D2538]">{thread.author}</h4>
                        <p className="text-[10px] text-[#4A5568]">{thread.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold px-3 py-1 rounded-full uppercase bg-[#1D63B8]/10 border border-blue-500/30 text-[#1D63B8]">
                        {thread.tag}
                      </span>
                      <span className="text-xs text-slate-500">{thread.time}</span>
                    </div>
                  </div>

                  {/* PREGUNTA PRINCIPAL / TITULO */}
                  <h3 className="font-black text-[#0D2538] text-lg sm:text-xl leading-snug">
                    {thread.title}
                  </h3>

                  {/* CONTEXTO DETALLADO */}
                  <div className="p-4 bg-[#F8F7F4] rounded-2xl border border-slate-200 text-xs sm:text-sm text-[#333A42] leading-relaxed space-y-1">
                    <p className="font-bold text-[#1D63B8]">Contexto de la duda:</p>
                    <p>{thread.context}</p>
                  </div>
                </div>

                {/* RESPUESTAS / HILO DE APORTES */}
                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#1D63B8]">
                    <MessageSquare className="w-4 h-4 text-[#1D63B8]" />
                    <span>{thread.answers.length} Respuestas y Aportes:</span>
                  </div>

                  {/* LISTA DE RESPUESTAS */}
                  <div className="space-y-3">
                    {thread.answers.map((answer) => (
                      <div
                        key={answer.id}
                        className="p-4 bg-slate-100/60 rounded-2xl border border-slate-200 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={answer.avatar}
                            alt={answer.author}
                            className="w-7 h-7 rounded-full object-cover border border-blue-500/40"
                          />
                          <span className="font-extrabold text-xs text-[#0D2538]">{answer.author}</span>
                          <span className="text-[10px] text-[#4A5568]">• {answer.role}</span>
                          <span className="text-[10px] text-slate-500 ml-auto">{answer.time}</span>
                        </div>

                        <p className="text-xs text-[#333A42] font-medium leading-relaxed pl-9">
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
                      className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-100/80 border border-slate-200 text-[#0D2538] placeholder-slate-500 font-medium focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => handleAddForumReply(thread.id)}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-[#0D2538] font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
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
          <div className="bg-white backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-[#1D63B8]" />
                <h2 className="text-2xl font-black text-[#0D2538]">
                  Comunidades & Grupos Estudiantiles
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#4A5568] font-medium mt-1">
                Explora grupos de estudio por carreras (Software, Arquitectura, Enfermería, etc.) o crea tu propio grupo para coordinar con compañeros.
              </p>
            </div>

            <button
              onClick={() => setShowCreateGroupModal(true)}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-[#0D2538] font-bold text-xs sm:text-sm rounded-2xl shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-2 shrink-0 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Crear Nuevo Grupo</span>
            </button>
          </div>

          {/* CHIPS DE FILTRO POR CARRERA */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-[#4A5568] uppercase tracking-wider mr-2">Filtrar área:</span>
            {['TODOS', 'Software / TI', 'Arquitectura', 'Enfermería', 'Derecho'].map((cat) => (
              <button
                key={cat}
                onClick={() => setGroupCategoryFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  groupCategoryFilter === cat
                    ? 'bg-blue-600 text-[#0D2538] shadow-md border border-blue-400/40'
                    : 'bg-white border border-slate-200 text-[#4A5568] hover:bg-slate-100/60 hover:text-[#0D2538]'
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
                className="bg-white backdrop-blur-md rounded-3xl p-6 shadow-xl border border-slate-200 flex flex-col justify-between hover:border-blue-500/30 transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider bg-[#1D63B8]/10 border border-blue-500/30 text-[#1D63B8]">
                      {group.category}
                    </span>
                    <span className="text-xs font-semibold text-[#4A5568] bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                      👥 {group.membersCount} miembros
                    </span>
                  </div>

                  <h3 className="font-extrabold text-[#0D2538] text-lg leading-snug">
                    {group.name}
                  </h3>

                  <div className="p-3.5 bg-[#F8F7F4] rounded-2xl border border-slate-200 text-xs space-y-1">
                    <p className="font-bold text-[#1D63B8]">🎯 Objetivo del grupo:</p>
                    <p className="text-[#333A42] leading-relaxed">{group.objective}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#4A5568]">Modalidad: <span className="text-[#1D63B8]">{group.modality}</span></p>
                    {group.creator && <p className="text-[10px] text-slate-500">Creado por: {group.creator}</p>}
                  </div>

                  <button
                    onClick={() => handleToggleJoinGroup(group.id)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${
                      group.joined
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-[#0D2538]'
                        : 'bg-blue-600 hover:bg-blue-500 text-[#0D2538]'
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
          <div className="bg-white backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <Sparkles className="w-6 h-6 text-[#1D63B8]" />
              <h2 className="text-xl sm:text-2xl font-black text-[#0D2538]">
                Red de Conexión Laboral & Mentores
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#4A5568] font-medium">
              Ingresa el puesto al que aspiras y las empresas donde planeas trabajar. LinkUP te conectará directamente con reclutadores activos y profesionales/mentores trabajando en esa área.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#1D63B8] uppercase tracking-wider mb-1">
                  🎯 Puesto al que aspiras (Filtro por Rol):
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3.5 top-3.5 text-[#1D63B8] z-10 pointer-events-none" />
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100/90 text-[#0D2538] font-semibold text-sm border border-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
                  >
                    <option value="TODOS">✨ Todos los Puestos y Áreas</option>
                    <option value="Arquitecto de Software">💻 Arquitecto de Software</option>
                    <option value="Data Analyst / Data Scientist">📊 Data Analyst / Data Scientist</option>
                    <option value="Desarrollador Fullstack / Backend">⚡ Desarrollador Fullstack / Backend</option>
                    <option value="Diseñador UX/UI">🎨 Diseñador UX/UI</option>
                    <option value="DevOps & Cloud Engineer">☁️ DevOps & Cloud Engineer</option>
                    <option value="Enfermería & Salud">🩺 Enfermería & Salud</option>
                    <option value="Derecho & Legal">⚖️ Derecho & Legal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1D63B8] uppercase tracking-wider mb-1">
                  🏢 Empresa donde planeas trabajar (Filtro por Empresa):
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-3.5 text-[#1D63B8] z-10 pointer-events-none" />
                  <select
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100/90 text-[#0D2538] font-semibold text-sm border border-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
                  >
                    <option value="TODOS">✨ Todas las Empresas</option>
                    <option value="Globant">🏢 Globant</option>
                    <option value="BBVA">🏦 BBVA</option>
                    <option value="Google">🌐 Google</option>
                    <option value="Rappi">🚀 Rappi</option>
                    <option value="NovaTech Solutions">💡 NovaTech Solutions</option>
                    <option value="Aethera Systems">⚡ Aethera Systems</option>
                    <option value="Hospital Central Gaia">🏥 Hospital Central Gaia</option>
                    <option value="Estudio Jurídico Aethera">⚖️ Estudio Jurídico Aethera</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* SECCIÓN 1: RECLUTADORES PARA EL PUESTO */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl sm:text-2xl font-black text-[#0D2538] tracking-wide flex items-center gap-2">
                <span>👔 Reclutadores para el puesto</span>
                <span className="text-xs px-3 py-1 bg-slate-100 border border-slate-200 rounded-full font-bold text-[#1D63B8]">
                  {filteredRecruiters.length} encontrados
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filteredRecruiters.map((recruiter) => (
                <div key={recruiter.id} className="bg-white backdrop-blur-md rounded-3xl p-6 shadow-xl border border-slate-200 flex flex-col justify-between hover:border-blue-500/30 transition-all space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={recruiter.avatar} alt={recruiter.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500 shadow-sm" />
                      <div>
                        <h4 className="font-extrabold text-[#0D2538] text-base">{recruiter.name} <span className="text-[#1D63B8] text-xs">✓</span></h4>
                        <p className="text-xs font-bold text-[#1D63B8]">{recruiter.role}</p>
                        <p className="text-[11px] font-semibold text-[#4A5568]">🏢 {recruiter.company}</p>
                      </div>
                    </div>
                    <div className="p-3 bg-[#F8F7F4] rounded-2xl border border-slate-200 text-xs">
                      <span className="font-bold text-[#333A42]">Especialidad: </span>
                      <span className="text-[#4A5568]">{recruiter.specialty}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contacto directo:</p>
                    <div className="flex items-center justify-between p-2.5 bg-slate-100/80 rounded-xl text-xs border border-slate-200">
                      <span className="font-medium text-[11px] truncate text-[#333A42]">✉️ {recruiter.email}</span>
                      <button onClick={() => handleCopy(recruiter.email, `rec-${recruiter.id}`)} className="p-1.5 bg-slate-700 hover:bg-slate-600 text-[#1D63B8] rounded-lg cursor-pointer">
                        {copiedContact === `rec-${recruiter.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <a href={`https://${recruiter.linkedin}`} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 bg-[#0077B5] hover:bg-[#005E93] text-[#0D2538] font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer">
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
              <h3 className="text-xl sm:text-2xl font-black text-[#0D2538] tracking-wide flex items-center gap-2">
                <span>💼 Mentores y Profesionales Trabajando en el Sector</span>
                <span className="text-xs px-3 py-1 bg-slate-100 border border-slate-200 rounded-full font-bold text-emerald-400">
                  {filteredProfessionals.length} disponibles
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filteredProfessionals.map((pro) => (
                <div key={pro.id} className="bg-white backdrop-blur-md rounded-3xl p-6 shadow-xl border border-slate-200 flex flex-col justify-between hover:border-emerald-500/30 transition-all space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={pro.avatar} alt={pro.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm" />
                      <div>
                        <h4 className="font-extrabold text-[#0D2538] text-base">{pro.name}</h4>
                        <p className="text-xs font-bold text-emerald-400">{pro.currentRole}</p>
                        <p className="text-[11px] font-semibold text-[#4A5568]">🏢 {pro.company}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-[#F8F7F4] rounded-2xl border border-slate-200 text-xs">
                      <p className="font-bold text-emerald-400 mb-1">🎓 Experiencia & Mentoría:</p>
                      <p className="text-[#333A42] leading-relaxed">{pro.bio}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contactar para orientación:</p>
                    <div className="flex items-center justify-between p-2.5 bg-slate-100/80 rounded-xl text-xs border border-slate-200">
                      <span className="font-medium text-[11px] truncate text-[#333A42]">✉️ {pro.email}</span>
                      <button onClick={() => handleCopy(pro.email, `pro-${pro.id}`)} className="p-1.5 bg-slate-700 hover:bg-slate-600 text-[#1D63B8] rounded-lg cursor-pointer">
                        {copiedContact === `pro-${pro.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <a href={`https://${pro.linkedin}`} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-[#0D2538] font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer">
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
        <div className="fixed inset-0 z-50 bg-slate-800/50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 text-[#333A42] animate-fadeIn">
            
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-[#1D63B8]" />
                <h3 className="font-black text-[#0D2538] text-xl">Hacer una Pregunta o Abrir Debate</h3>
              </div>
              <button
                onClick={() => setShowCreateForumModal(false)}
                className="text-[#4A5568] hover:text-[#0D2538] font-bold p-1 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateForumSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#333A42] uppercase tracking-wider mb-1">
                  Título de la Pregunta / Debate:
                </label>
                <input
                  type="text"
                  required
                  value={newForumTitle}
                  onChange={(e) => setNewForumTitle(e.target.value)}
                  placeholder="Ej. ¿Alguien sabe cómo preparar el portafolio para la vacante Trainee?"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-[#0D2538] font-semibold text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#333A42] uppercase tracking-wider mb-1">
                  Etiqueta / Tema:
                </label>
                <select
                  value={newForumTag}
                  onChange={(e) => setNewForumTag(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-[#0D2538] font-bold text-xs focus:outline-none"
                >
                  <option value="#entrevistas-tech">#entrevistas-tech</option>
                  <option value="#estudios-y-prácticas">#estudios-y-prácticas</option>
                  <option value="#tesis-vs-examen">#tesis-vs-examen</option>
                  <option value="#consejo-carrera">#consejo-carrera</option>
                  <option value="#salud-y-estudio">#salud-y-estudio</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#333A42] uppercase tracking-wider mb-1">
                  Contexto Detallado y Explicación:
                </label>
                <textarea
                  rows={4}
                  required
                  value={newForumContext}
                  onChange={(e) => setNewForumContext(e.target.value)}
                  placeholder="Escribe el trasfondo de tu pregunta, dudas específicas o lo que has intentado hasta el momento..."
                  className="w-full p-4 rounded-2xl bg-slate-100 border border-slate-200 text-[#0D2538] font-medium text-sm focus:outline-none focus:border-blue-500 resize-none"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForumModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-700 text-[#333A42] font-bold text-xs rounded-xl border border-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-[#0D2538] font-bold text-xs rounded-xl shadow-md cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-slate-800/50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 text-[#333A42] animate-fadeIn">
            
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-[#1D63B8]" />
                <h3 className="font-black text-[#0D2538] text-xl">Crear Nuevo Grupo</h3>
              </div>
              <button
                onClick={() => setShowCreateGroupModal(false)}
                className="text-[#4A5568] hover:text-[#0D2538] font-bold p-1 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateGroupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#333A42] uppercase tracking-wider mb-1">
                  Nombre del Grupo / Comunidad:
                </label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Ej. Grupo de Estudio de Enfermería Pediátrica..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-[#0D2538] font-semibold text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#333A42] uppercase tracking-wider mb-1">
                    Área / Carrera:
                  </label>
                  <select
                    value={newGroupCategory}
                    onChange={(e) => setNewGroupCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-[#0D2538] font-bold text-xs focus:outline-none"
                  >
                    <option value="Software / TI">Software / TI</option>
                    <option value="Arquitectura">Arquitectura</option>
                    <option value="Enfermería">Enfermería</option>
                    <option value="Derecho">Derecho</option>
                    <option value="General / Otras">General / Otras</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#333A42] uppercase tracking-wider mb-1">
                    Modalidad:
                  </label>
                  <select
                    value={newGroupModality}
                    onChange={(e) => setNewGroupModality(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-[#0D2538] font-bold text-xs focus:outline-none"
                  >
                    <option value="Virtual">Virtual (Online)</option>
                    <option value="Presencial">Presencial (Campus)</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#333A42] uppercase tracking-wider mb-1">
                  Descripción de su Objetivo:
                </label>
                <textarea
                  rows={3}
                  required
                  value={newGroupObjective}
                  onChange={(e) => setNewGroupObjective(e.target.value)}
                  placeholder="Explica qué temas se estudiarán, horarios sugeridos y metas del grupo..."
                  className="w-full p-4 rounded-2xl bg-slate-100 border border-slate-200 text-[#0D2538] font-medium text-sm focus:outline-none focus:border-blue-500 resize-none"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateGroupModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-700 text-[#333A42] font-bold text-xs rounded-xl border border-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-[#0D2538] font-bold text-xs rounded-xl shadow-md cursor-pointer"
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
