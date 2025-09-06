#!/usr/bin/env python3
"""
Script de inicio para el servidor de análisis de archivos de FinScope
"""

import sys
import os

# Agregar el directorio actual al path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from api.app import app
    
    if __name__ == '__main__':
        print("🚀 Iniciando FinScope Python Analytics API...")
        print("📊 Servicio de análisis financiero con Python")
        print("🔗 Conectando con base de datos SQL Server...")
        
        # Verificar conexión a la base de datos
        from database_connection import DatabaseConnection
        db = DatabaseConnection()
        
        if db.connect():
            print("✅ Conexión a la base de datos establecida")
            db.close()
        else:
            print("⚠️  Advertencia: No se pudo conectar a la base de datos")
            print("   Verifica la configuración en config.env")
        
        print("🌐 Servidor iniciado en http://localhost:5000")
        print("📁 Módulo de Análisis de Archivos activo")
        print("=" * 50)
        
        app.run(host='0.0.0.0', port=5000, debug=True)
        
except ImportError as e:
    print(f"❌ Error al importar dependencias: {e}")
    print("💡 Ejecuta: pip install -r requirements.txt")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error al iniciar el servidor: {e}")
    sys.exit(1)
