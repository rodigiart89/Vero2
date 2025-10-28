# Vero Core - Architecture

## Visión General

Vero Core es una arquitectura modular y escalable diseñada para que Vero sea la IA dominante y omnipresente. El sistema está construido con los siguientes principios:

1. **Vero Primero**: Todo el sistema gira en torno a Vero con prioridad MAXIMUM
2. **Modularidad**: Componentes independientes y reutilizables
3. **Extensibilidad**: Fácil añadir nuevas funcionalidades
4. **Seguridad**: Control de acceso y validaciones en todos los niveles
5. **Escalabilidad**: Diseñado para crecer sin límites

## Estructura del Proyecto

```
Vero2/
├── backend/
│   ├── core/
│   │   └── vero-core.js          # Núcleo de control de Vero
│   ├── modules/
│   │   ├── mcp.js                # Message Control Protocol
│   │   ├── ai-integrations.js   # Integraciones con IA
│   │   └── subagent-manager.js  # Gestión de subagentes
│   ├── api/
│   │   └── routes.js             # Rutas de la API REST
│   ├── config/
│   │   └── (configuraciones)
│   ├── utils/
│   │   └── (utilidades)
│   └── server.js                 # Servidor principal
├── frontend/
│   └── vero-ui/
│       └── (React/Next.js app)
├── docs/
│   ├── API.md                    # Documentación de API
│   ├── ARCHITECTURE.md           # Este documento
│   └── DEVELOPMENT.md            # Guía de desarrollo
├── .env.example                  # Plantilla de variables
├── .gitignore                    # Archivos ignorados
├── package.json                  # Configuración del proyecto
└── README.md                     # Readme principal
```

## Componentes Core

### 1. Vero Core (`backend/core/vero-core.js`)

El corazón del sistema. Gestiona:
- Estado y personalidad de Vero
- Registro de subagentes
- Gestión de conexiones activas
- Ejecución de comandos del sistema

**Características clave:**
- Singleton pattern para instancia única
- Prioridad MAXIMUM siempre
- Control total sobre subagentes
- Sistema de capacidades extensible

```javascript
const vero = getVeroCore();
vero.getStatus();          // Estado actual
vero.registerSubagent();   // Crear subagente
vero.executeCommand();     // Ejecutar comando
```

### 2. MCP - Message Control Protocol (`backend/modules/mcp.js`)

Sistema de comunicación directa con Vero.

**Funcionalidades:**
- Crear sesiones de comunicación
- Procesar mensajes y comandos
- Gestionar historial
- Responder consultas en lenguaje natural

**Tipos de mensaje:**
1. **command**: Comandos del sistema
2. **request**: Solicitudes de información
3. **query**: Consultas en lenguaje natural
4. **development**: Solicitudes de desarrollo

```javascript
const mcp = getMCP();
const sessionId = mcp.createSession('user_id');
const response = await mcp.processMessage(sessionId, message);
```

### 3. AI Integrations (`backend/modules/ai-integrations.js`)

Módulo para integraciones con servicios de IA externos.

**Servicios soportados:**
- OpenAI (GPT models)
- ElevenLabs (Voice synthesis)
- Avatar 3D (preparado para integración)

**Preparado para:**
- Instalar SDKs según necesidad
- Configurar con variables de entorno
- Extender con nuevos servicios

```javascript
const ai = getAIIntegrations();
await ai.initialize();
await ai.queryOpenAI(prompt);
await ai.generateVoice(text);
```

### 4. Subagent Manager (`backend/modules/subagent-manager.js`)

Gestiona subagentes independientes bajo control de Vero.

**Funcionalidades:**
- Crear subagentes desde plantillas
- Validar acciones según permisos
- Ejecutar acciones con restricciones
- Estadísticas y monitoreo

**Plantillas disponibles:**
- `lucia`: Asistente personal
- `generic`: Subagente genérico

**Restricciones:**
- Los subagentes NO pueden sobrescribir a Vero
- Permisos limitados y validados
- Prioridad siempre menor que Vero

```javascript
const manager = getSubagentManager();
const lucia = manager.createLucia();
const valid = manager.validateAction(id, 'respond');
await manager.executeSubagentAction(id, action, params);
```

## Flujo de Datos

### 1. Inicio del Sistema

```
Usuario inicia servidor
         ↓
   server.js inicializa
         ↓
   Vero Core carga
         ↓
   MCP inicializa
         ↓
   AI Integrations verifica config
         ↓
   Subagent Manager carga templates
         ↓
   Express server escucha en puerto
         ↓
   Sistema listo
```

### 2. Procesamiento de Request MCP

```
Cliente → POST /api/mcp/message
              ↓
    Validación de sesión
              ↓
    MCP procesa mensaje
              ↓
    Determina tipo (command/query/etc)
              ↓
    Vero Core ejecuta acción
              ↓
    Respuesta al cliente
```

### 3. Gestión de Subagentes

```
Request crear subagente
         ↓
Subagent Manager valida template
         ↓
Vero Core registra subagente
         ↓
Subagente activo con restricciones
         ↓
Acciones validadas antes de ejecutar
```

## Patrones de Diseño

### 1. Singleton Pattern

Usado en todos los módulos core para asegurar una única instancia:

```javascript
let veroInstance = null;

function getVeroCore() {
  if (!veroInstance) {
    veroInstance = new VeroCore();
  }
  return veroInstance;
}
```

**Beneficios:**
- Estado consistente
- Evita duplicación
- Control centralizado

### 2. Factory Pattern

Usado en Subagent Manager para crear subagentes desde plantillas:

```javascript
createSubagent(templateName, customConfig) {
  const template = this.templates.get(templateName);
  // Combinar template con config
  return new Subagent(mergedConfig);
}
```

### 3. Strategy Pattern

MCP usa estrategias diferentes según el tipo de mensaje:

```javascript
switch (type) {
  case 'command': return executeCommand();
  case 'query': return handleQuery();
  case 'development': return handleDevelopment();
}
```

## Seguridad

### 1. Niveles de Prioridad

```
MAXIMUM  → Solo Vero
HIGH     → Módulos core
MEDIUM   → Subagentes especiales (Lucía)
LOW      → Subagentes genéricos
```

### 2. Validación de Acciones

Todas las acciones de subagentes son validadas:

```javascript
validateAction(subagentId, action) {
  // Verifica permisos
  // Verifica restricciones
  // Aprueba o rechaza
}
```

### 3. Restricciones de Subagentes

Acciones prohibidas:
- `system_control`
- `vero_override`
- `priority_escalation`
- `master_modification`

### 4. Middleware de Seguridad

- **Helmet**: Headers HTTP seguros
- **CORS**: Control de acceso
- **Input Validation**: Validación de entradas
- **Environment Variables**: Configuración sensible

## Escalabilidad

### Horizontal

- API REST stateless
- Sesiones MCP con IDs únicos
- Cada instancia puede manejar requests independientes

### Vertical

- Módulos independientes
- Procesamiento asíncrono
- Carga bajo demanda

### Extensibilidad

```javascript
// Añadir nueva capacidad a Vero
vero.capabilities.add('nueva_capacidad');

// Añadir nueva plantilla de subagente
manager.addTemplate('nuevo_tipo', config);

// Añadir nueva integración de IA
ai.addService('nuevo_servicio', handler);
```

## Tecnologías

### Backend
- **Node.js**: Runtime de JavaScript
- **Express**: Framework web
- **dotenv**: Variables de entorno
- **Helmet**: Seguridad HTTP
- **Morgan**: Logging
- **CORS**: Cross-Origin Resource Sharing

### Frontend (Preparado)
- **React**: Biblioteca UI
- **Next.js**: Framework React
- **Tailwind CSS**: Estilos
- **Socket.io**: WebSockets (futuro)

### Integraciones (Preparadas)
- **OpenAI SDK**: GPT models
- **ElevenLabs**: Voice synthesis
- **Three.js**: Avatar 3D (futuro)

## Principios SOLID

### Single Responsibility
Cada módulo tiene una responsabilidad única:
- VeroCore: Control del sistema
- MCP: Comunicación
- AIIntegrations: Servicios de IA
- SubagentManager: Gestión de subagentes

### Open/Closed
Abierto para extensión, cerrado para modificación:
- Nuevas capacidades sin cambiar core
- Nuevas plantillas de subagentes
- Nuevas integraciones de IA

### Liskov Substitution
Los subagentes pueden sustituir comportamientos base sin romper el sistema.

### Interface Segregation
Cada módulo expone solo métodos relevantes.

### Dependency Inversion
Los módulos dependen de abstracciones (getters) no de implementaciones concretas.

## Monitoreo y Logs

### Logs de Sistema
```javascript
console.log('✨ Vero Core inicializada');
console.log('📡 MCP inicializado');
console.log('🤖 Subagente creado');
```

### Health Checks
```bash
GET /health
```

### Estadísticas
```javascript
manager.getStatistics();  // Stats de subagentes
mcp.listActiveSessions(); // Sesiones activas
```

## Próximas Mejoras

1. **Persistencia**: Base de datos para estado
2. **Authentication**: JWT tokens
3. **WebSockets**: Comunicación en tiempo real
4. **Frontend**: UI completa con React/Next.js
5. **Tests**: Suite de pruebas completa
6. **CI/CD**: Pipeline automatizado
7. **Docker**: Containerización
8. **Monitoring**: APM y métricas
9. **Cache**: Redis para performance
10. **Queue**: Sistema de colas para tareas

## Conclusión

Vero Core está diseñado para ser:
- **Dominante**: Vero tiene control total
- **Omnipresente**: Preparado para todas las plataformas
- **Escalable**: Crece sin límites
- **Seguro**: Protección en todos los niveles
- **Extensible**: Fácil añadir funcionalidades

---

**Vero Core v2.0.0** - Arquitectura para dominar 🏗️
