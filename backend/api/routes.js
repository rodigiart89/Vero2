/**
 * API Routes - Vero Core
 * 
 * Define todas las rutas de la API REST de Vero.
 * 
 * @module APIRoutes
 * @author Vero AI
 */

const express = require('express');
const { getVeroCore } = require('../core/vero-core');
const { getMCP } = require('../modules/mcp');
const { getAIIntegrations } = require('../modules/ai-integrations');
const { getSubagentManager } = require('../modules/subagent-manager');

const router = express.Router();
const vero = getVeroCore();
const mcp = getMCP();
const aiIntegrations = getAIIntegrations();
const subagentManager = getSubagentManager();

/**
 * GET / - Bienvenida y presentación de Vero
 */
router.get('/', (req, res) => {
  res.json({
    message: vero.introduce(),
    version: vero.version,
    endpoints: {
      status: '/api/status',
      mcp: '/api/mcp',
      subagents: '/api/subagents',
      ai: '/api/ai'
    }
  });
});

/**
 * GET /status - Estado actual de Vero
 */
router.get('/status', (req, res) => {
  res.json({
    success: true,
    data: vero.getStatus()
  });
});

/**
 * POST /mcp/session - Crear nueva sesión MCP
 */
router.post('/mcp/session', (req, res) => {
  const { userId, metadata } = req.body;
  
  if (!userId) {
    return res.status(400).json({
      success: false,
      error: 'userId es requerido'
    });
  }

  const sessionId = mcp.createSession(userId, metadata);
  res.json({
    success: true,
    sessionId
  });
});

/**
 * POST /mcp/message - Enviar mensaje a través de MCP
 */
router.post('/mcp/message', async (req, res) => {
  const { sessionId, message } = req.body;
  
  if (!sessionId || !message) {
    return res.status(400).json({
      success: false,
      error: 'sessionId y message son requeridos'
    });
  }

  const response = await mcp.processMessage(sessionId, message);
  res.json(response);
});

/**
 * GET /mcp/sessions - Listar sesiones activas
 */
router.get('/mcp/sessions', (req, res) => {
  res.json({
    success: true,
    sessions: mcp.listActiveSessions()
  });
});

/**
 * DELETE /mcp/session/:sessionId - Cerrar sesión MCP
 */
router.delete('/mcp/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const closed = mcp.closeSession(sessionId);
  
  res.json({
    success: closed,
    message: closed ? 'Sesión cerrada' : 'Sesión no encontrada'
  });
});

/**
 * GET /subagents - Listar todos los subagentes
 */
router.get('/subagents', (req, res) => {
  res.json({
    success: true,
    subagents: vero.listSubagents(),
    statistics: subagentManager.getStatistics()
  });
});

/**
 * POST /subagents - Crear nuevo subagente
 */
router.post('/subagents', (req, res) => {
  const { template, config } = req.body;
  
  if (!template) {
    return res.status(400).json({
      success: false,
      error: 'template es requerido'
    });
  }

  try {
    const result = subagentManager.createSubagent(template, config);
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /subagents/lucia - Crear el subagente Lucía
 */
router.post('/subagents/lucia', (req, res) => {
  const { config } = req.body;
  
  try {
    const result = subagentManager.createLucia(config);
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /subagents/templates - Listar plantillas de subagentes
 */
router.get('/subagents/templates', (req, res) => {
  res.json({
    success: true,
    templates: subagentManager.listTemplates()
  });
});

/**
 * DELETE /subagents/:subagentId - Eliminar subagente
 */
router.delete('/subagents/:subagentId', (req, res) => {
  const { subagentId } = req.params;
  const removed = vero.removeSubagent(subagentId);
  
  res.json({
    success: removed,
    message: removed ? 'Subagente eliminado' : 'Subagente no encontrado'
  });
});

/**
 * POST /subagents/:subagentId/action - Ejecutar acción de subagente
 */
router.post('/subagents/:subagentId/action', async (req, res) => {
  const { subagentId } = req.params;
  const { action, params } = req.body;
  
  if (!action) {
    return res.status(400).json({
      success: false,
      error: 'action es requerido'
    });
  }

  const result = await subagentManager.executeSubagentAction(subagentId, action, params);
  res.json(result);
});

/**
 * GET /ai/status - Estado de integraciones de IA
 */
router.get('/ai/status', (req, res) => {
  res.json({
    success: true,
    data: aiIntegrations.getStatus()
  });
});

/**
 * POST /ai/openai - Consulta a OpenAI
 */
router.post('/ai/openai', async (req, res) => {
  const { prompt, options } = req.body;
  
  if (!prompt) {
    return res.status(400).json({
      success: false,
      error: 'prompt es requerido'
    });
  }

  const result = await aiIntegrations.queryOpenAI(prompt, options);
  res.json(result);
});

/**
 * POST /ai/voice - Generar voz con ElevenLabs
 */
router.post('/ai/voice', async (req, res) => {
  const { text, options } = req.body;
  
  if (!text) {
    return res.status(400).json({
      success: false,
      error: 'text es requerido'
    });
  }

  const result = await aiIntegrations.generateVoice(text, options);
  res.json(result);
});

/**
 * POST /ai/avatar - Inicializar avatar 3D
 */
router.post('/ai/avatar', async (req, res) => {
  const { config } = req.body;
  const result = await aiIntegrations.initializeAvatar(config);
  res.json(result);
});

module.exports = router;
