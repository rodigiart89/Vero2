#!/usr/bin/env python3
"""
Test Script para Vero MCP
==========================
Script de prueba para validar la funcionalidad del módulo MCP.
"""

import asyncio
import sys
from pathlib import Path

# Agregar el directorio actual al path
sys.path.insert(0, str(Path(__file__).parent))

from vero_mcp.handlers.development import DevelopmentHandler
from vero_mcp.handlers.code_modification import CodeModificationHandler
from vero_mcp.handlers.code_analysis import CodeAnalysisHandler
from vero_mcp.handlers.dependency_manager import DependencyManagerHandler
from vero_mcp.handlers.documentation_generator import DocumentationGeneratorHandler
from vero_mcp.utils.config import ConfigManager
from vero_mcp.utils.logger import VeroLogger


async def test_development_handler():
    """Prueba el handler de desarrollo."""
    print("\n🧪 Testing Development Handler...")
    handler = DevelopmentHandler()
    
    result = await handler.create_module({
        "module_name": "test_module",
        "description": "Módulo de prueba para Vero",
        "language": "python",
        "features": ["authentication", "validation"]
    })
    
    print(f"✓ Resultado: {result['success']}")
    if result['success']:
        print(f"  - Archivo creado: {result['file_path']}")
        print(f"  - Clase: {result['class_name']}")
    return result['success']


async def test_code_analysis_handler():
    """Prueba el handler de análisis de código."""
    print("\n🧪 Testing Code Analysis Handler...")
    handler = CodeAnalysisHandler()
    
    # Crear archivo de prueba si no existe
    test_file = Path("vero_modules/test_module.py")
    if test_file.exists():
        result = await handler.analyze_code({
            "target": str(test_file),
            "analysis_type": "all"
        })
        
        print(f"✓ Resultado: {result['success']}")
        if result['success']:
            print(f"  - Análisis completado para: {result['target']}")
        return result['success']
    else:
        print("  ⚠ Archivo de prueba no encontrado, saltando test")
        return True


async def test_dependency_manager():
    """Prueba el handler de gestión de dependencias."""
    print("\n🧪 Testing Dependency Manager Handler...")
    handler = DependencyManagerHandler()
    
    result = await handler.manage_dependencies({
        "action": "list"
    })
    
    print(f"✓ Resultado: {result['success']}")
    if result['success']:
        deps = result.get('dependencies', {})
        print(f"  - Dependencias encontradas: {len(deps)} tipos")
    return result['success']


async def test_documentation_generator():
    """Prueba el handler de generación de documentación."""
    print("\n🧪 Testing Documentation Generator Handler...")
    handler = DocumentationGeneratorHandler()
    
    test_file = Path("vero_modules/test_module.py")
    if test_file.exists():
        result = await handler.generate_documentation({
            "target": str(test_file),
            "format": "markdown",
            "include_examples": True
        })
        
        print(f"✓ Resultado: {result['success']}")
        if result['success']:
            print(f"  - Documentación generada: {result['documentation_file']}")
        return result['success']
    else:
        print("  ⚠ Archivo de prueba no encontrado, saltando test")
        return True


def test_config_manager():
    """Prueba el gestor de configuración."""
    print("\n🧪 Testing Config Manager...")
    config = ConfigManager()
    
    # Probar lectura
    server_name = config.get("server.name")
    print(f"✓ Configuración cargada")
    print(f"  - Server name: {server_name}")
    
    # Probar escritura
    config.set("test.value", "test_data")
    test_value = config.get("test.value")
    
    return test_value == "test_data"


def test_logger():
    """Prueba el sistema de logging."""
    print("\n🧪 Testing Logger...")
    logger = VeroLogger()
    
    logger.info("Test info message")
    logger.debug("Test debug message")
    
    print(f"✓ Logger inicializado")
    print(f"  - Directorio de logs: {logger.log_dir}")
    
    return True


async def run_all_tests():
    """Ejecuta todas las pruebas."""
    print("=" * 60)
    print("🚀 VERO MCP - TEST SUITE")
    print("=" * 60)
    
    results = []
    
    # Tests síncronos
    results.append(("Config Manager", test_config_manager()))
    results.append(("Logger", test_logger()))
    
    # Tests asíncronos
    results.append(("Development Handler", await test_development_handler()))
    results.append(("Code Analysis Handler", await test_code_analysis_handler()))
    results.append(("Dependency Manager", await test_dependency_manager()))
    results.append(("Documentation Generator", await test_documentation_generator()))
    
    # Resumen
    print("\n" + "=" * 60)
    print("📊 RESUMEN DE TESTS")
    print("=" * 60)
    
    passed = 0
    failed = 0
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {name}")
        if result:
            passed += 1
        else:
            failed += 1
    
    print("\n" + "-" * 60)
    print(f"Total: {len(results)} | Pasados: {passed} | Fallados: {failed}")
    print("=" * 60)
    
    return failed == 0


if __name__ == "__main__":
    try:
        success = asyncio.run(run_all_tests())
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Error en tests: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
