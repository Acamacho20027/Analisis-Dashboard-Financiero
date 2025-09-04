@echo off
echo ========================================
echo 🚀 FinScope - Iniciando Servidores
echo 📊 Categorías Financieras con Python
echo ========================================

echo.
echo 🔧 Iniciando servidor Node.js...
start "FinScope Node.js" cmd /k "npm start"

echo.
echo ⏳ Esperando 3 segundos para que Node.js se inicie...
timeout /t 3 /nobreak > nul

echo.
echo 🐍 Iniciando servidor Python...
cd python-backend
start "FinScope Python API" cmd /k "python start_python_api.py"

echo.
echo ✅ Ambos servidores iniciados:
echo    📱 Node.js: http://localhost:3000
echo    🐍 Python: http://localhost:5000
echo.
echo 🌐 Abre http://localhost:3000 en tu navegador
echo.
pause
