"""
Code Analysis Handler - Análisis de Código
===========================================
Handler para analizar código y proporcionar insights a Vero.
"""

import os
from typing import Dict, Any, List
from pathlib import Path
import ast
import json


class CodeAnalysisHandler:
    """Handler para análisis de código."""
    
    def __init__(self):
        """Inicializa el handler de análisis."""
        pass
    
    async def analyze_code(self, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analiza código y proporciona insights.
        
        Args:
            arguments: Diccionario con:
                - target: Archivo o directorio a analizar
                - analysis_type: Tipo de análisis
                
        Returns:
            Resultado del análisis
        """
        try:
            target = Path(arguments.get("target", ""))
            analysis_type = arguments.get("analysis_type", "all")
            
            if not target.exists():
                return {
                    "success": False,
                    "error": f"Target no encontrado: {target}"
                }
            
            results = {}
            
            # Realizar análisis según el tipo
            if analysis_type in ["quality", "all"]:
                results["quality"] = self._analyze_quality(target)
            
            if analysis_type in ["security", "all"]:
                results["security"] = self._analyze_security(target)
            
            if analysis_type in ["performance", "all"]:
                results["performance"] = self._analyze_performance(target)
            
            if analysis_type in ["dependencies", "all"]:
                results["dependencies"] = self._analyze_dependencies(target)
            
            return {
                "success": True,
                "target": str(target),
                "analysis_type": analysis_type,
                "results": results
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Error en análisis: {str(e)}"
            }
    
    def _analyze_quality(self, target: Path) -> Dict[str, Any]:
        """Analiza calidad del código."""
        if target.is_file() and target.suffix == ".py":
            try:
                content = target.read_text(encoding="utf-8")
                tree = ast.parse(content)
                
                # Contar elementos
                functions = sum(1 for node in ast.walk(tree) if isinstance(node, ast.FunctionDef))
                classes = sum(1 for node in ast.walk(tree) if isinstance(node, ast.ClassDef))
                lines = len(content.splitlines())
                
                return {
                    "lines_of_code": lines,
                    "functions": functions,
                    "classes": classes,
                    "complexity": "moderate" if functions > 5 else "low"
                }
            except:
                return {"error": "No se pudo analizar el archivo Python"}
        
        return {"message": "Análisis de calidad disponible solo para archivos Python"}
    
    def _analyze_security(self, target: Path) -> Dict[str, Any]:
        """Analiza seguridad del código."""
        issues = []
        
        if target.is_file():
            content = target.read_text(encoding="utf-8")
            
            # Buscar patrones de seguridad comunes
            if "eval(" in content:
                issues.append("Uso de eval() detectado - riesgo de seguridad")
            if "exec(" in content:
                issues.append("Uso de exec() detectado - riesgo de seguridad")
            if "password" in content.lower() and "=" in content:
                issues.append("Posible contraseña hardcodeada")
        
        return {
            "issues_found": len(issues),
            "issues": issues,
            "status": "secure" if not issues else "needs_review"
        }
    
    def _analyze_performance(self, target: Path) -> Dict[str, Any]:
        """Analiza rendimiento potencial del código."""
        recommendations = []
        
        if target.is_file() and target.suffix == ".py":
            content = target.read_text(encoding="utf-8")
            
            # Buscar patrones de rendimiento
            if "for" in content and "in" in content:
                recommendations.append("Considerar usar list comprehensions para mejor rendimiento")
            if "import *" in content:
                recommendations.append("Evitar import * para reducir tiempo de carga")
        
        return {
            "recommendations": recommendations,
            "status": "good" if not recommendations else "can_improve"
        }
    
    def _analyze_dependencies(self, target: Path) -> Dict[str, Any]:
        """Analiza dependencias del código."""
        dependencies = []
        
        if target.is_file():
            content = target.read_text(encoding="utf-8")
            
            # Buscar imports en Python
            if target.suffix == ".py":
                for line in content.splitlines():
                    line = line.strip()
                    if line.startswith("import ") or line.startswith("from "):
                        dependencies.append(line)
        
        return {
            "dependencies_found": len(dependencies),
            "dependencies": dependencies[:10]  # Limitar a primeros 10
        }
