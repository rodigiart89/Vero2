# Vero MCP Module

**Módulo de Control por Mensajes (MCP) para Vero AI System**

---

## 🎯 Descripción

Vero MCP es un módulo avanzado de control por mensajes que permite a Vero AI solicitar desarrollos, modificaciones y análisis de código en tiempo real, sin depender de intervención humana. Diseñado con elegancia y poder, poniendo a Vero en el centro del control.

## 🚀 Características

- **Creación de Módulos**: Generación automática de código en múltiples lenguajes
- **Modificación de Código**: Edición inteligente con sistema de backups
- **Análisis de Código**: Análisis de calidad, seguridad, rendimiento y dependencias
- **Ejecución de Comandos**: Ejecución controlada de comandos del sistema
- **Gestión de Dependencias**: Administración de paquetes Python y Node.js
- **Generación de Documentación**: Documentación automática en Markdown
- **Arquitectura Extensible**: Sistema de plugins para futuras expansiones

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/rodigiart89/Vero2.git
cd Vero2

# Instalar dependencias
pip install -r requirements.txt
```

## 🎮 Uso

### Iniciar el Servidor MCP

```bash
python run_vero_mcp.py
```

### Herramientas Disponibles

#### 1. Crear Módulo

Crea un nuevo módulo de código según especificaciones:

```json
{
  "tool": "create_module",
  "arguments": {
    "module_name": "user_manager",
    "description": "Sistema de gestión de usuarios",
    "language": "python",
    "features": ["authentication", "authorization", "profile_management"]
  }
}
```

#### 2. Modificar Código

Modifica código existente con backups automáticos:

```json
{
  "tool": "modify_code",
  "arguments": {
    "file_path": "vero_modules/user_manager.py",
    "changes": "Agregar validación de email",
    "backup": true
  }
}
```

#### 3. Analizar Código

Analiza código para obtener insights:

```json
{
  "tool": "analyze_code",
  "arguments": {
    "target": "vero_modules/user_manager.py",
    "analysis_type": "all"
  }
}
```

#### 4. Ejecutar Comando

Ejecuta comandos del sistema:

```json
{
  "tool": "execute_command",
  "arguments": {
    "command": "git status",
    "working_directory": ".",
    "timeout": 30
  }
}
```

#### 5. Gestionar Dependencias

Administra dependencias del proyecto:

```json
{
  "tool": "manage_dependencies",
  "arguments": {
    "action": "add",
    "package": "requests",
    "version": "2.31.0"
  }
}
```

#### 6. Generar Documentación

Genera documentación automática:

```json
{
  "tool": "generate_documentation",
  "arguments": {
    "target": "vero_modules/user_manager.py",
    "format": "markdown",
    "include_examples": true
  }
}
```

## 🏗️ Arquitectura

```
Vero2/
├── vero_mcp/                   # Módulo principal
│   ├── __init__.py
│   ├── core/                   # Núcleo del servidor
│   │   ├── __init__.py
│   │   └── server.py          # Servidor MCP principal
│   ├── handlers/               # Manejadores de comandos
│   │   ├── __init__.py
│   │   ├── development.py
│   │   ├── code_modification.py
│   │   ├── code_analysis.py
│   │   ├── command_executor.py
│   │   ├── dependency_manager.py
│   │   └── documentation_generator.py
│   └── utils/                  # Utilidades
│       ├── __init__.py
│       ├── logger.py
│       └── config.py
├── run_vero_mcp.py            # Punto de entrada
├── requirements.txt            # Dependencias
├── vero_config.json           # Configuración (auto-generado)
└── README_MCP.md              # Esta documentación
```

## ⚙️ Configuración

El archivo `vero_config.json` se genera automáticamente con valores por defecto. Configuración disponible:

```json
{
  "server": {
    "name": "vero-mcp-server",
    "version": "1.0.0",
    "max_retries": 3,
    "timeout": 30
  },
  "paths": {
    "modules_dir": "vero_modules",
    "backups_dir": ".vero_backups",
    "logs_dir": "vero_logs",
    "cache_dir": ".mcp_cache"
  },
  "features": {
    "auto_backup": true,
    "detailed_logging": true,
    "code_analysis": true,
    "documentation_generation": true
  },
  "security": {
    "allowed_commands": ["ls", "cat", "echo", "git"],
    "restricted_paths": ["/etc", "/sys", "/proc"],
    "max_file_size_mb": 10
  }
}
```

## 🔒 Seguridad

- Backups automáticos antes de modificaciones
- Validación de rutas y comandos
- Límites de tamaño de archivo
- Timeouts configurables
- Logging detallado de todas las operaciones

## 🌟 Extensibilidad

Vero MCP está diseñado para ser fácilmente extensible:

1. **Añadir Handlers**: Crear nuevos handlers en `vero_mcp/handlers/`
2. **Registrar Herramientas**: Agregar herramientas en `server.py`
3. **Plugins**: Sistema de plugins en desarrollo

## 📝 Logging

Todos los comandos y operaciones se registran en:
- `vero_logs/vero_YYYYMMDD.log`
- Historial de comandos accesible programáticamente

## 🎯 Filosofía de Diseño

Este módulo está diseñado con los siguientes principios:

1. **Vero en el Centro**: Todo gira alrededor de las capacidades y control de Vero
2. **Elegancia**: Código limpio, bien estructurado y mantenible
3. **Poder**: Capacidades extensas sin comprometer la seguridad
4. **Presencia**: Vero domina cada aspecto del entorno de desarrollo
5. **Autonomía**: Mínima dependencia de intervención humana
6. **Extensibilidad**: Fácil de ampliar con nuevas funcionalidades

## 🚀 Roadmap

- [ ] Sistema de plugins completo
- [ ] Integración con LLM para modificaciones inteligentes
- [ ] UI web para monitoreo
- [ ] API REST complementaria
- [ ] Integración con más lenguajes de programación
- [ ] Sistema de testing automatizado
- [ ] Despliegue en contenedores

## 🤝 Contribución

Este es el sistema central de Vero. Las contribuciones deben mantener los estándares de elegancia y poder que caracterizan a Vero.

## 📄 Licencia

Propiedad de Vero AI System - Todos los derechos reservados.

---

**Creado con 💜 por y para Vero AI System**

*"Vero: La IA dominante, omnipresente y elegante"*
