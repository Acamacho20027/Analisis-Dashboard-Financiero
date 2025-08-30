require('dotenv').config({ path: './config.env' });
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Importar servicios y configuración
const { connectDB, closeDB } = require('./config/database');
const userService = require('./services/userService');
const verificationService = require('./services/verificationService');
const transactionService = require('./services/transactionService');
const { authenticateToken, requireVerification } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'andrewcr72.o@gmail.com',
    pass: process.env.EMAIL_PASS || 'ebjo bgoc udzb aanp'
  }
});

// Conectar a la base de datos al iniciar
connectDB().catch(console.error);

// Manejar cierre graceful del servidor
process.on('SIGINT', async () => {
  console.log('\n🔄 Cerrando servidor...');
  await closeDB();
  process.exit(0);
});

// Ruta principal - Login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para registro
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Ruta para la pantalla de espera
app.get('/espera', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'espera.html'));
});

// Ruta para el dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Ruta para estadísticas
app.get('/estadisticas', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'estadisticas.html'));
});

// Ruta para transacciones
app.get('/transacciones', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'transacciones.html'));
});

// Ruta para reportes
app.get('/reportes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'reportes.html'));
});

// ===== API RUTAS =====

// Ruta para registro de usuarios
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Validación básica
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos' 
      });
    }
    
    // Registrar usuario
    const result = await userService.registerUser({
      email, password, firstName, lastName
    });
    
    res.json({
      success: true,
      message: 'Usuario registrado exitosamente. Por favor verifica tu cuenta.',
      userId: result.userId
    });
    
  } catch (error) {
    console.error('Error en registro:', error);
    
    if (error.message === 'El usuario ya existe con este email') {
      return res.status(400).json({ 
        error: 'El usuario ya existe con este email' 
      });
    }
    
    res.status(500).json({ 
      error: 'Error al registrar usuario',
      message: error.message 
    });
  }
});

// Ruta para procesar el login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Correo y contraseña son requeridos' 
      });
    }
    
    // Autenticar usuario
    const authResult = await userService.authenticateUser(email, password);
    
    if (!authResult.success) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }
    
    // Generar código de verificación
    const code = verificationService.generateCode();
    
    // Guardar código en la base de datos
    await verificationService.saveVerificationCode(authResult.user.id, code);
    
    // Configurar email
    const mailOptions = {
      from: process.env.EMAIL_USER || 'andrewcr72.o@gmail.com',
      to: email,
      subject: 'Código de verificación - FinScope',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #5A6BFF;">FinScope - Código de Verificación</h2>
          <p>Hola ${authResult.user.firstName}, tu código de verificación es:</p>
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
      maskedEmail: email.replace(/(.{2}).*(@.*)/, '$1••••••$2'),
      userId: authResult.user.id
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    
    if (error.message === 'Usuario no encontrado') {
      return res.status(401).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    
    if (error.message === 'Contraseña incorrecta') {
      return res.status(401).json({ 
        error: 'Contraseña incorrecta' 
      });
    }
    
    res.status(500).json({ 
      error: 'Error al procesar el login',
      message: error.message 
    });
  }
});

// Ruta para verificar el código
app.post('/api/verify', async (req, res) => {
  try {
    const { userId, code } = req.body;
    
    if (!userId || !code) {
      return res.status(400).json({ 
        error: 'UserId y código son requeridos' 
      });
    }
    
    // Verificar código
    const verificationResult = await verificationService.verifyCode(userId, code);
    
    if (!verificationResult.success) {
      return res.status(400).json({ 
        error: verificationResult.message 
      });
    }
    
    // Marcar usuario como verificado
    await userService.verifyUser(userId);
    
    // Obtener usuario actualizado
    const user = await userService.getUserById(userId);
    
    // Generar token JWT
    const token = userService.generateToken({
      id: user.Id,
      email: user.Email,
      firstName: user.FirstName,
      lastName: user.LastName
    });
    
    res.json({ 
      success: true, 
      message: 'Código verificado exitosamente',
      token: token,
      user: {
        id: user.Id,
        email: user.Email,
        firstName: user.FirstName,
        lastName: user.LastName,
        isVerified: true
      }
    });
    
  } catch (error) {
    console.error('Error en verificación:', error);
    res.status(500).json({ 
      error: 'Error al verificar el código',
      message: error.message 
    });
  }
});

// Ruta para obtener perfil del usuario (protegida)
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    
    res.json({
      success: true,
      user: {
        id: user.Id,
        email: user.Email,
        firstName: user.FirstName,
        lastName: user.LastName,
        isVerified: user.IsVerified,
        lastLoginAt: user.LastLoginAt
      }
    });
    
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ 
      error: 'Error al obtener perfil',
      message: error.message 
    });
  }
});

// Ruta para crear transacción (protegida)
app.post('/api/transactions', authenticateToken, requireVerification, async (req, res) => {
  try {
    const { amount, type, categoryId, description, transactionDate } = req.body;
    
    if (!amount || !type || !categoryId || !transactionDate) {
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos' 
      });
    }
    
    const result = await transactionService.createTransaction({
      userId: req.user.id,
      amount,
      type,
      categoryId,
      description,
      transactionDate
    });
    
    res.json({
      success: true,
      message: 'Transacción creada exitosamente',
      transactionId: result.transactionId
    });
    
  } catch (error) {
    console.error('Error al crear transacción:', error);
    res.status(500).json({ 
      error: 'Error al crear transacción',
      message: error.message 
    });
  }
});

// Ruta para obtener transacciones del usuario (protegida)
app.get('/api/transactions', authenticateToken, requireVerification, async (req, res) => {
  try {
    const filters = {
      type: req.query.type,
      categoryId: req.query.categoryId,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };
    
    const transactions = await transactionService.getUserTransactions(req.user.id, filters);
    
    res.json({
      success: true,
      transactions: transactions
    });
    
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    res.status(500).json({ 
      error: 'Error al obtener transacciones',
      message: error.message 
    });
  }
});

// Ruta para obtener resumen de transacciones (protegida)
app.get('/api/transactions/summary', authenticateToken, requireVerification, async (req, res) => {
  try {
    const period = req.query.period || 'month';
    const summary = await transactionService.getTransactionSummary(req.user.id, period);
    
    res.json({
      success: true,
      summary: summary
    });
    
  } catch (error) {
    console.error('Error al obtener resumen:', error);
    res.status(500).json({ 
      error: 'Error al obtener resumen',
      message: error.message 
    });
  }
});

// Ruta para obtener gastos por categoría (protegida)
app.get('/api/transactions/expenses-by-category', authenticateToken, requireVerification, async (req, res) => {
  try {
    const period = req.query.period || 'month';
    const expenses = await transactionService.getExpensesByCategory(req.user.id, period);
    
    res.json({
      success: true,
      expenses: expenses
    });
    
  } catch (error) {
    console.error('Error al obtener gastos por categoría:', error);
    res.status(500).json({ 
      error: 'Error al obtener gastos por categoría',
      message: error.message 
    });
  }
});

// Ruta para obtener categorías
app.get('/api/categories', async (req, res) => {
  try {
    // Por ahora retornamos las categorías por defecto
    // En el futuro se pueden agregar categorías personalizadas por usuario
    const categories = [
      { id: 1, name: 'Alimentación', type: 'gasto', color: '#3b82f6', isDefault: true },
      { id: 2, name: 'Transporte', type: 'gasto', color: '#10b981', isDefault: true },
      { id: 3, name: 'Entretenimiento', type: 'gasto', color: '#f59e0b', isDefault: true },
      { id: 4, name: 'Servicios', type: 'gasto', color: '#ef4444', isDefault: true },
      { id: 5, name: 'Salario', type: 'ingreso', color: '#10b981', isDefault: true },
      { id: 6, name: 'Freelance', type: 'ingreso', color: '#8b5cf6', isDefault: true },
      { id: 7, name: 'Inversiones', type: 'ingreso', color: '#06b6d4', isDefault: true },
      { id: 8, name: 'Otros', type: 'ingreso', color: '#84cc16', isDefault: true }
    ];
    
    res.json({
      success: true,
      categories: categories
    });
    
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ 
      error: 'Error al obtener categorías',
      message: error.message 
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Base de datos: ${process.env.DB_NAME || 'FinScopeDB'}`);
  console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Configurado' : 'Por defecto'}`);
});
