# Funcionalidad de Cambio de Contraseña - FinScope

## Descripción
Esta funcionalidad permite a los usuarios cambiar su contraseña temporal por una nueva contraseña personalizada, manteniendo la seguridad y el flujo de autenticación del sistema.

## Características Implementadas

### 1. Base de Datos
- **Nuevas columnas en la tabla Users:**
  - `TempPassword`: Almacena la contraseña temporal hasheada
  - `MustChangePassword`: Indica si el usuario debe cambiar su contraseña

### 2. Vista de Cambio de Contraseña
- **Archivo:** `views/cambiar-contrasena.html`
- **Campos del formulario:**
  - Correo electrónico (solo lectura)
  - Contraseña temporal
  - Nueva contraseña (mínimo 8 caracteres)
  - Confirmar nueva contraseña
- **Validaciones:**
  - No acepta campos vacíos
  - Nueva contraseña debe tener al menos 8 caracteres
  - Las contraseñas deben coincidir
  - La nueva contraseña debe ser diferente a la temporal

### 3. API Endpoints
- **POST `/api/change-password`**
  - Valida la contraseña temporal
  - Verifica que la nueva contraseña sea diferente
  - Actualiza la contraseña en la base de datos
  - Limpia la contraseña temporal

### 4. Flujo de Autenticación
- **Login con contraseña temporal:**
  - El sistema detecta si el usuario tiene una contraseña temporal
  - Redirige automáticamente a la página de cambio de contraseña
- **Login normal:**
  - Funciona como antes, sin cambios

### 5. Botón en Login
- **Ubicación:** `views/index.html`
- **Texto:** "Cambiar Contraseña"
- **Funcionalidad:** Redirige a la vista de cambio de contraseña

## Archivos Modificados

### Base de Datos
- `database/FinScopeDB_Creacion.sql`
  - Agregadas columnas `TempPassword` y `MustChangePassword`
  - Script de actualización para bases de datos existentes

### Frontend
- `views/cambiar-contrasena.html` (nuevo)
- `views/index.html` (modificado)
- `scripts/auth/cambiar-contrasena.js` (nuevo)
- `scripts/shared/script.js` (modificado)
- `styles/styles.css` (modificado)

### Backend
- `server.js` (modificado)
- `services/userService.js` (modificado)

## Flujo de Uso

### Para Usuarios con Contraseña Temporal
1. El administrador crea un usuario con contraseña temporal
2. El usuario recibe la contraseña temporal
3. El usuario inicia sesión con su email y contraseña temporal
4. El sistema detecta que debe cambiar la contraseña
5. El usuario es redirigido automáticamente a la página de cambio de contraseña
6. El usuario ingresa su nueva contraseña
7. El sistema valida y actualiza la contraseña
8. El usuario es redirigido al login para iniciar sesión con su nueva contraseña

### Para Usuarios que Quieren Cambiar Contraseña Manualmente
1. El usuario va al login
2. Hace clic en "Cambiar Contraseña"
3. Ingresa su email y contraseña temporal
4. Ingresa su nueva contraseña
5. El sistema valida y actualiza la contraseña

## Seguridad

### Validaciones Implementadas
- ✅ Contraseña temporal debe ser correcta
- ✅ Nueva contraseña debe tener al menos 8 caracteres
- ✅ Nueva contraseña debe ser diferente a la temporal
- ✅ Las contraseñas deben coincidir
- ✅ No se aceptan campos vacíos

### Encriptación
- ✅ Todas las contraseñas se almacenan hasheadas con bcrypt
- ✅ Salt rounds: 12 (alto nivel de seguridad)
- ✅ La contraseña temporal se elimina después del cambio

## Estilos

### Diseño Consistente
- ✅ Mantiene el mismo diseño visual del proyecto
- ✅ Usa los mismos colores y tipografías
- ✅ Responsive design para móviles
- ✅ Misma estructura de layout (dos columnas)

### Elementos Visuales
- ✅ Formulario con validación en tiempo real
- ✅ Mensajes de error y éxito
- ✅ Botones con estados de carga
- ✅ Iconos informativos en la columna derecha

## Testing

### Archivo de Pruebas
- `test_password_change.js`
  - Prueba el hash de contraseñas
  - Prueba la generación de contraseñas temporales
  - Verifica que las contraseñas sean diferentes

### Cómo Ejecutar las Pruebas
```bash
node test_password_change.js
```

## Instalación y Configuración

### 1. Actualizar Base de Datos
```sql
-- Ejecutar el script actualizado
-- El script detecta automáticamente si las columnas ya existen
```

### 2. Reiniciar Servidor
```bash
# El servidor detecta automáticamente los nuevos endpoints
npm start
```

### 3. Verificar Funcionalidad
1. Crear un usuario desde la gestión de usuarios
2. Usar la contraseña temporal generada
3. Verificar que redirige a cambio de contraseña
4. Cambiar la contraseña
5. Verificar que puede hacer login con la nueva contraseña

## Notas Técnicas

### Compatibilidad
- ✅ Compatible con bases de datos existentes
- ✅ No afecta usuarios existentes
- ✅ Funciona con el sistema de roles actual

### Rendimiento
- ✅ Consultas optimizadas
- ✅ Validaciones en frontend y backend
- ✅ Manejo eficiente de errores

### Mantenimiento
- ✅ Código bien documentado
- ✅ Estructura modular
- ✅ Fácil de extender

## Posibles Mejoras Futuras

1. **Expiración de contraseñas temporales**
   - Agregar campo de expiración
   - Validar tiempo de vida

2. **Historial de cambios de contraseña**
   - Registrar cambios anteriores
   - Prevenir reutilización

3. **Notificaciones por email**
   - Confirmar cambio de contraseña
   - Alertas de seguridad

4. **Políticas de contraseña más estrictas**
   - Requerir caracteres especiales
   - Validar complejidad

## Soporte

Para cualquier problema o duda sobre esta funcionalidad:
1. Revisar los logs del servidor
2. Verificar la base de datos
3. Comprobar la consola del navegador
4. Ejecutar las pruebas incluidas
