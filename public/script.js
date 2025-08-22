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
            
            if (data.success) {
                // Guardar email en localStorage para la siguiente pantalla
                localStorage.setItem('userEmail', email);
                localStorage.setItem('maskedEmail', data.maskedEmail);
                
                // Redirigir a la pantalla de espera
                window.location.href = '/espera';
            } else {
                showError(data.error || 'Error al procesar el login');
            }
            
        } catch (error) {
            console.error('Error:', error);
            showError('Error de conexión. Por favor, intenta de nuevo.');
        } finally {
            // Restaurar botón
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
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
