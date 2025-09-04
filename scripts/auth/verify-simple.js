// Lógica de verificación simple para FinScope

// Configuración local simple
const LOCAL_CONFIG = {
    AUTH: {
        TOKEN_KEY: 'authToken',
        USER_KEY: 'usuarioAutenticado',
        USER_DATA_KEY: 'userData'
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const verifyForm = document.getElementById('verifyForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const maskedEmailSpan = document.getElementById('maskedEmail');
    
    // Verificar si el usuario viene del login
    const userEmail = localStorage.getItem('userEmail');
    const maskedEmail = localStorage.getItem('maskedEmail');
    
    if (!userEmail) {
        window.location.href = '/views/index.html';
        return;
    }
    
    // Mostrar email enmascarado
    if (maskedEmail && maskedEmailSpan) {
        maskedEmailSpan.textContent = maskedEmail;
    }
    
    // Configurar input del código para solo números
    const codeInput = document.getElementById('code');
    if (!codeInput) {
        return;
    }
    
    // Evento input para auto-submit
    codeInput.addEventListener('input', function(e) {
        // Solo permitir números
        this.value = this.value.replace(/[^0-9]/g, '');
        
        // Limpiar mensajes de error
        if (errorMessage) errorMessage.style.display = 'none';
        if (successMessage) successMessage.style.display = 'none';
        
        // Auto-submit cuando se complete el código
        if (this.value.length === 6 && !verifyForm.submitting) {
            verifyForm.dispatchEvent(new Event('submit'));
        }
    });
    
    // Evento submit del formulario
    verifyForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Prevenir doble enví
        if (this.submitting) {
            return;
        }
        
        this.submitting = true;
        
        const code = codeInput.value.trim();
        
        // Validación básica
        if (!code || code.length !== 6) {
            showError('Por favor, ingresa un código de 6 dígitos');
            this.submitting = false;
            return;
        }
        
        try {
            // Mostrar estado de carga
            const submitBtn = verifyForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Verificando...';
            submitBtn.disabled = true;
            
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail, code: code })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                showSuccess('Código verificado exitosamente');
                
                try {
                    localStorage.setItem(LOCAL_CONFIG.AUTH.USER_KEY, 'true');
                    localStorage.setItem(LOCAL_CONFIG.AUTH.TOKEN_KEY, data.token);
                    localStorage.setItem(LOCAL_CONFIG.AUTH.USER_DATA_KEY, JSON.stringify(data.user));
                    
                } catch (localStorageError) {
                    throw new Error('Error al configurar la autenticación');
                }
                
                // Limpiar localStorage temporal
                localStorage.removeItem('userEmail');
                localStorage.removeItem('maskedEmail');
                
                // Redirigir al dashboard después de verificación exitosa
                setTimeout(() => {
                    window.location.href = '/views/dashboard.html';
                }, 2000);
                
            } else {
                showError(data.error || 'Código incorrecto');
                
                // Limpiar código para evitar reutilización
                codeInput.value = '';
                codeInput.focus();
                
                // Resetear flag de enví
                this.submitting = false;
            }
            
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                showError('Error de conexión con el servidor. Verifica que el servidor esté ejecutándose.');
            } else if (error.message.includes('HTTP error')) {
                showError(`Error del servidor: ${error.message}`);
            } else {
                showError(`Error inesperado: ${error.message}`);
            }
        } finally {
            // Restaurar botón y resetear flag
            const submitBtn = verifyForm.querySelector('button[type="submit"]');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Resetear flag de enví
            this.submitting = false;
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
        } else {
            alert(message);
        }
    }
    
    function showSuccess(message) {
        if (successMessage) {
            successMessage.textContent = message;
            successMessage.style.display = 'block';
            if (errorMessage) errorMessage.style.display = 'none';
        } else {
            alert(message);
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
        window.location.href = '/views/index.html';
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
