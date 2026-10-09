import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, ExternalLink, HeartHandshake, PhoneCall } from 'lucide-react';

export default function AIChatSection() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: '¡Hola! 👋 Estoy aquí para escucharte y ayudarte a encontrar los recursos, herramientas o servicios de apoyo que necesites hoy. ¿Cómo te sientes con tus clases o tu día a día?',
      timestamp: '17:00',
      resources: [
        { label: 'Reserva de Cita en Orientación', type: 'service' },
        { label: 'Línea Directa de Acompañamiento 24/7', type: 'crisis' }
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  const suggestions = [
    "Me siento estresado por los exámenes",
    "Busco ayuda psicológica",
    "Técnicas de regulación y estudio",
    "¿Dónde solicito tutoría académica?"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    setTimeout(() => {
      let responseText = "Entiendo perfectamente lo que sientes. Recuerda que la salud mental es prioridad. He seleccionado estas opciones y servicios de apoyo para ti:";
      let resources = [
        { label: 'Comunidad Estudiantil de Acompañamiento', type: 'community' },
        { label: 'Solicitar Atención Psicopedagógica', type: 'service' }
      ];

      if (text.toLowerCase().includes('estres') || text.toLowerCase().includes('examen')) {
        responseText = "La presión por evaluaciones puede ser abrumadora. Aquí tienes recursos para regular el estrés y agilizar tu apoyo institucional:";
        resources = [
          { label: 'Taller de Manejo de Ansiedad en Exámenes', type: 'resource' },
          { label: 'Agendar Cita Prioritaria en Orientación', type: 'service' },
          { label: 'Línea Directa de Acompañamiento 24/7', type: 'crisis' }
        ];
      } else if (text.toLowerCase().includes('psicol') || text.toLowerCase().includes('ayuda')) {
        responseText = "Pedir ayuda es un paso muy valioso. Te conecto de inmediato con los centros de atención habilitados:";
        resources = [
          { label: 'Reserva de Cita (Centro de Orientación)', type: 'service' },
          { label: 'Línea de Apoyo Inmediato 24/7', type: 'crisis' }
        ];
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        resources: resources
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  return (
    <section className="lg:col-span-4 bg-white rounded-3xl shadow-md border border-emerald-200/60 flex flex-col h-[600px] overflow-hidden">
      
      {/* Encabezado Chat */}
      <div className="p-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm">Orientación y Apoyo (IA)</h2>
            <p className="text-[11px] text-emerald-200">Asistente de derivación institucional</p>
          </div>
        </div>
        <span className="px-2 py-1 bg-white/10 text-[10px] font-semibold rounded-lg text-emerald-100">
          Confidencial
        </span>
      </div>

      {/* Banner aviso */}
      <div className="bg-amber-50 px-4 py-2 border-b border-amber-100 text-[11px] text-amber-800 flex justify-between items-center">
        <span>Conexión directa con servicios de apoyo</span>
        <a href="#" className="font-bold underline text-amber-900">Líneas 24/7</a>
      </div>

      {/* Historial de Mensajes */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-slate-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className="flex items-end gap-2 max-w-[85%]">
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mb-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none shadow-xs'
                  : 'bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-2xs'
              }`}>
                {msg.text}

                {msg.resources && (
                  <div className="mt-3 space-y-2 pt-2 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Enlaces de derivación:</p>
                    {msg.resources.map((res, idx) => (
                      <a key={idx} href="#" className="flex items-center justify-between p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold rounded-xl text-[11px] border border-emerald-200/50">
                        <span className="flex items-center gap-1.5">
                          {res.type === 'crisis' ? <PhoneCall className="w-3.5 h-3.5 text-red-500" /> : <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />}
                          {res.label}
                        </span>
                        <ExternalLink className="w-3 h-3 text-emerald-700" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Sugerencias Rápidas e Input */}
      <div className="p-3 bg-white border-t border-slate-100 space-y-2">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {suggestions.map((sug, i) => (
            <button key={i} onClick={() => handleSendMessage(sug)} className="shrink-0 text-[11px] px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 rounded-xl border border-slate-200">
              {sug}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe cómo te sientes..."
            className="flex-1 text-xs py-2.5 px-3 bg-slate-100 focus:bg-white text-slate-800 rounded-xl border-transparent focus:border-emerald-500 focus:outline-none transition-all"
          />
          <button onClick={() => handleSendMessage()} className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs hover:bg-emerald-700 transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

    </section>
  );
}
