require('dotenv').config({ path: './config.env' });
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');

// Importar servicios y configuración
const { connectDB, closeDB } = require('./config/database');
const userService = require('./services/userService');
const verificationService = require('./services/verificationService');
const transactionService = require('./services/transactionService');
const { authenticateToken, requireVerification, requireAdmin } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar multer para manejo de archivos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'), false);
    }
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/styles', express.static('styles'));
app.use('/scripts', express.static('scripts'));
app.use('/views', express.static('views'));

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
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Ruta para registro
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Ruta para la pantalla de espera
app.get('/espera', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'espera.html'));
});

// Ruta para el dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// Ruta para categorías financieras
app.get('/categorias-financieras', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'categorias-financieras.html'));
});

// Ruta para análisis de archivos
app.get('/analisis-archivos', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'analisis-archivos.html'));
});

// Ruta para reportes
app.get('/reportes', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'reportes.html'));
});

// Ruta para gestión de usuarios (solo administradores)
app.get('/gestion-usuarios', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'gestion-usuarios.html'));
});

// ===== API RUTAS =====

// ===== TRANSACCIONES =====


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
        lastLoginAt: user.LastLoginAt,
        roleId: user.RoleId,
        roleName: user.RoleName
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

// ===== GESTIÓN DE USUARIOS (SOLO ADMINISTRADORES) =====

// Obtener todos los usuarios
app.get('/api/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    
    res.json({
      success: true,
      users: users
    });
    
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ 
      error: 'Error al obtener usuarios',
      message: error.message 
    });
  }
});

// Obtener usuario específico
app.get('/api/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await userService.getUserByIdForAdmin(userId);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    
    res.json({
      success: true,
      user: user
    });
    
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ 
      error: 'Error al obtener usuario',
      message: error.message 
    });
  }
});

// Actualizar usuario
app.put('/api/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { firstName, lastName, email, roleId, isActive } = req.body;
    
    // Validación básica
    if (!firstName || !lastName || !email || !roleId) {
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos' 
      });
    }
    
    // Actualizar usuario
    await userService.updateUser(userId, {
      firstName,
      lastName,
      email,
      roleId: parseInt(roleId),
      isActive: isActive === true || isActive === 'true'
    });
    
    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente'
    });
    
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ 
      error: 'Error al actualizar usuario',
      message: error.message 
    });
  }
});

// Eliminar usuario (desactivar)
app.delete('/api/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // No permitir que un administrador se elimine a sí mismo
    if (userId === req.user.id) {
      return res.status(400).json({ 
        error: 'No puedes eliminar tu propia cuenta' 
      });
    }
    
    await userService.deleteUser(userId);
    
    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
    
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ 
      error: 'Error al eliminar usuario',
      message: error.message 
    });
  }
});

// Crear usuario (solo administradores)
app.post('/api/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { firstName, lastName, email, roleId, isActive } = req.body;
    
    // Validación básica
    if (!firstName || !lastName || !email || !roleId) {
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos' 
      });
    }
    
    // Crear usuario
    const result = await userService.createUser({
      firstName,
      lastName,
      email,
      roleId: parseInt(roleId),
      isActive: isActive === true || isActive === 'true'
    });
    
    res.json({
      success: true,
      message: 'Usuario creado exitosamente',
      userId: result.userId,
      tempPassword: result.tempPassword
    });
    
  } catch (error) {
    console.error('Error al crear usuario:', error);
    
    if (error.message === 'El usuario ya existe con este email') {
      return res.status(400).json({ 
        error: 'El usuario ya existe con este email' 
      });
    }
    
    res.status(500).json({ 
      error: 'Error al crear usuario',
      message: error.message 
    });
  }
});

// Obtener todos los roles
app.get('/api/roles', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const roles = await userService.getAllRoles();
    
    res.json({
      success: true,
      roles: roles
    });
    
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({ 
      error: 'Error al obtener roles',
      message: error.message 
    });
  }
});

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
      error: 'Error al crear transacción',
      message: error.message 
    });
  }
});


// Ruta temporal para obtener transacciones sin autenticación (solo para testing)
app.get('/api/transactions/test', async (req, res) => {
  try {
    // Obtener transacciones del usuario ID 2 (usuario de prueba)
    const transactions = await transactionService.getUserTransactions(2, {});
    
    res.json({
      success: true,
      transactions: transactions
    });
    
  } catch (error) {
    console.error('Error al obtener transacciones de prueba:', error);
    res.status(500).json({ 
      error: 'Error al obtener transacciones de prueba',
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

// ===== CATEGORÍAS FINANCIERAS - API PYTHON =====

// Proxy para análisis de gastos por categoría
app.post('/api/categorias/analisis-gastos', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Obtener transacciones del usuario
    const transactions = await transactionService.getUserTransactions(userId, {});
    
    // Retornar datos para que el frontend use Chart.js
    res.json({
      success: true,
      transacciones: transactions,
      message: 'Usando análisis con Chart.js'
    });
    
  } catch (error) {
    console.error('Error en análisis de gastos:', error);
    res.status(500).json({ 
      error: 'Error al generar análisis de gastos',
      message: error.message 
    });
  }
});

// Proxy para evolución del balance
app.post('/api/categorias/evolucion-balance', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Obtener transacciones del usuario
    const transactions = await transactionService.getUserTransactions(userId, {});
    
    // Retornar datos para que el frontend use Chart.js
    res.json({
      success: true,
      transacciones: transactions,
      message: 'Usando análisis con Chart.js'
    });
    
  } catch (error) {
    console.error('Error en evolución del balance:', error);
    res.status(500).json({ 
      error: 'Error al generar evolución del balance',
      message: error.message 
    });
  }
});

// Proxy para distribución ingresos vs gastos
app.post('/api/categorias/distribucion-ingresos-gastos', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Obtener transacciones del usuario
    const transactions = await transactionService.getUserTransactions(userId, {});
    
    // Retornar datos para que el frontend use Chart.js
    res.json({
      success: true,
      transacciones: transactions,
      message: 'Usando análisis con Chart.js'
    });
    
  } catch (error) {
    console.error('Error en distribución ingresos vs gastos:', error);
    res.status(500).json({ 
      error: 'Error al generar distribución ingresos vs gastos',
      message: error.message 
    });
  }
});

// Proxy para resumen de categorías
app.get('/api/categorias/resumen', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Obtener transacciones del usuario
    const transactions = await transactionService.getUserTransactions(userId, {});
    
    // Calcular resumen básico
    const resumen = {
      total_transacciones: transactions.length,
      total_ingresos: 0,
      total_gastos: 0,
      balance: 0
    };
    
    transactions.forEach(transaccion => {
      const monto = parseFloat(transaccion.Amount || transaccion.amount || 0);
      if (transaccion.Type === 'ingreso' || transaccion.type === 'ingreso') {
        resumen.total_ingresos += monto;
      } else if (transaccion.Type === 'gasto' || transaccion.type === 'gasto') {
        resumen.total_gastos += monto;
      }
    });
    
    resumen.balance = resumen.total_ingresos - resumen.total_gastos;
    
    res.json({
      success: true,
      resumen: resumen,
      message: 'Usando análisis con Chart.js'
    });
    
  } catch (error) {
    console.error('Error en resumen de categorías:', error);
    res.status(500).json({ 
      error: 'Error al obtener resumen de categorías',
      message: error.message 
    });
  }
});

// ===== ANÁLISIS DE ARCHIVOS - PROXY A PYTHON =====

// Proxy para procesar archivos
app.post('/api/analisis-archivos/procesar', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Redirigir a la API de Python
    const pythonApiUrl = 'http://localhost:5000/api/analisis-archivos/procesar';
    
    // Crear una petición al backend de Python
    
    // Preparar los datos para enviar
    const formData = new FormData();
    
    // Obtener el archivo del request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No se proporcionó archivo'
      });
    }
    
    const file = req.file;
    
    // Agregar archivo al FormData
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype
    });
    formData.append('userId', userId);
    
    // Enviar al servidor Python
        const response = await fetch(pythonApiUrl, {
            method: 'POST',
            body: formData,
            headers: formData.getHeaders(),
            timeout: 30000 // 30 segundos timeout
        });
    
    const result = await response.json();
    res.json(result);
    
  } catch (error) {
    console.error('Error en procesamiento de archivos:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al procesar archivo',
      message: error.message 
    });
  }
});

// Proxy para obtener historial de archivos
app.get('/api/analisis-archivos/historial', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Hacer petición al backend de Python
    const pythonResponse = await fetch(`http://localhost:5000/api/analisis-archivos/historial?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!pythonResponse.ok) {
      throw new Error(`Error del servidor Python: ${pythonResponse.status}`);
    }
    
    const result = await pythonResponse.json();
    
    if (result.success) {
      // Enriquecer los datos con información adicional
      const archivos = result.archivos.map(archivo => ({
        id: archivo.id,
        fileName: archivo.fileName,
        fileType: archivo.fileType,
        fileSize: archivo.fileSize,
        status: archivo.status,
        processedAt: archivo.processedAt,
        totalRecords: 0, // Se puede calcular desde los datos originales si es necesario
        totalIncome: 0,  // Se puede calcular desde los datos originales si es necesario
        totalExpenses: 0, // Se puede calcular desde los datos originales si es necesario
        errorMessage: archivo.errorMessage
      }));
      
      res.json({
        success: true,
        archivos: archivos
      });
    } else {
      throw new Error(result.error || 'Error al obtener historial');
    }
    
  } catch (error) {
    console.error('Error al obtener historial de archivos:', error);
    res.status(500).json({ 
      error: 'Error al obtener historial de archivos',
      message: error.message 
    });
  }
});

// Proxy para eliminar un archivo procesado
app.delete('/api/analisis-archivos/eliminar/:fileId', authenticateToken, async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const userId = req.user.id;
    
    // Hacer petición al backend de Python
    const pythonResponse = await fetch(`http://localhost:5000/api/analisis-archivos/eliminar/${fileId}?userId=${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!pythonResponse.ok) {
      throw new Error(`Error del servidor Python: ${pythonResponse.status}`);
    }
    
    const result = await pythonResponse.json();
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Archivo eliminado exitosamente'
      });
    } else {
      throw new Error(result.error || 'Error al eliminar el archivo');
    }
    
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    res.status(500).json({ 
      error: 'Error al eliminar archivo',
      message: error.message 
    });
  }
});

// Proxy para obtener resultados de un archivo específico
app.get('/api/analisis-archivos/resultados/:fileId', authenticateToken, async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const userId = req.user.id;
    
    // Redirigir a la API de Python
    const pythonApiUrl = `http://localhost:5000/api/analisis-archivos/resultados/${fileId}?userId=${userId}`;
    
    // Hacer petición al backend de Python
    const response = await fetch(pythonApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 segundos timeout
    });
    
    const result = await response.json();
    res.json(result);
    
  } catch (error) {
    console.error('Error al obtener resultados de archivo:', error);
    res.status(500).json({ 
      error: 'Error al obtener resultados de archivo',
      message: error.message 
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
