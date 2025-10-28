"""
Command Executor Handler - Ejecución de Comandos
=================================================
Handler para ejecutar comandos del sistema según órdenes de Vero.
"""

import asyncio
import os
from typing import Dict, Any
from pathlib import Path


class CommandExecutorHandler:
    """Handler para ejecución de comandos del sistema."""
    
    def __init__(self):
        """Inicializa el handler de ejecución de comandos."""
        pass
    
    async def execute_command(self, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """
        Ejecuta un comando del sistema.
        
        Args:
            arguments: Diccionario con:
                - command: Comando a ejecutar
                - working_directory: Directorio de trabajo (opcional)
                - timeout: Tiempo máximo en segundos (default: 30)
                
        Returns:
            Resultado de la ejecución
        """
        try:
            command = arguments.get("command", "")
            working_dir = arguments.get("working_directory", os.getcwd())
            timeout = arguments.get("timeout", 30)
            
            if not command:
                return {
                    "success": False,
                    "error": "command es requerido"
                }
            
            # Validar directorio de trabajo
            if working_dir and not Path(working_dir).exists():
                return {
                    "success": False,
                    "error": f"Directorio no encontrado: {working_dir}"
                }
            
            # Ejecutar comando
            process = await asyncio.create_subprocess_shell(
                command,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                cwd=working_dir
            )
            
            try:
                stdout, stderr = await asyncio.wait_for(
                    process.communicate(),
                    timeout=timeout
                )
                
                return {
                    "success": process.returncode == 0,
                    "command": command,
                    "return_code": process.returncode,
                    "stdout": stdout.decode("utf-8", errors="replace"),
                    "stderr": stderr.decode("utf-8", errors="replace"),
                    "working_directory": working_dir
                }
                
            except asyncio.TimeoutError:
                process.kill()
                return {
                    "success": False,
                    "error": f"Comando excedió el timeout de {timeout} segundos",
                    "command": command
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": f"Error al ejecutar comando: {str(e)}"
            }
