// Lógica de autenticación para FinScope
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        
        // Validación básica
        if (!email || !password) {
            showError('Por favor, completa todos los campos');
            return;
        }
        
        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Por favor, ingresa un correo electrónico válido');
            return;
        }
        
        try {
            // Mostrar estado de carga
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            // Enviar datos al servidor
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            console.log('Respuesta del servidor:', data);
            
            if (data.success) {
                // Guardar email en localStorage para la siguiente pantalla
                localStorage.setItem('userEmail', email);
                localStorage.setItem('maskedEmail', data.maskedEmail);
                
                // Verificar si el usuario debe cambiar su contraseña
                if (data.user && data.user.mustChangePassword) {
                    // Redirigir a cambio de contraseña
                    window.location.href = '/views/cambiar-contrasena.html';
                } else {
                    // Redirigir a la pantalla de espera
                    window.location.href = '/views/espera.html';
                }
            } else {
                // Restaurar botón antes de mostrar error
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                showError(data.error || 'Error al procesar el login');
            }
            
        } catch (error) {
            console.error('Error:', error);
            // Restaurar botón antes de mostrar error
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            showError('Error de conexión. Por favor, intenta de nuevo.');
        }
    });
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
    
    // Limpiar mensajes de error al escribir
    document.getElementById('email').addEventListener('input', function() {
        errorMessage.style.display = 'none';
    });
    
    document.getElementById('password').addEventListener('input', function() {
        errorMessage.style.display = 'none';
    });
});
