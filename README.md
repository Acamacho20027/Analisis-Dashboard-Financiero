# 🚀 FinScope - Aplicación de Finanzas Personales

Una aplicación web moderna y completa para el control de finanzas personales, construida con HTML, CSS y JavaScript vanilla. FinScope ofrece un sistema completo de gestión financiera con interfaz intuitiva y funcionalidades avanzadas.

## ✨ Características Principales

### 🔐 Sistema de Autenticación Robusto
- **Login seguro** con usuario/contraseña
- **Verificación de dos factores (2FA)** con código temporal
- **Sesiones persistentes** con localStorage
- **Flujo de autenticación completo** y seguro

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
- **Almacenamiento local** persistente y confiable

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

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Gráficas**: Chart.js para visualizaciones interactivas
- **Exportación PDF**: jsPDF para reportes profesionales
- **Exportación Excel**: SheetJS para análisis de datos
- **Almacenamiento**: localStorage para persistencia de datos
- **Diseño**: CSS personalizado con sistema de grid y flexbox

## 🚀 Instalación y Uso

### Prerrequisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, para desarrollo)

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd Proyecto_Analisis_Financiero
```

### 2. Ejecutar la aplicación
- **Opción 1**: Abrir `public/index.html` directamente en el navegador
- **Opción 2**: Usar un servidor local (recomendado para desarrollo)

### 3. Acceder a la aplicación
- **URL**: `public/index.html`
- **Login**: Formulario de autenticación
- **Dashboard**: Panel principal tras verificación 2FA

## 🔑 Credenciales de Demo

Para probar la aplicación, usa estas credenciales:

- **Usuario**: `demo@finscope.com`
- **Contraseña**: `123456`
- **Código 2FA**: `123456` (se genera automáticamente)

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

## 🧪 Testing y Funcionalidades

### Funcionalidades a Probar
- [x] Login con credenciales válidas
- [x] Verificación 2FA exitosa
- [x] Navegación entre todas las secciones
- [x] Agregar nueva transacción
- [x] Validación de formularios
- [x] Filtrado de transacciones
- [x] Exportación a PDF/Excel/CSV
- [x] Responsividad en diferentes dispositivos
- [x] Persistencia de datos en localStorage
- [x] Sistema de scroll en todas las páginas

### Casos de Uso Principales
1. **Usuario nuevo**: Login → 2FA → Dashboard vacío → Agregar transacciones
2. **Usuario existente**: Login → 2FA → Dashboard con datos → Gestionar finanzas
3. **Gestión de transacciones**: Agregar, visualizar, filtrar, exportar
4. **Navegación completa**: Cambiar entre todas las secciones del sistema
5. **Análisis financiero**: Revisar estadísticas, metas y reportes

## 🤝 Contribución

### Cómo Contribuir
1. **Fork** el repositorio
2. **Crear** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crear** un Pull Request

### Áreas de Mejora Identificadas
- [ ] Implementar base de datos real (MySQL, PostgreSQL, MongoDB)
- [ ] Agregar autenticación robusta con JWT y refresh tokens
- [ ] Implementar sincronización en la nube
- [ ] Agregar más tipos de gráficas y visualizaciones
- [ ] Implementar sistema de metas personalizables por usuario
- [ ] Agregar notificaciones push y alertas
- [ ] Implementar modo oscuro/claro
- [ ] Agregar sistema de respaldo y restauración
- [ ] Implementar importación de datos desde archivos externos

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

### v2.0.0 (Actual)
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
