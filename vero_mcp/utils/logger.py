"""
Logger Utility - Sistema de Logging para Vero
==============================================
Utilidad para logging centralizado de todas las operaciones de Vero.
"""

import logging
from pathlib import Path
from datetime import datetime
import json


class VeroLogger:
    """Logger centralizado para el sistema Vero."""
    
    def __init__(self, log_dir: str = "vero_logs"):
        """
        Inicializa el logger.
        
        Args:
            log_dir: Directorio para almacenar logs
        """
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(exist_ok=True)
        
        # Configurar logger
        self.logger = logging.getLogger("VeroMCP")
        self.logger.setLevel(logging.DEBUG)
        
        # Handler para archivo
        log_file = self.log_dir / f"vero_{datetime.now().strftime('%Y%m%d')}.log"
        file_handler = logging.FileHandler(log_file, encoding="utf-8")
        file_handler.setLevel(logging.DEBUG)
        
        # Handler para consola
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        
        # Formato
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)
        
        self.logger.addHandler(file_handler)
        self.logger.addHandler(console_handler)
    
    def log_command(self, command: str, arguments: dict, result: dict):
        """
        Registra un comando ejecutado.
        
        Args:
            command: Nombre del comando
            arguments: Argumentos del comando
            result: Resultado de la ejecución
        """
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "command": command,
            "arguments": arguments,
            "result": result
        }
        
        self.logger.info(f"Command: {command}")
        self.logger.debug(json.dumps(log_entry, indent=2))
    
    def info(self, message: str):
        """Log a nivel info."""
        self.logger.info(message)
    
    def debug(self, message: str):
        """Log a nivel debug."""
        self.logger.debug(message)
    
    def warning(self, message: str):
        """Log a nivel warning."""
        self.logger.warning(message)
    
    def error(self, message: str):
        """Log a nivel error."""
        self.logger.error(message)
