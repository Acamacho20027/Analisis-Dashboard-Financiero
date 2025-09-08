@echo off
echo Actualizando base de datos con sistema de roles...
echo.

REM Verificar si sqlcmd está disponible
sqlcmd -? >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: sqlcmd no está disponible. Asegúrate de tener SQL Server Command Line Utilities instalado.
    pause
    exit /b 1
)

echo Ejecutando script de creación/actualización...
sqlcmd -S localhost -E -i "database\FinScopeDB_Creacion.sql"

if %errorlevel% equ 0 (
    echo.
    echo ¡Base de datos creada/actualizada exitosamente!
    echo El sistema de roles ha sido implementado.
    echo.
    echo El script FinScopeDB_Creacion.sql ahora incluye:
    echo - Creación de base de datos (si no existe)
    echo - Creación de tablas (si no existen)
    echo - Sistema de roles completo
    echo - Datos iniciales
) else (
    echo.
    echo Error al crear/actualizar la base de datos.
    echo Verifica la conexión a SQL Server y los permisos.
)

echo.
pause
