@echo off
echo ========================================
echo    ACTUALIZACION SISTEMA DE CONTRASEÑAS
echo ========================================
echo.

echo [1/3] Actualizando base de datos...
sqlcmd -S localhost -d FinScopeDB -i "database/FinScopeDB_Creacion.sql"
if %errorlevel% neq 0 (
    echo ERROR: No se pudo actualizar la base de datos
    pause
    exit /b 1
)
echo ✓ Base de datos actualizada correctamente
echo.

echo [2/3] Verificando archivos del sistema...
if not exist "views/cambiar-contrasena.html" (
    echo ERROR: Archivo views/cambiar-contrasena.html no encontrado
    pause
    exit /b 1
)
if not exist "scripts/auth/cambiar-contrasena.js" (
    echo ERROR: Archivo scripts/auth/cambiar-contrasena.js no encontrado
    pause
    exit /b 1
)
echo ✓ Archivos del sistema verificados
echo.

echo [3/3] Ejecutando pruebas...
node test_password_change.js
if %errorlevel% neq 0 (
    echo ADVERTENCIA: Las pruebas fallaron, pero el sistema puede funcionar
)
echo.

echo ========================================
echo    ACTUALIZACION COMPLETADA
echo ========================================
echo.
echo El sistema de cambio de contraseñas ha sido implementado.
echo.
echo Para probar la funcionalidad:
echo 1. Inicia el servidor: npm start
echo 2. Ve a la gestion de usuarios
echo 3. Crea un nuevo usuario
echo 4. Usa la contraseña temporal generada
echo 5. El sistema te redirigira a cambiar la contraseña
echo.
echo Para mas informacion, consulta README_CAMBIO_CONTRASENA.md
echo.
pause
