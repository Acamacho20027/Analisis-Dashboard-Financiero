// Script de prueba para la funcionalidad de cambio de contraseña
// Este archivo es solo para testing y puede ser eliminado después

const bcrypt = require('bcryptjs');

// Función para probar el hash de contraseñas
async function testPasswordHashing() {
    console.log('=== PRUEBA DE HASH DE CONTRASEÑAS ===');
    
    const tempPassword = 'TempPass123';
    const newPassword = 'NewPassword456';
    
    console.log('Contraseña temporal:', tempPassword);
    console.log('Nueva contraseña:', newPassword);
    
    // Hash de la contraseña temporal
    const tempHash = await bcrypt.hash(tempPassword, 12);
    console.log('Hash de contraseña temporal:', tempHash);
    
    // Hash de la nueva contraseña
    const newHash = await bcrypt.hash(newPassword, 12);
    console.log('Hash de nueva contraseña:', newHash);
    
    // Verificar que las contraseñas son diferentes
    const isSame = await bcrypt.compare(newPassword, tempHash);
    console.log('¿Son la misma contraseña?', isSame);
    
    // Verificar que la contraseña temporal es correcta
    const isTempValid = await bcrypt.compare(tempPassword, tempHash);
    console.log('¿Contraseña temporal válida?', isTempValid);
    
    // Verificar que la nueva contraseña es correcta
    const isNewValid = await bcrypt.compare(newPassword, newHash);
    console.log('¿Nueva contraseña válida?', isNewValid);
    
    console.log('=== FIN DE PRUEBA ===\n');
}

// Función para probar la generación de contraseñas temporales
function testTempPasswordGeneration() {
    console.log('=== PRUEBA DE GENERACIÓN DE CONTRASEÑAS TEMPORALES ===');
    
    const generateTempPassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };
    
    console.log('Generando 5 contraseñas temporales:');
    for (let i = 0; i < 5; i++) {
        const tempPass = generateTempPassword();
        console.log(`${i + 1}. ${tempPass} (longitud: ${tempPass.length})`);
    }
    
    console.log('=== FIN DE PRUEBA ===\n');
}

// Ejecutar pruebas
async function runTests() {
    try {
        await testPasswordHashing();
        testTempPasswordGeneration();
        console.log('✅ Todas las pruebas completadas exitosamente');
    } catch (error) {
        console.error('❌ Error en las pruebas:', error);
    }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
    runTests();
}

module.exports = {
    testPasswordHashing,
    testTempPasswordGeneration
};
