# 🚀 FinScope - Aplicación de Finanzas Personales

Una aplicación web moderna y completa para el control de finanzas personales, construida con **Node.js, SQL Server y JavaScript**. FinScope ofrece un sistema completo de gestión financiera con interfaz intuitiva, funcionalidades avanzadas y **base de datos real integrada**.

## 🆕 **NUEVO: Base de Datos Real Integrada**

- **SQL Server** como base de datos principal
- **Sistema de usuarios real** con registro y autenticación
- **Datos persistentes** y seguros en la nube
- **API REST completa** para todas las operaciones
- **Autenticación JWT** con tokens seguros
- **Verificación por email** con códigos reales

## ✨ Características Principales

### 🔐 Sistema de Autenticación Robusto
- **Login seguro** con usuario/contraseña
- **Verificación de dos factores (2FA)** con código por email real
- **Sesiones persistentes** con JWT tokens
- **Flujo de autenticación completo** y seguro
- **Registro de usuarios** con validación completa
- **Base de datos SQL Server** para almacenamiento seguro

### 📊 Dashboard Financiero Inteligente
- **Resumen financiero completo** con balance total, ingresos y gastos del mes
- **Métricas en tiempo real** actualizadas automáticamente
- **Sistema de metas de ahorro** con barras de progreso visuales
- **Actividad reciente** con historial detallado de transacciones
- **Diseño responsive** que se adapta a todos los dispositivos

### 💰 Gestión Avanzada de Transacciones
- **Formulario intuitivo** para agregar transacciones
- **Categorías predefinidas**: Alimentación, Transporte, Entretenimiento, Servicios, Salario, Inversiones, Otros
- **Tipos de transacción**: Ingresos, Gastos y Transferencias
- **Sistema de filtros** por tipo y categoría
- **Listado dinámico** con scroll habilitado
- **Base de datos SQL Server** para almacenamiento persistente y seguro
- **API REST completa** para operaciones CRUD

### 📈 Estadísticas y Análisis
- **Gráficos interactivos** usando Chart.js
- **Análisis de gastos por categoría**
- **Evolución del balance** en el tiempo
- **Distribución de ingresos vs gastos**
- **Métricas detalladas** y comparativas

### 📊 Reportes y Exportación
- **Exportación a PDF** usando jsPDF
- **Exportación a Excel** usando SheetJS
- **Exportación a CSV** para análisis externos
- **Filtros personalizables** por fecha, categoría y tipo
- **Vista previa** de reportes antes de exportar
- **Historial de reportes** generados

### 🎯 Metas de Ahorro Personalizadas
- **Barras de progreso visuales** con porcentajes
- **Seguimiento de objetivos** financieros
- **Metas predefinidas** (Vacaciones, Fondo de Emergencia, Nuevo Auto)
- **Progreso en tiempo real** del ahorro

## 🛠️ Tecnologías Utilizadas

### **Backend (NUEVO)**
- **Node.js** con Express.js para el servidor
- **SQL Server** como base de datos principal
- **JWT** para autenticación segura
- **bcryptjs** para encriptación de contraseñas
- **Nodemailer** para envío de emails de verificación
- **API REST** completa para todas las operaciones

### **Frontend**
- **HTML5, CSS3, JavaScript ES6+** para la interfaz
- **Chart.js** para visualizaciones interactivas
- **jsPDF** para exportación de reportes PDF
- **SheetJS** para exportación de reportes Excel
- **CSS personalizado** con sistema de grid y flexbox

## 🚀 Instalación y Uso

### Prerrequisitos
- **Node.js** (versión 16 o superior)
- **SQL Server** instalado y configurado
- **Navegador web moderno** (Chrome, Firefox, Safari, Edge)
- **Git** para clonar el repositorio

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd Proyecto_Analisis_Financiero
```

### 2. Configurar la base de datos
```bash
# Ejecutar el script SQL en SQL Server Management Studio
database/FinScopeDB_Creation.sql

# Configurar variables de entorno
cp config.env .env
# Editar .env con tus credenciales de SQL Server y email
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Ejecutar la aplicación
```bash
npm run dev
```

### 5. Acceder a la aplicación
- **URL**: `http://localhost:3000`
- **Registro**: `http://localhost:3000/register`
- **Login**: `http://localhost:3000`
- **Dashboard**: Panel principal tras verificación 2FA

## 🔑 Sistema de Usuarios Real

### **Registro de Usuarios**
- **Página de registro** completa con validaciones
- **Verificación por email** con códigos reales
- **Encriptación de contraseñas** con bcrypt
- **Base de datos SQL Server** para almacenamiento seguro

### **Login y Autenticación**
- **Sistema de login** integrado con base de datos
- **Verificación 2FA** por email real
- **Tokens JWT** para sesiones seguras
- **Middleware de autenticación** para rutas protegidas

### **Para Probar la Aplicación**
1. **Registra un usuario** en `/register`
2. **Verifica tu email** con el código recibido
3. **Haz login** con tus credenciales
4. **Accede al dashboard** completo

## 📱 Funcionalidades Detalladas

### Sistema de Login y Autenticación
1. **Página de inicio** con formulario de login elegante
2. **Validación de credenciales** con manejo de errores
3. **Generación automática** de código 2FA
4. **Redirección inteligente** a página de verificación

### Verificación 2FA
1. **Ingreso de código** de 6 dígitos con validación automática
2. **Verificación local** para pruebas y desarrollo
3. **Manejo de errores** con mensajes informativos
4. **Redirección automática** al dashboard tras verificación exitosa

### Dashboard Principal
1. **Header informativo** con título y subtítulo descriptivo
2. **Sidebar de navegación** con enlaces a todas las secciones
3. **Métricas principales** en tarjetas visuales atractivas
4. **Sistema de metas** con barras de progreso
5. **Actividad reciente** con historial detallado

### Gestión de Transacciones
1. **Formulario completo** para nueva transacción
2. **Validación robusta** de todos los campos requeridos
3. **Sistema de filtros** por tipo y categoría
4. **Listado dinámico** con scroll habilitado
5. **Resumen automático** de métricas del mes

### Visualización de Datos
1. **Gráficos responsivos** que se adaptan al contenido
2. **Colores consistentes** con el tema de la aplicación
3. **Interactividad completa** con hover y tooltips
4. **Actualización dinámica** al agregar transacciones

## 🎨 Diseño y Experiencia de Usuario

### Características de Diseño
- **Diseño completamente responsivo** para todos los dispositivos
- **Sistema de scroll habilitado** en todas las páginas del sistema
- **Sidebar fijo** para navegación consistente
- **Animaciones suaves** y transiciones elegantes
- **Iconografía consistente** con emojis y símbolos
- **Tipografía legible** con jerarquía visual clara
- **Espaciado consistente** usando sistema de grid CSS

### Paleta de Colores
- **Primario**: Azul (#3b82f6) para elementos principales
- **Secundario**: Gris (#64748b) para elementos secundarios
- **Acento**: Verde (#10b981) para elementos positivos
- **Peligro**: Rojo (#dc2626) para elementos negativos
- **Neutral**: Grises (#f8fafc, #e2e8f0) para fondos

### Componentes UI
- **Tarjetas** con sombras y bordes redondeados
- **Botones** con estados hover, focus y active
- **Formularios** con validación visual y feedback
- **Navegación** clara e intuitiva con indicadores activos
- **Métricas** con iconos y colores semánticos

## 📊 Estructura de Datos

### Transacción
```javascript
{
  id: Number,
  fecha: String (YYYY-MM-DD),
  categoria: String,
  monto: Number,
  tipo: 'ingreso' | 'gasto' | 'transferencia',
  descripcion: String (opcional)
}
```

### Categorías Disponibles
- `alimentacion` → 🍽️ Alimentación
- `transporte` → 🚗 Transporte
- `entretenimiento` → 🎮 Entretenimiento
- `servicios` → ⚡ Servicios
- `salario` → 💰 Salario
- `inversiones` → 📈 Inversiones
- `otros` → 📦 Otros

### Metas de Ahorro
```javascript
{
  nombre: String,
  meta: Number,
  actual: Number,
  porcentaje: Number
}
```

## 🔧 Personalización y Extensibilidad

### Agregar Nuevas Categorías
1. Editar el array de categorías en los archivos JavaScript
2. Actualizar los formularios en los archivos HTML
3. Agregar traducciones en las funciones de categorías

### Modificar Colores y Estilos
1. Actualizar variables CSS en `styles.css`
2. Modificar colores de gráficas en los archivos JavaScript
3. Ajustar paleta de colores en componentes específicos

### Agregar Nuevas Funcionalidades
1. Crear nuevas páginas HTML siguiendo el patrón existente
2. Implementar lógica JavaScript en archivos separados
3. Agregar estilos CSS específicos para nuevas funcionalidades

## 🚀 Despliegue

### Opciones de Despliegue
- **Vercel**: Despliegue automático desde GitHub
- **Netlify**: Drag & drop de la carpeta `public`
- **GitHub Pages**: Servir archivos estáticos
- **Servidor propio**: Usar cualquier servidor web estático

### Configuración de Producción
1. **Optimizar assets** (minificar CSS/JS)
2. **Configurar HTTPS** para seguridad
3. **Implementar base de datos** real (opcional)
4. **Agregar autenticación** robusta con backend
5. **Configurar monitoreo** y logs de errores

## 🔌 API REST Completa

### **Endpoints de Autenticación**
- **POST** `/api/register` - Registro de usuarios
- **POST** `/api/login` - Autenticación de usuarios
- **POST** `/api/verify` - Verificación de códigos 2FA
- **GET** `/api/profile` - Perfil del usuario autenticado

### **Endpoints de Transacciones**
- **POST** `/api/transactions` - Crear nueva transacción
- **GET** `/api/transactions` - Obtener transacciones del usuario
- **GET** `/api/transactions/summary` - Resumen de transacciones
- **GET** `/api/transactions/expenses-by-category` - Gastos por categoría

### **Endpoints de Categorías**
- **GET** `/api/categories` - Obtener categorías disponibles

### **Seguridad y Autenticación**
- **Middleware JWT** para rutas protegidas
- **Encriptación bcrypt** para contraseñas
- **Validación de datos** en todos los endpoints
- **Manejo de errores** robusto y descriptivo

## 🧪 Testing y Funcionalidades

### Funcionalidades a Probar
- [x] **Registro de usuarios** con validación completa
- [x] **Login con base de datos real** y verificación de credenciales
- [x] **Verificación 2FA por email** con códigos reales
- [x] **Sistema de autenticación JWT** con tokens seguros
- [x] **Navegación entre todas las secciones** del sistema
- [x] **Agregar nueva transacción** con persistencia en SQL Server
- [x] **Validación de formularios** en frontend y backend
- [x] **Filtrado de transacciones** con base de datos real
- [x] **Exportación a PDF/Excel/CSV** desde datos reales
- [x] **Responsividad en diferentes dispositivos**
- [x] **Persistencia de datos en SQL Server** con relaciones
- [x] **Sistema de scroll** en todas las páginas
- [x] **API REST completa** para todas las operaciones

### Casos de Uso Principales
1. **Usuario nuevo**: Registro → Verificación email → Login → 2FA → Dashboard vacío → Agregar transacciones
2. **Usuario existente**: Login → 2FA → Dashboard con datos → Gestionar finanzas
3. **Gestión de transacciones**: Agregar, visualizar, filtrar, exportar desde base de datos real
4. **Navegación completa**: Cambiar entre todas las secciones del sistema
5. **Análisis financiero**: Revisar estadísticas, metas y reportes con datos persistentes
6. **Administración de usuarios**: Sistema completo de cuentas individuales y seguras

## 🤝 Contribución

### Cómo Contribuir
1. **Fork** el repositorio
2. **Crear** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crear** un Pull Request

### Áreas de Mejora Identificadas
- [x] **Implementar base de datos real** (SQL Server integrado)
- [x] **Agregar autenticación robusta** con JWT y verificación 2FA
- [x] **Sistema de usuarios real** con registro y login
- [ ] Implementar sincronización en la nube
- [ ] Agregar más tipos de gráficas y visualizaciones
- [ ] Implementar sistema de metas personalizables por usuario
- [ ] Agregar notificaciones push y alertas
- [ ] Implementar modo oscuro/claro
- [ ] Agregar sistema de respaldo y restauración
- [ ] Implementar importación de datos desde archivos externos
- [ ] Agregar roles y permisos de usuario
- [ ] Implementar auditoría de cambios

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Desarrollador Full Stack** - FinScope Team

## 🙏 Agradecimientos

- **Chart.js** por las librerías de gráficas interactivas
- **jsPDF** por las funcionalidades de exportación a PDF
- **SheetJS** por las funcionalidades de exportación a Excel
- **Comunidad de desarrolladores** por el feedback y sugerencias

## 📞 Soporte y Contacto

Si tienes alguna pregunta o necesitas ayuda:

1. **Crear un issue** en GitHub con descripción detallada
2. **Revisar la documentación** del código en los comentarios
3. **Contactar al equipo** de desarrollo directamente

## 🔄 Historial de Versiones

### v3.0.0 (Actual) - **Base de Datos Real Integrada**
- ✅ **Base de datos SQL Server** completamente integrada
- ✅ **Sistema de usuarios real** con registro y autenticación
- ✅ **API REST completa** para todas las operaciones
- ✅ **Autenticación JWT** con tokens seguros
- ✅ **Verificación 2FA por email** con códigos reales
- ✅ **Middleware de autenticación** para rutas protegidas
- ✅ **Encriptación de contraseñas** con bcrypt
- ✅ **Persistencia de datos** en base de datos relacional
- ✅ **Sistema de scroll** habilitado en todas las páginas
- ✅ **Arquitectura multi-página** con sidebar consistente
- ✅ **Gestión completa de transacciones** con base de datos
- ✅ **Exportación a múltiples formatos** desde datos reales
- ✅ **Diseño completamente responsive**

### v2.0.0
- ✅ Sistema de scroll habilitado en todas las páginas
- ✅ Refactorización completa a arquitectura multi-página
- ✅ Sidebar de navegación consistente
- ✅ Sistema de autenticación 2FA funcional
- ✅ Gestión completa de transacciones
- ✅ Exportación a múltiples formatos
- ✅ Diseño completamente responsive

### v1.0.0 (Inicial)
- ✅ Sistema básico de login
- ✅ Dashboard con métricas básicas
- ✅ Gestión simple de transacciones

---

**¡Gracias por usar FinScope! 🎉**

*Una aplicación construida con ❤️ para el control financiero personal, diseñada para ser intuitiva, funcional y escalable.*

---

**🚀 ¡FinScope - Tu futuro financiero comienza aquí!**
