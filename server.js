import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
