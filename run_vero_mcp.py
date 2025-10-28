#!/usr/bin/env python3
"""
Vero MCP Server - Entry Point
==============================
Punto de entrada principal para el servidor MCP de Vero.
"""

import asyncio
import sys
from vero_mcp.core.server import VeroMCPServer, main


if __name__ == "__main__":
    """Ejecuta el servidor MCP de Vero."""
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🛑 Vero MCP Server detenido por el usuario")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error al iniciar Vero MCP Server: {e}")
        sys.exit(1)
