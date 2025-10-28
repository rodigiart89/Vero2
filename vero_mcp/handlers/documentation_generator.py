"""
Documentation Generator Handler - Generación de Documentación
==============================================================
Handler para generar documentación automática según estándares de Vero.
"""

import os
from typing import Dict, Any
from pathlib import Path
import ast
from datetime import datetime


class DocumentationGeneratorHandler:
    """Handler para generación de documentación."""
    
    def __init__(self):
        """Inicializa el handler de generación de documentación."""
        pass
    
    async def generate_documentation(self, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """
        Genera documentación automática.
        
        Args:
            arguments: Diccionario con:
                - target: Módulo o archivo para documentar
                - format: Formato de documentación (markdown, html, etc.)
                - include_examples: Incluir ejemplos de uso
                
        Returns:
            Resultado de la generación
        """
        try:
            target = Path(arguments.get("target", ""))
            doc_format = arguments.get("format", "markdown")
            include_examples = arguments.get("include_examples", True)
            
            if not target.exists():
                return {
                    "success": False,
                    "error": f"Target no encontrado: {target}"
                }
            
            # Generar documentación según formato
            if doc_format == "markdown":
                doc_content = self._generate_markdown_doc(target, include_examples)
            else:
                return {
                    "success": False,
                    "error": f"Formato no soportado: {doc_format}"
                }
            
            # Guardar documentación
            doc_file = target.parent / f"{target.stem}_documentation.md"
            doc_file.write_text(doc_content, encoding="utf-8")
            
            return {
                "success": True,
                "message": "Documentación generada exitosamente",
                "target": str(target),
                "documentation_file": str(doc_file),
                "format": doc_format
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Error al generar documentación: {str(e)}"
            }
    
    def _generate_markdown_doc(self, target: Path, include_examples: bool) -> str:
        """
        Genera documentación en formato Markdown.
        
        Args:
            target: Archivo objetivo
            include_examples: Si incluir ejemplos
            
        Returns:
            Contenido de documentación en Markdown
        """
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        doc = f"""# Documentación: {target.name}

**Generado por Vero AI System**  
**Fecha**: {timestamp}

---

## Descripción

Módulo: `{target.name}`  
Ruta: `{target}`

"""
        
        if target.suffix == ".py":
            try:
                content = target.read_text(encoding="utf-8")
                tree = ast.parse(content)
                
                # Documentar clases
                classes = [node for node in ast.walk(tree) if isinstance(node, ast.ClassDef)]
                if classes:
                    doc += "## Clases\n\n"
                    for cls in classes:
                        doc += f"### {cls.name}\n\n"
                        docstring = ast.get_docstring(cls)
                        if docstring:
                            doc += f"{docstring}\n\n"
                        
                        # Métodos
                        methods = [node for node in cls.body if isinstance(node, ast.FunctionDef)]
                        if methods:
                            doc += "**Métodos:**\n\n"
                            for method in methods:
                                doc += f"- `{method.name}()`"
                                method_doc = ast.get_docstring(method)
                                if method_doc:
                                    doc += f": {method_doc.split('.')[0]}"
                                doc += "\n"
                            doc += "\n"
                
                # Documentar funciones
                functions = [node for node in tree.body if isinstance(node, ast.FunctionDef)]
                if functions:
                    doc += "## Funciones\n\n"
                    for func in functions:
                        doc += f"### {func.name}()\n\n"
                        docstring = ast.get_docstring(func)
                        if docstring:
                            doc += f"{docstring}\n\n"
                
            except:
                doc += "*No se pudo analizar el contenido del archivo Python*\n\n"
        
        if include_examples:
            doc += """## Ejemplos de Uso

```python
# TODO: Agregar ejemplos de uso
```

"""
        
        doc += """---

## Notas

Esta documentación fue generada automáticamente por Vero AI System.  
Para actualizaciones, ejecutar el comando de generación de documentación nuevamente.
"""
        
        return doc
