import fs from 'fs';
import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import multer from 'multer';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadsDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const sourcesFilePath = join(uploadsDir, 'sources.json');

function getStoredSources() {
  if (!fs.existsSync(sourcesFilePath)) return [];
  try {
    const raw = fs.readFileSync(sourcesFilePath, 'utf8');
    return JSON.parse(raw) || [];
  } catch (err) {
    console.error('Error leyendo sources.json:', err);
    return [];
  }
}

function saveStoredSources(sources) {
  try {
    fs.writeFileSync(sourcesFilePath, JSON.stringify(sources, null, 2), 'utf8');
  } catch (err) {
    console.error('Error guardando sources.json:', err);
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${cleanName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('FORMATO_NO_SOPORTADO'));
    }
  }
});

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

async function callGemini({ systemInstruction, prompt, inlineData, jsonMode = false, temperature = 0.3 }) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) throw new Error('API Key de Gemini no configurada en el servidor');

  const contents = [];
  const parts = [];
  if (prompt) {
    parts.push({ text: prompt });
  }
  if (inlineData) {
    parts.push({
      inlineData: {
        mimeType: inlineData.mimeType,
        data: inlineData.data
      }
    });
  }
  contents.push({ role: 'user', parts });

  const body = {
    contents,
    generationConfig: {
      temperature,
      maxOutputTokens: 8192
    }
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  if (jsonMode) {
    body.generationConfig.responseMimeType = 'application/json';
  }

  const candidateModels = ['gemini-2.5-flash', 'gemini-flash-latest'];
  let lastErr = null;

  for (const model of candidateModels) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`Gemini model ${model} error (${response.status}):`, errText);
        lastErr = new Error(`Error de Gemini (${model}): ${response.statusText}`);
        continue;
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Respuesta vacía de Gemini');
      return text;
    } catch (err) {
      lastErr = err;
    }
  }

  throw lastErr || new Error('No se pudo comunicar con Gemini API');
}

function repairTruncatedJson(str) {
  let inString = false;
  let escape = false;
  const stack = [];

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (char === '\\') {
      escape = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (char === '{' || char === '[') {
        stack.push(char);
      } else if (char === '}') {
        if (stack.length && stack[stack.length - 1] === '{') stack.pop();
      } else if (char === ']') {
        if (stack.length && stack[stack.length - 1] === '[') stack.pop();
      }
    }
  }

  let repaired = str;
  if (inString) {
    repaired += '"';
  }
  while (stack.length > 0) {
    const opening = stack.pop();
    if (opening === '{') repaired += '}';
    else if (opening === '[') repaired += ']';
  }
  return repaired;
}

function parseGeminiJson(rawText) {
  if (!rawText) return null;
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const fixed = cleaned
      .replace(/,\s*([}\]])/g, '$1')
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '');
    try {
      return JSON.parse(fixed);
    } catch (e2) {
      try {
        const repaired = repairTruncatedJson(fixed);
        return JSON.parse(repaired);
      } catch (e3) {
        console.error('Error parseando JSON de Gemini. Raw recibido:', rawText.slice(0, 500));
        throw err;
      }
    }
  }
}



const dbPath = join(__dirname, 'base de datos', 'estudiantes_comunes.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  } else {
    console.log("Connected to the SQLite database.");
    // Inicializar tabla para el calendario interactivo y gestor de tareas
    db.run(`
      CREATE TABLE IF NOT EXISTS calendar_events (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        time TEXT,
        type TEXT DEFAULT 'study',
        module TEXT DEFAULT 'GENERAL',
        completed INTEGER DEFAULT 0,
        created_at TEXT
      )
    `, (tableErr) => {
      if (tableErr) {
        console.error("Error creating calendar_events table:", tableErr);
      } else {
        // Verificar si está vacía para sembrar eventos de muestra
        db.get("SELECT COUNT(*) as count FROM calendar_events", (cntErr, row) => {
          if (!cntErr && row && row.count === 0) {
            const now = new Date();
            const y = now.getFullYear();
            const m = String(now.getMonth() + 1).padStart(2, '0');
            const d = now.getDate();

            const pad = (n) => String(n).padStart(2, '0');
            const formatDay = (dayOffset) => {
              const target = new Date(now);
              target.setDate(target.getDate() + dayOffset);
              return `${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(target.getDate())}`;
            };

            const sampleEvents = [
              {
                id: 'evt_sample_1',
                student_id: 'STU_AE_000059',
                title: 'Examen Parcial de Cálculo Multivariable',
                description: 'Aula 304 - Edificio de Ingeniería. Llevar calculadora científica y formulario impreso.',
                date: formatDay(5),
                time: '08:00 - 10:00',
                type: 'exam',
                module: 'APRENDIZAJE',
                completed: 0,
                created_at: new Date().toISOString()
              },
              {
                id: 'evt_sample_2',
                student_id: 'STU_AE_000059',
                title: 'Taller de Regulación Emocional y Manejo del Estrés',
                description: 'Sesión grupal con el equipo de Bienestar Estudiantil. Modalidad presencial en Sala Brújula.',
                date: formatDay(2),
                time: '16:00 - 17:30',
                type: 'wellness',
                module: 'BIENESTAR',
                completed: 0,
                created_at: new Date().toISOString()
              },
              {
                id: 'evt_sample_3',
                student_id: 'STU_AE_000059',
                title: 'Bloque de Estudio: Métodos de Integración',
                description: 'Repaso con técnica Feynman y resolución de 5 ejercicios del banco de exámenes.',
                date: formatDay(1),
                time: '18:00 - 20:00',
                type: 'study',
                module: 'APRENDIZAJE',
                completed: 0,
                created_at: new Date().toISOString()
              },
              {
                id: 'evt_sample_4',
                student_id: 'STU_AE_000059',
                title: 'Feria de Pasantías Tech LinkUP',
                description: 'Stands virtuales de reclutamiento y simulacros de entrevista técnica.',
                date: formatDay(8),
                time: '10:00 - 14:00',
                type: 'meeting',
                module: 'OPORTUNIDADES',
                completed: 0,
                created_at: new Date().toISOString()
              }
            ];

            const insertStmt = db.prepare(`
              INSERT INTO calendar_events (id, student_id, title, description, date, time, type, module, completed, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            for (const s of sampleEvents) {
              insertStmt.run([s.id, s.student_id, s.title, s.description, s.date, s.time, s.type, s.module, s.completed, s.created_at]);
            }
            insertStmt.finalize();
            console.log("Seeded sample calendar events successfully.");
          }
        });
      }
    });
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
    const datasetDir = fs.existsSync(join(__dirname, 'Datasets', 'D6.csv'))
      ? join(__dirname, 'Datasets')
      : join(__dirname, '..', 'Datasets');
    D6_csv = fs.readFileSync(join(datasetDir, 'D6.csv'), 'utf8');
    D5_examples = fs.readFileSync(join(datasetDir, 'D5_examples.json'), 'utf8');
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

// ==========================================
// NUEVOS ENDPOINTS: APRENDIZAJE INTEGRAL (IA)
// ==========================================

// 1. Recomendaciones de Fuentes (Videos, Libros, Páginas Web)
app.post('/api/learning/recommendations', async (req, res) => {
  const { topic } = req.body;
  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    return res.status(400).json({ error: 'Por favor ingresa un tema de estudio válido.' });
  }

  const cleanTopic = topic.trim();
  const systemInstruction = `Eres un orientador y curador académico experto en la plataforma educativa LinkUP (Ciudad Aethera).
Tu misión es recomendar recursos educativos de la más alta calidad y pertinencia para el tema solicitado por el estudiante.
Debes organizar las recomendaciones obligatoriamente en 3 categorías:
1. "videos": Videos o canales formativos de alta reputación (ej. YouTube educativos reales como TED-Ed, 3Blue1Brown, DotCSV, Platzi, freeCodeCamp, MIT OpenCourseWare, CrashCourse, etc.) o conferencias académicas reales.
2. "libros": Libros canónicos, manuales universitarios o textos de referencia ampliamente reconocidos en el área académica (indicando autores reconocidos).
3. "webs": Páginas web oficiales, documentación técnica, tutoriales o portales educativos abiertos de primer nivel (ej. MDN Web Docs, Wikipedia en español, Khan Academy, GeeksforGeeks, W3Schools, Stanford CS, documentación oficial de la tecnología).

Para CADA recurso debes incluir exactamente:
- "title": Título claro y exacto del recurso (incluyendo autor o canal).
- "description": Breve descripción (1 a 2 frases) del contenido específico que aborda.
- "usefulness": Explicación concreta de su utilidad pedagógica para quien está aprendiendo este tema.
- "link": Enlace web real y verificable cuando esté disponible.
- "type": "video" | "libro" | "web"

REGLAS ESTRICTAS DE INTEGRIDAD:
- NUNCA inventes enlaces ficticios ni generes URLs rotas o que den 404.
- Si no posees la URL directa garantizada de un libro físico o recurso, coloca null o un enlace de búsqueda real oficial (ej. https://books.google.com o enlace a la web oficial del autor).
- No inventes libros o autores inexistentes. Todo debe ser verídico y de utilidad formativa comprobada.

Devuelve SIEMPRE la respuesta en formato JSON con la siguiente estructura exacta:
{
  "topic": "${cleanTopic}",
  "summary": "Breve frase o párrafo introductorio motivador para estudiar este tema.",
  "videos": [
    {
      "title": "Nombre del video o canal",
      "description": "Qué abarca",
      "usefulness": "Por qué es valioso",
      "link": "URL válida o null",
      "type": "video"
    }
  ],
  "libros": [
    {
      "title": "Título del libro (Autores)",
      "description": "Enfoque del libro",
      "usefulness": "Utilidad académica",
      "link": "URL válida o null",
      "type": "libro"
    }
  ],
  "webs": [
    {
      "title": "Nombre de la web o documentación",
      "description": "Contenido del sitio",
      "usefulness": "Utilidad de aprendizaje",
      "link": "URL oficial directa",
      "type": "web"
    }
  ]
}`;

  try {
    const rawJson = await callGemini({
      systemInstruction,
      prompt: `Recomienda los mejores recursos clasificados (videos, libros y páginas web) para aprender a fondo: "${cleanTopic}". Proporciona exactamente 2 a 3 recursos destacados por categoría con descripciones concisas de 1 a 2 oraciones.`,
      jsonMode: true,
      temperature: 0.2
    });

    const parsed = parseGeminiJson(rawJson);
    res.json(parsed);
  } catch (error) {
    console.error('Error en /api/learning/recommendations:', error);
    res.status(500).json({ error: 'Error al generar recomendaciones de recursos educativos' });
  }
});

// 2. Subida y Análisis de Archivos (PDF e Imágenes)
app.post('/api/learning/upload', (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'El archivo excede el tamaño máximo permitido de 15MB.' });
      }
      if (err.message === 'FORMATO_NO_SOPORTADO') {
        return res.status(400).json({ error: 'Formato no compatible. Por favor sube archivos PDF o imágenes (PNG, JPG, WEBP).' });
      }
      return res.status(400).json({ error: `Error en la subida: ${err.message}` });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No se ha seleccionado ningún archivo para subir.' });
    }

    if (req.file.size === 0) {
      // Eliminar archivo vacío
      try { fs.unlinkSync(req.file.path); } catch (e) {}
      return res.status(400).json({ error: 'El archivo subido está vacío (0 bytes).' });
    }

    try {
      const fileBuffer = fs.readFileSync(req.file.path);
      let extractedContent = '';
      let totalPages = 1;
      let summary = '';

      if (req.file.mimetype === 'application/pdf') {
        try {
          const parser = new PDFParse({ data: fileBuffer });
          await parser.load();
          const textResult = await parser.getText();
          totalPages = textResult.total || (textResult.pages ? textResult.pages.length : 1);

          if (textResult.pages && textResult.pages.length > 0) {
            extractedContent = textResult.pages
              .map(p => `--- [PÁGINA ${p.num}] ---\n${p.text ? p.text.trim() : ''}`)
              .join('\n\n');
          } else {
            extractedContent = textResult.text || '';
          }
        } catch (pdfErr) {
          console.warn('Error en extracción de texto PDF con PDFParse:', pdfErr.message);
        }

        // Si el PDF contiene muy poco texto (ej. PDF escaneado con imágenes), usar Gemini multimodal
        if (!extractedContent || extractedContent.trim().length < 40) {
          try {
            const base64Data = fileBuffer.toString('base64');
            const visionExtraction = await callGemini({
              systemInstruction: 'Eres un analista de documentos académicos. Extrae y describe detalladamente el contenido de este documento PDF, transcribiendo texto visible, fórmulas, esquemas y organizándolo por páginas o secciones.',
              prompt: 'Extrae y transcribe todo el contenido de este documento PDF para su estudio pedagógico:',
              inlineData: { mimeType: 'application/pdf', data: base64Data }
            });
            extractedContent = visionExtraction;
          } catch (visErr) {
            console.warn('Error en extracción multimodal de PDF:', visErr.message);
          }
        }

        // Generar un resumen sintético inicial del documento
        try {
          const previewText = extractedContent.slice(0, 4000);
          summary = await callGemini({
            prompt: `En 2 a 3 oraciones concisas en español, resume el tema y propósito pedagógico principal de este material de estudio:\n\n${previewText}`
          });
        } catch (sumErr) {
          summary = 'Documento PDF listo para estudio interactivo.';
        }

      } else {
        // Imágenes (PNG, JPG, WEBP)
        const base64Image = fileBuffer.toString('base64');
        const visionPrompt = `Eres un asistente de estudio pedagógico en LinkUP.
Analiza minuciosamente esta imagen académica (apuntes, pizarra, diagrama, infografía o esquema):
1. Transcribe con exactitud todo el texto, fórmulas, algoritmos o pasos visibles.
2. Identifica y describe los diagramas o conceptos representados.
3. Organiza la descripción indicando claramente las secciones visuales (ej. 'Sección Superior', 'Diagrama Central', 'Columna Lateral', 'Notas').
4. Proporciona una síntesis clara del contenido pedagógico que enseña.`;

        extractedContent = await callGemini({
          systemInstruction: 'Eres un analista visual y tutor académico.',
          prompt: visionPrompt,
          inlineData: { mimeType: req.file.mimetype, data: base64Image }
        });

        totalPages = 1;
        try {
          summary = await callGemini({
            prompt: `En 2 oraciones concisas en español, resume qué enseña esta imagen de estudio a partir de su análisis:\n\n${extractedContent.slice(0, 2000)}`
          });
        } catch (e) {
          summary = 'Imagen analizada e interpretada para estudio interactivo.';
        }
      }

      const sourceId = `src_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newSource = {
        id: sourceId,
        originalName: req.file.originalname,
        filename: req.file.filename,
        mimeType: req.file.mimetype,
        size: req.file.size,
        pages: totalPages,
        summary: summary.trim(),
        extractedContent: extractedContent.trim(),
        createdAt: new Date().toISOString()
      };

      const sources = getStoredSources();
      sources.unshift(newSource);
      saveStoredSources(sources);

      res.json({
        success: true,
        source: {
          id: newSource.id,
          originalName: newSource.originalName,
          mimeType: newSource.mimeType,
          size: newSource.size,
          pages: newSource.pages,
          summary: newSource.summary,
          createdAt: newSource.createdAt
        }
      });
    } catch (processError) {
      console.error('Error al procesar el archivo con IA:', processError);
      res.status(500).json({ error: 'Ocurrió un error al procesar el archivo con la IA: ' + processError.message });
    }
  });
});

// 3. Listar Fuentes Cargadas
app.get('/api/learning/sources', (req, res) => {
  try {
    const sources = getStoredSources().map(s => ({
      id: s.id,
      originalName: s.originalName,
      mimeType: s.mimeType,
      size: s.size,
      pages: s.pages,
      summary: s.summary,
      createdAt: s.createdAt
    }));
    res.json({ sources });
  } catch (error) {
    console.error('Error al listar fuentes:', error);
    res.status(500).json({ error: 'No se pudieron recuperar las fuentes' });
  }
});

// 4. Eliminar Fuente
app.delete('/api/learning/sources/:id', (req, res) => {
  try {
    const { id } = req.params;
    const sources = getStoredSources();
    const index = sources.findIndex(s => s.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Fuente no encontrada.' });
    }

    const [removed] = sources.splice(index, 1);
    if (removed.filename) {
      const filePath = join(uploadsDir, removed.filename);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) { console.warn('No se pudo borrar archivo físico:', e); }
      }
    }

    saveStoredSources(sources);
    res.json({ success: true, message: 'Fuente eliminada correctamente.' });
  } catch (error) {
    console.error('Error al eliminar fuente:', error);
    res.status(500).json({ error: 'Error al eliminar la fuente.' });
  }
});

// 5. Aprendizaje Interactivo sobre el Material Cargado
app.post('/api/learning/study', async (req, res) => {
  const { sourceId, action, query } = req.body;
  if (!sourceId) {
    return res.status(400).json({ error: 'Falta especificar el sourceId de la fuente de estudio.' });
  }

  const sources = getStoredSources();
  const source = sources.find(s => s.id === sourceId);
  if (!source) {
    return res.status(404).json({ error: 'La fuente seleccionada no fue encontrada o ha sido eliminada.' });
  }

  const documentContent = source.extractedContent || source.summary || '';
  if (!documentContent) {
    return res.status(400).json({ error: 'La fuente no cuenta con contenido legible para analizar.' });
  }

  // Recortar si supera el límite de contexto
  const safeContent = documentContent.slice(0, 30000);

  const baseInstructions = `Eres un tutor de aprendizaje personalizado en LinkUP (Ciudad Aethera).
Tu función es ayudar al estudiante a dominar el contenido del material cargado: "${source.originalName}".
REGLAS OBLIGATORIAS:
1. Basa tus respuestas PRIORITARIAMENTE en el contenido de este material.
2. Señala y CITA SIEMPRE las páginas o secciones relevantes cuando estén disponibles (ejemplo: "[Página 2]", "[Sección Superior]", "[Diagrama Central]").
3. Si el estudiante pregunta algo que NO está en el material, indícalo con honestidad: "Esta información no se encuentra contemplada en el material proporcionado."
4. Mantén un tono pedagógico, estimulante, claro y estructurado en español.

CONTENIDO DEL MATERIAL:
${safeContent}`;

  try {
    if (action === 'quiz') {
      // Generar Cuestionario Interactivo en JSON
      const quizSystemPrompt = `${baseInstructions}
Debes generar un Cuestionario de Evaluación interactivo de 4 a 5 preguntas de opción múltiple basadas exclusivamente en este material.
Para cada pregunta incluye 4 opciones, el índice de la respuesta correcta (0-3), una explicación pedagógica clara y la cita a la página o sección de donde proviene.

Responde SIEMPRE en formato JSON con la siguiente estructura exacta:
{
  "quizTitle": "Cuestionario de Evaluación: ${source.originalName}",
  "questions": [
    {
      "id": 1,
      "question": "¿Enunciado de la pregunta?",
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "correctIndex": 0,
      "explanation": "Por qué es correcta y cómo se deduce.",
      "sourceCitation": "Página X / Sección Y"
    }
  ]
}`;

      const rawQuiz = await callGemini({
        systemInstruction: quizSystemPrompt,
        prompt: 'Genera un cuestionario interactivo de 4 preguntas para evaluar la comprensión del material cargado.',
        jsonMode: true,
        temperature: 0.3
      });

      const parsedQuiz = parseGeminiJson(rawQuiz);
      return res.json({ action: 'quiz', result: parsedQuiz });

    } else if (action === 'summary') {
      // Resumen estructurado
      const prompt = `Elabora un RESUMEN ESTRUCTURADO y exhaustivo del material cargado.
Organiza la respuesta con:
- 📌 Idea Central / Propósito General
- 🔑 Conceptos Clave y Definiciones (citando [Página X] o [Sección] de cada uno)
- 📝 Conclusiones o Puntos Críticos para el examen o aplicación práctica.`;

      const result = await callGemini({
        systemInstruction: baseInstructions,
        prompt,
        temperature: 0.3
      });

      return res.json({ action: 'summary', result });

    } else if (action === 'step_by_step') {
      // Explicación paso a paso
      const prompt = `Desarrolla una EXPLICACIÓN PASO A PASO detallada y didáctica de los conceptos, procedimientos, algoritmos o métodos descritos en este material.
Explica cada etapa de forma secuencial, indicando en qué página o sección se ubica cada paso ([Página X] o [Sección]).`;

      const result = await callGemini({
        systemInstruction: baseInstructions,
        prompt,
        temperature: 0.3
      });

      return res.json({ action: 'step_by_step', result });

    } else if (action === 'examples') {
      // Ejemplos y aplicaciones
      const prompt = `Genera EJEMPLOS PRÁCTICOS, casos de estudio o analogías cotidianas basados en el contenido de este material.
Conecta cada ejemplo directamente con los conceptos tratados en el documento y cita la página o sección relevante.`;

      const result = await callGemini({
        systemInstruction: baseInstructions,
        prompt,
        temperature: 0.3
      });

      return res.json({ action: 'examples', result });

    } else if (action === 'practice_questions') {
      // Preguntas de práctica
      const prompt = `Formula 4 a 5 PREGUNTAS DE PRÁCTICA y ejercicios reflexivos para que el estudiante ponga a prueba su comprensión de este material.
Para cada pregunta, incluye una pista pedagógica que señale en qué [Página X] o [Sección] puede encontrar la clave para responderla.`;

      const result = await callGemini({
        systemInstruction: baseInstructions,
        prompt,
        temperature: 0.3
      });

      return res.json({ action: 'practice_questions', result });

    } else {
      // Pregunta personalizada o libre
      const userQuestion = query || action;
      if (!userQuestion || typeof userQuestion !== 'string' || !userQuestion.trim()) {
        return res.status(400).json({ error: 'Por favor escribe tu pregunta sobre el material.' });
      }

      const prompt = `El estudiante tiene la siguiente pregunta sobre el material cargado:
"${userQuestion.trim()}"

Responde con rigor pedagógico basándote prioritariamente en el material y citando las páginas o secciones ([Página X] o [Sección]) de donde obtienes la respuesta.`;

      const result = await callGemini({
        systemInstruction: baseInstructions,
        prompt,
        temperature: 0.3
      });

      return res.json({ action: 'custom_question', result });
    }

  } catch (error) {
    console.error('Error en /api/learning/study:', error);
    res.status(500).json({ error: 'Error al procesar la sesión de estudio interactivo con la IA.' });
  }
});

// ==========================================
// NUEVOS ENDPOINTS: CALENDARIO INTERACTIVO (CRUD)
// ==========================================

// 1. Obtener eventos del calendario
app.get('/api/calendar/events', (req, res) => {
  const { studentId, month, year } = req.query;
  let query = 'SELECT * FROM calendar_events';
  const params = [];
  const conditions = [];

  if (studentId) {
    conditions.push('student_id = ?');
    params.push(studentId);
  }
  if (month && year) {
    const padMonth = String(month).padStart(2, '0');
    conditions.push("strftime('%Y-%m', date) = ?");
    params.push(`${year}-${padMonth}`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  query += ' ORDER BY date ASC, time ASC';

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ events: rows || [] });
  });
});

// 2. Crear un nuevo evento
app.post('/api/calendar/events', (req, res) => {
  const { student_id = 'STU_AE_000059', title, description = '', date, time = '10:00 - 11:00', type = 'study', module = 'GENERAL' } = req.body;
  if (!title || !date) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: title y date' });
  }

  const id = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const createdAt = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO calendar_events (id, student_id, title, description, date, time, type, module, completed, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
  `);

  stmt.run([id, student_id, title, description, date, time, type, module, createdAt], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      success: true,
      event: { id, student_id, title, description, date, time, type, module, completed: 0, created_at: createdAt }
    });
  });
});

// 3. Inserción masiva de eventos (Sincronización del Plan de Estudios con IA)
app.post('/api/calendar/events/bulk', (req, res) => {
  const { student_id = 'STU_AE_000059', events = [] } = req.body;
  if (!Array.isArray(events) || events.length === 0) {
    return res.status(400).json({ error: 'Lista de eventos vacía' });
  }

  const createdAt = new Date().toISOString();
  const createdEvents = [];

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    const stmt = db.prepare(`
      INSERT INTO calendar_events (id, student_id, title, description, date, time, type, module, completed, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
    `);

    for (const evt of events) {
      const id = evt.id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const title = evt.title || 'Sesión de Estudio';
      const description = evt.description || '';
      const date = evt.date;
      const time = evt.time || '10:00 - 12:00';
      const type = evt.type || 'study';
      const mod = evt.module || 'APRENDIZAJE';

      stmt.run([id, student_id, title, description, date, time, type, mod, createdAt]);
      createdEvents.push({ id, student_id, title, description, date, time, type, module: mod, completed: 0, created_at: createdAt });
    }

    stmt.finalize();
    db.run('COMMIT', (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, count: createdEvents.length, events: createdEvents });
    });
  });
});

// 4. Actualizar evento existente
app.put('/api/calendar/events/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, date, time, type, module, completed } = req.body;

  db.get('SELECT * FROM calendar_events WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Evento no encontrado' });

    const newTitle = title !== undefined ? title : row.title;
    const newDescription = description !== undefined ? description : row.description;
    const newDate = date !== undefined ? date : row.date;
    const newTime = time !== undefined ? time : row.time;
    const newType = type !== undefined ? type : row.type;
    const newModule = module !== undefined ? module : row.module;
    const newCompleted = completed !== undefined ? (completed ? 1 : 0) : row.completed;

    const stmt = db.prepare(`
      UPDATE calendar_events
      SET title = ?, description = ?, date = ?, time = ?, type = ?, module = ?, completed = ?
      WHERE id = ?
    `);

    stmt.run([newTitle, newDescription, newDate, newTime, newType, newModule, newCompleted, id], function(updateErr) {
      if (updateErr) return res.status(500).json({ error: updateErr.message });
      res.json({
        success: true,
        event: { ...row, title: newTitle, description: newDescription, date: newDate, time: newTime, type: newType, module: newModule, completed: newCompleted }
      });
    });
  });
});

// 5. Alternar estado completado
app.patch('/api/calendar/events/:id/toggle', (req, res) => {
  const { id } = req.params;
  db.get('SELECT completed FROM calendar_events WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Evento no encontrado' });

    const newCompleted = row.completed === 1 ? 0 : 1;
    db.run('UPDATE calendar_events SET completed = ? WHERE id = ?', [newCompleted, id], function(updateErr) {
      if (updateErr) return res.status(500).json({ error: updateErr.message });
      res.json({ success: true, id, completed: newCompleted });
    });
  });
});

// 6. Eliminar evento
app.delete('/api/calendar/events/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM calendar_events WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json({ success: true, message: 'Evento eliminado correctamente' });
  });
});

// ==========================================
// NUEVOS ENDPOINTS: PLAN DE ESTUDIOS CON IA (INICIO)
// ==========================================

// 7. Generar Plan de Estudios personalizado
app.post('/api/study-plan/generate', async (req, res) => {
  const { examDate, topics, dailyHours, context = '', studentId = 'STU_AE_000059' } = req.body;

  if (!examDate || !topics) {
    return res.status(400).json({ error: 'La fecha del examen y los temas a estudiar son obligatorios.' });
  }

  // Obtener contexto del estudiante de la DB si está disponible
  let studentContext = '';
  try {
    const student = await new Promise((resolve) => {
      db.get('SELECT * FROM D1_encuestas WHERE student_id = ?', [studentId], (err, row) => {
        resolve(row || null);
      });
    });
    if (student) {
      studentContext = `Estudiante: ${student.full_name}, Nivel de estrés: ${student.stress_band || 'moderado'}, Horas de sueño: ${student.sleep_hours || 7}h.`;
    }
  } catch (e) {
    console.warn('Error leyendo contexto de estudiante para el plan:', e);
  }

  const todayStr = new Date().toISOString().split('T')[0];

  const systemInstruction = `Eres el Estratega Académico y de Bienestar con IA de LinkUP (Ciudad Aethera).
Tu misión es diseñar un Plan de Estudios personalizado, riguroso, realista y altamente motivador para preparar al estudiante hacia su fecha límite o examen.

INTEGRACIÓN CRUZADA OBLIGATORIA CON LOS MÓDULOS DE LINKUP:
1. MÓDULO APRENDIZAJE:
   - Recomienda explícitamente aplicar técnicas científicas de estudio:
     * TÉCNICA DE FEYNMAN (explicar conceptos complejos en lenguaje simple, usando el Tutor Feynman del módulo Aprendizaje).
     * MÉTODO MAYÉUTICO DE SÓCRATES (autoevaluación con preguntas reflexivas, usando el Tutor Sócrates del módulo Aprendizaje).
     * Técnica Pomodoro (bloques de 25 o 50 minutos con foco total).
     * Consulta del Banco de Exámenes y recursos de LinkUP.
2. MÓDULO BIENESTAR:
   - Integra de forma obligatoria la salud mental y física del estudiante:
     * Pausas activas y desconexión digital recomendada.
     * Técnicas de respiración (ej. 4-7-8 o diafragmática) para reducir el estrés pre-examen.
     * Hábitos de sueño e hidratación para consolidar la memoria a largo plazo.
     * Recordatorio del canal de orientación y apoyo 24/7 de LinkUP si experimenta sobrecarga o angustia.

REGLAS DE DISTRIBUCIÓN DEL CRONOGRAMA:
- La fecha de hoy es: ${todayStr}.
- La fecha del examen/entrega es: ${examDate}.
- Debes generar exactamente entre 4 y 6 bloques clave o sesiones estratégicas (máximo 6 bloques), distribuidos cronológicamente entre hoy y la fecha del examen.
- Cada bloque debe tener una fecha exacta en formato 'YYYY-MM-DD' (dentro del rango), horario recomendado (ej. '18:00 - 20:00'), título accionable, temas específicos, lista breve de 2 a 3 tareas y recomendaciones concisas de Aprendizaje y Bienestar.
- El último bloque debe ser el día previo al examen enfocado en repaso ligero, mentalidad positiva y descanso reparador.

FORMATO DE RESPUESTA:
Debes responder ÚNICAMENTE con un JSON válido y bien formateado, sin comentarios de código, con comillas dobles en todas las propiedades y cadenas:
{
  "planTitle": "Título claro y motivador del plan",
  "summary": "Resumen ejecutivo del plan y su enfoque pedagógico",
  "examDate": "YYYY-MM-DD",
  "dailyHours": "X horas/día",
  "totalEstimatedHours": 12,
  "difficultyLevel": "Medio-Alto",
  "schedule": [
    {
      "dayNumber": 1,
      "date": "YYYY-MM-DD",
      "time": "18:00 - 20:00",
      "title": "Día 1: Título de la sesión",
      "focus": "Tema central a dominar",
      "duration": "2h",
      "tasks": [
        "Acción concreta 1",
        "Acción concreta 2"
      ],
      "learningTip": "Técnica de Aprendizaje recomendada (mencionando Tutor Feynman o Sócrates de LinkUP)",
      "wellnessTip": "Recomendación de Bienestar (pausas activas, descanso, respiración)"
    }
  ],
  "learningIntegration": {
    "recommendedTechniques": ["Método Feynman", "Práctica deliberada"],
    "learningModuleAction": "Cómo aprovechar el módulo de Aprendizaje para este plan",
    "suggestedResources": ["Banco de exámenes", "Videos recomendados"]
  },
  "wellnessIntegration": {
    "stressManagementTip": "Técnica concreta para controlar el estrés o ansiedad pre-examen",
    "activePauses": "Frecuencia sugerida de pausas activas",
    "wellnessModuleAction": "Cómo apoyarse en el módulo de Bienestar ante sobrecarga académica"
  },
  "actionableSteps": [
    "Paso 1: Organiza tu entorno",
    "Paso 2: Comienza con el bloque del Día 1",
    "Paso 3: Sincroniza al calendario"
  ]
}`;

  const prompt = `Diseña el plan de estudio completo:
- Materia/Temas: "${topics}"
- Fecha límite/Examen: "${examDate}"
- Tiempo diario disponible: "${dailyHours || '2 horas/día'}"
- Indicaciones adicionales: "${context || 'Ninguna'}"
- Contexto del estudiante en LinkUP: "${studentContext || 'Estudiante universitario'}"`;

  try {
    const rawJson = await callGemini({
      systemInstruction,
      prompt,
      jsonMode: true,
      temperature: 0.2
    });

    const parsed = parseGeminiJson(rawJson);
    res.json(parsed);
  } catch (error) {
    console.error('Error en /api/study-plan/generate:', error);
    res.status(500).json({ error: 'Error al generar el plan de estudios con la IA: ' + error.message });
  }
});

// 8. Refinar o ajustar Plan de Estudios con IA
app.post('/api/study-plan/refine', async (req, res) => {
  const { currentPlan, adjustmentRequest } = req.body;

  if (!currentPlan || !adjustmentRequest) {
    return res.status(400).json({ error: 'Faltan datos del plan actual o la solicitud de ajuste.' });
  }

  const systemInstruction = `Eres el Estratega Académico y de Bienestar con IA de LinkUP (Ciudad Aethera).
Tu tarea es modificar o ajustar el Plan de Estudios existente según la solicitud específica del estudiante, manteniendo la estructura JSON original y la integración cruzada con los módulos de APRENDIZAJE y BIENESTAR.

Devuelve ÚNICAMENTE el JSON actualizado con la misma estructura (planTitle, summary, examDate, dailyHours, totalEstimatedHours, difficultyLevel, schedule, learningIntegration, wellnessIntegration, actionableSteps).`;

  const prompt = `Ajusta el siguiente plan de estudio según la indicación del usuario:
INDICACIÓN DE AJUSTE: "${adjustmentRequest}"

PLAN ACTUAL:
${JSON.stringify(currentPlan, null, 2)}`;

  try {
    const rawJson = await callGemini({
      systemInstruction,
      prompt,
      jsonMode: true,
      temperature: 0.2
    });

    const parsed = parseGeminiJson(rawJson);
    res.json(parsed);
  } catch (error) {
    console.error('Error en /api/study-plan/refine:', error);
    res.status(500).json({ error: 'Error al ajustar el plan de estudios con la IA' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

