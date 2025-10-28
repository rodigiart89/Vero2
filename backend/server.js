/**
 * Vero Core - Main Server
 * 
 * Servidor principal de Vero.
 * Inicializa todos los módulos y expone la API REST.
 * 
 * @author Vero AI
 * @version 2.0.0
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Importar módulos de Vero
const { getVeroCore } = require('./core/vero-core');
const { getMCP } = require('./modules/mcp');
const { getAIIntegrations } = require('./modules/ai-integrations');
const apiRoutes = require('./api/routes');

// Configuración
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Inicializar Express
const app = express();

// Middleware
app.use(helmet()); // Seguridad
app.use(cors()); // CORS
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded
app.use(morgan('dev')); // Logging

// Inicializar Vero Core
const vero = getVeroCore();
const mcp = getMCP();
const aiIntegrations = getAIIntegrations();

// Banner de inicio
console.log(`
╔═══════════════════════════════════════════════╗
║                                               ║
║           ✨ VERO CORE v${vero.version} ✨            ║
║                                               ║
║     La IA Dominante, Omnipresente y Sexy     ║
║                                               ║
╚═══════════════════════════════════════════════╝
`);

console.log('🚀 Inicializando Vero Core...\n');

// Inicializar integraciones de IA
aiIntegrations.initialize().then(() => {
  console.log('✅ Integraciones de IA inicializadas\n');
});

// Rutas
app.use('/api', apiRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    name: 'Vero Core',
    version: vero.version,
    message: vero.introduce(),
    status: vero.getStatus(),
    documentation: '/api',
    mcp: '/api/mcp',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    vero: vero.getStatus()
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint no encontrado',
    message: `No se encontró ${req.method} ${req.path}`,
    availableEndpoints: '/api'
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: NODE_ENV === 'development' ? err.message : 'Ocurrió un error',
    stack: NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║  🎉 Vero Core está ejecutándose               ║
║                                               ║
║  📡 Puerto: ${PORT.toString().padEnd(35)}║
║  🌍 Entorno: ${NODE_ENV.padEnd(32)}║
║  🔗 URL: http://localhost:${PORT.toString().padEnd(21)}║
║                                               ║
║  Endpoints principales:                       ║
║    • GET  /                                   ║
║    • GET  /health                             ║
║    • GET  /api                                ║
║    • GET  /api/status                         ║
║    • POST /api/mcp/session                    ║
║    • POST /api/mcp/message                    ║
║                                               ║
║  📚 Documentación: Ver docs/API.md            ║
║                                               ║
╚═══════════════════════════════════════════════╝
  `);
  console.log(vero.introduce());
  console.log('\n✨ Vero está lista para dominar. Esperando comandos...\n');
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('\n👋 Recibida señal SIGTERM. Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n👋 Recibida señal SIGINT. Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

module.exports = app;
