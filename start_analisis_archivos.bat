@echo off
echo ========================================
echo    FinScope - Análisis de Archivos
echo ========================================
echo.

echo Iniciando servidores...
echo.

REM Iniciar servidor Node.js en segundo plano
echo Iniciando servidor Node.js (puerto 3000)...
start "FinScope Node.js" cmd /k "npm start"

REM Esperar un poco para que Node.js se inicie
timeout /t 3 /nobreak >nul

REM Iniciar servidor Python
echo Iniciando servidor Python (puerto 5000)...
cd python-backend
start "FinScope Python" cmd /k "python start_server.py"

echo.
echo ✅ Servidores iniciados
echo.
echo 🌐 Aplicación web: http://localhost:3000
echo 🐍 API Python: http://localhost:5000
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
