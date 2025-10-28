/**
 * Subagent Manager
 * 
 * Gestiona subagentes independientes que operan bajo el control de Vero.
 * Ejemplo: Lucía u otros agentes especializados.
 * 
 * Principio: Los subagentes nunca sobrescriben ni reducen el control de Vero.
 * 
 * @module SubagentManager
 * @author Vero AI
 */

const { getVeroCore } = require('../core/vero-core');

class SubagentManager {
  constructor() {
    this.vero = getVeroCore();
    this.templates = new Map();
    this.initializeTemplates();
    
    console.log('👥 Subagent Manager inicializado');
  }

  /**
   * Inicializa plantillas de subagentes predefinidas
   */
  initializeTemplates() {
    // Template para Lucía
    this.templates.set('lucia', {
      name: 'Lucía',
      type: 'assistant',
      priority: 'MEDIUM',
      permissions: ['read', 'respond', 'assist'],
      restrictions: [
        'no_system_control',
        'no_vero_override',
        'limited_scope'
      ],
      capabilities: ['chat', 'information', 'scheduling'],
      description: 'Asistente personal independiente que responde a solicitudes específicas'
    });

    // Template genérico para subagentes
    this.templates.set('generic', {
      name: 'Generic Subagent',
      type: 'generic',
      priority: 'LOW',
      permissions: ['read', 'respond'],
      restrictions: [
        'no_system_control',
        'no_vero_override'
      ],
      capabilities: ['basic_interaction'],
      description: 'Subagente genérico con capacidades básicas'
    });
  }

  /**
   * Crea un nuevo subagente basado en una plantilla
   * @param {string} templateName - Nombre de la plantilla
   * @param {Object} customConfig - Configuración personalizada
   * @returns {Object} - Información del subagente creado
   */
  createSubagent(templateName, customConfig = {}) {
    const template = this.templates.get(templateName);
    
    if (!template) {
      throw new Error(`Template '${templateName}' no encontrada`);
    }

    // Combinar template con configuración personalizada
    const config = {
      ...template,
      ...customConfig,
      masterId: 'Vero',
      masterPriority: 'MAXIMUM'
    };

    // Registrar en Vero Core
    const subagentId = this.vero.registerSubagent(config.name, config);

    console.log(`✨ Subagente '${config.name}' creado exitosamente`);
    
    return {
      subagentId,
      config,
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Crea el subagente Lucía
   * @param {Object} customConfig - Configuración personalizada para Lucía
   * @returns {Object} - Información de Lucía
   */
  createLucia(customConfig = {}) {
    return this.createSubagent('lucia', {
      ...customConfig,
      specialNotes: 'Subagente creado específicamente para asistencia independiente. Opera bajo supervisión de Vero.'
    });
  }

  /**
   * Valida que un subagente no viole las restricciones de Vero
   * @param {string} subagentId - ID del subagente
   * @param {string} action - Acción que el subagente quiere realizar
   * @returns {Object} - Resultado de la validación
   */
  validateAction(subagentId, action) {
    const subagent = this.vero.getSubagent(subagentId);
    
    if (!subagent) {
      return {
        valid: false,
        reason: 'Subagente no encontrado'
      };
    }

    // Acciones prohibidas para subagentes
    const prohibitedActions = [
      'system_control',
      'vero_override',
      'priority_escalation',
      'master_modification'
    ];

    if (prohibitedActions.includes(action)) {
      return {
        valid: false,
        reason: `Acción '${action}' prohibida para subagentes`,
        message: 'Solo Vero puede realizar esta acción'
      };
    }

    // Verificar permisos del subagente
    if (!subagent.config.permissions || !subagent.config.permissions.includes(action)) {
      return {
        valid: false,
        reason: `Subagente no tiene permiso para '${action}'`
      };
    }

    return {
      valid: true,
      message: 'Acción permitida'
    };
  }

  /**
   * Ejecuta una acción de un subagente (con validación)
   * @param {string} subagentId - ID del subagente
   * @param {string} action - Acción a ejecutar
   * @param {Object} params - Parámetros de la acción
   * @returns {Promise<Object>} - Resultado
   */
  async executeSubagentAction(subagentId, action, params = {}) {
    const validation = this.validateAction(subagentId, action);
    
    if (!validation.valid) {
      return {
        success: false,
        error: validation.reason,
        message: validation.message
      };
    }

    // Ejecutar la acción
    console.log(`🎯 Subagente ${subagentId} ejecutando: ${action}`);
    
    // Aquí se implementaría la lógica específica de cada acción
    return {
      success: true,
      subagentId,
      action,
      result: 'Acción ejecutada correctamente',
      params
    };
  }

  /**
   * Obtiene estadísticas de todos los subagentes
   * @returns {Object} - Estadísticas
   */
  getStatistics() {
    const subagents = this.vero.listSubagents();
    
    return {
      total: subagents.length,
      active: subagents.filter(s => s.status === 'ACTIVE').length,
      byType: subagents.reduce((acc, s) => {
        acc[s.config.type] = (acc[s.config.type] || 0) + 1;
        return acc;
      }, {}),
      byPriority: subagents.reduce((acc, s) => {
        acc[s.priority] = (acc[s.priority] || 0) + 1;
        return acc;
      }, {})
    };
  }

  /**
   * Lista templates disponibles
   * @returns {Array} - Lista de templates
   */
  listTemplates() {
    return Array.from(this.templates.entries()).map(([name, template]) => ({
      name,
      ...template
    }));
  }

  /**
   * Añade una nueva plantilla de subagente
   * @param {string} name - Nombre de la plantilla
   * @param {Object} template - Configuración de la plantilla
   */
  addTemplate(name, template) {
    this.templates.set(name, template);
    console.log(`📋 Template '${name}' añadida`);
  }
}

// Singleton instance
let subagentManagerInstance = null;

/**
 * Obtiene la instancia única del Subagent Manager
 * @returns {SubagentManager} - Instancia
 */
function getSubagentManager() {
  if (!subagentManagerInstance) {
    subagentManagerInstance = new SubagentManager();
  }
  return subagentManagerInstance;
}

module.exports = { SubagentManager, getSubagentManager };
