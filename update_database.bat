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

echo Ejecutando script de actualización...
sqlcmd -S localhost -E -i "database\update_roles.sql"

if %errorlevel% equ 0 (
    echo.
    echo ¡Base de datos actualizada exitosamente!
    echo El sistema de roles ha sido implementado.
) else (
    echo.
    echo Error al actualizar la base de datos.
    echo Verifica la conexión a SQL Server y los permisos.
)

echo.
pause
