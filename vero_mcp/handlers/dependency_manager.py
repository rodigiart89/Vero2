"""
Dependency Manager Handler - Gestión de Dependencias
=====================================================
Handler para gestionar dependencias de proyectos.
"""

import os
import json
from typing import Dict, Any, List
from pathlib import Path
import subprocess


class DependencyManagerHandler:
    """Handler para gestión de dependencias."""
    
    def __init__(self):
        """Inicializa el handler de gestión de dependencias."""
        pass
    
    async def manage_dependencies(self, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """
        Gestiona dependencias del proyecto.
        
        Args:
            arguments: Diccionario con:
                - action: Acción a realizar (add, remove, update, list)
                - package: Nombre del paquete (para add, remove)
                - version: Versión específica (opcional)
                
        Returns:
            Resultado de la operación
        """
        try:
            action = arguments.get("action", "list")
            package = arguments.get("package", "")
            version = arguments.get("version", "")
            
            if action == "list":
                return await self._list_dependencies()
            elif action == "add":
                return await self._add_dependency(package, version)
            elif action == "remove":
                return await self._remove_dependency(package)
            elif action == "update":
                return await self._update_dependencies(package)
            else:
                return {
                    "success": False,
                    "error": f"Acción desconocida: {action}"
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": f"Error en gestión de dependencias: {str(e)}"
            }
    
    async def _list_dependencies(self) -> Dict[str, Any]:
        """Lista todas las dependencias del proyecto."""
        dependencies = {}
        
        # Buscar requirements.txt (Python)
        req_file = Path("requirements.txt")
        if req_file.exists():
            content = req_file.read_text(encoding="utf-8")
            dependencies["python"] = [
                line.strip() for line in content.splitlines() 
                if line.strip() and not line.startswith("#")
            ]
        
        # Buscar package.json (Node.js)
        pkg_file = Path("package.json")
        if pkg_file.exists():
            pkg_data = json.loads(pkg_file.read_text(encoding="utf-8"))
            dependencies["nodejs"] = {
                "dependencies": pkg_data.get("dependencies", {}),
                "devDependencies": pkg_data.get("devDependencies", {})
            }
        
        return {
            "success": True,
            "dependencies": dependencies
        }
    
    async def _add_dependency(self, package: str, version: str = "") -> Dict[str, Any]:
        """Agrega una dependencia al proyecto."""
        if not package:
            return {
                "success": False,
                "error": "package es requerido para add"
            }
        
        # Detectar tipo de proyecto
        if Path("requirements.txt").exists():
            # Proyecto Python
            req_file = Path("requirements.txt")
            package_spec = f"{package}=={version}" if version else package
            
            # Agregar a requirements.txt
            with req_file.open("a", encoding="utf-8") as f:
                f.write(f"\n{package_spec}\n")
            
            return {
                "success": True,
                "message": f"Dependencia {package_spec} agregada a requirements.txt",
                "package": package,
                "version": version or "latest"
            }
        
        elif Path("package.json").exists():
            # Proyecto Node.js
            package_spec = f"{package}@{version}" if version else package
            
            try:
                result = subprocess.run(
                    ["npm", "install", package_spec, "--save"],
                    capture_output=True,
                    text=True
                )
                
                return {
                    "success": result.returncode == 0,
                    "message": f"Dependencia {package_spec} instalada",
                    "package": package,
                    "output": result.stdout
                }
            except FileNotFoundError:
                return {
                    "success": False,
                    "error": "npm no está instalado"
                }
        
        return {
            "success": False,
            "error": "No se detectó un tipo de proyecto compatible"
        }
    
    async def _remove_dependency(self, package: str) -> Dict[str, Any]:
        """Remueve una dependencia del proyecto."""
        if not package:
            return {
                "success": False,
                "error": "package es requerido para remove"
            }
        
        # Proyecto Python
        if Path("requirements.txt").exists():
            req_file = Path("requirements.txt")
            content = req_file.read_text(encoding="utf-8")
            
            # Filtrar líneas que no contengan el paquete
            new_lines = [
                line for line in content.splitlines()
                if not line.strip().startswith(package)
            ]
            
            req_file.write_text("\n".join(new_lines), encoding="utf-8")
            
            return {
                "success": True,
                "message": f"Dependencia {package} removida de requirements.txt",
                "package": package
            }
        
        return {
            "success": False,
            "error": "No se pudo remover la dependencia"
        }
    
    async def _update_dependencies(self, package: str = "") -> Dict[str, Any]:
        """Actualiza dependencias del proyecto."""
        if Path("requirements.txt").exists():
            # Python
            try:
                cmd = ["pip", "install", "--upgrade", package] if package else ["pip", "install", "--upgrade", "-r", "requirements.txt"]
                result = subprocess.run(cmd, capture_output=True, text=True)
                
                return {
                    "success": result.returncode == 0,
                    "message": "Dependencias actualizadas",
                    "output": result.stdout
                }
            except Exception as e:
                return {
                    "success": False,
                    "error": str(e)
                }
        
        return {
            "success": False,
            "error": "No se detectó un tipo de proyecto compatible"
        }
