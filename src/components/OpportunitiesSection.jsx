import React, { useState } from 'react';
import { Target, Home, Users, Heart, Video, Edit3, Sparkles } from 'lucide-react';

export default function OpportunitiesSection() {
  const [selectedCategory, setSelectedCategory] = useState('Mercado Laboral');
  const [promptText, setPromptText] = useState('Me gustaria encontrar empleo como Arquitecto de software nivel principiante con salario esperado de 2000 soles');
  const [isConsulting, setIsConsulting] = useState(false);

  // Parse prompt info or defaults matching the wireframe
  const specialty = 'Arquitecto de software';
  const level = 'principiante';
  const expectedSalary = '2000 soles';

  const categories = [
    { id: 'Mercado Laboral', label: 'Mercado Laboral', count: 1, color: 'bg-[#FAD02C]', textColor: 'text-slate-900', icon: Target },
    { id: 'Becas', label: 'Becas', count: 2, color: 'bg-[#E7CFB4]', textColor: 'text-slate-900', icon: Home },
    { id: 'Intercambios', label: 'Intercambios', count: 5, color: 'bg-[#CBB6EC]', textColor: 'text-slate-900', icon: Users },
    { id: 'Concursos', label: 'Concursos', count: 3, color: 'bg-[#4F73FF]', textColor: 'text-white', icon: Heart },
    { id: 'Seminarios', label: 'Seminarios', count: 7, color: 'bg-[#00D061]', textColor: 'text-white', icon: Video },
    { id: 'Voluntariados', label: 'Voluntariados', count: 5, color: 'bg-[#4ED4E6]', textColor: 'text-slate-900', icon: Edit3 },
  ];

  const opportunitiesData = {
    'Mercado Laboral': [
      {
        id: 1,
        title: 'Desarrollador Junior / Arquitecto de Software Trainee',
        company: 'NovaTech Solutions',
        modality: 'Remoto',
        salary: '2,000 S/',
        description: 'Desarrollo de microservicios, diseño de diagramas UML y bases de datos SQL.'
      }
    ],
    'Becas': [
      {
        id: 2,
        title: 'Beca Talento Tech Aethera 2026',
        company: 'Fundación Aethera',
        modality: 'Presencial / Híbrido',
        salary: 'Cobertura 80%',
        description: 'Financiamiento parcial para cursos de arquitectura de software y cloud.'
      },
      {
        id: 3,
        title: 'Beca Formación Profesional en TI',
        company: 'Global Tech Institute',
        modality: 'Virtual',
        salary: 'Cobertura 100%',
        description: 'Programa de capacitación intensiva en desarrollo y sistemas.'
      }
    ],
    'Intercambios': [
      {
        id: 4,
        title: 'Programa de Intercambio Académico 2026',
        company: 'Universidad de Santiago',
        modality: 'Semestral',
        salary: 'Subvencionado',
        description: 'Semestre de intercambio académico en ciencias de la computación.'
      },
      {
        id: 5,
        title: 'Pasantía Internacional de Verano',
        company: 'TechLab Latinoamérica',
        modality: 'Remoto',
        salary: 'Estipendio mensual',
        description: 'Experiencia práctica con equipos multiculturales de tecnología.'
      }
    ],
    'Concursos': [
      {
        id: 6,
        title: 'Hackathon Nacional de Arquitectura de Software',
        company: 'LinkUP Tech',
        modality: 'Virtual 48h',
        salary: 'Premios 10,000 S/',
        description: 'Diseña la solución de arquitectura más eficiente y escalable.'
      }
    ],
    'Seminarios': [
      {
        id: 7,
        title: 'Seminario: Fundamentos de Arquitectura de Software',
        company: 'Comunidad Tech',
        modality: 'Online en vivo',
        salary: 'Gratuito',
        description: 'Patrones de arquitectura de software para principiantes e intermedios.'
      }
    ],
    'Voluntariados': [
      {
        id: 8,
        title: 'Mentoría y Apoyo Técnico Estudiantil',
        company: 'Voluntarios LinkUP',
        modality: 'Remoto',
        salary: 'Certificado',
        description: 'Apoya a estudiantes de primeros ciclos en proyectos informáticos.'
      }
    ]
  };

  const handleConsult = () => {
    setIsConsulting(true);
    setTimeout(() => {
      setIsConsulting(false);
    }, 600);
  };

  return (
    <div className="flex-1 p-6 sm:p-8 max-w-6xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT & CENTER COLUMN (TOP PROMPT + MAIN AI RESPONSE BOX) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* TOP PROMPT BOX */}
          <div className="bg-[#CBDDE6] rounded-3xl p-6 shadow-xl border border-white/40 text-center space-y-3">
            <h2 className="font-bold text-[#1F4555] text-base sm:text-lg">
              Prompt Para Ingrese Especialidad
            </h2>
            <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider">
              Me gustaría encontrar:
            </p>
            <div className="relative max-w-2xl mx-auto">
              <textarea
                rows="2"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Escribe aquí lo que te gustaría encontrar..."
                className="w-full p-4 rounded-2xl bg-[#EAF2F6] text-slate-800 placeholder-slate-400 font-medium text-sm text-center border border-slate-300 shadow-inner focus:outline-none focus:border-[#2C5D71]"
              ></textarea>
              <button
                onClick={handleConsult}
                disabled={isConsulting}
                className="mt-2 px-6 py-2 bg-[#2C5D71] hover:bg-[#1E4353] text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {isConsulting ? 'Consultando IA...' : 'Consultar a la IA'}
              </button>
            </div>
          </div>

          {/* CENTRAL MAIN AI RESPONSE BOX */}
          <div className="bg-[#CBDDE6] rounded-3xl p-6 sm:p-8 shadow-xl border border-white/40 min-h-[360px] flex flex-col justify-between">
            <div className="space-y-5">
              
              {/* AI Header Metadata Box */}
              <div className="bg-[#EAF2F6] p-5 rounded-2xl border border-slate-300/80 text-center shadow-inner space-y-1">
                <h3 className="font-extrabold text-[#1F4555] text-base sm:text-lg">
                  Respuesta de la IA por categorias:
                </h3>
                <div className="text-xs sm:text-sm font-semibold text-slate-700 space-y-1 pt-1">
                  <p><span className="text-[#1F4555]">Espcialidad:</span> {specialty}</p>
                  <p><span className="text-[#1F4555]">Nivel:</span> {level}</p>
                  <p><span className="text-[#1F4555]">Salario Esperado:</span> {expectedSalary}</p>
                </div>
              </div>

              {/* Active Category Title */}
              <div className="flex items-center justify-between px-2">
                <span className="font-bold text-slate-900 text-sm">
                  Categoría seleccionada: <span className="text-[#2C5D71] underline">{selectedCategory}</span>
                </span>
                <span className="text-xs font-semibold text-slate-600 bg-white/70 px-3 py-1 rounded-full border border-slate-200">
                  {opportunitiesData[selectedCategory]?.length || 0} disponibles
                </span>
              </div>

              {/* Opportunities Items List */}
              <div className="space-y-3">
                {opportunitiesData[selectedCategory]?.map((item) => (
                  <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">{item.title}</h4>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg shrink-0">
                        {item.salary}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-500">
                      {item.company} • {item.modality}
                    </p>
                    <p className="text-xs text-slate-700 leading-relaxed pt-1">
                      {item.description}
                    </p>
                    <div className="pt-2 flex justify-end">
                      <button className="px-4 py-1.5 bg-[#2C5D71] hover:bg-[#1E4353] text-white text-xs font-bold rounded-xl shadow-xs transition-colors">
                        Postular / Ver detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            <div className="mt-6 pt-4 border-t border-slate-300/60 flex items-center justify-between text-xs text-slate-600">
              <span>Orientación personalizada de LinkUP IA</span>
              <span className="font-bold text-[#2C5D71]">Filtro activo</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN CATEGORY BUTTONS WITH RED BADGES */}
        <div className="lg:col-span-4 space-y-3.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full ${cat.color} ${cat.textColor} p-4 sm:p-4.5 rounded-2xl shadow-lg border-2 border-white/50 flex items-center justify-between transition-all transform hover:-translate-y-0.5 cursor-pointer ${
                  isSelected ? 'ring-4 ring-white/80 scale-[1.02]' : 'opacity-90 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 bg-black/10 rounded-xl">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="font-extrabold text-sm sm:text-base tracking-wide">{cat.label}</span>
                </div>

                {/* RED COUNTER BADGE */}
                <div className="w-7 h-7 rounded-full bg-red-600 text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-md shrink-0">
                  {cat.count}
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
