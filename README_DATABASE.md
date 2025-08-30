# 🗄️ Configuración de Base de Datos - FinScope

## 📋 Requisitos Previos

- **SQL Server** instalado y funcionando
- **SQL Server Management Studio (SSMS)** o **Azure Data Studio**
- **Node.js** y **npm** instalados

## 🚀 Pasos para Configurar la Base de Datos

### 1. Crear la Base de Datos

1. Abre **SQL Server Management Studio (SSMS)**
2. Conecta a tu instancia de SQL Server
3. Abre el archivo `database/FinScopeDB_Creation.sql`
4. Ejecuta todo el script completo
5. Verifica que se haya creado la base de datos `FinScopeDB`

### 2. Configurar Variables de Entorno

1. Copia el archivo `config.env` a `.env`
2. Modifica las siguientes variables según tu configuración:

```env
# Configuración de Base de Datos SQL Server
DB_SERVER=localhost          # Tu servidor SQL Server
DB_NAME=FinScopeDB          # Nombre de la base de datos
DB_USER=sa                  # Usuario de SQL Server
DB_PASSWORD=tu_password     # Contraseña de SQL Server

# Configuración de JWT
JWT_SECRET=tu_jwt_secret_super_seguro_aqui_para_finscope_2024
JWT_EXPIRES_IN=24h

# Configuración de Email
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_aplicacion
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Verificar Conexión

```bash
npm run dev
```

Deberías ver en la consola:
```
✅ Conexión a SQL Server establecida exitosamente
🚀 Servidor corriendo en http://localhost:3000
```

## 🗂️ Estructura de la Base de Datos

### Tablas Principales

- **Users** - Información de usuarios
- **VerificationCodes** - Códigos de verificación de dos factores
- **Categories** - Categorías de transacciones (sistema + personalizadas)
- **Transactions** - Transacciones financieras de los usuarios
- **UserSessions** - Sesiones activas de usuarios

### Índices y Optimizaciones

- Índices en campos de búsqueda frecuente
- Procedimientos almacenados para limpieza automática
- Restricciones de integridad referencial

## 🔐 Funcionalidades Implementadas

### Autenticación
- ✅ Registro de usuarios con contraseñas encriptadas
- ✅ Login con validación de credenciales
- ✅ Verificación de dos factores por email
- ✅ Tokens JWT para sesiones seguras

### Transacciones Financieras
- ✅ Crear, leer, actualizar y eliminar transacciones
- ✅ Filtros por tipo, categoría y fecha
- ✅ Cálculo automático de balances
- ✅ Estadísticas por períodos

### Categorías
- ✅ Categorías por defecto del sistema
- ✅ Categorías personalizadas por usuario
- ✅ Colores y tipos predefinidos

## 🚨 Solución de Problemas

### Error de Conexión
```
❌ Error al conectar a SQL Server: Login failed for user 'sa'
```
**Solución:** Verifica que el usuario `sa` esté habilitado y la contraseña sea correcta

### Error de Base de Datos
```
❌ Error: Cannot find database 'FinScopeDB'
```
**Solución:** Ejecuta primero el script SQL para crear la base de datos

### Error de Permisos
```
❌ Error: CREATE TABLE permission denied
```
**Solución:** Asegúrate de que tu usuario tenga permisos de administrador

## 📊 Verificar Instalación

1. **Base de datos creada** ✅
2. **Tablas existentes** ✅
3. **Categorías por defecto insertadas** ✅
4. **Servidor conectando correctamente** ✅
5. **APIs respondiendo** ✅

## 🔄 Próximos Pasos

1. **Probar registro de usuario** - `/api/register`
2. **Probar login** - `/api/login`
3. **Probar verificación** - `/api/verify`
4. **Probar transacciones** - `/api/transactions`

## 📞 Soporte

Si encuentras problemas:
1. Verifica los logs del servidor
2. Revisa la configuración de SQL Server
3. Confirma que las variables de entorno estén correctas
4. Verifica que la base de datos esté creada y accesible

---

**¡FinScope con Base de Datos Real está listo! 🎉**
