@echo off
echo Instalando dependencias de Python para FinScope...
echo.

REM Verificar si Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python no está instalado o no está en el PATH
    echo Por favor instala Python desde https://python.org
    pause
    exit /b 1
)

echo Python encontrado. Instalando dependencias...
echo.

REM Instalar dependencias
pip install -r requirements.txt

if errorlevel 1 (
    echo.
    echo ERROR: Hubo un problema instalando las dependencias
    echo Verifica que pip esté actualizado: python -m pip install --upgrade pip
    pause
    exit /b 1
)

echo.
echo ✅ Dependencias instaladas correctamente
echo.
echo Ahora puedes ejecutar el servidor con: python start_server.py
echo.
pause
