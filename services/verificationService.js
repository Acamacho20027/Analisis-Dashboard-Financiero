const { executeQuery } = require('../config/database');

class VerificationService {
    
    // Generar código aleatorio de 6 dígitos
    generateCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    
    // Guardar código de verificación
    async saveVerificationCode(userId, code) {
        try {
            // Limpiar códigos anteriores del usuario
            await this.cleanupUserCodes(userId);
            
            // Calcular tiempo de expiración (10 minutos)
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
            
            const query = `
                INSERT INTO VerificationCodes (UserId, Code, ExpiresAt, CreatedAt)
                VALUES (@param1, @param2, @param3, GETDATE())
            `;
            
            await executeQuery(query, [userId, code, expiresAt]);
            
            return {
                success: true,
                code: code,
                expiresAt: expiresAt
            };
            
        } catch (error) {
            console.error('Error al guardar código de verificación:', error);
            throw error;
        }
    }
    
    // Verificar código
    async verifyCode(userId, code) {
        try {
            const query = `
                SELECT * FROM VerificationCodes 
                WHERE UserId = @param1 
                AND Code = @param2 
                AND ExpiresAt > GETDATE() 
                AND IsUsed = 0
            `;
            
            const result = await executeQuery(query, [userId, code]);
            const verificationCode = result.recordset[0];
            
            if (!verificationCode) {
                return {
                    success: false,
                    message: 'Código inválido, expirado o ya utilizado'
                };
            }
            
            // Marcar código como usado
            await this.markCodeAsUsed(verificationCode.Id);
            
            return {
                success: true,
                message: 'Código verificado exitosamente'
            };
            
        } catch (error) {
            console.error('Error al verificar código:', error);
            throw error;
        }
    }
    
    // Marcar código como usado
    async markCodeAsUsed(codeId) {
        try {
            const query = 'UPDATE VerificationCodes SET IsUsed = 1 WHERE Id = @param1';
            await executeQuery(query, [codeId]);
        } catch (error) {
            console.error('Error al marcar código como usado:', error);
            throw error;
        }
    }
    
    // Limpiar códigos de un usuario específico
    async cleanupUserCodes(userId) {
        try {
            const query = 'DELETE FROM VerificationCodes WHERE UserId = @param1';
            await executeQuery(query, [userId]);
        } catch (error) {
            console.error('Error al limpiar códigos del usuario:', error);
            throw error;
        }
    }
    
    // Limpiar códigos expirados (para mantenimiento)
    async cleanupExpiredCodes() {
        try {
            const query = 'DELETE FROM VerificationCodes WHERE ExpiresAt < GETDATE() OR IsUsed = 1';
            await executeQuery(query);
            console.log('Códigos expirados limpiados');
        } catch (error) {
            console.error('Error al limpiar códigos expirados:', error);
            throw error;
        }
    }
    
    // Obtener código activo de un usuario
    async getActiveCode(userId) {
        try {
            const query = `
                SELECT * FROM VerificationCodes 
                WHERE UserId = @param1 
                AND ExpiresAt > GETDATE() 
                AND IsUsed = 0
                ORDER BY CreatedAt DESC
            `;
            
            const result = await executeQuery(query, [userId]);
            return result.recordset[0] || null;
            
        } catch (error) {
            console.error('Error al obtener código activo:', error);
            throw error;
        }
    }
}

module.exports = new VerificationService();
