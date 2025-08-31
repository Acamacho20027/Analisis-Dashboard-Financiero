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

// Middleware de logging para todas las peticiones


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

// ===== TRANSACCIONES =====

// Crear nueva transacción
app.post('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const { amount, type, categoryId, description, transactionDate } = req.body;
    const userId = req.user.id;
    
    // Validación básica
    if (!amount || !type || !categoryId || !transactionDate) {
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos' 
      });
    }
    
    // Validar tipo de transacción
    if (!['ingreso', 'gasto'].includes(type)) {
      return res.status(400).json({ 
        error: 'Tipo de transacción inválido' 
      });
    }
    
    // Crear transacción
    const result = await transactionService.createTransaction({
      userId,
      amount: parseFloat(amount),
      type,
      categoryId: parseInt(categoryId),
      description: description || '',
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
      error: 'Error interno del servidor' 
    });
  }
});

// Obtener transacciones del usuario
app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, categoryId, startDate, endDate } = req.query;
    
    const filters = {};
    if (type && type !== 'todas') filters.type = type;
    if (categoryId) filters.categoryId = parseInt(categoryId);
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    
    const transactions = await transactionService.getUserTransactions(userId, filters);
    
    res.json({
      success: true,
      transactions: transactions
    });
    
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
});

// Obtener resumen de transacciones para dashboard
app.get('/api/transactions/summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = 'month' } = req.query;
    
    const summary = await transactionService.getTransactionSummary(userId, period);
    
    res.json({
      success: true,
      summary: summary
    });
    
  } catch (error) {
    console.error('Error al obtener resumen:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
});

// Obtener gastos por categoría para estadísticas
app.get('/api/transactions/expenses-by-category', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = 'month' } = req.query;
    
    const expenses = await transactionService.getExpensesByCategory(userId, period);
    
    res.json({
      success: true,
      expenses: expenses
    });
    
  } catch (error) {
    console.error('Error al obtener gastos por categoría:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
});

// Actualizar transacción
app.put('/api/transactions/:id', authenticateToken, async (req, res) => {
  try {
    const transactionId = parseInt(req.params.id);
    const userId = req.user.id;
    const { amount, type, categoryId, description, transactionDate } = req.body;
    
    // Validación básica
    if (!amount || !type || !categoryId || !transactionDate) {
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos' 
      });
    }
    
    // Actualizar transacción
    await transactionService.updateTransaction(transactionId, userId, {
      amount: parseFloat(amount),
      type,
      categoryId: parseInt(categoryId),
      description: description || '',
      transactionDate
    });
    
    res.json({
      success: true,
      message: 'Transacción actualizada exitosamente'
    });
    
  } catch (error) {
    console.error('Error al actualizar transacción:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
});

// Eliminar transacción
app.delete('/api/transactions/:id', authenticateToken, async (req, res) => {
  try {
    const transactionId = parseInt(req.params.id);
    const userId = req.user.id;
    
    await transactionService.deleteTransaction(transactionId, userId);
    
    res.json({
      success: true,
      message: 'Transacción eliminada exitosamente'
    });
    
  } catch (error) {
    console.error('Error al eliminar transacción:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
});

// ===== CATEGORÍAS =====

// Obtener categorías disponibles
app.get('/api/categories', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Obtener categorías del sistema y del usuario
    const query = `
      SELECT Id, Name, Type, Color, IsDefault
      FROM Categories 
      WHERE UserId IS NULL OR UserId = @param1
      ORDER BY IsDefault DESC, Name ASC
    `;
    
    const result = await require('./config/database').executeQuery(query, [userId]);
    
    res.json({
      success: true,
      categories: result.recordset
    });
    
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
});

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
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({ 
        error: 'Email y código son requeridos' 
      });
    }
    
    // Obtener usuario por email
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    
    // Verificar código
    const verificationResult = await verificationService.verifyCode(user.Id, code);
    
    if (!verificationResult.success) {
      return res.status(400).json({ 
        error: verificationResult.message 
      });
    }
    
    // Marcar usuario como verificado
    await userService.verifyUser(user.Id);
    
    // Obtener usuario actualizado
    const updatedUser = await userService.getUserById(user.Id);
    
    // Generar token JWT
    const token = userService.generateToken({
      id: updatedUser.Id,
      email: updatedUser.Email,
      firstName: updatedUser.FirstName,
      lastName: updatedUser.LastName
    });
    
    const responseData = { 
      success: true, 
      message: 'Código verificado exitosamente',
      token: token,
      user: {
        id: updatedUser.Id,
        email: updatedUser.Email,
        firstName: updatedUser.FirstName,
        lastName: updatedUser.LastName,
        isVerified: true
      }
    };
    
    res.json(responseData);
    
  } catch (error) {
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
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
