# AGENTS.md

## Qué es esto
Plataforma estudiantil **LinkUP** (ciudad ficticia "Aethera"): backend Express + SQLite + Gemini AI, frontend React + Vite + Tailwind. Todo el contenido (datos, UI, comentarios) está en **español** y los datos son **sintéticos/ficticios**.

## Estructura (importante)
- `backend/` — API Express. Entry: `backend/server.js`. Tiene su **propio** `package.json`.
- `frontend/` — SPA React. Entry: `frontend/src/main.jsx` → `App.jsx`. Su **propio** `package.json`.
- No son npm workspaces: **cada carpeta se instala por separado** (`npm install` dentro de cada una).
- ⚠️ El `package.json` de la RAÍZ es un **artefacto obsoleto** ("ubunto-platform"): sus scripts (`dev`, `build`, `start-server`) apuntan a un `server.js` y `src/` que NO existen en la raíz. **No ejecutes `npm` desde la raíz** — ve a `backend/` o `frontend/`.

## Cómo correr (dev local)
```bash
# Backend (puerto 3001 por defecto)
cd backend
npm install
npm run dev          # = node --env-file=.env server.js

# Frontend (Vite, puerto 5173)
cd frontend
npm install
npm run dev
```
- `npm run dev` del backend usa `--env-file` → requiere **Node >= 20.6**.
- El frontend llama a `import.meta.env.VITE_API_URL || 'http://localhost:3001'`.
- El frontend tiene datos de estudiante de respaldo hardcodeados en `App.jsx`, así que la UI funciona aunque el backend esté caído.

## Variables de entorno
- `backend/.env` → `GEMINI_API_KEY` (requerida para los 3 endpoints de IA), `PORT` (opcional, default 3001).
- `frontend/.env` → `VITE_API_URL` (URL del backend desplegado).
- `server.js` además carga `.env` manualmente con fallback a `backend/.env` y luego a `.env` raíz si `GEMINI_API_KEY` no está definida.

## Datos
- **SQLite**: `backend/base de datos/estudiantes_comunes.db` (⚠️ la carpeta tiene un **espacio**: `base de datos`). Tablas: `D1_encuestas`, `D2_servicios_apoyo`, `D3_rendimiento_academico`, unidas por `student_id`. Hay también `aethera.db` en esa carpeta y en la raíz.
- **Datasets** (`D1`–`D7`): viven en `Datasets/` en la **RAÍZ** (CSV/JSON/XLSX). `DATA_DICTIONARY.xlsm` documenta los campos.
- ⚠️ **Discrepancia de ruta**: `server.js` lee los datasets para `/api/bienestar/chat` desde `join(__dirname, 'Datasets', ...)` → `backend/Datasets/`, pero esa carpeta **no existe** (los datasets están solo en la raíz). El `try/catch` falla en silencio (`console.warn`) y el endpoint responde con contexto D5/D6 vacío. Si vas a arreglar esto, la ruta correcta es `join(__dirname, '..', 'Datasets', ...)`.

## Endpoints (backend/server.js)
- `GET  /api/student/:id` — devuelve `{ survey(D1), services(D2), academic(D3) }`.
- `POST /api/chat` — RAG general (prompt de módulos LinkUP).
- `POST /api/bienestar/chat` — RAG de bienestar; inyecta `D6.csv` + `D5_examples.json` (ver discrepancia arriba). Mapea tipo→categoría: peer_support→"APOYO", counseling→"SERVICIOS", career_guidance→"RECURSOS".
- `POST /api/learning/tutor` — tutor IA; body `{ topic, mode, messages }`, `mode` es `'socrates'` (mayéutico) o `'feynman'` (explicar con palabras simples).

## IA (Gemini)
- Se llama por `fetch` directo a `generativelanguage.googleapis.com` — **no hay SDK** instalado.
- El modelo está hardcodeado: `gemini-3.5-flash-lite`. Las respuestas se piden con `responseMimeType: application/json` y se parsean con `JSON.parse`.

## Testing / lint
- **No hay** tests, linter, formatter, typecheck ni CI (`.github/workflows` no existe). No inventes comandos de verificación; si necesitas validar, corre el backend y/o el frontend a mano.

## Despliegue
- Backend → **Render** (Web Service, Root Directory `backend`, start `npm start`). Requiere `GEMINI_API_KEY`.
- Frontend → **Vercel** (Root Directory `frontend`, preset Vite, output `dist`, env `VITE_API_URL`). `frontend/vercel.json` rewrites todo a `/` (SPA).

## Convenciones
- Código, comments y UI en español; nombres de módulos de negocio: OPORTUNIDADES, BIENESTAR, APRENDIZAJE, COMUNIDAD, INICIO, PERFIL.
- Colores por módulo definidos inline en `App.jsx` (BIENESTAR usa `#D92B27`, APRENDIZAJE `#9333EA`, etc.).
- Scripts sueltos en la raíz (`create_db.py`, `update_wellness.cjs`, `script.py`, etc.) son generadores de datos de una sola vez, no parte del build.
