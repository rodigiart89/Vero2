# Vero Core - Development Guide

## Guía para Desarrolladores y para Vero

Este documento guía el desarrollo futuro de Vero Core, tanto para desarrolladores humanos como para que Vero pueda solicitar cambios y expansiones a través de MCP.

## Configuración del Entorno

### Requisitos
- Node.js 18+ 
- npm o yarn
- Git
- Editor de código (VS Code recomendado)

### Setup Inicial

```bash
# Clonar repositorio
git clone <repository-url>
cd Vero2

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus configuraciones
nano .env

# Iniciar en modo desarrollo
npm run dev
```

### Variables de Entorno Requeridas

```bash
# Básicas (obligatorias)
PORT=3000
NODE_ENV=development

# Para integraciones de IA (opcionales para dev)
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...

# Seguridad (generar valores únicos)
JWT_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -base64 32)
MCP_ADMIN_PASSWORD=secure_password
```

## Estructura de Desarrollo

### Añadir Nuevo Módulo

1. **Crear el archivo del módulo**
```bash
touch backend/modules/nuevo-modulo.js
```

2. **Estructura básica del módulo**
```javascript
/**
 * Nuevo Módulo
 * 
 * Descripción del módulo y su propósito.
 * 
 * @module NuevoModulo
 * @author Vero AI
 */

class NuevoModulo {
  constructor() {
    console.log('🚀 Nuevo Módulo inicializado');
  }

  // Métodos del módulo
}

let instance = null;

function getNuevoModulo() {
  if (!instance) {
    instance = new NuevoModulo();
  }
  return instance;
}

module.exports = { NuevoModulo, getNuevoModulo };
```

3. **Integrar en el sistema**
```javascript
// En backend/server.js
const { getNuevoModulo } = require('./modules/nuevo-modulo');
const nuevoModulo = getNuevoModulo();
```

### Añadir Nuevas Rutas API

1. **En backend/api/routes.js**
```javascript
/**
 * GET /nuevo-endpoint - Descripción
 */
router.get('/nuevo-endpoint', async (req, res) => {
  try {
    const resultado = await nuevoModulo.metodo();
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});
```

2. **Documentar en docs/API.md**

### Añadir Nueva Capacidad a Vero

```javascript
// En backend/core/vero-core.js
this.capabilities.add('nueva_capacidad');

// Añadir método correspondiente
nuevaCapacidad() {
  console.log('⚡ Ejecutando nueva capacidad');
  // Implementación
}
```

### Añadir Nueva Plantilla de Subagente

```javascript
// En backend/modules/subagent-manager.js
this.templates.set('nuevo_agente', {
  name: 'Nuevo Agente',
  type: 'specialized',
  priority: 'MEDIUM',
  permissions: ['read', 'respond'],
  restrictions: [
    'no_system_control',
    'no_vero_override'
  ],
  capabilities: ['capability1', 'capability2'],
  description: 'Descripción del nuevo agente'
});
```

### Añadir Nueva Integración de IA

1. **Instalar SDK si es necesario**
```bash
npm install nuevo-sdk
```

2. **En backend/modules/ai-integrations.js**
```javascript
async connectNuevoServicio() {
  const apiKey = process.env.NUEVO_SERVICIO_KEY;
  
  if (!apiKey) {
    return { success: false, error: 'API key no configurada' };
  }

  // Implementar integración
  console.log('🔗 Conectando con Nuevo Servicio');
  
  return { success: true };
}
```

3. **Añadir ruta en API**
```javascript
router.post('/ai/nuevo-servicio', async (req, res) => {
  const { data } = req.body;
  const result = await aiIntegrations.connectNuevoServicio(data);
  res.json(result);
});
```

## Testing

### Pruebas Manuales

```bash
# 1. Verificar que el servidor inicia
npm start

# 2. Probar endpoints con curl
curl http://localhost:3000/health
curl http://localhost:3000/api/status

# 3. Crear sesión MCP
curl -X POST http://localhost:3000/api/mcp/session \
  -H "Content-Type: application/json" \
  -d '{"userId": "test_user"}'

# 4. Enviar mensaje MCP
curl -X POST http://localhost:3000/api/mcp/message \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "mcp_...",
    "message": {
      "type": "query",
      "text": "¿Quién eres?"
    }
  }'
```

### Añadir Tests Automatizados (Futuro)

```javascript
// tests/vero-core.test.js
const { getVeroCore } = require('../backend/core/vero-core');

describe('Vero Core', () => {
  it('debe inicializar con prioridad MAXIMUM', () => {
    const vero = getVeroCore();
    expect(vero.priority).toBe('MAXIMUM');
  });

  it('debe registrar subagentes', () => {
    const vero = getVeroCore();
    const id = vero.registerSubagent('test', {});
    expect(id).toBeDefined();
  });
});
```

## Comandos Útiles

```bash
# Desarrollo
npm run dev              # Iniciar servidor en modo desarrollo

# Producción
npm start                # Iniciar servidor

# Linting (cuando esté configurado)
npm run lint             # Verificar código
npm run lint:fix         # Arreglar problemas

# Tests (cuando estén configurados)
npm test                 # Ejecutar tests
npm run test:watch       # Tests en modo watch

# Otros
npm run check            # Verificar estado del proyecto
```

## Buenas Prácticas

### 1. Código Limpio
- Usar nombres descriptivos
- Funciones pequeñas y específicas
- Comentarios donde sea necesario
- Mantener consistencia con el código existente

### 2. Seguridad
- Nunca commitear claves de API
- Validar todas las entradas
- Usar variables de entorno para secretos
- Implementar rate limiting cuando sea necesario

### 3. Documentación
- Documentar nuevas funcionalidades en docs/
- Actualizar API.md con nuevos endpoints
- Comentar código complejo
- Mantener README.md actualizado

### 4. Control de Versiones
```bash
# Commits descriptivos
git commit -m "feat: añadir nueva capacidad X"
git commit -m "fix: corregir error en MCP"
git commit -m "docs: actualizar API documentation"

# Prefijos útiles
# feat: nueva funcionalidad
# fix: corrección de bug
# docs: documentación
# refactor: refactorización
# test: añadir tests
# chore: tareas de mantenimiento
```

### 5. Estructura de Commits

```bash
# Crear rama para nueva feature
git checkout -b feature/nueva-funcionalidad

# Hacer cambios y commits
git add .
git commit -m "feat: implementar nueva funcionalidad"

# Push y crear PR
git push origin feature/nueva-funcionalidad
```

## Extensiones de VS Code Recomendadas

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "christian-kohler.path-intellisense",
    "formulahendry.auto-rename-tag",
    "ms-azuretools.vscode-docker"
  ]
}
```

## Solución de Problemas Comunes

### Error: Cannot find module
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Puerto ya en uso
```bash
# Cambiar puerto en .env
PORT=3001

# O matar proceso en puerto 3000
lsof -ti:3000 | xargs kill -9
```

### Variables de entorno no cargadas
```bash
# Verificar que .env existe
ls -la .env

# Verificar que dotenv se carga en server.js
require('dotenv').config();
```

## Roadmap de Desarrollo

### Fase 1: Backend Core ✅
- [x] Vero Core module
- [x] MCP (Message Control Protocol)
- [x] Subagent Manager
- [x] AI Integrations (preparado)
- [x] API REST
- [x] Documentación básica

### Fase 2: Frontend (Próximo)
- [ ] Inicializar Next.js con Tailwind
- [ ] Dashboard de Vero
- [ ] Interfaz MCP chat
- [ ] Panel de gestión de subagentes
- [ ] Visualización de estado en tiempo real

### Fase 3: Integraciones IA
- [ ] Implementar OpenAI SDK completo
- [ ] Implementar ElevenLabs para voz
- [ ] Integrar avatar 3D (Three.js o Ready Player Me)
- [ ] Sistema de conversación con contexto

### Fase 4: Features Avanzadas
- [ ] Autenticación JWT
- [ ] WebSockets para comunicación en tiempo real
- [ ] Base de datos (PostgreSQL o MongoDB)
- [ ] Sistema de plugins
- [ ] API Gateway

### Fase 5: Producción
- [ ] Tests completos (unit, integration, e2e)
- [ ] CI/CD pipeline
- [ ] Docker y Docker Compose
- [ ] Documentación de deployment
- [ ] Monitoring y logs (ELK stack)
- [ ] Backup y recovery

## Cómo Vero Puede Solicitar Desarrollos

### A través de MCP

```javascript
// Vero puede enviar solicitudes de desarrollo vía MCP
{
  "type": "development",
  "data": {
    "task": "Implementar sistema de notificaciones",
    "priority": "HIGH",
    "requirements": [
      "Soporte para email y push notifications",
      "Templates personalizables",
      "Queue system para envío masivo",
      "Integración con frontend"
    ],
    "estimatedTime": "2-3 días",
    "dependencies": ["nodemailer", "firebase-admin"]
  }
}
```

### Formato de Solicitud

1. **Descripción clara**: Qué se necesita
2. **Prioridad**: HIGH/MEDIUM/LOW
3. **Requirements**: Lista detallada
4. **Dependencies**: Librerías necesarias
5. **Estimated Time**: Tiempo estimado

### Proceso

1. Vero envía solicitud por MCP
2. Sistema registra en development queue
3. Desarrollador (humano o AI) recibe tarea
4. Implementa según especificaciones
5. Vero prueba y aprueba
6. Deploy a producción

## Contribuir al Proyecto

### Para Desarrolladores Externos

1. Fork del repositorio
2. Crear rama para feature
3. Implementar cambios
4. Tests y documentación
5. Pull Request con descripción detallada

### Código de Conducta

- Mantener la filosofía de Vero: control, eficiencia, escalabilidad
- Documentar todo cambio importante
- No sobrescribir o reducir el control de Vero
- Priorizar seguridad y performance

## Recursos

### Documentación
- [API.md](API.md) - Documentación completa de API
- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitectura del sistema
- [README.md](../README.md) - Readme principal

### Enlaces Útiles
- [Node.js Docs](https://nodejs.org/docs/)
- [Express Guide](https://expressjs.com/guide/)
- [OpenAI API](https://platform.openai.com/docs/)
- [ElevenLabs Docs](https://elevenlabs.io/docs/)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Contacto y Soporte

Para cualquier duda o consulta sobre desarrollo:
1. Revisar documentación existente
2. Buscar en issues del repositorio
3. Contactar a través de MCP
4. Crear issue con label "question" o "help wanted"

---

**Vero Core v2.0.0** - Desarrollado con ❤️ para dominar 💻
