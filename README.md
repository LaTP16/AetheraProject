# Aethera Project - LinkUP

Este repositorio contiene la plataforma LinkUP dividida en dos partes:
* [frontend/](file:///c:/Users/USER/Desktop/AetheraProject/frontend): Aplicación cliente en React + Vite + Tailwind CSS.
* [backend/](file:///c:/Users/USER/Desktop/AetheraProject/backend): API servidor en Node.js + Express + SQLite + Gemini AI.

---

## 🚀 Despliegue en Producción

### 1. Backend en Render (Web Service)
1. Conecta tu repositorio de GitHub en Render.
2. Crea un **New Web Service**.
3. Configuración del servicio:
   * **Root Directory**: `backend`
   * **Environment**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
4. En la pestaña **Environment Variables**:
   * `GEMINI_API_KEY`: Tu clave de Google Gemini.
5. Copia la URL que Render te asigna (ej. `https://mi-backend.onrender.com`).

---

### 2. Frontend en Vercel
1. Conecta tu repositorio de GitHub en Vercel.
2. Al importar el proyecto:
   * **Root Directory**: Haz clic en *Edit* y selecciona `frontend`.
   * **Framework Preset**: `Vite` (lo detectará automáticamente).
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
3. En la sección **Environment Variables**:
   * Nombre: `VITE_API_URL`
   * Valor: `https://mi-backend.onrender.com` (la URL de tu servicio de Render, sin barra al final).
4. Haz clic en **Deploy**.

---

## 💻 Desarrollo Local

### Iniciar Backend:
```bash
cd backend
npm install
npm run dev
```

### Iniciar Frontend:
```bash
cd frontend
npm install
npm run dev
```
