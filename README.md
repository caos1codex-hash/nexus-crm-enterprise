<p align="center">
  <a href="https://caos1codex-hash.github.io/nexus-crm-enterprise/">
    <img src="https://img.shields.io/badge/🚀-DEMO%20EN%20VIVO-6366f1?style=for-the-badge" alt="Demo en Vivo" />
  </a>
  &nbsp;
  <a href="https://github.com/caos1codex-hash/nexus-crm-enterprise">
    <img src="https://img.shields.io/badge/📂-REPOSITORIO-222?style=for-the-badge&logo=github" alt="Repositorio" />
  </a>
  &nbsp;
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
  &nbsp;
  <img src="https://img.shields.io/badge/PR%20Welcome-✓-brightgreen?style=for-the-badge" alt="PRs Welcome" />
</p>

<br />

<p align="center">
  <img width="800" alt="Nexus CRM Enterprise Dashboard" src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80" />
</p>

<h1 align="center">Nexus CRM Enterprise</h1>

<p align="center">
  Plataforma CRM SaaS de nivel empresarial construida con React, TypeScript y las mejores herramientas del ecosistema moderno.
  <br />
  <strong>Gestión completa de clientes, pipeline de ventas, automatizaciones e inteligencia artificial.</strong>
</p>

---

## 🚀 Demo en Vivo

**[https://caos1codex-hash.github.io/nexus-crm-enterprise/](https://caos1codex-hash.github.io/nexus-crm-enterprise/)**

## 📂 Repositorio

**[https://github.com/caos1codex-hash/nexus-crm-enterprise](https://github.com/caos1codex-hash/nexus-crm-enterprise)**

---

## ✨ Características

### Dashboard Ejecutivo
- KPIs en tiempo real con comparativas temporales
- Gráficos interactivos de evolución de ventas
- Distribución del pipeline por etapas
- Rendimiento del equipo comercial
- Actividad reciente en tiempo real

### Gestión de Clientes
- CRUD completo con búsqueda, filtros y ordenamiento
- Perfiles detallados con timeline de actividades
- Etiquetas, estados y valor comercial
- Exportación de datos

### Pipeline de Ventas
- Vista Kanban profesional con **Drag & Drop**
- 8 etapas: Lead → Contactado → Calificado → Reunión → Propuesta → Negociación → Ganado → Perdido
- Estadísticas y totales monetarios por etapa
- Animaciones suaves y fluidas

### Gestión de Tareas
- Vistas de Lista y Kanban
- Prioridades, fechas límite y asignación a equipo
- Filtrado por estado y prioridad
- Toggle rápido de estado

### Calendario Comercial
- Vista mensual interactiva
- Eventos por tipo: reuniones, llamadas, seguimientos
- Selección de fecha con detalle de eventos

### Reportes Analíticos
- Tendencia de ventas mensual
- Embudo de conversión
- Rendimiento por vendedor
- Fuentes de leads
- Exportación PDF/CSV

### Centro de Notas
- Editor de texto avanzado
- Notas fijadas y búsqueda
- Relación con clientes
- Etiquetas organizativas

### Automatizaciones
- Constructor visual de reglas
- Triggers: nuevo lead, cambio de etapa, tarea completada, cliente inactivo
- Acciones: crear tarea, enviar notificación, asignar usuario, cambiar etapa
- Activación/desactivación con un clic

### IA Empresarial
- Predicciones de cierre con nivel de confianza
- Sugerencias de seguimiento inteligentes
- Alertas de riesgo de pérdida
- Resúmenes automáticos del equipo
- Proyecciones de ventas trimestrales

### Experiencia de Usuario
- **Dark Mode / Light Mode** con persistencia
- **Búsqueda global** con atajo de teclado (Cmd+K / Ctrl+K)
- **Notificaciones** en tiempo real con centro de notificaciones
- **Loading Skeletons** y **Empty States**
- **Microinteracciones** con Framer Motion
- **Responsive** completo (móvil, tablet, desktop)
- **Sidebar colapsable** con animación

---

## 🛠️ Tecnologías

| Categoría | Tecnología |
|-----------|-----------|
| **Frontend** | React 19, TypeScript, Vite |
| **Estilos** | Tailwind CSS 4, CSS Custom Properties |
| **Estado** | Zustand con persistencia |
| **Tablas** | TanStack Table |
| **Formularios** | React Hook Form + Zod |
| **Gráficos** | Recharts |
| **Animaciones** | Framer Motion |
| **Drag & Drop** | DnD Kit |
| **Iconos** | Lucide React |
| **Rutas** | React Router DOM |
| **Fechas** | date-fns |

---

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/caos1codex-hash/nexus-crm-enterprise.git
cd nexus-crm-enterprise

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

---

## 🚀 Uso

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

---

## 🏗️ Arquitectura

```
nexus-crm-enterprise/
├── .github/workflows/     # GitHub Actions (deploy automático)
├── public/                # Assets estáticos, favicon
├── src/
│   ├── components/
│   │   └── layout/        # AppShell, Sidebar, Header
│   ├── data/              # Datos mock realistas
│   ├── lib/               # Utilidades y helpers
│   ├── pages/             # Páginas de la aplicación
│   ├── store/             # Zustand stores
│   ├── types/             # Tipos TypeScript
│   ├── App.tsx            # Enrutamiento principal
│   ├── main.tsx           # Punto de entrada
│   └── index.css          # Estilos globales y tema
├── .gitignore
├── index.html
├── LICENSE
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.ts
```

### Principios

- **SOLID**: Responsabilidad única, abierto/cerrado, sustitución de Liskov
- **DRY**: Componentes reutilizables y sin duplicación
- **Clean Architecture**: Separación clara entre presentación, estado y datos
- **Performance**: Lazy loading, animaciones optimizadas, re-renders mínimos

---

## 🌐 Despliegue

El proyecto se despliega automáticamente a **GitHub Pages** en cada push a la rama `main` mediante **GitHub Actions**.

La configuración está en `.github/workflows/deploy.yml`.

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

<p align="center">
  Construido con ❤️ usando React, TypeScript y Tailwind CSS
</p>