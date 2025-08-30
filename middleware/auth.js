const userService = require('../services/userService');

// Middleware para verificar token JWT
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        
        if (!token) {
            return res.status(401).json({ 
                error: 'Token de acceso requerido',
                message: 'Debes iniciar sesión para acceder a este recurso'
            });
        }
        
        // Verificar token
        const decoded = userService.verifyToken(token);
        
        // Obtener usuario de la base de datos
        const user = await userService.getUserById(decoded.userId);
        if (!user || !user.IsActive) {
            return res.status(401).json({ 
                error: 'Usuario no válido',
                message: 'Tu cuenta ha sido desactivada o no existe'
            });
        }
        
        // Agregar información del usuario al request
        req.user = {
            id: user.Id,
            email: user.Email,
            firstName: user.FirstName,
            lastName: user.LastName,
            isVerified: user.IsVerified
        };
        
        next();
        
    } catch (error) {
        console.error('Error en autenticación:', error);
        
        if (error.message === 'Token inválido o expirado') {
            return res.status(401).json({ 
                error: 'Token inválido',
                message: 'Tu sesión ha expirado, por favor inicia sesión nuevamente'
            });
        }
        
        return res.status(500).json({ 
            error: 'Error de autenticación',
            message: 'Error interno del servidor'
        });
    }
};

// Middleware para verificar si el usuario está verificado
const requireVerification = (req, res, next) => {
    if (!req.user.isVerified) {
        return res.status(403).json({ 
            error: 'Verificación requerida',
            message: 'Debes verificar tu cuenta antes de acceder a este recurso'
        });
    }
    next();
};

// Middleware para verificar permisos de usuario
const requireOwnership = (req, res, next) => {
    const resourceUserId = parseInt(req.params.userId || req.body.userId);
    
    if (req.user.id !== resourceUserId) {
        return res.status(403).json({ 
            error: 'Acceso denegado',
            message: 'No tienes permisos para acceder a este recurso'
        });
    }
    next();
};

module.exports = {
    authenticateToken,
    requireVerification,
    requireOwnership
};
