const { executeQuery } = require('../config/database');

class CategoryService {
    
    // Obtener todas las categorías disponibles (sistema + usuario)
    async getAvailableCategories(userId) {
        try {
            const query = `
                SELECT Id, Name, Type, Color, IsDefault, UserId
                FROM Categories 
                WHERE UserId IS NULL OR UserId = @param1
                ORDER BY IsDefault DESC, Name ASC
            `;
            
            const result = await executeQuery(query, [userId]);
            return result.recordset;
            
        } catch (error) {
            console.error('Error al obtener categorías:', error);
            throw error;
        }
    }
    
    // Obtener categorías por tipo
    async getCategoriesByType(userId, type) {
        try {
            const query = `
                SELECT Id, Name, Color, IsDefault
                FROM Categories 
                WHERE (UserId IS NULL OR UserId = @param1)
                AND Type = @param2
                ORDER BY IsDefault DESC, Name ASC
            `;
            
            const result = await executeQuery(query, [userId, type]);
            return result.recordset;
            
        } catch (error) {
            console.error('Error al obtener categorías por tipo:', error);
            throw error;
        }
    }
    
    // Crear nueva categoría personalizada
    async createCustomCategory(userId, categoryData) {
        try {
            const { name, type, color } = categoryData;
            
            const query = `
                INSERT INTO Categories (UserId, Name, Type, Color, IsDefault, CreatedAt)
                VALUES (@param1, @param2, @param3, @param4, 0, GETDATE());
                SELECT SCOPE_IDENTITY() AS Id;
            `;
            
            const result = await executeQuery(query, [userId, name, type, color]);
            const categoryId = result.recordset[0].Id;
            
            return {
                success: true,
                categoryId: categoryId,
                message: 'Categoría creada exitosamente'
            };
            
        } catch (error) {
            console.error('Error al crear categoría:', error);
            throw error;
        }
    }
    
    // Actualizar categoría personalizada
    async updateCustomCategory(categoryId, userId, updateData) {
        try {
            const { name, type, color } = updateData;
            
            const query = `
                UPDATE Categories 
                SET Name = @param1, Type = @param2, Color = @param3
                WHERE Id = @param4 AND UserId = @param5 AND IsDefault = 0
            `;
            
            const result = await executeQuery(query, [name, type, color, categoryId, userId]);
            
            if (result.rowsAffected[0] === 0) {
                throw new Error('Categoría no encontrada o no tienes permisos para editarla');
            }
            
            return {
                success: true,
                message: 'Categoría actualizada exitosamente'
            };
            
        } catch (error) {
            console.error('Error al actualizar categoría:', error);
            throw error;
        }
    }
    
    // Eliminar categoría personalizada
    async deleteCustomCategory(categoryId, userId) {
        try {
            // Verificar que no haya transacciones usando esta categoría
            const checkQuery = `
                SELECT COUNT(*) as TransactionCount
                FROM Transactions 
                WHERE CategoryId = @param1
            `;
            
            const checkResult = await executeQuery(checkQuery, [categoryId]);
            const transactionCount = checkResult.recordset[0].TransactionCount;
            
            if (transactionCount > 0) {
                throw new Error('No se puede eliminar la categoría porque tiene transacciones asociadas');
            }
            
            // Eliminar la categoría
            const deleteQuery = `
                DELETE FROM Categories 
                WHERE Id = @param1 AND UserId = @param2 AND IsDefault = 0
            `;
            
            const result = await executeQuery(deleteQuery, [categoryId, userId]);
            
            if (result.rowsAffected[0] === 0) {
                throw new Error('Categoría no encontrada o no tienes permisos para eliminarla');
            }
            
            return {
                success: true,
                message: 'Categoría eliminada exitosamente'
            };
            
        } catch (error) {
            console.error('Error al eliminar categoría:', error);
            throw error;
        }
    }
    
    // Obtener estadísticas de uso de categorías
    async getCategoryUsageStats(userId, period = 'month') {
        try {
            let dateFilter;
            switch (period) {
                case 'week':
                    dateFilter = 'DATEADD(week, -1, GETDATE())';
                    break;
                case 'month':
                    dateFilter = 'DATEADD(month, -1, GETDATE())';
                    break;
                case 'year':
                    dateFilter = 'DATEADD(year, -1, GETDATE())';
                    break;
                default:
                    dateFilter = 'DATEADD(month, -1, GETDATE())';
            }
            
            const query = `
                SELECT 
                    c.Id,
                    c.Name,
                    c.Type,
                    c.Color,
                    COUNT(t.Id) as TransactionCount,
                    SUM(t.Amount) as TotalAmount
                FROM Categories c
                LEFT JOIN Transactions t ON c.Id = t.CategoryId 
                    AND t.UserId = @param1 
                    AND t.TransactionDate >= ${dateFilter}
                WHERE c.UserId IS NULL OR c.UserId = @param1
                GROUP BY c.Id, c.Name, c.Type, c.Color
                ORDER BY TransactionCount DESC, TotalAmount DESC
            `;
            
            const result = await executeQuery(query, [userId]);
            return result.recordset;
            
        } catch (error) {
            console.error('Error al obtener estadísticas de categorías:', error);
            throw error;
        }
    }
}

module.exports = new CategoryService();
