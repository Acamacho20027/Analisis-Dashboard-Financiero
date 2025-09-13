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

### 🔐 Sistema de Autenticación y Roles Robusto
- **Login seguro** con usuario/contraseña
- **Verificación de dos factores (2FA)** con código por email real
- **Sesiones persistentes** con JWT tokens
- **Flujo de autenticación completo** y seguro
- **Registro de usuarios** con validación completa
- **Sistema de roles** (Usuario/Administrador) con permisos diferenciados
- **Base de datos SQL Server** para almacenamiento seguro

### 📊 Dashboard Financiero Inteligente
- **Resumen financiero completo** con balance total, ingresos y gastos del mes
- **Balance Anual** con gráfico de barras mensuales y métricas detalladas
- **Métricas en tiempo real** actualizadas automáticamente
- **Gráficos interactivos** con Chart.js para visualización de datos
- **Diseño responsive** que se adapta a todos los dispositivos

### 💰 Gestión Avanzada de Transacciones
- **Formulario intuitivo** para agregar transacciones con validación en tiempo real
- **Categorías predefinidas**: Alimentación, Transporte, Entretenimiento, Servicios, Salario, Inversiones, Otros
- **Tipos de transacción**: Ingresos, Gastos y Transferencias
- **Sistema de filtros** por tipo y categoría
- **Listado dinámico** con scroll habilitado
- **Actualización automática** del dashboard al crear transacciones
- **Base de datos SQL Server** para almacenamiento persistente y seguro
- **API REST completa** para operaciones CRUD

### 📊 Categorías Financieras
- **Análisis de Gastos por Categoría** con gráficos de dona interactivos
- **Evolución del Balance** con gráficos de barras acumuladas y gradientes
- **Distribución Ingresos vs Gastos** con gráficos de barras comparativas
- **Datos específicos por usuario** desde la base de datos SQL Server
- **Procesamiento inteligente** de transacciones por mes y categoría
- **Tooltips informativos** con porcentajes y valores formateados
- **Diseño responsivo** con colores profesionales y efectos hover
- **Autenticación robusta** con datos reales por rol de usuario

### 📁 Análisis de Archivos (NUEVO)
- **Procesamiento de archivos PDF y Excel** con análisis financiero automático
- **Backend Python integrado** con pandas, numpy, matplotlib y scikit-learn
- **Extracción inteligente de datos** financieros de documentos
- **Generación de gráficos** personalizados con matplotlib
- **Interfaz drag & drop** para carga de archivos
- **Historial de archivos procesados** con funcionalidad de eliminación
- **Análisis de ingresos y gastos** detectados automáticamente
- **Visualización de resultados** integrada en el frontend
- **Almacenamiento en base de datos** SQL Server para historial
- **Modales elegantes** para confirmaciones y notificaciones
- **Sistema de confirmación** para eliminación de archivos con advertencias
- **Notificaciones visuales** con animaciones y colores consistentes
- **🆕 Visualización de análisis** con modal interactivo para ver resultados
- **🆕 Descarga de análisis** en formato JPG con gráficos combinados
- **🆕 Botón "Ver Análisis"** para archivos procesados exitosamente
- **🆕 Resumen detallado** con métricas de ingresos, gastos y balance
- **🆕 Validación robusta** de datos de gráficos para descarga
- **🆕 Estados de carga** y manejo de errores mejorado

### 📊 Reportes y Exportación
- **Reportes de Transacciones** con vista previa completa y descarga en PDF
- **Reportes de Categorías Financieras** con información detallada de categorías
- **Vista previa en pantalla** con el mismo diseño que tendrá el PDF
- **Historial de reportes generados** con opción de redescarga y eliminación
- **Descarga en formato PDF** usando jsPDF con diseño profesional
- **Datos específicos por usuario** de las tablas de la base de datos
- **Formato estructurado** con tablas, encabezados claros y diseño legible
- **Estados de carga** y manejo de errores mejorado
- **Notificaciones visuales** para confirmación de acciones
- **🆕 Modal de confirmación elegante** para eliminación de reportes con animaciones
- **🆕 PDFs con diseño profesional** con encabezados corporativos, tarjetas de resumen y tablas estilizadas
- **🆕 Colores corporativos** y tipografía consistente en los PDFs
- **🆕 Pie de página** con paginación y marca corporativa
- **🆕 Tarjetas de resumen** con métricas destacadas y colores semánticos

### 👥 Gestión de Usuarios (Solo Administradores)
- **Creación de usuarios** con formulario completo y validaciones
- **Edición de usuarios** con actualización de datos personales
- **Eliminación completa** de usuarios y todos sus datos relacionados
- **Sistema de roles** con permisos diferenciados (Usuario/Administrador)
- **Interfaz administrativa** exclusiva para administradores
- **Validación de permisos** en frontend y backend
- **Base de datos SQL Server** para gestión de usuarios
- **Contraseñas temporales** generadas automáticamente para nuevos usuarios
- **Modales elegantes** con diseño profesional y animaciones
- **Eliminación en cascada** de transacciones, categorías y archivos del usuario
- **Verificación automática** de usuarios creados por administradores

### 🎯 Metas de Ahorro Personalizadas
- **Barras de progreso visuales** con porcentajes
- **Seguimiento de objetivos** financieros
- **Metas predefinidas** (Vacaciones, Fondo de Emergencia, Nuevo Auto)
- **Progreso en tiempo real** del ahorro

## 🗂️ Reorganización de Estructura (v3.1.0)

### **Mejoras en la Organización**
- **📁 Separación clara de responsabilidades**: Vistas, scripts y estilos en carpetas dedicadas
- **🔧 Mantenibilidad mejorada**: Código organizado por funcionalidad para fácil mantenimiento
- **📈 Escalabilidad**: Estructura preparada para futuras funcionalidades
- **🎯 Navegación optimizada**: Rutas absolutas para mejor rendimiento
- **⚡ Servidor Express configurado**: Servicio de archivos estáticos optimizado

### **Beneficios de la Nueva Estructura**
- **Desarrollo más eficiente**: Localización rápida de archivos por funcionalidad
- **Colaboración mejorada**: Estructura clara para trabajo en equipo
- **Debugging simplificado**: Archivos organizados por módulos específicos
- **Deployment optimizado**: Configuración de servidor para producción
- **Código más limpio**: Separación de responsabilidades clara

## 🛠️ Tecnologías Utilizadas

### **Backend**
- **Node.js** con Express.js para el servidor principal
- **Python Flask** para análisis avanzado de archivos
- **SQL Server** como base de datos principal
- **JWT** para autenticación segura
- **bcryptjs** para encriptación de contraseñas
- **Nodemailer** para envío de emails de verificación
- **API REST** completa para todas las operaciones
- **pandas, numpy, matplotlib** para análisis de datos
- **scikit-learn** para análisis avanzado

### **Frontend**
- **HTML5, CSS3, JavaScript ES6+** para la interfaz
- **Chart.js** para visualizaciones interactivas
- **jsPDF** para exportación de reportes PDF
- **SheetJS** para exportación de reportes Excel
- **CSS personalizado** con sistema de grid y flexbox

## 🚀 Instalación y Uso

### Prerrequisitos
- **Node.js** (versión 16 o superior)
- **Python** (versión 3.8 o superior) - Para análisis avanzado de categorías financieras
  - Descargar desde: https://www.python.org/downloads/
  - Asegúrate de marcar "Add Python to PATH" durante la instalación
- **SQL Server** instalado y configurado
- **Navegador web moderno** (Chrome, Firefox, Safari, Edge)
- **Git** para clonar el repositorio

> **Nota**: Si no tienes Python instalado, el módulo de Categorías Financieras funcionará con gráficos básicos usando Chart.js como fallback.

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
# Instalar dependencias de Node.js
npm install

# Instalar dependencias de Python
cd python-backend
pip install -r requirements.txt
cd ..
```

### 4. Ejecutar la aplicación
```bash
# Opción 1: Iniciar ambos servidores automáticamente
start_servers.bat

# Opción 2: Iniciar manualmente
# Terminal 1 - Servidor Node.js
npm start

# Terminal 2 - Servidor Python
cd python-backend
python start_python_api.py
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

### **Endpoints de Gestión de Usuarios (Solo Administradores)**
- **POST** `/api/users` - Crear nuevo usuario con contraseña temporal
- **GET** `/api/users` - Obtener todos los usuarios
- **GET** `/api/users/:id` - Obtener usuario específico
- **PUT** `/api/users/:id` - Actualizar usuario
- **DELETE** `/api/users/:id` - Eliminar usuario completamente (cascada)
- **GET** `/api/roles` - Obtener roles disponibles

### **Endpoints de Transacciones**
- **POST** `/api/transactions` - Crear nueva transacción
- **GET** `/api/transactions` - Obtener transacciones del usuario
- **GET** `/api/transactions/summary` - Resumen de transacciones
- **GET** `/api/transactions/expenses-by-category` - Gastos por categoría

### **Endpoints de Categorías**
- **GET** `/api/categories` - Obtener categorías disponibles

### **Endpoints de Análisis de Archivos**
- **POST** `/api/analisis-archivos/procesar` - Procesar archivo PDF/Excel
- **GET** `/api/analisis-archivos/historial` - Obtener historial de archivos procesados
- **GET** `/api/analisis-archivos/resultados/:fileId` - Obtener resultados de análisis específico
- **DELETE** `/api/analisis-archivos/eliminar/:fileId` - Eliminar archivo procesado

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
- [x] **Implementar análisis de archivos** PDF y Excel con Python
- [x] **Visualización y descarga de análisis** con modal interactivo
- [x] **Módulo de reportes completamente funcional** con vista previa y descarga PDF
- [ ] Implementar sincronización en la nube
- [ ] Agregar más tipos de gráficas y visualizaciones
- [ ] Implementar sistema de metas personalizables por usuario
- [ ] Agregar notificaciones push y alertas
- [ ] Implementar modo oscuro/claro
- [ ] Agregar sistema de respaldo y restauración
- [x] **Agregar roles y permisos de usuario** (Sistema completo implementado)
- [ ] Implementar auditoría de cambios
- [ ] Agregar descarga en múltiples formatos (PNG, PDF)
- [ ] Implementar plantillas personalizables de reportes

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

## 📁 Estructura del Proyecto

```
Proyecto_Analisis_Financiero/
├── views/                    # Vistas HTML organizadas
│   ├── index.html           # Página de login
│   ├── register.html        # Página de registro
│   ├── verify.html          # Página de verificación 2FA
│   ├── espera.html          # Página de espera
│   ├── dashboard.html       # Dashboard principal
│   ├── categorias-financieras.html  # Página de categorías financieras
│   ├── analisis-archivos.html  # Análisis de archivos PDF/Excel
│   └── reportes.html        # Generación de reportes
├── scripts/                 # Archivos JavaScript organizados
│   ├── auth/                # Autenticación
│   │   ├── register.js
│   │   └── verify-simple.js
│   ├── dashboard/           # Dashboard
│   │   └── dashboard.js
│   ├── categorias-financieras/  # Categorías Financieras
│   │   └── categorias-financieras.js
│   ├── analisis-archivos/   # Análisis de Archivos
│   │   └── analisis-archivos.js
│   ├── reportes/            # Reportes
│   │   └── reportes.js
│   └── shared/              # Archivos compartidos
│       ├── config.js
│       └── script.js
├── styles/                  # Archivos CSS
│   └── styles.css
├── public/                  # Recursos estáticos
│   └── images/              # Imágenes del proyecto
├── services/                # Servicios del backend
├── middleware/              # Middleware de autenticación
├── config/                  # Configuración de base de datos
├── database/                # Scripts SQL
└── python-backend/          # Backend Python para análisis
    ├── api/                 # API Flask
    ├── analysis/            # Módulos de análisis
    └── requirements.txt     # Dependencias Python
```

## 🔄 Historial de Versiones

### v3.10.1 (Actual) - **Mejoras en UI de Modales de Análisis de Archivos**
- ✅ **Títulos centrados** en modales de análisis y eliminación de archivos
- ✅ **Layout mejorado** con flexbox para centrado perfecto de títulos
- ✅ **Consistencia visual** en todos los modales del sistema
- ✅ **Estilos específicos** para modales de análisis de archivos
- ✅ **Experiencia de usuario** mejorada con diseño más profesional

### v3.10.0 - **Gestión Completa de Usuarios con Modales Profesionales**
- ✅ **Creación de usuarios** con formulario completo y validaciones
- ✅ **Contraseñas temporales** generadas automáticamente para nuevos usuarios
- ✅ **Eliminación completa** de usuarios y todos sus datos relacionados (cascada)
- ✅ **Modales elegantes** con diseño profesional y animaciones suaves
- ✅ **Layout horizontal** en headers con título centrado e icono lateral
- ✅ **Eliminación en cascada** de transacciones, categorías y archivos del usuario
- ✅ **Verificación automática** de usuarios creados por administradores
- ✅ **Modal de contraseña temporal** con funcionalidad de copiar al portapapeles
- ✅ **Estilos CSS específicos** para cada modal con gradientes y animaciones
- ✅ **Botones con iconos SVG** y efectos hover profesionales
- ✅ **Sistema de confirmación** mejorado para eliminación de usuarios
- ✅ **API REST actualizada** con endpoint POST para creación de usuarios
- ✅ **Interfaz administrativa** completamente renovada y profesional
- ✅ **Diseño responsive** que se adapta a todos los dispositivos
- ✅ **Experiencia de usuario** mejorada con feedback visual inmediato

### v3.9.0 - **Sistema de Roles y Gestión de Usuarios**
- ✅ **Sistema de roles** (Usuario/Administrador) completamente implementado
- ✅ **Gestión de usuarios** exclusiva para administradores
- ✅ **Datos específicos por usuario** en todos los módulos
- ✅ **Autenticación robusta** con verificación de permisos
- ✅ **Interfaz administrativa** con registro, edición y eliminación de usuarios
- ✅ **Middleware de autorización** para rutas protegidas
- ✅ **Base de datos actualizada** con tabla de roles y permisos
- ✅ **UI consistente** en todos los módulos según rol
- ✅ **API REST completa** para gestión de usuarios
- ✅ **Validación de permisos** en frontend y backend
- ✅ **Eliminación lógica** de usuarios con confirmación
- ✅ **Historial de usuarios** registrados y modificados
- ✅ **Sistema de autenticación** mejorado con roles
- ✅ **Datos reales por usuario** en Dashboard y Categorías Financieras
- ✅ **Navegación dinámica** según permisos del usuario

### v3.8.0 - **Reportes con Diseño Profesional y Modal Elegante**
- ✅ **Modal de confirmación elegante** para eliminación de reportes con animaciones suaves
- ✅ **Backdrop blur** y efectos visuales profesionales en el modal
- ✅ **PDFs con diseño corporativo** con encabezados azules y branding FinScope
- ✅ **Tarjetas de resumen** con métricas destacadas y colores semánticos
- ✅ **Tablas profesionales** con encabezados estilizados y filas alternadas
- ✅ **Pie de página** con paginación y marca corporativa en cada página
- ✅ **Colores corporativos** consistentes en toda la aplicación
- ✅ **Tipografía jerárquica** con diferentes tamaños y pesos de fuente
- ✅ **Círculos de color** para mostrar colores de categorías en PDFs
- ✅ **Manejo inteligente de páginas** con nueva página automática cuando sea necesario
- ✅ **Animaciones CSS** para una experiencia de usuario fluida
- ✅ **Estados de carga** mejorados con indicadores visuales
- ✅ **Manejo robusto de errores** con mensajes específicos y recuperación automática
- ✅ **Integración perfecta** entre modal y funcionalidad de eliminación
- ✅ **Diseño responsive** que se adapta a todos los dispositivos
- ✅ **Experiencia de usuario** mejorada con feedback visual inmediato

### v3.7.0 - **Módulo de Reportes Completamente Funcional**
- ✅ **Reportes de Transacciones** con vista previa completa y descarga en PDF
- ✅ **Reportes de Categorías Financieras** con información detallada
- ✅ **Vista previa en pantalla** con el mismo diseño que tendrá el PDF
- ✅ **Historial de reportes generados** con opción de redescarga y eliminación
- ✅ **Descarga en formato PDF** usando jsPDF con diseño profesional
- ✅ **Datos obtenidos directamente** de las tablas de la base de datos
- ✅ **Formato estructurado** con tablas, encabezados claros y diseño legible
- ✅ **Estados de carga** y manejo de errores mejorado
- ✅ **Notificaciones visuales** para confirmación de acciones
- ✅ **Diseño responsive** que se adapta a todos los dispositivos
- ✅ **Integración completa** con la base de datos SQL Server
- ✅ **API REST** para obtener datos de transacciones y categorías

### v3.6.0 - **Visualización y Descarga de Análisis de Archivos**
- ✅ **Botón "Ver Análisis"** para archivos procesados exitosamente
- ✅ **Modal de visualización** con resumen completo del análisis
- ✅ **Descarga en formato JPG** con gráficos combinados
- ✅ **Proxy mejorado** del servidor Node.js para conectar con Python
- ✅ **Validación robusta** de datos de gráficos para descarga
- ✅ **Estados de carga** y manejo de errores mejorado
- ✅ **Modal consistente** con el diseño del sistema
- ✅ **Descarga simple** para archivos con un solo gráfico
- ✅ **Descarga combinada** para múltiples gráficos en una imagen
- ✅ **Nombres descriptivos** de archivos basados en el original
- ✅ **Debug logging** para troubleshooting
- ✅ **Botón centrado** de descarga JPG
- ✅ **Manejo de errores** informativo y recuperación automática

### v3.5.0 - **Módulo de Análisis de Archivos con Modales Elegantes**
- ✅ **Módulo "Análisis de Archivos"** completamente funcional
- ✅ **Procesamiento de PDF y Excel** con análisis financiero automático
- ✅ **Backend Python integrado** con Flask, pandas, numpy, matplotlib
- ✅ **Extracción inteligente de datos** financieros de documentos
- ✅ **Generación de gráficos** personalizados con matplotlib
- ✅ **Interfaz drag & drop** para carga de archivos
- ✅ **Historial de archivos procesados** con funcionalidad de eliminación
- ✅ **Análisis de ingresos y gastos** detectados automáticamente
- ✅ **Visualización de resultados** integrada en el frontend
- ✅ **Almacenamiento en base de datos** SQL Server para historial
- ✅ **API REST completa** para operaciones de archivos
- ✅ **Autenticación JWT** integrada para seguridad
- ✅ **Manejo robusto de errores** y timeouts
- ✅ **Interfaz simplificada** con información esencial
- ✅ **Modales elegantes** para notificaciones y confirmaciones
- ✅ **Sistema de confirmación** para eliminación con advertencias visuales
- ✅ **Notificaciones visuales** con animaciones y colores consistentes
- ✅ **UX mejorada** con indicadores de carga y restauración de botones

### v3.4.0 - **Dashboard Mejorado con Balance Anual**
- ✅ **Sección "Balance Anual"** reemplaza "Metas de Ahorro" con gráfico de barras mensuales
- ✅ **Métricas anuales** (Balance Total, Ingresos Anuales, Gastos Anuales) con indicadores de cambio
- ✅ **Gráfico interactivo** con colores dinámicos (verde/rojo según balance mensual)
- ✅ **Actualización automática** completa del dashboard al crear transacciones
- ✅ **Manejo robusto de errores** con logging detallado para diagnóstico
- ✅ **Indicador de carga** en formulario de transacciones
- ✅ **Eliminación de "Actividad Reciente"** para interfaz más limpia
- ✅ **Validaciones mejoradas** para Chart.js y elementos DOM
- ✅ **Destrucción segura** de gráficos existentes antes de crear nuevos
- ✅ **Manejo individual de errores** en inicialización del dashboard
- ✅ **Mejoras en apiRequest** para evitar excepciones innecesarias

### v3.3.0 - **Categorías Financieras Optimizadas**
- ✅ **Módulo "Categorías Financieras"** completamente funcional
- ✅ **Datos reales de base de datos** SQL Server integrados
- ✅ **Análisis de Gastos por Categoría** con gráficos de dona interactivos
- ✅ **Evolución del Balance** con gráficos de barras acumuladas y gradientes
- ✅ **Distribución Ingresos vs Gastos** con gráficos de barras comparativas
- ✅ **Procesamiento inteligente** de transacciones por mes y categoría
- ✅ **Tooltips informativos** con porcentajes y valores formateados
- ✅ **Diseño responsivo** con colores profesionales y efectos hover
- ✅ **Fallback inteligente** a datos de ejemplo si no hay autenticación
- ✅ **Logging detallado** para debugging y monitoreo
- ✅ **Endpoint de prueba** para desarrollo y testing

### v3.2.0 - **Categorías Financieras con Análisis Python**
- ✅ **Módulo "Categorías Financieras"** completamente renovado
- ✅ **Backend Python integrado** con pandas, numpy, scikit-learn
- ✅ **Análisis inteligente** basado en datos reales de transacciones
- ✅ **Gráficos avanzados** generados con matplotlib y seaborn
- ✅ **Tres secciones principales**: Gastos por Categoría, Evolución del Balance, Distribución Ingresos vs Gastos
- ✅ **Clustering y regresión** con scikit-learn para insights personalizados
- ✅ **API Python independiente** en puerto 5000
- ✅ **Integración perfecta** entre Node.js y Python
- ✅ **Visualizaciones responsivas** y estéticamente atractivas
- ✅ **Análisis en tiempo real** desde base de datos SQL Server
- ✅ **Estructura de carpetas reorganizada** para mejor organización
- ✅ **Separación clara** entre vistas, scripts y estilos
- ✅ **Archivos JavaScript organizados** por funcionalidad
- ✅ **Rutas optimizadas** con servidor Express configurado
- ✅ **Navegación mejorada** entre todas las páginas
- ✅ **Mantenibilidad mejorada** del código
- ✅ **Escalabilidad** para futuras funcionalidades
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

### v3.1.0 - **Estructura Reorganizada y Optimizada**

### v3.0.0 - **Base de Datos Real Integrada**

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
