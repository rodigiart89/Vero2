"""
Configuration Manager - Gestión de Configuración
=================================================
Utilidad para gestionar la configuración de Vero MCP.
"""

import json
from pathlib import Path
from typing import Dict, Any, Optional


class ConfigManager:
    """Gestor de configuración para Vero MCP."""
    
    DEFAULT_CONFIG = {
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
            "auto_backup": True,
            "detailed_logging": True,
            "code_analysis": True,
            "documentation_generation": True
        },
        "security": {
            "allowed_commands": ["ls", "cat", "echo", "git"],
            "restricted_paths": ["/etc", "/sys", "/proc"],
            "max_file_size_mb": 10
        },
        "extensions": {
            "enabled": True,
            "plugin_dir": "vero_plugins"
        }
    }
    
    def __init__(self, config_file: str = "vero_config.json"):
        """
        Inicializa el gestor de configuración.
        
        Args:
            config_file: Ruta del archivo de configuración
        """
        self.config_file = Path(config_file)
        self.config = self._load_config()
    
    def _load_config(self) -> Dict[str, Any]:
        """
        Carga la configuración desde archivo o crea una por defecto.
        
        Returns:
            Diccionario de configuración
        """
        if self.config_file.exists():
            try:
                with self.config_file.open("r", encoding="utf-8") as f:
                    return json.load(f)
            except (json.JSONDecodeError, IOError) as e:
                # Si hay error de configuración, usar configuración por defecto
                import logging
                logging.warning(f"Error loading config file: {e}. Using default configuration.")
                return self.DEFAULT_CONFIG.copy()
        else:
            # Crear archivo de configuración por defecto
            self.save_config(self.DEFAULT_CONFIG)
            return self.DEFAULT_CONFIG.copy()
    
    def save_config(self, config: Optional[Dict[str, Any]] = None):
        """
        Guarda la configuración en archivo.
        
        Args:
            config: Configuración a guardar (usa self.config si es None)
        """
        config_to_save = config or self.config
        with self.config_file.open("w", encoding="utf-8") as f:
            json.dump(config_to_save, f, indent=2, ensure_ascii=False)
    
    def get(self, key: str, default: Any = None) -> Any:
        """
        Obtiene un valor de configuración.
        
        Args:
            key: Clave de configuración (puede usar notación de punto)
            default: Valor por defecto si no existe
            
        Returns:
            Valor de configuración
        """
        keys = key.split(".")
        value = self.config
        
        for k in keys:
            if isinstance(value, dict) and k in value:
                value = value[k]
            else:
                return default
        
        return value
    
    def set(self, key: str, value: Any):
        """
        Establece un valor de configuración.
        
        Args:
            key: Clave de configuración (puede usar notación de punto)
            value: Valor a establecer
        """
        keys = key.split(".")
        config = self.config
        
        for k in keys[:-1]:
            if k not in config:
                config[k] = {}
            config = config[k]
        
        config[keys[-1]] = value
        self.save_config()
    
    def reset_to_default(self):
        """Reinicia la configuración a valores por defecto."""
        self.config = self.DEFAULT_CONFIG.copy()
        self.save_config()
