// Lógica de verificación para FinScope
document.addEventListener('DOMContentLoaded', function() {
    const verifyForm = document.getElementById('verifyForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const maskedEmailSpan = document.getElementById('maskedEmail');
    
    // Verificar si el usuario viene del login
    const userEmail = localStorage.getItem('userEmail');
    const maskedEmail = localStorage.getItem('maskedEmail');
    
    if (!userEmail) {
        // Si no hay email, redirigir al login
        window.location.href = 'index.html';
        return;
    }
    
    // Mostrar email enmascarado
    if (maskedEmail && maskedEmailSpan) {
        maskedEmailSpan.textContent = maskedEmail;
    }
    
    // Configurar input del código para solo números
    const codeInput = document.getElementById('code'); // Corregido: usar 'code' en lugar de 'verificationCode'
    if (!codeInput) {
        console.error('No se encontró el input del código de verificación');
        return;
    }
    
    codeInput.addEventListener('input', function(e) {
        // Solo permitir números
        this.value = this.value.replace(/[^0-9]/g, '');
        
        // Limpiar mensajes de error
        if (errorMessage) errorMessage.style.display = 'none';
        if (successMessage) successMessage.style.display = 'none';
        
        // Auto-submit cuando se complete el código
        if (this.value.length === 6) {
            verifyForm.dispatchEvent(new Event('submit'));
        }
    });
    
    verifyForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const code = codeInput.value.trim();
        console.log('Formulario enviado con código:', code);
        console.log('Email del usuario:', userEmail);
        
        // Validación básica
        if (!code || code.length !== 6) {
            showError('Por favor, ingresa un código de 6 dígitos');
            return;
        }
        
        try {
            // Mostrar estado de carga
            const submitBtn = verifyForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Verificando...';
            submitBtn.disabled = true;
            
            console.log('Enviando solicitud de verificación...');
            
            // VERIFICACIÓN LOCAL TEMPORAL - Comentar esta sección cuando el servidor funcione
            // Simular verificación exitosa para pruebas
            console.log('Usando verificación local temporal');
            setTimeout(() => {
                console.log('Verificación exitosa (local)');
                showSuccess('Código verificado exitosamente');
                
                // Establecer autenticación para el dashboard
                localStorage.setItem('usuarioAutenticado', 'true');
                localStorage.setItem('username', userEmail);
                
                // Limpiar localStorage temporal
                localStorage.removeItem('userEmail');
                localStorage.removeItem('maskedEmail');
                
                // Redirigir al dashboard después de verificación exitosa
                console.log('Verificación exitosa, redirigiendo al dashboard...');
                setTimeout(() => {
                    console.log('Redirigiendo a: dashboard.html');
                    window.location.href = 'dashboard.html';
                }, 2000);
            }, 1000);
            
            // DESCOMENTAR ESTA SECCIÓN CUANDO EL SERVIDOR FUNCIONE
            /*
            // Enviar código al servidor
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail, code: code })
            });
            
            console.log('Respuesta del servidor:', response.status, response.statusText);
            
            const data = await response.json();
            console.log('Datos de respuesta:', data);
            
            if (data.success) {
                console.log('Verificación exitosa');
                showSuccess('Código verificado exitosamente');
                
                // Establecer autenticación para el dashboard
                localStorage.setItem('usuarioAutenticado', 'true');
                localStorage.setItem('username', userEmail);
                
                // Limpiar localStorage temporal
                localStorage.removeItem('userEmail');
                localStorage.removeItem('maskedEmail');
                
                // Redirigir al dashboard después de verificación exitosa
                console.log('Verificación exitosa, redirigiendo al dashboard...');
                setTimeout(() => {
                    console.log('Redirigiendo a: dashboard.html');
                    window.location.href = 'dashboard.html';
                }, 2000);
                
            } else {
                console.log('Verificación fallida:', data.error);
                showError(data.error || 'Código incorrecto');
                codeInput.value = '';
                codeInput.focus();
            }
            */
            
        } catch (error) {
            console.error('Error en la verificación:', error);
            showError('Error de conexión. Por favor, intenta de nuevo.');
        } finally {
            // Restaurar botón
            const submitBtn = verifyForm.querySelector('button[type="submit"]');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    
    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            if (successMessage) successMessage.style.display = 'none';
            
            // Ocultar mensaje después de 5 segundos
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 5000);
        }
    }
    
    function showSuccess(message) {
        if (successMessage) {
            successMessage.textContent = message;
            successMessage.style.display = 'block';
            if (errorMessage) errorMessage.style.display = 'none';
        }
    }
    
    // Botón para volver al login
    const backButton = document.createElement('button');
    backButton.textContent = '← Volver al Login';
    backButton.className = 'back-btn';
    backButton.style.cssText = `
        position: absolute;
        top: 2rem;
        left: 2rem;
        padding: 0.5rem 1rem;
        background-color: #f0f0f0;
        border: 1px solid #ddd;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
    `;
    
    backButton.addEventListener('click', function() {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('maskedEmail');
        window.location.href = 'index.html';
    });
    
    document.body.appendChild(backButton);
    
    // Estilos para el botón de volver
    backButton.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#e0e0e0';
    });
    
    backButton.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#f0f0f0';
    });
});
