import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Trash2, Edit2, 
  CheckCircle2, Circle, Clock, Sparkles, BookOpen, Heart, Target, Users, AlertCircle, 
  X, Check, LayoutGrid, CalendarDays, Bookmark, ShieldCheck, Info
} from 'lucide-react';
import { D7_EVENTS } from '../data/d7Events';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const TYPE_CONFIG = {
  study: { label: 'Estudio IA', color: 'bg-purple-500', text: 'text-purple-700', bgLight: 'bg-purple-50 border-purple-200', icon: Sparkles },
  exam: { label: 'Examen / Evaluación', color: 'bg-red-500', text: 'text-red-700', bgLight: 'bg-red-50 border-red-200', icon: AlertCircle },
  wellness: { label: 'Bienestar / Pausa', color: 'bg-emerald-500', text: 'text-emerald-700', bgLight: 'bg-emerald-50 border-emerald-200', icon: Heart },
  assignment: { label: 'Ciclo / Tarea', color: 'bg-blue-500', text: 'text-blue-700', bgLight: 'bg-blue-50 border-blue-200', icon: BookOpen },
  meeting: { label: 'Actividad / Encuentro', color: 'bg-amber-500', text: 'text-amber-700', bgLight: 'bg-amber-50 border-amber-200', icon: Users },
  other: { label: 'General', color: 'bg-slate-500', text: 'text-slate-700', bgLight: 'bg-slate-50 border-slate-200', icon: CalendarIcon }
};

export default function CalendarModal({ onClose, studentId = 'STU_AE_000059', initialDate = null }) {
  const today = new Date();
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'year'
  const [currentYear, setCurrentYear] = useState(2026); // Default 2026 para alinear con Dataset 7 y LinkUP
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDateStr, setSelectedDateStr] = useState(() => {
    if (initialDate) return initialDate;
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `2026-${m}-${d}`;
  });

  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');

  // Formulario de Crear / Editar
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: selectedDateStr,
    time: '18:00 - 19:30',
    type: 'study',
    module: 'APRENDIZAJE'
  });

  // Cargar eventos del usuario desde el backend SQLite
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/api/calendar/events?studentId=${studentId}`);
      if (res.ok) {
        const data = await res.json();
        setUserEvents(data.events || []);
      }
    } catch (err) {
      console.warn('Error fetching calendar events, using fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [studentId]);

  // Combinar eventos de Dataset 7 con eventos de SQLite del usuario
  const allEvents = useMemo(() => {
    return [...D7_EVENTS, ...userEvents];
  }, [userEvents]);

  // Comprobar si un evento aplica a una fecha específica YYYY-MM-DD
  const isEventOnDate = (evt, dateStr) => {
    if (evt.date === dateStr) return true;
    if (evt.startDate && evt.endDate) {
      // Rango de fechas inclusivo de inicio y fin
      return dateStr >= evt.startDate && dateStr < evt.endDate;
    }
    return false;
  };

  // Filtrado de eventos
  const filteredEvents = useMemo(() => {
    return allEvents.filter((evt) => {
      if (filterType === 'ALL') return true;
      if (filterType === 'D7') return evt.isD7;
      if (filterType === 'USER') return !evt.isD7;
      if (filterType === 'PENDING') return evt.completed === 0;
      return evt.type === filterType;
    });
  }, [allEvents, filterType]);

  // Obtener eventos filtrados para una fecha específica
  const getFilteredEventsForDate = (dateStr) => {
    return filteredEvents.filter((evt) => isEventOnDate(evt, dateStr));
  };

  // Eventos del día seleccionado
  const selectedDayEvents = useMemo(() => {
    return allEvents.filter((evt) => isEventOnDate(evt, selectedDateStr));
  }, [allEvents, selectedDateStr]);

  // Navegación de mes y año
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handlePrevYear = () => setCurrentYear((prev) => prev - 1);
  const handleNextYear = () => setCurrentYear((prev) => prev + 1);

  const handleGoToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(today.getMonth());
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    setSelectedDateStr(`2026-${m}-${d}`);
  };

  // Acciones CRUD (solo para eventos de usuario)
  const handleOpenCreate = (dateOverride = null) => {
    const targetDate = dateOverride || selectedDateStr;
    setEditingEventId(null);
    setFormData({
      title: '',
      description: '',
      date: targetDate,
      time: '18:00 - 20:00',
      type: 'study',
      module: 'APRENDIZAJE'
    });
    setShowEventForm(true);
  };

  const handleOpenEdit = (evt) => {
    if (evt.isD7) {
      alert('Los eventos oficiales del Dataset 7 son inmutables del calendario institucional.');
      return;
    }
    setEditingEventId(evt.id);
    setFormData({
      title: evt.title,
      description: evt.description || '',
      date: evt.date,
      time: evt.time || '10:00 - 11:00',
      type: evt.type || 'study',
      module: evt.module || 'GENERAL'
    });
    setShowEventForm(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date) return;

    try {
      if (editingEventId) {
        const res = await fetch(`${apiUrl}/api/calendar/events/${editingEventId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          const data = await res.json();
          setUserEvents((prev) => prev.map((item) => (item.id === editingEventId ? data.event : item)));
        }
      } else {
        const res = await fetch(`${apiUrl}/api/calendar/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, student_id: studentId })
        });
        if (res.ok) {
          const data = await res.json();
          setUserEvents((prev) => [...prev, data.event]);
          setSelectedDateStr(formData.date);
        }
      }
      setShowEventForm(false);
      setEditingEventId(null);
    } catch (err) {
      console.error('Error guardando evento:', err);
    }
  };

  const handleDeleteEvent = async (evt) => {
    if (evt.isD7) {
      alert('Los eventos oficiales del Dataset 7 no pueden eliminarse.');
      return;
    }
    if (!window.confirm('¿Seguro que deseas eliminar este evento del calendario?')) return;
    try {
      const res = await fetch(`${apiUrl}/api/calendar/events/${evt.id}`, { method: 'DELETE' });
      if (res.ok) {
        setUserEvents((prev) => prev.filter((item) => item.id !== evt.id));
      }
    } catch (err) {
      console.error('Error eliminando evento:', err);
    }
  };

  const handleToggleComplete = async (evt) => {
    if (evt.isD7) return; // D7 es institucional
    try {
      setUserEvents((prev) =>
        prev.map((item) => (item.id === evt.id ? { ...item, completed: item.completed === 1 ? 0 : 1 } : item))
      );
      await fetch(`${apiUrl}/api/calendar/events/${evt.id}/toggle`, { method: 'PATCH' });
    } catch (err) {
      console.error('Error toggling complete:', err);
    }
  };

  const formatDisplayDate = (dStr) => {
    if (!dStr) return '';
    const [y, m, d] = dStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Cálculo de la cuadrícula del mes en vista mensual
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const startingDayOffset = (firstDayOfMonth + 6) % 7; // Lunes = 0
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Función para renderizar un mini-mes en la Vista Anual
  const renderYearMonthGrid = (monthIndex) => {
    const mFirstDay = new Date(currentYear, monthIndex, 1).getDay();
    const mOffset = (mFirstDay + 6) % 7;
    const mTotalDays = new Date(currentYear, monthIndex + 1, 0).getDate();

    return (
      <div 
        key={monthIndex}
        className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
      >
        {/* Cabecera del mes con acción para saltar a vista mensual */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
          <h4 className="font-extrabold text-sm text-[#0D2538]">
            {MONTH_NAMES[monthIndex]}
          </h4>
          <button
            onClick={() => {
              setCurrentMonth(monthIndex);
              setViewMode('month');
            }}
            className="text-[10px] font-bold text-[#1D63B8] hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
            title="Abrir este mes en vista detallada"
          >
            Ver mes →
          </button>
        </div>

        {/* Encabezado días de la semana */}
        <div className="grid grid-cols-7 gap-1 text-[9px] font-black text-slate-400 text-center mb-1">
          <div>L</div><div>M</div><div>M</div><div>J</div><div>V</div><div>S</div><div>D</div>
        </div>

        {/* Cuadrícula de días */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold">
          {Array.from({ length: mOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="py-1"></div>
          ))}

          {Array.from({ length: mTotalDays }).map((_, i) => {
            const dayNum = i + 1;
            const mPad = String(monthIndex + 1).padStart(2, '0');
            const dPad = String(dayNum).padStart(2, '0');
            const dateKey = `${currentYear}-${mPad}-${dPad}`;

            const evts = getFilteredEventsForDate(dateKey);
            const hasEvents = evts.length > 0;
            const hasExam = evts.some(e => e.type === 'exam' || e.category === 'evaluation_week');
            const hasWellness = evts.some(e => e.type === 'wellness' || e.category === 'wellbeing_activity');
            const hasD7 = evts.some(e => e.isD7);
            const isSelected = selectedDateStr === dateKey;

            let dayStyle = 'hover:bg-slate-100 text-slate-700';
            if (isSelected) {
              dayStyle = 'bg-[#1D63B8] text-white font-bold shadow-sm';
            } else if (hasExam) {
              dayStyle = 'bg-red-500 text-white font-bold shadow-sm';
            } else if (hasWellness) {
              dayStyle = 'bg-emerald-500 text-white font-bold shadow-sm';
            } else if (hasEvents) {
              dayStyle = 'bg-blue-100 text-blue-800 font-bold';
            }

            return (
              <button
                key={dayNum}
                onClick={() => {
                  setSelectedDateStr(dateKey);
                  setCurrentMonth(monthIndex);
                  // En vista anual, al hacer clic en un día se selecciona y puede abrir el mes
                }}
                className={`py-1 rounded-md transition-all relative flex flex-col items-center justify-center cursor-pointer ${dayStyle}`}
                title={hasEvents ? `${evts.map(e => e.title).join(' • ')}` : dateKey}
              >
                <span>{dayNum}</span>
                {hasEvents && !isSelected && !hasExam && !hasWellness && (
                  <span className="w-1 h-1 rounded-full bg-[#1D63B8] -mt-0.5"></span>
                )}
                {hasD7 && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-indigo-600 ring-1 ring-white"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn" onClick={onClose}>
      <div 
        className="bg-white border border-slate-200 rounded-3xl max-w-7xl w-full h-[92vh] shadow-2xl flex flex-col overflow-hidden text-[#0D2538] relative" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* ==================== HEADER PRINCIPAL ==================== */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-[#1D63B8] to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
              <CalendarIcon className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  Calendario Académico & Gestor de Tareas
                </h2>
                <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
                  <ShieldCheck className="w-3 h-3 text-cyan-300" /> Dataset 7 Activo
                </span>
              </div>
              <p className="text-xs text-blue-100 font-medium">
                Vista unificada de eventos institucionales de Ciudad Aethera y tus bloques de estudio personales
              </p>
            </div>
          </div>

          {/* TOGGLE DE VISTA (MENSUAL / ANUAL) Y ACCIONES */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Selector de Vista */}
            <div className="bg-white/15 backdrop-blur-md p-1 rounded-xl border border-white/20 flex items-center gap-1">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'month'
                    ? 'bg-white text-[#1D63B8] shadow-sm'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Mes</span>
              </button>
              <button
                onClick={() => setViewMode('year')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'year'
                    ? 'bg-white text-[#1D63B8] shadow-sm'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Año (12 Meses)</span>
              </button>
            </div>

            <button
              onClick={() => handleOpenCreate()}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nueva Tarea</span>
            </button>

            <button 
              onClick={onClose} 
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
              title="Cerrar calendario"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ==================== BARRA DE FILTROS Y NAVEGACIÓN ==================== */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          {/* Navegación temporal según vista activa */}
          <div className="flex items-center gap-2">
            {viewMode === 'month' ? (
              <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                <button 
                  onClick={handlePrevMonth}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors cursor-pointer"
                  title="Mes anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 font-bold text-sm text-[#0D2538] min-w-[140px] text-center">
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </span>
                <button 
                  onClick={handleNextMonth}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors cursor-pointer"
                  title="Mes siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                <button 
                  onClick={handlePrevYear}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors cursor-pointer"
                  title="Año anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 font-black text-sm text-[#0D2538] min-w-[110px] text-center">
                  Año {currentYear}
                </span>
                <button 
                  onClick={handleNextYear}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors cursor-pointer"
                  title="Año siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={handleGoToday}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700 transition-colors cursor-pointer shadow-sm"
            >
              Hoy (2026)
            </button>
          </div>

          {/* Chips de Filtro */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-[11px] font-bold text-slate-500 mr-1 hidden sm:inline">Filtrar:</span>
            {[
              { id: 'ALL', label: 'Todos' },
              { id: 'D7', label: '🏛️ Dataset 7 (Oficial)', color: 'bg-indigo-600' },
              { id: 'USER', label: 'Mis Tareas / IA', color: 'bg-purple-500' },
              { id: 'exam', label: 'Exámenes', color: 'bg-red-500' },
              { id: 'wellness', label: 'Bienestar', color: 'bg-emerald-500' },
              { id: 'PENDING', label: 'Pendientes' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1.5 border ${
                  filterType === f.id
                    ? 'bg-[#1D63B8] text-white border-[#1D63B8] shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {f.color && <span className={`w-2 h-2 rounded-full ${f.color}`}></span>}
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ==================== CUERPO PRINCIPAL ==================== */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
          
          {/* LADO IZQUIERDO: CUADRÍCULA MENSUAL O ANUAL */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto border-r border-slate-200 flex flex-col">
            
            {/* ====== MODO VISTA ANUAL (12 MESES) ====== */}
            {viewMode === 'year' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200/80">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#1D63B8]" />
                    <div>
                      <h3 className="font-extrabold text-sm text-[#0D2538]">
                        Vista Anual 2026 • Calendario Oficial Dataset 7 & Plan de Estudio
                      </h3>
                      <p className="text-[11px] text-slate-600">
                        Haz clic en cualquier día o en "Ver mes →" para inspeccionar las actividades y fechas clave.
                      </p>
                    </div>
                  </div>

                  {/* Leyenda rápida */}
                  <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-bold">
                    <span className="flex items-center gap-1 text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span> Exámenes / Evaluaciones
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Semanas de Bienestar
                    </span>
                    <span className="flex items-center gap-1 text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                      <span className="w-2 h-2 rounded-full bg-indigo-600"></span> Oficial Dataset 7
                    </span>
                  </div>
                </div>

                {/* Cuadrícula de 12 Meses */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {Array.from({ length: 12 }).map((_, mIdx) => renderYearMonthGrid(mIdx))}
                </div>
              </div>
            )}

            {/* ====== MODO VISTA MENSUAL ====== */}
            {viewMode === 'month' && (
              <div className="flex-1 flex flex-col">
                {/* Días de la semana */}
                <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {DAY_NAMES.map((d) => (
                    <div key={d} className="py-1">{d}</div>
                  ))}
                </div>

                {/* Celdas del calendario mensual */}
                <div className="grid grid-cols-7 gap-2 flex-1 auto-rows-fr">
                  {/* Celdas vacías del offset */}
                  {Array.from({ length: startingDayOffset }).map((_, i) => (
                    <div key={`empty-${i}`} className="bg-slate-50/50 rounded-2xl border border-transparent min-h-[70px] opacity-30"></div>
                  ))}

                  {/* Días del mes actual */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const mPad = String(currentMonth + 1).padStart(2, '0');
                    const dPad = String(dayNum).padStart(2, '0');
                    const dateKey = `${currentYear}-${mPad}-${dPad}`;

                    const isToday = currentYear === 2026 && today.getMonth() === currentMonth && today.getDate() === dayNum;
                    const isSelected = selectedDateStr === dateKey;
                    const dayEvts = getFilteredEventsForDate(dateKey);

                    return (
                      <div
                        key={dateKey}
                        onClick={() => setSelectedDateStr(dateKey)}
                        className={`rounded-2xl p-2 sm:p-2.5 min-h-[75px] sm:min-h-[85px] border transition-all cursor-pointer flex flex-col justify-between group relative ${
                          isSelected
                            ? 'bg-blue-50/80 border-[#1D63B8] shadow-md ring-2 ring-[#1D63B8]/20'
                            : isToday
                            ? 'bg-amber-50/50 border-amber-300'
                            : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'
                        }`}
                      >
                        {/* Header del día */}
                        <div className="flex items-center justify-between">
                          <span className={`text-xs sm:text-sm font-black w-6 h-6 rounded-full flex items-center justify-center ${
                            isSelected
                              ? 'bg-[#1D63B8] text-white'
                              : isToday
                              ? 'bg-amber-500 text-white'
                              : 'text-slate-800'
                          }`}>
                            {dayNum}
                          </span>

                          {dayEvts.length > 0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                              {dayEvts.length}
                            </span>
                          )}
                        </div>

                        {/* Indicadores de Eventos */}
                        <div className="space-y-1 mt-1">
                          {dayEvts.slice(0, 2).map((evt) => {
                            const isD7 = evt.isD7;
                            const typeCfg = TYPE_CONFIG[evt.type] || TYPE_CONFIG.other;

                            return (
                              <div 
                                key={evt.id}
                                className={`text-[9px] font-bold truncate px-1.5 py-0.5 rounded-md border flex items-center gap-1 ${
                                  isD7
                                    ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                                    : `${typeCfg.bgLight} ${evt.completed ? 'line-through opacity-50' : ''}`
                                }`}
                                title={`${evt.title} ${isD7 ? '(Dataset 7 Oficial)' : ''}`}
                              >
                                {isD7 ? (
                                  <Bookmark className="w-2.5 h-2.5 text-indigo-600 shrink-0" />
                                ) : (
                                  <span className={`w-1.5 h-1.5 rounded-full ${typeCfg.color} shrink-0`}></span>
                                )}
                                <span className="truncate">{evt.title}</span>
                              </div>
                            );
                          })}

                          {dayEvts.length > 2 && (
                            <span className="text-[9px] font-bold text-slate-500 block text-right">
                              +{dayEvts.length - 2} más
                            </span>
                          )}
                        </div>

                        {/* Botón rápido flotante */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenCreate(dateKey);
                          }}
                          className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-md bg-[#1D63B8] text-white hidden group-hover:flex items-center justify-center opacity-90 hover:opacity-100 shadow"
                          title="Agregar evento en este día"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Leyenda al pie */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 font-bold text-indigo-900 text-[11px] bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                  <Bookmark className="w-3 h-3 text-indigo-600" />
                  <span>Dataset 7 (Institucional)</span>
                </div>
                {Object.entries(TYPE_CONFIG).slice(0, 4).map(([key, cfg]) => (
                  <div key={key} className="flex items-center gap-1.5 font-bold text-slate-600 text-[11px]">
                    <span className={`w-2.5 h-2.5 rounded-full ${cfg.color}`}></span>
                    <span>{cfg.label}</span>
                  </div>
                ))}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                {allEvents.length} eventos totales ({D7_EVENTS.length} de Dataset 7)
              </span>
            </div>

          </div>

          {/* ==================== LADO DERECHO: PANEL DE DETALLE DEL DÍA ==================== */}
          <div className="w-full lg:w-96 bg-slate-50/70 p-4 sm:p-6 flex flex-col justify-between shrink-0 overflow-y-auto">
            <div className="space-y-4">
              {/* Encabezado del panel lateral */}
              <div className="border-b border-slate-200 pb-3 flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D63B8] block">
                    Detalle de la Fecha
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-[#0D2538] capitalize">
                    {formatDisplayDate(selectedDateStr)}
                  </h3>
                </div>
                <button
                  onClick={() => handleOpenCreate(selectedDateStr)}
                  className="p-2 bg-[#1D63B8] hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all cursor-pointer"
                  title="Agregar tarea en este día"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Lista de eventos del día */}
              {selectedDayEvents.length === 0 ? (
                <div className="text-center py-10 px-4 bg-white rounded-2xl border border-dashed border-slate-300 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-700">Sin eventos en esta fecha</p>
                    <p className="text-xs text-slate-500 mt-1">No hay exámenes ni tareas registradas para este día.</p>
                  </div>
                  <button
                    onClick={() => handleOpenCreate(selectedDateStr)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0D2538] font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    + Agregar Tarea o Bloque
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[calc(90vh-280px)] overflow-y-auto pr-1">
                  {selectedDayEvents.map((evt) => {
                    const isD7 = evt.isD7;
                    const typeCfg = TYPE_CONFIG[evt.type] || TYPE_CONFIG.other;
                    const Icon = typeCfg.icon;
                    const isDone = evt.completed === 1;

                    return (
                      <div
                        key={evt.id}
                        className={`rounded-2xl p-3.5 border transition-all shadow-sm ${
                          isD7
                            ? 'bg-gradient-to-br from-indigo-50/90 to-blue-50/70 border-indigo-200 ring-1 ring-indigo-200/50'
                            : isDone
                            ? 'bg-slate-50/60 border-slate-200 opacity-75'
                            : 'bg-white border-slate-200 hover:border-blue-400'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {/* Checkbox o Badge D7 */}
                          {isD7 ? (
                            <div className="mt-0.5 text-indigo-600 shrink-0" title="Evento oficial institucional">
                              <ShieldCheck className="w-5 h-5 text-indigo-600" />
                            </div>
                          ) : (
                            <button
                              onClick={() => handleToggleComplete(evt)}
                              className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer shrink-0"
                              title={isDone ? 'Marcar como pendiente' : 'Marcar como completada'}
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                              ) : (
                                <Circle className="w-5 h-5 hover:text-emerald-500" />
                              )}
                            </button>
                          )}

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-1">
                              {isD7 ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-indigo-600 text-white shadow-xs">
                                  <Bookmark className="w-3 h-3" />
                                  Dataset 7 • Oficial
                                </span>
                              ) : (
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black border ${typeCfg.bgLight} ${typeCfg.text}`}>
                                  <Icon className="w-3 h-3" />
                                  {typeCfg.label}
                                </span>
                              )}

                              {!isD7 && (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleOpenEdit(evt)}
                                    className="p-1 text-slate-400 hover:text-[#1D63B8] transition-colors cursor-pointer"
                                    title="Editar"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteEvent(evt)}
                                    className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                    title="Eliminar"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>

                            <h4 className={`text-sm font-bold leading-snug ${
                              isD7
                                ? 'text-indigo-950 font-black'
                                : isDone
                                ? 'line-through text-slate-500'
                                : 'text-[#0D2538]'
                            }`}>
                              {evt.title}
                            </h4>

                            {evt.description && (
                              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                                {evt.description}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] font-semibold text-slate-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {evt.startDate && evt.endDate
                                  ? `${evt.startDate} al ${evt.endDate}`
                                  : evt.time || 'Todo el día'}
                              </span>
                              {evt.period && (
                                <span className="px-1.5 py-0.2 rounded bg-indigo-100/70 text-indigo-700 text-[9px] font-bold">
                                  {evt.period.replace('_', ' ')}
                                </span>
                              )}
                              {evt.institution && evt.institution !== 'ALL' && (
                                <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 text-[9px] font-bold">
                                  {evt.institution}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Resumen del Día */}
            <div className="pt-4 border-t border-slate-200 mt-4 bg-white p-3.5 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                <span>Actividades del Día:</span>
                <span className="text-[#1D63B8]">
                  {selectedDayEvents.length} {selectedDayEvents.length === 1 ? 'evento' : 'eventos'}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                <span>{selectedDayEvents.filter(e => e.isD7).length} Oficiales D7</span>
                <span className="opacity-40">•</span>
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span>{selectedDayEvents.filter(e => !e.isD7).length} Personales / IA</span>
              </div>
            </div>

          </div>

        </div>

        {/* ==================== MODAL CREAR / EDITAR EVENTO PERSONAL ==================== */}
        {showEventForm && (
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn text-[#0D2538]">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">
                <h3 className="font-extrabold text-lg text-[#0D2538] flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-[#1D63B8]" />
                  {editingEventId ? 'Editar Evento / Bloque' : 'Nuevo Evento Personal'}
                </h3>
                <button
                  onClick={() => setShowEventForm(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEvent} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Título de la Actividad *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Repaso de Cálculo: Integrales triples"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Fecha *</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Horario sugerido</label>
                    <input
                      type="text"
                      placeholder="18:00 - 20:00"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tipo de Evento</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white"
                    >
                      <option value="study">Estudio IA</option>
                      <option value="exam">Examen / Entrega</option>
                      <option value="wellness">Bienestar / Pausa</option>
                      <option value="assignment">Tarea / Práctica</option>
                      <option value="meeting">Reunión / Asesoría</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Módulo Vinculado</label>
                    <select
                      value={formData.module}
                      onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white"
                    >
                      <option value="APRENDIZAJE">Aprendizaje</option>
                      <option value="BIENESTAR">Bienestar</option>
                      <option value="OPORTUNIDADES">Oportunidades</option>
                      <option value="COMUNIDAD">Comunidad</option>
                      <option value="GENERAL">General</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Notas o Descripción</label>
                  <textarea
                    rows={2}
                    placeholder="Detalles, capítulos a leer, enlaces o recordatorios..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white"
                  ></textarea>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEventForm(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1D63B8] hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm transition-colors cursor-pointer"
                  >
                    {editingEventId ? 'Guardar Cambios' : 'Crear Evento'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
