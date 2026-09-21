# Ubunto - Plataforma Digital de Acompañamiento Estudiantil

Ubunto es una plataforma digital responsive diseñada para conectar, orientar y acompañar a estudiantes universitarios en su trayectoria académica, personal y profesional.

## 🚀 Formas de Ejecución

### Opción 1: Vista Previa Inmediata (Sin Instalación)
Solo abre el archivo [`index.html`](file:///c:/Users/USER/Desktop/AetheraProject/index.html) directamente en tu navegador preferido. Es una aplicación completa e interactiva con Tailwind CSS y React.

### Opción 2: Proyecto React Modular (Vite + Tailwind CSS + Lucide)
Si deseas ejecutarlo como proyecto Vite de producción:

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev
```

## 📁 Estructura del Código Creado en `AetheraProject`:

```
AetheraProject/
├── index.html                  <-- Aplicación web interactiva autónoma
├── package.json                <-- Configuración de dependencias (Vite + React + Lucide)
├── README.md                   <-- Documentación y guía de uso
└── src/
    ├── App.jsx                 <-- Contenedor principal de la aplicación Ubunto
    ├── main.jsx                <-- Punto de entrada de React
    ├── index.css               <-- Estilos globales y Tailwind CSS
    └── components/
        ├── Navbar.jsx          <-- Barra superior con buscador, notificaciones y perfil
        ├── AcademicSection.jsx <-- Sección 1: Entorno Académico (Grupos, Foros)
        ├── CareerSection.jsx   <-- Sección 2: Desarrollo Profesional (Becas, Analizador CV)
        ├── AIChatSection.jsx   <-- Sección 3: Orientación & Apoyo IA (Chat de derivación)
        └── CVModal.jsx         <-- Modal interactivo de análisis de CV con IA
```
