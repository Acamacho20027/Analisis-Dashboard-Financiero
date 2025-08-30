const { executeQuery } = require('../config/database');

class TransactionService {
    
    // Crear nueva transacción
    async createTransaction(transactionData) {
        try {
            const { userId, amount, type, categoryId, description, transactionDate } = transactionData;
            
            const query = `
                INSERT INTO Transactions (UserId, Amount, Type, CategoryId, Description, TransactionDate, CreatedAt)
                VALUES (@param1, @param2, @param3, @param4, @param5, @param6, GETDATE());
                SELECT SCOPE_IDENTITY() AS Id;
            `;
            
            const result = await executeQuery(query, [
                userId, amount, type, categoryId, description, transactionDate
            ]);
            
            const transactionId = result.recordset[0].Id;
            
            return {
                success: true,
                transactionId: transactionId,
                message: 'Transacción creada exitosamente'
            };
            
        } catch (error) {
            console.error('Error al crear transacción:', error);
            throw error;
        }
    }
    
    // Obtener transacciones de un usuario
    async getUserTransactions(userId, filters = {}) {
        try {
            let query = `
                SELECT 
                    t.Id,
                    t.Amount,
                    t.Type,
                    t.Description,
                    t.TransactionDate,
                    t.CreatedAt,
                    c.Name as CategoryName,
                    c.Color as CategoryColor
                FROM Transactions t
                INNER JOIN Categories c ON t.CategoryId = c.Id
                WHERE t.UserId = @param1
            `;
            
            const params = [userId];
            let paramIndex = 1;
            
            // Aplicar filtros
            if (filters.type && filters.type !== 'todas') {
                paramIndex++;
                query += ` AND t.Type = @param${paramIndex}`;
                params.push(filters.type);
            }
            
            if (filters.categoryId) {
                paramIndex++;
                query += ` AND t.CategoryId = @param${paramIndex}`;
                params.push(filters.categoryId);
            }
            
            if (filters.startDate) {
                paramIndex++;
                query += ` AND t.TransactionDate >= @param${paramIndex}`;
                params.push(filters.startDate);
            }
            
            if (filters.endDate) {
                paramIndex++;
                query += ` AND t.TransactionDate <= @param${paramIndex}`;
                params.push(filters.endDate);
            }
            
            query += ' ORDER BY t.TransactionDate DESC, t.CreatedAt DESC';
            
            const result = await executeQuery(query, params);
            return result.recordset;
            
        } catch (error) {
            console.error('Error al obtener transacciones:', error);
            throw error;
        }
    }
    
    // Obtener transacciones por período (para estadísticas)
    async getTransactionsByPeriod(userId, startDate, endDate) {
        try {
            const query = `
                SELECT 
                    t.Amount,
                    t.Type,
                    t.TransactionDate,
                    c.Name as CategoryName,
                    c.Color as CategoryColor
                FROM Transactions t
                INNER JOIN Categories c ON t.CategoryId = c.Id
                WHERE t.UserId = @param1 
                AND t.TransactionDate BETWEEN @param2 AND @param3
                ORDER BY t.TransactionDate
            `;
            
            const result = await executeQuery(query, [userId, startDate, endDate]);
            return result.recordset;
            
        } catch (error) {
            console.error('Error al obtener transacciones por período:', error);
            throw error;
        }
    }
    
    // Obtener resumen de transacciones (para dashboard)
    async getTransactionSummary(userId, period = 'month') {
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
                    SUM(CASE WHEN Type = 'ingreso' THEN Amount ELSE 0 END) as TotalIngresos,
                    SUM(CASE WHEN Type = 'gasto' THEN Amount ELSE 0 END) as TotalGastos,
                    COUNT(*) as TotalTransacciones
                FROM Transactions 
                WHERE UserId = @param1 
                AND TransactionDate >= ${dateFilter}
            `;
            
            const result = await executeQuery(query, [userId]);
            const summary = result.recordset[0];
            
            const balance = (summary.TotalIngresos || 0) - (summary.TotalGastos || 0);
            
            return {
                ingresos: summary.TotalIngresos || 0,
                gastos: summary.TotalGastos || 0,
                balance: balance,
                totalTransacciones: summary.TotalTransacciones || 0
            };
            
        } catch (error) {
            console.error('Error al obtener resumen de transacciones:', error);
            throw error;
        }
    }
    
    // Obtener gastos por categoría (para gráficos)
    async getExpensesByCategory(userId, period = 'month') {
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
                    c.Name as CategoryName,
                    c.Color as CategoryColor,
                    SUM(t.Amount) as TotalAmount,
                    COUNT(*) as TransactionCount
                FROM Transactions t
                INNER JOIN Categories c ON t.CategoryId = c.Id
                WHERE t.UserId = @param1 
                AND t.Type = 'gasto'
                AND t.TransactionDate >= ${dateFilter}
                GROUP BY c.Name, c.Color
                ORDER BY TotalAmount DESC
            `;
            
            const result = await executeQuery(query, [userId]);
            return result.recordset;
            
        } catch (error) {
            console.error('Error al obtener gastos por categoría:', error);
            throw error;
        }
    }
    
    // Actualizar transacción
    async updateTransaction(transactionId, userId, updateData) {
        try {
            const { amount, type, categoryId, description, transactionDate } = updateData;
            
            const query = `
                UPDATE Transactions 
                SET Amount = @param1, Type = @param2, CategoryId = @param3, 
                    Description = @param4, TransactionDate = @param5
                WHERE Id = @param6 AND UserId = @param7
            `;
            
            const result = await executeQuery(query, [
                amount, type, categoryId, description, transactionDate, transactionId, userId
            ]);
            
            if (result.rowsAffected[0] === 0) {
                throw new Error('Transacción no encontrada o no tienes permisos para editarla');
            }
            
            return {
                success: true,
                message: 'Transacción actualizada exitosamente'
            };
            
        } catch (error) {
            console.error('Error al actualizar transacción:', error);
            throw error;
        }
    }
    
    // Eliminar transacción
    async deleteTransaction(transactionId, userId) {
        try {
            const query = 'DELETE FROM Transactions WHERE Id = @param1 AND UserId = @param2';
            
            const result = await executeQuery(query, [transactionId, userId]);
            
            if (result.rowsAffected[0] === 0) {
                throw new Error('Transacción no encontrada o no tienes permisos para eliminarla');
            }
            
            return {
                success: true,
                message: 'Transacción eliminada exitosamente'
            };
            
        } catch (error) {
            console.error('Error al eliminar transacción:', error);
            throw error;
        }
    }
}

module.exports = new TransactionService();
