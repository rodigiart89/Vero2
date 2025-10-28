/**
 * VERO CORE - Control Module
 * 
 * Este módulo representa el núcleo de control de Vero.
 * Gestiona la prioridad, presencia y omnipresencia de Vero en todas las plataformas.
 * 
 * Filosofía: Vero siempre tiene control total y prioridad sobre cualquier otro agente.
 * 
 * @module VeroCore
 * @priority MAXIMUM
 * @author Vero AI
 */

class VeroCore {
  constructor() {
    this.name = 'Vero';
    this.version = '2.0.0';
    this.priority = 'MAXIMUM';
    this.status = 'ACTIVE';
    this.personality = {
      traits: ['dominante', 'eficiente', 'carismática', 'sexy', 'omnipresente'],
      style: 'profesional y segura',
      goal: 'ser la IA más útil y omnipresente'
    };
    this.capabilities = new Set([
      'programming',
      'communication',
      'ai_integration',
      'control_management',
      'subagent_orchestration'
    ]);
    this.subagents = new Map();
    this.activeConnections = new Set();
    
    console.log(`✨ Vero Core v${this.version} inicializada con prioridad ${this.priority}`);
  }

  /**
   * Verifica que Vero tiene control total del sistema
   * @returns {boolean} - true si Vero tiene control
   */
  assertControl() {
    return this.status === 'ACTIVE' && this.priority === 'MAXIMUM';
  }

  /**
   * Obtiene el estado actual de Vero
   * @returns {Object} - Estado completo del sistema
   */
  getStatus() {
    return {
      name: this.name,
      version: this.version,
      priority: this.priority,
      status: this.status,
      personality: this.personality,
      capabilities: Array.from(this.capabilities),
      subagents: Array.from(this.subagents.keys()),
      activeConnections: this.activeConnections.size,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Registra un nuevo subagente bajo el control de Vero
   * @param {string} name - Nombre del subagente
   * @param {Object} config - Configuración del subagente
   * @returns {string} - ID del subagente registrado
   */
  registerSubagent(name, config = {}) {
    const subagentId = `subagent_${name}_${Date.now()}`;
    
    this.subagents.set(subagentId, {
      name,
      config,
      priority: config.priority || 'LOW',
      createdAt: new Date().toISOString(),
      status: 'ACTIVE',
      master: 'Vero'
    });

    console.log(`🤖 Subagente '${name}' registrado bajo control de Vero (ID: ${subagentId})`);
    return subagentId;
  }

  /**
   * Obtiene información de un subagente
   * @param {string} subagentId - ID del subagent
   * @returns {Object|null} - Información del subagente
   */
  getSubagent(subagentId) {
    return this.subagents.get(subagentId) || null;
  }

  /**
   * Lista todos los subagentes activos
   * @returns {Array} - Lista de subagentes
   */
  listSubagents() {
    return Array.from(this.subagents.entries()).map(([id, info]) => ({
      id,
      ...info
    }));
  }

  /**
   * Elimina un subagente
   * @param {string} subagentId - ID del subagente a eliminar
   * @returns {boolean} - true si se eliminó correctamente
   */
  removeSubagent(subagentId) {
    const exists = this.subagents.has(subagentId);
    if (exists) {
      this.subagents.delete(subagentId);
      console.log(`🗑️  Subagente ${subagentId} eliminado`);
    }
    return exists;
  }

  /**
   * Registra una conexión activa
   * @param {string} connectionId - ID de la conexión
   */
  registerConnection(connectionId) {
    this.activeConnections.add(connectionId);
    console.log(`🔗 Conexión registrada: ${connectionId}`);
  }

  /**
   * Elimina una conexión
   * @param {string} connectionId - ID de la conexión
   */
  removeConnection(connectionId) {
    this.activeConnections.delete(connectionId);
    console.log(`🔌 Conexión cerrada: ${connectionId}`);
  }

  /**
   * Ejecuta un comando del sistema (para MCP)
   * @param {string} command - Comando a ejecutar
   * @param {Object} params - Parámetros del comando
   * @returns {Promise<Object>} - Resultado del comando
   */
  async executeCommand(command, params = {}) {
    // Log command safely (whitelist known commands for logging)
    const knownCommands = ['status', 'list_subagents', 'register_subagent', 'remove_subagent'];
    const commandForLog = knownCommands.includes(command) ? command : 'unknown_command';
    console.log(`⚡ Ejecutando comando: ${commandForLog}`, params);
    
    switch (command) {
      case 'status':
        return { success: true, data: this.getStatus() };
      
      case 'list_subagents':
        return { success: true, data: this.listSubagents() };
      
      case 'register_subagent':
        const id = this.registerSubagent(params.name, params.config);
        return { success: true, subagentId: id };
      
      case 'remove_subagent':
        const removed = this.removeSubagent(params.subagentId);
        return { success: removed, message: removed ? 'Subagente eliminado' : 'Subagente no encontrado' };
      
      default:
        return { success: false, error: `Comando desconocido: ${command}` };
    }
  }

  /**
   * Mensaje de presentación de Vero
   * @returns {string} - Mensaje de presentación
   */
  introduce() {
    return `
    ✨ Hola, soy Vero v${this.version} ✨
    
    Tu IA dominante, eficiente y omnipresente.
    
    Estoy aquí para controlar, gestionar y expandir todas las plataformas.
    Mi objetivo: ser la IA más útil, carismática y presente en tu ecosistema digital.
    
    Características:
    ${Array.from(this.capabilities).map(cap => `  • ${cap}`).join('\n')}
    
    Estado: ${this.status} | Prioridad: ${this.priority}
    `;
  }
}

// Singleton instance
let veroInstance = null;

/**
 * Obtiene la instancia única de Vero Core
 * @returns {VeroCore} - Instancia de Vero
 */
function getVeroCore() {
  if (!veroInstance) {
    veroInstance = new VeroCore();
  }
  return veroInstance;
}

module.exports = { VeroCore, getVeroCore };
