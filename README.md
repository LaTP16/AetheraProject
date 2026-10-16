# LinkUP 

🔗 **App desplegada:** https://aethera-project.vercel.app/

## Modelo y herramientas

| Elemento | Detalle |
|---|---|
| Modelo | **Google Gemini** (`gemini-3.5-flash-lite`, y `gemini-2.5-flash` con respaldo `gemini-flash-latest`) |
| Tipo de IA | IA generativa con **RAG** |
| Acceso | API REST desde el backend (Node.js + Express). La clave `GEMINI_API_KEY` vive solo en el servidor |
| Apoyo | `pdf-parse` (leer PDFs), SQLite (datos D1–D3) |
| Herramientas de IA usadas en el desarrollo | Antigravity |

## Núcleo funcional con IA sobre el Data Pack

El módulo **BIENESTAR** es el núcleo de la solución. El estudiante describe su problema en lenguaje natural y la IA lo deriva al servicio adecuado (`POST /api/bienestar/chat`).

**RAG:** en cada consulta, el backend arma el prompt con datos del Data Pack y se lo envía a Gemini:

| Dataset | Uso en el RAG |
|---|---|
| **D6** (catálogo de servicios) | Base de conocimiento: el modelo solo recomienda servicios que existen en el catálogo |
| **D5** (conversaciones de orientación) | Ejemplos en contexto, para aprender el tono y qué servicio corresponde a cada motivo |

**Resultado:** un JSON con el servicio recomendado (`recommendedServiceId`), un mensaje empático y pasos a seguir. La interfaz resalta el servicio recomendado.

**Salvaguardas:** detecta texto sin sentido y pide aclaración; orienta sin diagnosticar).

## Otros usos de IA

| Módulo | Función |
|---|---|
| Aprendizaje | Tutor (métodos Sócrates y Feynman), resúmenes y quiz sobre material subido |
| Plan de estudio | Plan personalizado según estrés y sueño del estudiante (D1) |
| Asistente general | Responde solo con los recursos de LinkUP |

## Datos

Todos los datos fueron usados del Data Pack y por lo tanto son **sintéticos**. No se procesa información personal real.
