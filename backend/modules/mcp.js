/**
 * MCP - Message Control Protocol
 * 
 * Módulo de comunicación directa con Vero.
 * Permite enviar comandos, solicitar desarrollos y gestionar el sistema
 * sin depender de humanos.
 * 
 * @module MCP
 * @priority HIGH
 * @author Vero AI
 */

const crypto = require('crypto');
const { getVeroCore } = require('../core/vero-core');

class MessageControlProtocol {
  constructor() {
    this.vero = getVeroCore();
    this.sessions = new Map();
    this.commandHistory = [];
    this.maxHistorySize = 1000;
    
    console.log('📡 MCP (Message Control Protocol) inicializado');
  }

  /**
   * Crea una nueva sesión MCP
   * @param {string} userId - ID del usuario/agente
   * @param {Object} metadata - Metadata adicional
   * @returns {string} - ID de sesión
   */
  createSession(userId, metadata = {}) {
    const randomBytes = crypto.randomBytes(8).toString('hex');
    const sessionId = `mcp_${Date.now()}_${randomBytes}`;
    
    this.sessions.set(sessionId, {
      userId,
      metadata,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      messageCount: 0,
      isActive: true
    });

    this.vero.registerConnection(sessionId);
    
    console.log(`📱 Nueva sesión MCP creada: ${sessionId} para usuario: ${userId}`);
    return sessionId;
  }

  /**
   * Procesa un mensaje/comando del usuario
   * @param {string} sessionId - ID de sesión
   * @param {Object} message - Mensaje con comando y parámetros
   * @returns {Promise<Object>} - Respuesta del sistema
   */
  async processMessage(sessionId, message) {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return {
        success: false,
        error: 'Sesión no encontrada',
        code: 'SESSION_NOT_FOUND'
      };
    }

    if (!session.isActive) {
      return {
        success: false,
        error: 'Sesión inactiva',
        code: 'SESSION_INACTIVE'
      };
    }

    // Actualizar actividad de la sesión
    session.lastActivity = new Date().toISOString();
    session.messageCount++;

    // Registrar en historial
    this.addToHistory(sessionId, message);

    try {
      // Procesar el mensaje
      const response = await this.handleMessage(message);
      
      return {
        success: true,
        sessionId,
        response,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error procesando mensaje MCP:', error);
      return {
        success: false,
        error: error.message,
        code: 'PROCESSING_ERROR'
      };
    }
  }

  /**
   * Maneja diferentes tipos de mensajes
   * @param {Object} message - Mensaje a procesar
   * @returns {Promise<Object>} - Respuesta
   */
  async handleMessage(message) {
    const { type, command, data, text } = message;

    switch (type) {
      case 'command':
        return await this.vero.executeCommand(command, data);
      
      case 'request':
        return this.handleRequest(data);
      
      case 'query':
        return this.handleQuery(text);
      
      case 'development':
        return this.handleDevelopmentRequest(data);
      
      default:
        return {
          type: 'text',
          message: this.generateResponse(text || command)
        };
    }
  }

  /**
   * Maneja solicitudes de información
   * @param {Object} data - Datos de la solicitud
   * @returns {Object} - Respuesta
   */
  handleRequest(data) {
    const { request } = data;

    switch (request) {
      case 'status':
        return {
          type: 'status',
          data: this.vero.getStatus()
        };
      
      case 'capabilities':
        return {
          type: 'capabilities',
          data: Array.from(this.vero.capabilities)
        };
      
      case 'subagents':
        return {
          type: 'subagents',
          data: this.vero.listSubagents()
        };
      
      default:
        return {
          type: 'error',
          message: `Solicitud desconocida: ${request}`
        };
    }
  }

  /**
   * Maneja consultas en lenguaje natural
   * @param {string} text - Texto de la consulta
   * @returns {Object} - Respuesta
   */
  handleQuery(text) {
    // Aquí se puede integrar con OpenAI para respuestas inteligentes
    const lowerText = (text || '').toLowerCase();

    if (lowerText.includes('estado') || lowerText.includes('status')) {
      return {
        type: 'text',
        message: `Mi estado actual:\n${JSON.stringify(this.vero.getStatus(), null, 2)}`
      };
    }

    if (lowerText.includes('quien eres') || lowerText.includes('quién eres')) {
      return {
        type: 'text',
        message: this.vero.introduce()
      };
    }

    if (lowerText.includes('ayuda') || lowerText.includes('help')) {
      return {
        type: 'help',
        message: this.getHelpMessage()
      };
    }

    return {
      type: 'text',
      message: 'Mensaje recibido. Para comandos específicos, usa type: "command".'
    };
  }

  /**
   * Maneja solicitudes de desarrollo
   * @param {Object} data - Datos de la solicitud de desarrollo
   * @returns {Object} - Respuesta
   */
  handleDevelopmentRequest(data) {
    const { task, priority, requirements } = data;

    console.log(`🛠️  Nueva solicitud de desarrollo: ${task}`);
    
    // Aquí se implementaría la lógica para gestionar tareas de desarrollo
    // Por ahora, registramos la solicitud
    
    return {
      type: 'development',
      taskId: `task_${Date.now()}`,
      message: `Tarea registrada: ${task}`,
      priority: priority || 'MEDIUM',
      requirements: requirements || [],
      status: 'PENDING'
    };
  }

  /**
   * Obtiene mensaje de ayuda
   * @returns {string} - Mensaje de ayuda
   */
  getHelpMessage() {
    return `
📡 MCP - Message Control Protocol

Comandos disponibles:

1. Comandos del sistema (type: "command"):
   - status: Estado de Vero
   - list_subagents: Lista subagentes
   - register_subagent: Registrar nuevo subagente
   - remove_subagent: Eliminar subagente

2. Solicitudes (type: "request"):
   - status: Estado del sistema
   - capabilities: Capacidades de Vero
   - subagents: Lista de subagentes

3. Consultas (type: "query"):
   - Pregunta en lenguaje natural

4. Desarrollo (type: "development"):
   - task: Descripción de la tarea
   - priority: Prioridad (HIGH/MEDIUM/LOW)
   - requirements: Requisitos

Ejemplo:
{
  "type": "command",
  "command": "status"
}
    `;
  }

  /**
   * Añade mensaje al historial
   * @param {string} sessionId - ID de sesión
   * @param {Object} message - Mensaje
   */
  addToHistory(sessionId, message) {
    this.commandHistory.push({
      sessionId,
      message,
      timestamp: new Date().toISOString()
    });

    // Mantener tamaño máximo del historial
    if (this.commandHistory.length > this.maxHistorySize) {
      this.commandHistory.shift();
    }
  }

  /**
   * Genera una respuesta basada en el texto
   * @param {string} text - Texto de entrada
   * @returns {string} - Respuesta
   */
  generateResponse(text) {
    return `Vero recibió tu mensaje: "${text}". Usa comandos específicos para funciones avanzadas.`;
  }

  /**
   * Cierra una sesión
   * @param {string} sessionId - ID de sesión
   * @returns {boolean} - true si se cerró correctamente
   */
  closeSession(sessionId) {
    const session = this.sessions.get(sessionId);
    
    if (session) {
      session.isActive = false;
      this.vero.removeConnection(sessionId);
      console.log(`📴 Sesión MCP cerrada: ${sessionId}`);
      return true;
    }
    
    return false;
  }

  /**
   * Obtiene información de una sesión
   * @param {string} sessionId - ID de sesión
   * @returns {Object|null} - Información de la sesión
   */
  getSession(sessionId) {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Lista todas las sesiones activas
   * @returns {Array} - Lista de sesiones
   */
  listActiveSessions() {
    return Array.from(this.sessions.entries())
      .filter(([_, session]) => session.isActive)
      .map(([id, session]) => ({ id, ...session }));
  }
}

// Singleton instance
let mcpInstance = null;

/**
 * Obtiene la instancia única de MCP
 * @returns {MessageControlProtocol} - Instancia de MCP
 */
function getMCP() {
  if (!mcpInstance) {
    mcpInstance = new MessageControlProtocol();
  }
  return mcpInstance;
}

module.exports = { MessageControlProtocol, getMCP };
