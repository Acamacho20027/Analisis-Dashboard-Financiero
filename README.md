# FinScope - Plataforma de Análisis Financiero

Sistema de autenticación moderno con verificación por código de 6 dígitos enviado por email para la plataforma FinScope.

## 🚀 Características

- **Diseño Responsivo**: Layout de dos columnas (50/50) con interfaz moderna
- **Autenticación de Dos Pasos**: Login + verificación por código
- **Envío de Emails**: Integración con Nodemailer para códigos de verificación
- **Validaciones**: Frontend y backend con manejo de errores
- **Seguridad**: Códigos temporales con expiración de 10 minutos

## 📁 Estructura del Proyecto

```
ProyectoFinScope/
├── public/
│   ├── index.html          # Página de login
│   ├── espera.html         # Página de verificación
│   ├── styles.css          # Estilos CSS
│   ├── script.js           # JavaScript para login
│   └── verify.js           # JavaScript para verificación
├── server.js               # Servidor Node.js
├── package.json            # Dependencias del proyecto
└── README.md               # Este archivo
```

## 🛠️ Instalación

1. **Clonar o descargar el proyecto**
2. **Instalar dependencias:**
   ```bash
   npm install
   ```

## ⚙️ Configuración

### 1. Configurar Email (Nodemailer)

Edita el archivo `server.js` y cambia estas líneas:

```javascript
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'tu-correo@gmail.com',        // ← Tu correo Gmail
    pass: 'tu-contraseña-de-aplicacion' // ← Tu contraseña de aplicación
  }
});
```

### 2. Obtener Contraseña de Aplicación Gmail

1. Ve a [Google Account Settings](https://myaccount.google.com/)
2. Activa la **Verificación en dos pasos**
3. Ve a **Contraseñas de aplicación**
4. Genera una nueva contraseña para "Mail"
5. Usa esa contraseña en el campo `pass`

### 3. Configurar Correo Remitente

Cambia también esta línea en `server.js`:

```javascript
from: 'tu-correo@gmail.com', // ← Mismo correo que configuraste arriba
```

## 🚀 Ejecutar el Proyecto

### Desarrollo (con recarga automática):
```bash
npm run dev
```

### Producción:
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 🔄 Flujo de Autenticación

1. **Login** (`/`)
   - Usuario ingresa correo y contraseña
   - Se valida la información
   - Se genera y envía código de 6 dígitos por email

2. **Verificación** (`/espera`)
   - Usuario ingresa el código recibido
   - Se valida el código
   - Si es correcto, autenticación exitosa

## 📧 Funcionalidades del Email

- **Asunto**: "Código de verificación - FinScope"
- **Contenido**: Código de 6 dígitos con formato atractivo
- **Expiración**: 10 minutos
- **Formato**: HTML responsive

## 🎨 Personalización

### Colores Principales:
- **Azul Principal**: `#5A6BFF`
- **Gris Claro**: `#E5E5E5`
- **Fondo Derecho**: `#F5F5F5`

### Tipografía:
- **Familia**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Tamaños**: Responsivos y escalables

## 🔒 Seguridad

- Códigos temporales almacenados en memoria (Map)
- Expiración automática de 10 minutos
- Validación de entrada en frontend y backend
- Limpieza automática de códigos usados

## 📱 Responsive Design

- **Desktop**: Layout de dos columnas
- **Mobile**: Layout vertical apilado
- **Breakpoint**: 768px

## 🚨 Solución de Problemas

### Error de Autenticación Gmail:
- Verifica que la verificación en dos pasos esté activada
- Usa contraseñas de aplicación, no tu contraseña principal
- Revisa que el correo esté correctamente configurado

### Código no llega:
- Revisa la carpeta de spam
- Verifica la configuración de Nodemailer
- Revisa la consola del servidor para errores

## 🔮 Próximos Pasos

- [ ] Integración con base de datos
- [ ] Sistema de usuarios
- [ ] Dashboard de análisis financiero
- [ ] Logs de auditoría
- [ ] Rate limiting
- [ ] HTTPS

## 📄 Licencia

MIT License - Libre para uso personal y comercial

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

---

**FinScope** - Tu aliado en el análisis financiero 📊💰
