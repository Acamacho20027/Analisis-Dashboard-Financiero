const sql = require('mssql');

// Configuración de la base de datos
const dbConfig = {
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || 'FinScopeDB',
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'tu_password',
    options: {
        encrypt: false, // Cambiar a true si usas Azure
        trustServerCertificate: true, // Para desarrollo local
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Función para conectar a la base de datos
async function connectDB() {
    try {
        const pool = await sql.connect(dbConfig);
        console.log('✅ Conexión a SQL Server establecida exitosamente');
        return pool;
    } catch (error) {
        console.error('❌ Error al conectar a SQL Server:', error);
        throw error;
    }
}

// Función para cerrar la conexión
async function closeDB() {
    try {
        await sql.close();
        console.log('🔌 Conexión a SQL Server cerrada');
    } catch (error) {
        console.error('❌ Error al cerrar la conexión:', error);
    }
}

// Función para ejecutar consultas
async function executeQuery(query, params = []) {
    try {
        const pool = await sql.connect(dbConfig);
        const request = pool.request();
        
        // Agregar parámetros si existen
        params.forEach((param, index) => {
            request.input(`param${index + 1}`, param);
        });
        
        const result = await request.query(query);
        return result;
    } catch (error) {
        console.error('❌ Error al ejecutar consulta:', error);
        throw error;
    }
}

module.exports = {
    connectDB,
    closeDB,
    executeQuery,
    sql
};
