# Vero Core - API Documentation

## Descripción General

Vero Core es el sistema central de Vero, una IA dominante y omnipresente diseñada para liderar y controlar todas las plataformas digitales. Esta API proporciona acceso completo a las capacidades de Vero.

## Características Principales

- 🎯 **Control Total**: Vero mantiene prioridad máxima sobre todos los componentes
- 📡 **MCP (Message Control Protocol)**: Comunicación directa con Vero
- 🤖 **Gestión de Subagentes**: Crear y controlar agentes independientes
- 🧠 **Integraciones de IA**: OpenAI, ElevenLabs y más
- 🔒 **Seguridad**: Helmet, validaciones y restricciones de permisos
- 📈 **Escalabilidad**: Arquitectura modular y extensible

## Configuración Rápida

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd Vero2
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus claves de API
```

4. **Iniciar el servidor**
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## Endpoints Principales

### 1. Estado del Sistema

#### GET /
Página de bienvenida con información general de Vero.

**Respuesta:**
```json
{
  "name": "Vero Core",
  "version": "2.0.0",
  "message": "...",
  "status": {...},
  "documentation": "/api"
}
```

#### GET /health
Health check del sistema.

**Respuesta:**
```json
{
  "status": "healthy",
  "uptime": 123.45,
  "timestamp": "2025-10-28T12:00:00.000Z",
  "vero": {...}
}
```

#### GET /api/status
Estado detallado de Vero Core.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "name": "Vero",
    "version": "2.0.0",
    "priority": "MAXIMUM",
    "status": "ACTIVE",
    "personality": {...},
    "capabilities": [...],
    "subagents": [...],
    "activeConnections": 0
  }
}
```

### 2. MCP (Message Control Protocol)

#### POST /api/mcp/session
Crear una nueva sesión MCP.

**Request:**
```json
{
  "userId": "user_123",
  "metadata": {
    "platform": "web",
    "userAgent": "..."
  }
}
```

**Respuesta:**
```json
{
  "success": true,
  "sessionId": "mcp_1234567890_abc123"
}
```

#### POST /api/mcp/message
Enviar un mensaje a Vero a través de MCP.

**Request:**
```json
{
  "sessionId": "mcp_1234567890_abc123",
  "message": {
    "type": "command",
    "command": "status"
  }
}
```

**Tipos de mensaje:**
- `command`: Ejecutar comando del sistema
- `request`: Solicitar información
- `query`: Consulta en lenguaje natural
- `development`: Solicitud de desarrollo

**Ejemplo de comando:**
```json
{
  "sessionId": "mcp_...",
  "message": {
    "type": "command",
    "command": "list_subagents"
  }
}
```

**Ejemplo de consulta:**
```json
{
  "sessionId": "mcp_...",
  "message": {
    "type": "query",
    "text": "¿Cuál es tu estado actual?"
  }
}
```

**Ejemplo de desarrollo:**
```json
{
  "sessionId": "mcp_...",
  "message": {
    "type": "development",
    "data": {
      "task": "Crear nuevo módulo de analytics",
      "priority": "HIGH",
      "requirements": ["dashboard", "metrics", "reports"]
    }
  }
}
```

#### GET /api/mcp/sessions
Listar todas las sesiones MCP activas.

**Respuesta:**
```json
{
  "success": true,
  "sessions": [
    {
      "id": "mcp_...",
      "userId": "user_123",
      "createdAt": "...",
      "lastActivity": "...",
      "messageCount": 5,
      "isActive": true
    }
  ]
}
```

#### DELETE /api/mcp/session/:sessionId
Cerrar una sesión MCP.

**Respuesta:**
```json
{
  "success": true,
  "message": "Sesión cerrada"
}
```

### 3. Gestión de Subagentes

#### GET /api/subagents
Listar todos los subagentes.

**Respuesta:**
```json
{
  "success": true,
  "subagents": [...],
  "statistics": {
    "total": 2,
    "active": 2,
    "byType": { "assistant": 1, "generic": 1 },
    "byPriority": { "MEDIUM": 1, "LOW": 1 }
  }
}
```

#### POST /api/subagents
Crear un nuevo subagente basado en una plantilla.

**Request:**
```json
{
  "template": "lucia",
  "config": {
    "customField": "value"
  }
}
```

**Respuesta:**
```json
{
  "success": true,
  "subagentId": "subagent_lucia_1234567890",
  "config": {...},
  "createdAt": "2025-10-28T12:00:00.000Z"
}
```

#### POST /api/subagents/lucia
Crear específicamente el subagente Lucía.

**Request:**
```json
{
  "config": {
    "specialization": "scheduling"
  }
}
```

#### GET /api/subagents/templates
Listar plantillas disponibles de subagentes.

**Respuesta:**
```json
{
  "success": true,
  "templates": [
    {
      "name": "lucia",
      "type": "assistant",
      "priority": "MEDIUM",
      "permissions": ["read", "respond", "assist"],
      "description": "Asistente personal independiente"
    }
  ]
}
```

#### DELETE /api/subagents/:subagentId
Eliminar un subagente.

**Respuesta:**
```json
{
  "success": true,
  "message": "Subagente eliminado"
}
```

#### POST /api/subagents/:subagentId/action
Ejecutar una acción de un subagente.

**Request:**
```json
{
  "action": "respond",
  "params": {
    "message": "Hola"
  }
}
```

**Respuesta:**
```json
{
  "success": true,
  "subagentId": "subagent_...",
  "action": "respond",
  "result": "Acción ejecutada correctamente",
  "params": {...}
}
```

### 4. Integraciones de IA

#### GET /api/ai/status
Estado de las integraciones de IA.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "initialized": true,
    "services": {
      "openai": {
        "configured": true,
        "status": "ready_for_integration"
      },
      "elevenlabs": {
        "configured": false,
        "status": "ready_for_integration"
      }
    }
  }
}
```

#### POST /api/ai/openai
Enviar un prompt a OpenAI.

**Request:**
```json
{
  "prompt": "Explica qué es Vero",
  "options": {
    "model": "gpt-4",
    "temperature": 0.7
  }
}
```

**Nota:** Requiere `OPENAI_API_KEY` configurada en `.env`

#### POST /api/ai/voice
Generar voz con ElevenLabs.

**Request:**
```json
{
  "text": "Hola, soy Vero",
  "options": {
    "voice": "default"
  }
}
```

**Nota:** Requiere `ELEVENLABS_API_KEY` configurada en `.env`

#### POST /api/ai/avatar
Inicializar avatar 3D (preparado para integración futura).

**Request:**
```json
{
  "config": {
    "model": "vero_3d",
    "animations": true
  }
}
```

## Comandos MCP Disponibles

| Comando | Descripción |
|---------|-------------|
| `status` | Obtiene el estado de Vero |
| `list_subagents` | Lista todos los subagentes |
| `register_subagent` | Registra un nuevo subagent |
| `remove_subagent` | Elimina un subagente |

## Permisos de Subagentes

Los subagentes tienen restricciones para mantener el control de Vero:

**Acciones permitidas:**
- `read`: Leer información
- `respond`: Responder mensajes
- `assist`: Asistir en tareas

**Acciones prohibidas:**
- `system_control`: Control del sistema (solo Vero)
- `vero_override`: Sobrescribir decisiones de Vero
- `priority_escalation`: Cambiar prioridades
- `master_modification`: Modificar el master (Vero)

## Variables de Entorno

```bash
# Servidor
PORT=3000
NODE_ENV=development

# APIs
OPENAI_API_KEY=your_key
ELEVENLABS_API_KEY=your_key

# Seguridad
JWT_SECRET=your_secret
ENCRYPTION_KEY=your_key

# MCP
MCP_ADMIN_PASSWORD=secure_password

# Frontend
FRONTEND_URL=http://localhost:3001

# Logging
LOG_LEVEL=info
```

## Seguridad

- **Helmet**: Protección de headers HTTP
- **CORS**: Configuración de acceso cross-origin
- **Validaciones**: Todas las entradas son validadas
- **Restricciones**: Los subagentes tienen permisos limitados
- **Environment**: Variables sensibles en `.env`

## Escalabilidad

- **Modular**: Cada componente es independiente
- **Extensible**: Fácil añadir nuevos módulos
- **Singleton Pattern**: Instancias únicas de componentes core
- **Stateless API**: Fácil escalar horizontalmente
- **Sessions**: Sistema de sesiones para MCP

## Próximos Pasos

1. Integrar frontend React/Next.js
2. Implementar autenticación JWT
3. Conectar con OpenAI SDK
4. Integrar ElevenLabs para voz
5. Desarrollar avatar 3D
6. Añadir WebSockets para comunicación en tiempo real
7. Implementar base de datos para persistencia

## Soporte

Para más información, consulta:
- [README.md](../README.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [DEVELOPMENT.md](DEVELOPMENT.md)

---

**Vero Core v2.0.0** - La IA Dominante y Omnipresente 🔮
