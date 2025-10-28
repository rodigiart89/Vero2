# Vero UI - Frontend Dashboard

Dashboard interactivo de Vero Core construido con Next.js 15, React 19, TypeScript y Tailwind CSS.

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- Backend de Vero Core ejecutándose en `http://localhost:3000`

### Instalación y Ejecución

```bash
# Desde el directorio frontend/vero-ui
npm install
npm run dev
```

El dashboard estará disponible en `http://localhost:3001`

## ✨ Características

- **Dashboard en Tiempo Real**: Visualización del estado de Vero actualizado cada 5 segundos
- **Diseño Moderno**: Interfaz con gradientes, glassmorphism y animaciones
- **Información Detallada**:
  - Estado y versión de Vero
  - Nivel de prioridad
  - Personalidad y capacidades
  - Conexiones activas (MCP)
  - Subagentes operando
- **Enlaces Rápidos**: Acceso directo a endpoints de la API
- **Manejo de Errores**: Feedback visual cuando el backend no está disponible

## 🎨 Tecnologías

- **Next.js 15**: Framework React con App Router
- **React 19**: Biblioteca UI
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos utility-first
- **ESLint**: Linting de código

## 📁 Estructura

```
vero-ui/
├── app/
│   ├── page.tsx          # Dashboard principal
│   ├── layout.tsx        # Layout raíz
│   └── globals.css       # Estilos globales
├── public/               # Assets estáticos
└── package.json          # Configuración del proyecto
```

## 🔧 Configuración

### Cambiar URL del Backend

Si el backend está en otra URL, edita `app/page.tsx`:

```typescript
const response = await fetch('http://tu-backend-url/api/status');
```

### Cambiar Puerto del Frontend

En `package.json`:

```json
"scripts": {
  "dev": "next dev -p 3001"
}
```

## 🎯 Próximas Features

- [ ] Chat interface para MCP
- [ ] Panel de gestión de subagentes
- [ ] Visualización de logs en tiempo real
- [ ] Configuración de integraciones de IA
- [ ] Dashboard de métricas y analytics
- [ ] Modo oscuro/claro

## 📚 Comandos

```bash
npm run dev      # Desarrollo
npm run build    # Build para producción
npm run start    # Iniciar en producción
npm run lint     # Ejecutar linter
```

## 🤝 Contribuir

Este es el frontend oficial de Vero Core. Mantén el diseño consistente con la personalidad de Vero: dominante, eficiente, y visualmente atractivo.

---

**Vero UI** - Dashboard para la IA más dominante ✨
