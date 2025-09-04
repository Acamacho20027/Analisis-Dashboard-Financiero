#!/usr/bin/env python3
"""
Script de inicio para la API de Python de FinScope
Análisis de Categorías Financieras
"""

import os
import sys
import subprocess
from pathlib import Path

def check_python_version():
    """Verifica que la versión de Python sea compatible"""
    if sys.version_info < (3, 8):
        print("❌ Error: Se requiere Python 3.8 o superior")
        print(f"   Versión actual: {sys.version}")
        return False
    print(f"✅ Python {sys.version.split()[0]} detectado")
    return True

def install_requirements():
    """Instala las dependencias de Python"""
    print("📦 Instalando dependencias de Python...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencias instaladas correctamente")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error al instalar dependencias: {e}")
        return False

def check_database_connection():
    """Verifica la conexión a la base de datos"""
    print("🔗 Verificando conexión a la base de datos...")
    try:
        from database_connection import DatabaseConnection
        db = DatabaseConnection()
        if db.connect():
            print("✅ Conexión a SQL Server establecida")
            db.close()
            return True
        else:
            print("⚠️  Advertencia: No se pudo conectar a SQL Server")
            print("   Asegúrate de que la base de datos esté ejecutándose")
            return False
    except Exception as e:
        print(f"⚠️  Advertencia: Error al conectar con la base de datos: {e}")
        return False

def start_api():
    """Inicia la API de Python"""
    print("🚀 Iniciando API de Python...")
    try:
        from api.app import app
        app.run(host='0.0.0.0', port=5000, debug=False)
    except Exception as e:
        print(f"❌ Error al iniciar la API: {e}")
        return False

def main():
    """Función principal"""
    print("=" * 60)
    print("🤖 FinScope Python Analytics API")
    print("📊 Análisis de Categorías Financieras")
    print("=" * 60)
    
    # Verificar versión de Python
    if not check_python_version():
        sys.exit(1)
    
    # Instalar dependencias
    if not install_requirements():
        print("❌ No se pudieron instalar las dependencias")
        sys.exit(1)
    
    # Verificar conexión a la base de datos
    check_database_connection()
    
    # Iniciar API
    print("\n🌐 Iniciando servidor en http://localhost:5000")
    print("📊 API de análisis financiero lista")
    print("🔗 Integración con Node.js en puerto 3000")
    print("\nPresiona Ctrl+C para detener el servidor")
    print("=" * 60)
    
    start_api()

if __name__ == "__main__":
    main()
