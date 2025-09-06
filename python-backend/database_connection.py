import pyodbc
import os
from dotenv import load_dotenv

load_dotenv('config.env')

class DatabaseConnection:
    def __init__(self):
        self.connection_string = self._get_connection_string()
        self.connection = None
    
    def _get_connection_string(self):
        """Construye la cadena de conexión a SQL Server"""
        server = os.getenv('DB_SERVER', 'localhost')
        database = os.getenv('DB_NAME', 'FinScopeDB')
        username = os.getenv('DB_USER', 'sa')
        password = os.getenv('DB_PASSWORD', '')
        
        return f"""
        DRIVER={{ODBC Driver 17 for SQL Server}};
        SERVER={server};
        DATABASE={database};
        UID={username};
        PWD={password};
        Trusted_Connection=no;
        """
    
    def connect(self):
        """Establece conexión con la base de datos"""
        try:
            self.connection = pyodbc.connect(self.connection_string)
            return True
        except Exception as e:
            print(f"Error al conectar con la base de datos: {e}")
            return False
    
    def get_transactions(self, user_id, start_date=None, end_date=None):
        """Obtiene transacciones de un usuario específico"""
        if not self.connection:
            if not self.connect():
                return []
        
        try:
            query = """
            SELECT 
                t.Id,
                t.Amount,
                t.Type,
                t.Description,
                t.TransactionDate,
                c.Name as CategoryName,
                c.Color as CategoryColor
            FROM Transactions t
            INNER JOIN Categories c ON t.CategoryId = c.Id
            WHERE t.UserId = ?
            """
            
            params = [user_id]
            
            if start_date:
                query += " AND t.TransactionDate >= ?"
                params.append(start_date)
            
            if end_date:
                query += " AND t.TransactionDate <= ?"
                params.append(end_date)
            
            query += " ORDER BY t.TransactionDate DESC"
            
            cursor = self.connection.cursor()
            cursor.execute(query, params)
            
            columns = [column[0] for column in cursor.description]
            results = []
            
            for row in cursor.fetchall():
                results.append(dict(zip(columns, row)))
            
            return results
            
        except Exception as e:
            print(f"Error al obtener transacciones: {e}")
            return []
    
    def get_user_summary(self, user_id):
        """Obtiene resumen financiero del usuario"""
        if not self.connection:
            if not self.connect():
                return {}
        
        try:
            query = """
            SELECT 
                COUNT(*) as TotalTransactions,
                SUM(CASE WHEN Type = 'ingreso' THEN Amount ELSE 0 END) as TotalIngresos,
                SUM(CASE WHEN Type = 'gasto' THEN Amount ELSE 0 END) as TotalGastos,
                SUM(CASE WHEN Type = 'ingreso' THEN Amount ELSE -Amount END) as Balance
            FROM Transactions
            WHERE UserId = ?
            """
            
            cursor = self.connection.cursor()
            cursor.execute(query, [user_id])
            
            row = cursor.fetchone()
            if row:
                return {
                    'total_transactions': row[0],
                    'total_ingresos': float(row[1]) if row[1] else 0,
                    'total_gastos': float(row[2]) if row[2] else 0,
                    'balance': float(row[3]) if row[3] else 0
                }
            
            return {}
            
        except Exception as e:
            print(f"Error al obtener resumen del usuario: {e}")
            return {}
    
    def close(self):
        """Cierra la conexión con la base de datos"""
        if self.connection:
            self.connection.close()
            self.connection = None
    
    @property
    def conn(self):
        """Propiedad para compatibilidad con el código existente"""
        return self.connection
    
    @property
    def cursor(self):
        """Propiedad para obtener cursor"""
        if not self.connection:
            self.connect()
        return self.connection.cursor()