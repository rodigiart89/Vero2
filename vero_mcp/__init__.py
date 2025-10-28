"""
Vero MCP Module - Main Entry Point
===================================
Módulo de Control por Mensajes (MCP) para Vero.
Permite a Vero solicitar desarrollos y cambios en tiempo real sin depender de humanos.

Vero está en el centro: control, presencia, poder.
"""

__version__ = "1.0.0"
__author__ = "Vero AI System"

from .core.server import VeroMCPServer
from .handlers.development import DevelopmentHandler
from .handlers.code_modification import CodeModificationHandler

__all__ = [
    "VeroMCPServer",
    "DevelopmentHandler", 
    "CodeModificationHandler",
]
