@echo off
echo Reiniciando servidor FinScope...
echo.

echo Deteniendo procesos de Node.js...
taskkill /f /im node.exe 2>nul

echo Esperando 2 segundos...
timeout /t 2 /nobreak >nul

echo Iniciando servidor...
node server.js

pause
