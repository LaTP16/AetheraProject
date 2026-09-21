import React, { useState } from 'react';
import { Search, Bell } from 'lucide-react';

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* LOGO UBUNTO */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 font-extrabold text-xl">
            U
          </div>
          <div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">Ubunto</span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-full">
              Acompañamiento 360°
            </span>
          </div>
        </div>

        {/* BUSCADOR GLOBAL */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar grupos de estudio, becas, recursos..."
              className="w-full pl-9 pr-12 py-2 text-sm bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl border border-transparent focus:border-emerald-500 focus:outline-none transition-all"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">⌘K</span>
          </div>
        </div>

        {/* ACCIONES Y PERFIL DE USUARIO */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl relative transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="font-bold text-sm text-slate-900">Notificaciones</span>
                  <span className="text-xs text-emerald-600 font-medium cursor-pointer">Marcar leídas</span>
                </div>
                <div className="space-y-3 mt-3">
                  <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100/50">
                    <p className="text-xs font-semibold text-slate-800">Cita de Orientación Confirmada</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Mañana a las 10:00 AM • Presencial</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900 leading-none">Mateo Benítez</p>
              <p className="text-[11px] text-slate-500 mt-1">Ing. de Sistemas • 7mo Semestre</p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
              alt="Avatar"
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/30"
            />
          </div>
        </div>

      </div>
    </header>
  );
}
