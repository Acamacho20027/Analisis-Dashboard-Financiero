# 🚀 FinScope - Aplicación de Finanzas Personales

Una aplicación web moderna y completa para el control de finanzas personales, construida con HTML, CSS (TailwindCSS) y JavaScript vanilla.

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- **Login con usuario/contraseña**
- **Verificación de dos factores (2FA)** con código temporal simulado
- **Sesiones persistentes** con localStorage
- **Credenciales de demo** incluidas

### 📊 Dashboard Financiero
- **Resumen financiero** con balance total, ingresos y gastos del mes
- **Métricas en tiempo real** actualizadas automáticamente
- **Gráficas interactivas** usando Chart.js:
  - Balance mensual (línea)
  - Gastos por categoría (dona)
  - Ingresos vs Gastos mensual (barras)

### 💰 Gestión de Transacciones
- **Formulario intuitivo** para agregar transacciones
- **Categorías predefinidas**: Alimentación, Transporte, Entretenimiento, Servicios, Salario, Inversiones
- **Tipos de transacción**: Ingresos y Gastos
- **Listado de transacciones** con opción "Ver más"
- **Almacenamiento local** persistente

### 📈 Reportes y Exportación
- **Exportación a PDF** usando jsPDF
- **Exportación a Excel** usando SheetJS
- **Reportes detallados** con formato profesional

### 🎯 Metas de Ahorro
- **Barras de progreso** visuales
- **Indicadores de metas** personalizables
- **Seguimiento de objetivos** financieros

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Framework CSS**: TailwindCSS (CDN)
- **Gráficas**: Chart.js
- **Exportación PDF**: jsPDF
- **Exportación Excel**: SheetJS
- **Backend**: Node.js + Express
- **Almacenamiento**: localStorage (cliente)

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd Proyecto_Analisis_Financiero
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar la aplicación
```bash
npm start
```

### 4. Acceder a la aplicación
- **URL**: http://localhost:3000
- **Login**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard

## 🔑 Credenciales de Demo

Para probar la aplicación, usa estas credenciales:

- **Usuario**: `demo`
- **Contraseña**: `123456`
- **Código 2FA**: `123456` (se genera automáticamente)

## 📱 Funcionalidades Detalladas

### Sistema de Login
1. **Página de inicio** con formulario de login
2. **Validación de credenciales** simulada
3. **Generación automática** de código 2FA
4. **Redirección** a página de verificación

### Verificación 2FA
1. **Ingreso de código** de 6 dígitos
2. **Validación automática** del código
3. **Opción de reenvío** de código
4. **Redirección** al dashboard tras verificación exitosa

### Dashboard Principal
1. **Header** con logo y opciones de usuario
2. **Sidebar** con navegación por secciones
3. **Área principal** con contenido dinámico
4. **Métricas** actualizadas en tiempo real

### Gestión de Transacciones
1. **Formulario** para nueva transacción
2. **Validación** de campos requeridos
3. **Almacenamiento** en localStorage
4. **Actualización automática** de métricas y gráficas

### Visualización de Datos
1. **Gráficas responsivas** que se adaptan al contenido
2. **Colores consistentes** con el tema de la aplicación
3. **Interactividad** con hover y tooltips
4. **Actualización dinámica** al agregar transacciones

## 🎨 Diseño y UX

### Paleta de Colores
- **Primario**: Azul (#1e40af)
- **Secundario**: Gris (#64748b)
- **Acento**: Verde (#10b981)
- **Peligro**: Rojo (#ef4444)

### Características de Diseño
- **Diseño responsivo** para todos los dispositivos
- **Animaciones suaves** y transiciones
- **Iconografía consistente** con SVG
- **Tipografía legible** y jerarquía visual clara
- **Espaciado consistente** usando sistema de espaciado de Tailwind

### Componentes UI
- **Tarjetas** con sombras y bordes redondeados
- **Botones** con estados hover y focus
- **Formularios** con validación visual
- **Navegación** clara e intuitiva

## 📊 Estructura de Datos

### Transacción
```javascript
{
  id: Number,
  fecha: String (YYYY-MM-DD),
  categoria: String,
  monto: Number,
  tipo: 'ingreso' | 'gasto',
  descripcion: String
}
```

### Categorías Disponibles
- `alimentacion` → Alimentación
- `transporte` → Transporte
- `entretenimiento` → Entretenimiento
- `servicios` → Servicios
- `salario` → Salario
- `inversiones` → Inversiones

## 🔧 Personalización

### Agregar Nuevas Categorías
1. Editar el array de categorías en `dashboard.js`
2. Actualizar el formulario en `dashboard.html`
3. Agregar traducciones en la función `getCategoryName()`

### Modificar Colores
1. Actualizar la configuración de Tailwind en los archivos HTML
2. Modificar variables CSS en `styles.css`
3. Ajustar colores de gráficas en `dashboard.js`

### Agregar Nuevas Gráficas
1. Crear función de inicialización en `dashboard.js`
2. Agregar canvas en `dashboard.html`
3. Implementar lógica de datos y renderizado

## 🚀 Despliegue

### Opciones de Despliegue
- **Vercel**: Despliegue automático desde GitHub
- **Netlify**: Drag & drop de la carpeta `public`
- **GitHub Pages**: Servir archivos estáticos
- **Servidor propio**: Usar Node.js + Express

### Configuración de Producción
1. **Optimizar assets** (minificar CSS/JS)
2. **Configurar HTTPS** para seguridad
3. **Implementar base de datos** real
4. **Agregar autenticación** robusta
5. **Configurar monitoreo** y logs

## 🧪 Testing

### Funcionalidades a Probar
- [ ] Login con credenciales válidas
- [ ] Verificación 2FA exitosa
- [ ] Agregar nueva transacción
- [ ] Validación de formularios
- [ ] Exportación a PDF/Excel
- [ ] Responsividad en diferentes dispositivos
- [ ] Persistencia de datos en localStorage

### Casos de Uso
1. **Usuario nuevo**: Login → 2FA → Dashboard vacío
2. **Usuario existente**: Login → 2FA → Dashboard con datos
3. **Gestión de transacciones**: Agregar, visualizar, exportar
4. **Navegación**: Cambiar entre secciones del sidebar

## 🤝 Contribución

### Cómo Contribuir
1. **Fork** el repositorio
2. **Crear** una rama para tu feature
3. **Commit** tus cambios
4. **Push** a la rama
5. **Crear** un Pull Request

### Áreas de Mejora
- [ ] Implementar base de datos real
- [ ] Agregar autenticación robusta
- [ ] Implementar sincronización en la nube
- [ ] Agregar más tipos de gráficas
- [ ] Implementar sistema de metas personalizables
- [ ] Agregar notificaciones push
- [ ] Implementar modo oscuro

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Tu Nombre** - Desarrollador Full Stack

## 🙏 Agradecimientos

- **TailwindCSS** por el framework CSS
- **Chart.js** por las librerías de gráficas
- **jsPDF** y **SheetJS** por las funcionalidades de exportación
- **Express.js** por el framework de servidor

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda:

1. **Crear un issue** en GitHub
2. **Revisar la documentación** del código
3. **Contactar al desarrollador** directamente

---

**¡Gracias por usar FinScope! 🎉**

*Una aplicación construida con ❤️ para el control financiero personal.*
