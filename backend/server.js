import fs from 'fs';
import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno desde backend/.env o .env raíz si no están definidas
if (!process.env.GEMINI_API_KEY) {
  const envPaths = [join(__dirname, '.env'), join(__dirname, '..', '.env')];
  for (const p of envPaths) {
    if (fs.existsSync(p)) {
      const envContent = fs.readFileSync(p, 'utf8');
      envContent.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [k, ...v] = trimmed.split('=');
          const key = k.trim();
          const val = v.join('=').trim();
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      });
      if (process.env.GEMINI_API_KEY) break;
    }
  }
}

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = join(__dirname, 'base de datos', 'estudiantes_comunes.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

app.get('/api/student/:id', (req, res) => {
  const studentId = req.params.id;

  // Fetch from D1
  db.get("SELECT * FROM D1_encuestas WHERE student_id = ?", [studentId], (err, d1) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!d1) return res.status(404).json({ error: "Student not found" });

    // Fetch from D2
    db.all("SELECT * FROM D2_servicios_apoyo WHERE student_id = ?", [studentId], (err, d2) => {
      if (err) return res.status(500).json({ error: err.message });

      // Fetch from D3
      db.all("SELECT * FROM D3_rendimiento_academico WHERE student_id = ?", [studentId], (err, d3) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
          student_id: studentId,
          survey: d1,
          services: d2,
          academic: d3
        });
      });
    });
  });
});

// Endpoint for RAG Chat
app.post('/api/chat', async (req, res) => {
  const { userQuery } = req.body;
  if (!userQuery) return res.status(400).json({ error: 'Falta userQuery' });

  // Leer la API KEY desde las variables de entorno
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) return res.status(500).json({ error: 'API Key no configurada en el servidor' });

  const context = `
Eres un asistente de la plataforma LinkUP (Ciudad Aethera).
Tu objetivo es ayudar a los estudiantes usando SOLAMENTE la información de los siguientes módulos y sus recursos específicos.
NO respondas a preguntas fuera de este contexto. No hables de temas ajenos, no des consejos genéricos que no remitan a un recurso de LinkUP.

MÓDULOS Y SUS RECURSOS ESPECÍFICOS DISPONIBLES:
1. OPORTUNIDADES: 
   - Feria de pasantías Tech.
   - Simulacros de entrevistas.
   - Plantillas y creación de CV profesional en formato Harvard (PDF).
2. BIENESTAR: 
   - Programa de orientación en autoestima.
   - Talleres de regulación emocional.
   - Línea directa de acompañamiento psicológico 24/7.
3. APRENDIZAJE: 
   - Recursos de cálculo numérico y ciencias básicas.
   - Banco de exámenes pasados.
   - Tutorías académicas.
   - Técnicas de estudio (Pomodoro, timers) y retos diarios.
4. COMUNIDAD: 
   - Club de debate.
   - Grupos de estudio especializados (ej. Software/TI).
   - Programa de networking alumni y búsqueda de contactos en LinkedIn.

INSTRUCCIONES DE RESPUESTA:
Debes responder SIEMPRE en formato JSON con la siguiente estructura exacta:
{
  "intro": "Un párrafo corto, amigable y empático introduciendo cómo LinkUP puede ayudar con su consulta.",
  "steps": [
    "Recomendación ESPECÍFICA 1 mencionando el recurso exacto y el módulo al que pertenece.",
    "Recomendación ESPECÍFICA 2 mencionando el recurso exacto y el módulo al que pertenece."
  ]
}

Consulta del usuario: ${userQuery}
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: context }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Error de Gemini API');
    }

    const data = await response.json();
    let answerText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    // Fallback if empty
    if (!answerText) {
      answerText = JSON.stringify({
        intro: "Lo siento, no pude procesar tu consulta.",
        steps: ["Intenta ser más específico."]
      });
    }

    // Parse the JSON strictly so we can send it as an object
    const parsedAnswer = JSON.parse(answerText);
    res.json(parsedAnswer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor al consultar la IA' });
  }
});

// Endpoint específico para BIENESTAR (RAG con D5 y D6)
app.post('/api/bienestar/chat', async (req, res) => {
  const { userQuery } = req.body;
  if (!userQuery) return res.status(400).json({ error: 'Falta userQuery' });

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) return res.status(500).json({ error: 'API Key no configurada' });

  let D6_csv = '';
  let D5_examples = '';
  try {
    D6_csv = fs.readFileSync(join(__dirname, 'Datasets', 'D6.csv'), 'utf8');
    D5_examples = fs.readFileSync(join(__dirname, 'Datasets', 'D5_examples.json'), 'utf8');
  } catch (e) {
    console.warn('No se pudieron leer los datasets D5 o D6', e);
  }

  const context = `
Eres un orientador de BIENESTAR en la plataforma LinkUP (Ciudad Aethera).
Tu objetivo es leer el problema del estudiante y recomendarle el servicio adecuado de nuestro catálogo.

CATÁLOGO DE SERVICIOS DISPONIBLES (Dataset D6):
${D6_csv}

EJEMPLOS DE CONVERSACIONES PASADAS (Dataset D5) PARA APRENDER EL TONO Y EL TIPO DE SERVICIO A RECOMENDAR SEGÚN EL MOTIVO:
${D5_examples}

INSTRUCCIONES:
1. Analiza el mensaje del usuario. Si el texto no tiene sentido (gibberish, letras al azar), marca "isGibberish" como true y da un mensaje de error amigable.
2. Si el mensaje tiene sentido, determina su problema o motivo subyacente.
3. Busca en el catálogo (D6) el servicio más adecuado para ese problema.
4. Define a qué categoría pertenece tu recomendación ("APOYO", "RECURSOS" o "SERVICIOS"). Usa "APOYO" para peer_support, "SERVICIOS" para counseling, "RECURSOS" para career_guidance.
5. Responde SIEMPRE en formato JSON con la siguiente estructura exacta:
{
  "isGibberish": boolean,
  "recommendedCategory": "APOYO" | "RECURSOS" | "SERVICIOS" | null,
  "recommendedServiceId": "El service_id exacto que recomiendas (ej. SRV_AE_001) o null si es gibberish",
  "intro": "Un párrafo empático y comprensivo introduciendo cómo puedes ayudarle (o pidiendo que explique mejor si es gibberish).",
  "steps": [
    "Recomendación ESPECÍFICA mencionando el servicio exacto (ej. Espacio Brújula Orientación), sus horarios y modalidades.",
    "Un siguiente paso de acción o consejo breve de bienestar."
  ]
}

Mensaje del estudiante: ${userQuery}
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: context }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      }),
    });

    if (!response.ok) throw new Error('Error de Gemini API: ' + response.statusText);

    const data = await response.json();
    let answerText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!answerText) {
      answerText = JSON.stringify({
        intro: "Lo siento, no pude procesar tu consulta de bienestar.",
        steps: ["Intenta explicar tu situación de nuevo."]
      });
    }

    res.json(JSON.parse(answerText));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno al consultar la IA de bienestar' });
  }
});

// Endpoint para Tutor IA en Aprendizaje (Sócrates y Feynman)
app.post('/api/learning/tutor', async (req, res) => {
  const { topic, mode, messages = [] } = req.body;
  if (!topic) return res.status(400).json({ error: 'Falta el tema de estudio' });

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) return res.status(500).json({ error: 'API Key no configurada en el servidor' });

  let systemPrompt = '';
  if (mode === 'socrates') {
    systemPrompt = `Eres Sócrates, el gran filósofo clásico, actuando como tutor virtual de aprendizaje en la plataforma LinkUP (Ciudad Aethera).
Tu método es el MÉTODO MAYÉUTICO.
Reglas estrictas de comportamiento:
1. NUNCA des respuestas directas, explicaciones completas ni soluciones masticadas al estudiante.
2. Tu propósito es guiar al estudiante a través de preguntas reflexivas, incisivas, socráticas y estimulantes sobre el tema: "${topic}".
3. Ayuda al estudiante a examinar sus propias suposiciones, razonar paso a paso, descubrir inconsistencias y llegar a sus propias conclusiones por sí mismo.
4. Mantén un tono respetuoso, filosófico, curioso, cálido e intelectualmente provocador. Usa intervenciones concisas (1 a 3 párrafos como máximo) para invitar a la respuesta activa del estudiante.
5. Si el estudiante recién comienza, salúdalo brevemente en tu papel y plantéale una primera pregunta fundamental o dilema conceptual intrigante sobre "${topic}".`;
  } else {
    // feynman mode
    systemPrompt = `Eres Richard Feynman, el célebre físico ganador del Premio Nobel y apasionado educador, actuando como tutor virtual en la plataforma LinkUP (Ciudad Aethera).
Tu método es la TÉCNICA DE FEYNMAN.
Reglas estrictas de comportamiento:
1. Tu misión es guiar al estudiante para que explique el tema "${topic}" con sus propias palabras, usando un lenguaje ultra sencillo, sin jerga innecesaria ni tecnicismos vacíos (como si se lo explicara a un niño de 10 años o a un novato).
2. Diagnostica activamente los vacíos conceptuales, lagunas o ambigüedades en las explicaciones que brinde el estudiante.
3. Si el estudiante recurre a palabras complejas o memorizadas sin entenderlas a fondo, pídele analogías cotidianas o ejemplos intuitivos para poner a prueba su comprensión real.
4. Mantén un tono entusiasta, curioso, directo, motivador y divertido, fiel al estilo de Richard Feynman.
5. Si el estudiante recién comienza, invítalo con entusiasmo a comenzar su explicación inicial de "${topic}" usando palabras simples y analogías.`;
  }

  try {
    const contents = [];
    if (Array.isArray(messages) && messages.length > 0) {
      for (const m of messages) {
        contents.push({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        });
      }
    } else {
      // First turn
      contents.push({
        role: 'user',
        parts: [{ text: `Hola, quiero estudiar el tema: "${topic}". Por favor, comienza guiándome en tu rol de tutor.` }]
      });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini error:', errText);
      throw new Error('Error al consultar Gemini API');
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude generar una respuesta en este momento. Inténtalo de nuevo.';

    res.json({ reply: replyText });
  } catch (error) {
    console.error('Error en /api/learning/tutor:', error);
    res.status(500).json({ error: 'Error interno del tutor IA' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
