@echo off
echo ========================================
echo    COMMIT: Integración de Archivos SQL
echo ========================================
echo.

echo [1/4] Agregando archivos modificados...
git add .

echo [2/4] Creando commit con mensaje descriptivo...
git commit -m "refactor: Integrar archivos SQL en un solo script

🔧 Reorganización de archivos:
- Integrado update_roles.sql en FinScopeDB_Creacion.sql
- Eliminado archivo update_roles.sql duplicado
- Actualizado update_database.bat para usar script unificado

✨ Mejoras en FinScopeDB_Creacion.sql:
- Script inteligente para bases de datos nuevas y existentes
- Verificaciones IF NOT EXISTS para evitar errores
- Mensajes informativos sobre el progreso de ejecución
- Sistema de roles completamente integrado
- Compatible con bases de datos existentes

🛠️ Actualizaciones en update_database.bat:
- Ahora ejecuta FinScopeDB_Creacion.sql unificado
- Mensajes informativos sobre funcionalidades del script
- Mejor documentación de las operaciones

📊 Beneficios:
- Un solo archivo SQL para crear/actualizar base de datos
- Mantenimiento simplificado
- Menos archivos en el proyecto
- Script más robusto y confiable
- Mejor experiencia de usuario

🗄️ Archivos afectados:
- database/FinScopeDB_Creacion.sql (actualizado)
- database/update_roles.sql (eliminado)
- update_database.bat (actualizado)

🎯 Versión: v3.9.1 - Integración de Archivos SQL"

echo [3/4] Verificando estado del repositorio...
git status

echo [4/4] Commit creado exitosamente!
echo.
echo ========================================
echo    ARCHIVOS SQL INTEGRADOS
echo ========================================
echo.
echo Para hacer push al repositorio remoto:
echo git push origin main
echo.
pause
