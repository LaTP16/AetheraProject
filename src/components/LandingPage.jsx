import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';

const LandingPage = ({ onLogin }) => {
  const [studentId, setStudentId] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
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
      <main className="relative z-10 w-full max-w-[1280px] mx-auto px-6 py-12 lg:py-24 flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* LEFT COLUMN: TEXT & CTA */}
        <div className="w-full lg:w-[55%] flex flex-col items-start gap-8">
          <h1 className="text-[54px] lg:text-[72px] font-bold text-[#0D2538] leading-[1.15] tracking-tight">
            <span className="text-[#1D63B8] block">El Sistema de</span>
            Acompañamiento<br />
            Estudiantil
          </h1>

          <p className="text-[18px] lg:text-[20px] font-normal text-[#333A42] leading-[1.6] max-w-[48ch]">
            LinkUP integra los perfiles académicos y de bienestar de Ciudad Aethera. Una red de prevención unificada para aprender, crecer y superar el estrés.
          </p>

          <form 
            onSubmit={handleLogin}
            className="w-full max-w-[500px] mt-2 flex flex-col sm:flex-row items-stretch gap-3"
          >
            <input 
              type="text" 
              placeholder="Ingrese ID de estudiante..." 
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="flex-1 bg-white border-2 border-slate-200 focus:border-[#1D63B8] outline-none text-[#0D2538] font-bold px-5 py-4 rounded-[2px] shadow-sm transition-colors"
            />
            <button 
              type="submit"
              className="group bg-[#F5B82E] hover:bg-[#e0a624] text-[#0D2538] font-bold text-[15px] px-6 py-4 rounded-[2px] flex items-center justify-center gap-4 transition-colors shadow-sm whitespace-nowrap"
            >
              <span>Ingresar</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          
          <p className="text-xs text-slate-400 mt-1">
            Tip: Haz clic en el ID <strong className="text-[#1D63B8] cursor-pointer" onClick={() => setStudentId('STU_AE_002288')}>STU_AE_002288</strong> para autocompletar e ingresar a la demostración.
          </p>
        </div>

        {/* RIGHT COLUMN: IMAGES */}
        <div className="w-full lg:w-[45%] flex justify-end relative">
          
          {/* Decorative Blueprint Square Background */}
          <div className="absolute -inset-4 bg-[#F5B82E]/10 border border-[#F5B82E]/30 rounded-xl -z-10 translate-x-4 translate-y-4"></div>
          <div className="absolute -inset-4 bg-[#1D63B8]/10 border border-[#1D63B8]/30 rounded-xl -z-10 -translate-x-4 -translate-y-4"></div>

          <div className="relative w-full max-w-[500px] h-[600px] rounded-xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100 flex items-center justify-center">
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
