const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Almacenamiento temporal de códigos (en producción usar Redis o base de datos)
const tempCodes = new Map();

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'andrewcr72.o@gmail.com', // Cambiar por tu correo
    pass: 'ebjo bgoc udzb aanp' // Cambiar por tu contraseña de aplicación
  }
});

// Función para generar código aleatorio de 6 dígitos
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Ruta principal - Login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para la pantalla de espera
app.get('/espera', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'espera.html'));
});

// Ruta para el dashboard (nueva funcionalidad)
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Ruta para procesar el login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }
    
    // Generar código de 6 dígitos
    const code = generateCode();
    
    // Guardar código temporalmente
    tempCodes.set(email, {
      code: code,
      timestamp: Date.now()
    });
    
    // Configurar email
    const mailOptions = {
      from: 'andrewcr72.o@gmail.com',
      to: email,
      subject: 'Código de verificación - FinScope',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #5A6BFF;">FinScope - Código de Verificación</h2>
          <p>Tu código de verificación es:</p>
          <h1 style="color: #5A6BFF; font-size: 48px; text-align: center; letter-spacing: 8px;">${code}</h1>
          <p>Este código expira en 10 minutos.</p>
          <p>Si no solicitaste este código, ignora este mensaje.</p>
        </div>
      `
    };
    
    // Enviar email
    await transporter.sendMail(mailOptions);
    
    res.json({ 
      success: true, 
      message: 'Código enviado exitosamente',
      maskedEmail: email.replace(/(.{2}).*(@.*)/, '$1••••••$2')
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al procesar el login' });
  }
});

// Ruta para verificar el código
app.post('/api/verify', (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({ error: 'Email y código son requeridos' });
    }
    
    const storedData = tempCodes.get(email);
    
    if (!storedData) {
      return res.status(400).json({ error: 'Código expirado o no encontrado' });
    }
    
    // Verificar si el código ha expirado (10 minutos)
    if (Date.now() - storedData.timestamp > 10 * 60 * 1000) {
      tempCodes.delete(email);
      return res.status(400).json({ error: 'Código expirado' });
    }
    
    // Verificar código
    if (storedData.code === code) {
      // Limpiar código usado
      tempCodes.delete(email);
      res.json({ 
        success: true, 
        message: 'Código verificado exitosamente' 
      });
    } else {
      res.status(400).json({ error: 'Código incorrecto' });
    }
    
  } catch (error) {
    console.error('Error en verificación:', error);
    res.status(500).json({ error: 'Error al verificar el código' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
