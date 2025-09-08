const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { executeQuery, sql } = require('../config/database');

class UserService {
    
    // Registrar nuevo usuario
    async registerUser(userData) {
        try {
            const { email, password, firstName, lastName } = userData;
            
            // Verificar si el usuario ya existe
            const existingUser = await this.getUserByEmail(email);
            if (existingUser) {
                throw new Error('El usuario ya existe con este email');
            }
            
            // Encriptar contraseña
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            
            // Insertar usuario en la base de datos
            const query = `
                INSERT INTO Users (Email, PasswordHash, FirstName, LastName, CreatedAt, IsVerified)
                VALUES (@param1, @param2, @param3, @param4, GETDATE(), 0);
                SELECT SCOPE_IDENTITY() AS Id;
            `;
            
            const result = await executeQuery(query, [email, hashedPassword, firstName, lastName]);
            const userId = result.recordset[0].Id;
            
            return {
                success: true,
                userId: userId,
                message: 'Usuario registrado exitosamente'
            };
            
        } catch (error) {
            console.error('Error en registro de usuario:', error);
            throw error;
        }
    }
    
    // Autenticar usuario
    async authenticateUser(email, password) {
        try {
            const user = await this.getUserByEmail(email);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            
            // Verificar contraseña
            const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
            if (!isPasswordValid) {
                throw new Error('Contraseña incorrecta');
            }
            
            // Verificar si el usuario está activo
            if (!user.IsActive) {
                throw new Error('Usuario inactivo');
            }
            
            // Actualizar último login
            await this.updateLastLogin(user.Id);
            
            return {
                success: true,
                user: {
                    id: user.Id,
                    email: user.Email,
                    firstName: user.FirstName,
                    lastName: user.LastName,
                    isVerified: user.IsVerified
                }
            };
            
        } catch (error) {
            throw error;
        }
    }
    
    // Obtener usuario por email
    async getUserByEmail(email) {
        try {
            const query = 'SELECT * FROM Users WHERE Email = @param1';
            const result = await executeQuery(query, [email]);
            
            const user = result.recordset[0] || null;
            return user;
        } catch (error) {
            throw error;
        }
    }
    
    // Obtener usuario por ID
    async getUserById(userId) {
        try {
            const query = `
                SELECT u.*, r.Name as RoleName, r.Description as RoleDescription
                FROM Users u
                LEFT JOIN Roles r ON u.RoleId = r.Id
                WHERE u.Id = @param1
            `;
            const result = await executeQuery(query, [userId]);
            return result.recordset[0] || null;
        } catch (error) {
            throw error;
        }
    }
    
    // Actualizar último login
    async updateLastLogin(userId) {
        try {
            const query = 'UPDATE Users SET LastLoginAt = GETDATE() WHERE Id = @param1';
            await executeQuery(query, [userId]);
        } catch (error) {
            throw error;
        }
    }
    
    // Verificar usuario
    async verifyUser(userId) {
        try {
            const query = 'UPDATE Users SET IsVerified = 1 WHERE Id = @param1';
            await executeQuery(query, [userId]);
            return true;
        } catch (error) {
            throw error;
        }
    }
    
    // Generar token JWT
    generateToken(user) {
        const payload = {
            userId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        };
        
        return jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', {
            expiresIn: process.env.JWT_EXPIRES_IN || '24h'
        });
    }
    
    // Verificar token JWT
    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
        } catch (error) {
            throw new Error('Token inválido o expirado');
        }
    }

    // Obtener todos los usuarios (solo administradores)
    async getAllUsers() {
        try {
            const query = `
                SELECT u.Id, u.Email, u.FirstName, u.LastName, u.RoleId, 
                       r.Name as RoleName, u.CreatedAt, u.IsVerified, 
                       u.LastLoginAt, u.IsActive
                FROM Users u
                LEFT JOIN Roles r ON u.RoleId = r.Id
                ORDER BY u.CreatedAt DESC
            `;
            const result = await executeQuery(query, []);
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    // Obtener usuario por ID para administradores
    async getUserByIdForAdmin(userId) {
        try {
            const query = `
                SELECT u.Id, u.Email, u.FirstName, u.LastName, u.RoleId, 
                       r.Name as RoleName, r.Description as RoleDescription,
                       u.CreatedAt, u.IsVerified, u.LastLoginAt, u.IsActive
                FROM Users u
                LEFT JOIN Roles r ON u.RoleId = r.Id
                WHERE u.Id = @param1
            `;
            const result = await executeQuery(query, [userId]);
            return result.recordset[0] || null;
        } catch (error) {
            throw error;
        }
    }

    // Actualizar usuario (solo administradores)
    async updateUser(userId, userData) {
        try {
            const { firstName, lastName, email, roleId, isActive } = userData;
            
            const query = `
                UPDATE Users 
                SET FirstName = @param1, LastName = @param2, Email = @param3, 
                    RoleId = @param4, IsActive = @param5
                WHERE Id = @param6
            `;
            
            await executeQuery(query, [firstName, lastName, email, roleId, isActive, userId]);
            return true;
        } catch (error) {
            throw error;
        }
    }

    // Eliminar usuario (solo administradores)
    async deleteUser(userId) {
        try {
            const query = 'UPDATE Users SET IsActive = 0 WHERE Id = @param1';
            await executeQuery(query, [userId]);
            return true;
        } catch (error) {
            throw error;
        }
    }

    // Obtener todos los roles
    async getAllRoles() {
        try {
            const query = 'SELECT * FROM Roles ORDER BY Id';
            const result = await executeQuery(query, []);
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserService();
