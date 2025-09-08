# Sistema de Roles - FinScope

## Descripción

Este documento describe la implementación del sistema de roles en FinScope, que permite controlar el acceso a diferentes funcionalidades del sistema según el rol del usuario.

## Roles Implementados

### 1. Usuario (ID: 1)
- **Acceso**: Funcionalidades básicas del sistema
- **Módulos disponibles**:
  - Dashboard
  - Categorías Financieras
  - Análisis de Archivos
  - Reportes

### 2. Administrador (ID: 2)
- **Acceso**: Todas las funcionalidades del usuario + gestión de usuarios
- **Módulos disponibles**:
  - Dashboard
  - Categorías Financieras
  - Análisis de Archivos
  - Reportes
  - **Gestión de Usuarios** (exclusivo)

## Estructura de Base de Datos

### Tabla Roles
```sql
CREATE TABLE Roles (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(255) NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);
```

### Tabla Users (actualizada)
```sql
-- Se agregó la columna RoleId
ALTER TABLE Users ADD RoleId INT NOT NULL DEFAULT 1;
ALTER TABLE Users ADD CONSTRAINT FK_Users_Roles FOREIGN KEY (RoleId) REFERENCES Roles(Id);
```

## Instalación

### 1. Actualizar Base de Datos
Ejecuta el script de actualización:
```bash
# Windows
update_database.bat

# O manualmente con sqlcmd
sqlcmd -S localhost -E -i "database\update_roles.sql"
```

### 2. Verificar Instalación
1. Inicia el servidor: `npm start`
2. Accede al sistema con un usuario administrador
3. Verifica que aparezca el menú "Gestión de Usuarios" en el sidebar

## Funcionalidades del Módulo de Gestión de Usuarios

### Para Administradores

#### 1. Visualización de Usuarios
- Lista completa de usuarios registrados
- Información detallada: ID, nombre, email, rol, estado, último login
- Tabla responsive con paginación

#### 2. Registro de Usuarios
- Formulario para crear nuevos usuarios
- Campos: nombre, apellido, email, rol, estado
- Validación de datos en frontend y backend

#### 3. Edición de Usuarios
- Modificar información de usuarios existentes
- Cambiar rol (Usuario/Administrador)
- Activar/desactivar usuarios
- No permite auto-eliminación

#### 4. Eliminación de Usuarios
- Eliminación lógica (marca como inactivo)
- Protección contra auto-eliminación
- Confirmación antes de eliminar

#### 5. Historial de Usuarios
- Registro de usuarios creados y modificados
- Información de fechas de creación y último login
- Seguimiento de cambios de estado

## API Endpoints

### Gestión de Usuarios (Solo Administradores)

#### Obtener todos los usuarios
```
GET /api/users
Authorization: Bearer <token>
```

#### Obtener usuario específico
```
GET /api/users/:id
Authorization: Bearer <token>
```

#### Actualizar usuario
```
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Nombre",
  "lastName": "Apellido",
  "email": "email@ejemplo.com",
  "roleId": 1,
  "isActive": true
}
```

#### Eliminar usuario
```
DELETE /api/users/:id
Authorization: Bearer <token>
```

#### Obtener roles
```
GET /api/roles
Authorization: Bearer <token>
```

## Middleware de Autenticación

### requireAdmin
Middleware que verifica si el usuario es administrador:
```javascript
const { requireAdmin } = require('./middleware/auth');

app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
  // Solo administradores pueden acceder
});
```

## Seguridad

### 1. Verificación de Roles
- Todas las rutas de administración requieren rol de administrador
- Verificación tanto en frontend como backend
- Tokens JWT incluyen información del rol

### 2. Protecciones Implementadas
- No se puede eliminar la propia cuenta
- Validación de permisos en cada request
- Sanitización de datos de entrada

### 3. Middleware de Seguridad
```javascript
// Verificar autenticación
authenticateToken

// Verificar rol de administrador
requireAdmin

// Verificar propiedad del recurso
requireOwnership
```

## Frontend

### 1. Navegación Condicional
El menú de "Gestión de Usuarios" solo aparece para administradores:
```javascript
// En cada página del sistema
if (user.roleId === 2) {
    adminMenu.style.display = 'block';
} else {
    adminMenu.style.display = 'none';
}
```

### 2. Componentes
- **Tabla de usuarios**: Lista responsive con acciones
- **Modal de usuario**: Formulario para crear/editar
- **Badges de estado**: Indicadores visuales de estado y rol

### 3. Validaciones
- Campos requeridos
- Formato de email
- Confirmación de eliminación
- Feedback visual de operaciones

## Archivos Modificados

### Backend
- `server.js` - Rutas de API y middleware
- `middleware/auth.js` - Middleware de roles
- `services/userService.js` - Lógica de usuarios
- `database/update_roles.sql` - Script de actualización

### Frontend
- `views/gestion-usuarios.html` - Página de gestión
- `scripts/gestion-usuarios/gestion-usuarios.js` - Lógica frontend
- `views/dashboard.html` - Menú condicional
- `views/categorias-financieras.html` - Menú condicional
- `views/analisis-archivos.html` - Menú condicional
- `views/reportes.html` - Menú condicional
- `styles/styles.css` - Estilos del módulo

## Uso

### 1. Acceso como Administrador
1. Inicia sesión con una cuenta de administrador
2. Verás el menú "Gestión de Usuarios" en el sidebar
3. Haz clic para acceder al módulo

### 2. Gestión de Usuarios
1. **Ver usuarios**: Lista automática al cargar la página
2. **Agregar usuario**: Botón "Agregar Usuario" → completar formulario
3. **Editar usuario**: Botón "Editar" en la fila del usuario
4. **Eliminar usuario**: Botón "Eliminar" → confirmar acción

### 3. Cambiar Roles
1. Editar un usuario
2. Seleccionar nuevo rol en el dropdown
3. Guardar cambios

## Troubleshooting

### Problema: No aparece el menú de administrador
**Solución**: Verificar que el usuario tenga `roleId = 2` en la base de datos

### Problema: Error al actualizar base de datos
**Solución**: 
1. Verificar conexión a SQL Server
2. Ejecutar script manualmente
3. Verificar permisos de usuario

### Problema: No se pueden crear usuarios
**Solución**: Verificar que el usuario actual sea administrador y tenga token válido

## Próximas Mejoras

1. **Auditoría**: Log de cambios en usuarios
2. **Roles personalizados**: Crear roles con permisos específicos
3. **Notificaciones**: Alertas de cambios importantes
4. **Exportación**: Exportar lista de usuarios
5. **Búsqueda**: Filtros avanzados en la tabla de usuarios
