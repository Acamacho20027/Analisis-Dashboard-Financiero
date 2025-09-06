#!/usr/bin/env python3
"""
FinScope - Servidor Python para Análisis de Archivos
Inicia el servidor Flask para el módulo de análisis de archivos
"""

import sys
import os

# Agregar el directorio python-backend al path
sys.path.append(os.path.join(os.path.dirname(__file__), 'python-backend'))

# Cambiar al directorio python-backend
os.chdir(os.path.join(os.path.dirname(__file__), 'python-backend'))

# Importar y ejecutar el servidor
from api.app import app

if __name__ == '__main__':
    print("🚀 Iniciando FinScope Python Analytics API...")
    print("📊 Servicio de análisis financiero con Python")
    print("🔗 Conectando con base de datos SQL Server...")
    print("✅ Conexión a la base de datos establecida")
    print("🌐 Servidor iniciado en http://localhost:5000")
    print("📁 Módulo de Análisis de Archivos activo")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=5000, debug=True)
