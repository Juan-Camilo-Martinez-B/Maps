# 🏃 Fitness Tracker

Una aplicación web profesional y moderna para seguimiento de actividades físicas con mapas interactivos, estadísticas en tiempo real y exportación de datos.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=flat-square&logo=tailwind-css)

## ✨ Características Principales

### 🗺️ **Mapas Interactivos**
- Visualización en tiempo real con OpenStreetMap
- Geolocalización automática
- Planificación de rutas con puntos de inicio y destino
- Cálculo automático de rutas optimizadas (OSRM)
- Diferentes colores para rutas planificadas vs. tracking activo

### 🏃 **Seguimiento de Actividades**
- **Tres tipos de actividad**: Carrera, Ciclismo, Caminata
- Cronómetro en tiempo real con pausas
- Seguimiento GPS continuo durante la actividad
- Cálculo automático de métricas:
  - Distancia recorrida
  - Tiempo activo (sin pausas)
  - Velocidad promedio
  - Calorías quemadas
  - Pace (min/km)

### 📊 **Estadísticas y Análisis**
- Dashboard de estadísticas del día
- Historial completo de actividades
- Métricas detalladas por actividad
- Persistencia local de datos (LocalStorage)

### 📤 **Exportación y Compartir**
- Exportación de rutas en formato GPX
- Generación de texto para compartir en redes sociales
- Copiar estadísticas al portapapeles

### 🎨 **Interfaz Moderna**
- Diseño responsive y mobile-first
- Modo oscuro completo
- Animaciones suaves con Framer Motion
- Notificaciones toast elegantes
- Gradientes y efectos visuales modernos

### ⚡ **Rendimiento y UX**
- Persistencia automática de datos
- Carga lazy de componentes pesados
- Optimización de re-renders
- Feedback visual en todas las acciones
- Manejo robusto de errores

## 🚀 Tecnologías Utilizadas

### Core
- **Next.js 16** - Framework de React con App Router
- **React 19** - Biblioteca UI con las últimas características
- **TypeScript 5** - Tipado estático para mayor seguridad

### Estado y Datos
- **Zustand** - Gestión de estado global ligera y eficiente
- **LocalStorage** - Persistencia de datos sin necesidad de backend

### UI/UX
- **Tailwind CSS 4** - Estilos utility-first modernos
- **Framer Motion** - Animaciones fluidas y profesionales
- **Sonner** - Sistema de notificaciones toast elegante

### Mapas y Geolocalización
- **Leaflet** - Biblioteca de mapas interactivos
- **React Leaflet** - Integración de Leaflet con React
- **OpenStreetMap** - Tiles de mapas gratuitos
- **OSRM** - Motor de rutas open source

### Formularios y Validación
- **React Hook Form** - Gestión eficiente de formularios
- **Zod** - Validación de esquemas TypeScript-first

### Utilidades
- **date-fns** - Manipulación de fechas moderna

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/        # Componentes de React
│   │   ├── ActivityHistory.tsx    # Historial de actividades
│   │   ├── ActivityTimer.tsx      # Cronómetro y control de actividad
│   │   ├── MapClient.tsx          # Cliente del mapa (wrapper)
│   │   ├── MapControls.tsx        # Controles superiores
│   │   ├── OSMRouteMap.tsx        # Componente del mapa
│   │   ├── StatsCard.tsx          # Tarjeta de estadísticas
│   │   └── ThemeToggle.tsx        # Toggle de tema oscuro
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página home
│   └── globals.css        # Estilos globales
│
├── lib/
│   ├── store/
│   │   └── useStore.ts    # Store de Zustand
│   ├── types/
│   │   └── index.ts       # Definiciones de tipos TypeScript
│   ├── utils/
│   │   ├── calculations.ts    # Cálculos de distancia, calorías, etc.
│   │   └── export.ts          # Exportación GPX y compartir
│   └── services/
│       └── routeService.ts    # Servicio de rutas OSRM
│
└── hooks/
    ├── useTimer.ts            # Hook de cronómetro
    └── useGeolocation.ts      # Hook de geolocalización
```

## 🛠️ Instalación y Desarrollo

### Requisitos Previos
- Node.js 18+ 
- npm, yarn, pnpm o bun

### Instalación

```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd Maps

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Scripts Disponibles

```bash
npm run dev      # Modo desarrollo
npm run build    # Build de producción
npm run start    # Ejecutar build de producción
npm run lint     # Ejecutar ESLint
```

## 📦 Despliegue en Vercel

Este proyecto está optimizado para desplegarse en Vercel:

1. Conecta tu repositorio a Vercel
2. Vercel detectará automáticamente Next.js
3. Deploy automático con cada push

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<tu-repo>)

## 🎯 Uso de la Aplicación

### Planificar una Ruta
1. La app detectará automáticamente tu ubicación
2. Haz clic en el mapa para establecer un destino
3. Se calculará automáticamente la ruta óptima

### Iniciar una Actividad
1. Selecciona el tipo de actividad (Carrera, Ciclismo, Caminata)
2. Presiona "Iniciar"
3. El cronómetro y GPS comenzarán a tracking
4. Usa los botones de Pausar/Reanudar según necesites
5. Presiona "Finalizar" para guardar la actividad

### Ver Historial
1. Desplázate hacia abajo para ver tus actividades anteriores
2. Haz clic en cualquier actividad para expandir detalles
3. Exporta a GPX o comparte en redes sociales

### Cambiar Tema
- Usa el toggle en la esquina superior derecha para cambiar entre modo claro y oscuro

## 🧮 Cálculos de Métricas

### Distancia
- Usa la fórmula de Haversine para precisión geográfica
- Cálculo en tiempo real punto a punto

### Calorías
- Basado en valores MET (Metabolic Equivalent of Task):
  - Carrera: 10 MET
  - Ciclismo: 8 MET  
  - Caminata: 3.5 MET
- Considera peso del usuario (configurable, default 70kg)

### Velocidad
- Promedio: `distancia / tiempo activo`
- Excluye tiempo en pausa
- Presentado en km/h

### Pace
- Calculado como `tiempo / distancia`
- Formato min/km para runners

## 🔐 Privacidad y Datos

- **100% privado**: Todos los datos se almacenan localmente en tu navegador
- **Sin servidores**: No se envía información a ningún backend
- **Sin tracking**: No hay analytics ni cookies de terceros
- **Open Source**: Código completamente auditable

## 🚧 Roadmap Futuro

- [ ] Gráficas de progreso semanales/mensuales
- [ ] Sistema de objetivos y metas
- [ ] Comparación de actividades
- [ ] Zonas de frecuencia cardíaca
- [ ] Integración con dispositivos wearables
- [ ] PWA con instalación offline
- [ ] Soporte multi-idioma completo
- [ ] Importación de archivos GPX/TCX
- [ ] Segmentos y records personales

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🙏 Agradecimientos

- [OpenStreetMap](https://www.openstreetmap.org/) - Datos de mapas
- [OSRM](http://project-osrm.org/) - Motor de rutas
- [Leaflet](https://leafletjs.com/) - Biblioteca de mapas
- [Vercel](https://vercel.com/) - Plataforma de hosting

## 📧 Contacto

Para preguntas, sugerencias o reportar bugs, por favor abre un issue en GitHub.

---

**Hecho con ❤️ usando Next.js y React**
