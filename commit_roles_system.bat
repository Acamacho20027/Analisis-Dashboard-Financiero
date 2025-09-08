@echo off
echo ========================================
echo    COMMIT: Sistema de Roles FinScope
echo ========================================
echo.

echo [1/4] Agregando archivos modificados...
git add .

echo [2/4] Creando commit con mensaje descriptivo...
git commit -m "feat: Implementar sistema de roles y gestión de usuarios

✨ Nuevas funcionalidades:
- Sistema de roles (Usuario/Administrador) completo
- Gestión de usuarios exclusiva para administradores
- Datos específicos por usuario en todos los módulos
- Autenticación robusta con verificación de permisos

🔧 Cambios técnicos:
- Middleware de autorización (requireAdmin)
- API REST para gestión de usuarios
- Base de datos actualizada con tabla de roles
- UI consistente según rol del usuario
- Validación de permisos en frontend y backend

📊 Módulos actualizados:
- Dashboard: datos reales por usuario
- Categorías Financieras: datos específicos por rol
- Gestión de Usuarios: nuevo módulo administrativo
- Autenticación: sistema de roles integrado

🗄️ Base de datos:
- Tabla Roles creada
- Columna RoleId agregada a Users
- Scripts de actualización incluidos
- Datos de roles insertados

🎯 Versión: v3.9.0 - Sistema de Roles y Gestión de Usuarios"

echo [3/4] Verificando estado del repositorio...
git status

echo [4/4] Commit creado exitosamente!
echo.
echo ========================================
echo    SISTEMA DE ROLES IMPLEMENTADO
echo ========================================
echo.
echo Para hacer push al repositorio remoto:
echo git push origin main
echo.
pause
