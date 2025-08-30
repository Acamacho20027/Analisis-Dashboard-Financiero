// FinScope - Registro de Usuarios
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Manejar el envío del formulario de registro
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Obtener valores del formulario
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validaciones básicas
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            showError('Por favor completa todos los campos');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('Las contraseñas no coinciden');
            return;
        }
        
        if (password.length < 6) {
            showError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Por favor ingresa un email válido');
            return;
        }
        
        // Mostrar estado de carga
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creando cuenta...';
        submitBtn.disabled = true;
        
        try {
            // Realizar registro
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password
                })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                // Registro exitoso
                showSuccess('Cuenta creada exitosamente. Por favor verifica tu email para continuar.');
                
                // Limpiar formulario
                registerForm.reset();
                
                // Redirigir a la página de espera después de 3 segundos
                setTimeout(() => {
                    window.location.href = '/espera';
                }, 3000);
                
            } else {
                // Error en el registro
                showError(data.error || 'Error al crear la cuenta');
            }
            
        } catch (error) {
            console.error('Error en registro:', error);
            showError('Error de conexión. Por favor intenta nuevamente.');
        } finally {
            // Restaurar botón
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Función para mostrar mensajes de error
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
    
    // Función para mostrar mensajes de éxito
    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
    }
    
    // Validación en tiempo real para confirmar contraseña
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordInput = document.getElementById('password');
    
    confirmPasswordInput.addEventListener('input', function() {
        if (this.value && this.value !== passwordInput.value) {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = '#d1d5db';
        }
    });
    
    passwordInput.addEventListener('input', function() {
        if (confirmPasswordInput.value && this.value !== confirmPasswordInput.value) {
            confirmPasswordInput.style.borderColor = '#ef4444';
        } else {
            confirmPasswordInput.style.borderColor = '#d1d5db';
        }
    });
});
