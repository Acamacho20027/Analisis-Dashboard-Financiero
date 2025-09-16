// Lógica de cambio de contraseña para FinScope

document.addEventListener('DOMContentLoaded', function() {
    const changePasswordForm = document.getElementById('changePasswordForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const emailInput = document.getElementById('email');
    
    // Obtener email del localStorage si existe
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        emailInput.value = userEmail;
    }
    
    // Evento submit del formulario
    changePasswordForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const currentPassword = document.getElementById('tempPassword').value.trim();
        const newPassword = document.getElementById('newPassword').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();
        
        // Validaciones
        if (!email || !currentPassword || !newPassword || !confirmPassword) {
            showError('Por favor, completa todos los campos');
            return;
        }
        
        if (newPassword.length < 8) {
            showError('La nueva contraseña debe tener al menos 8 caracteres');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showError('Las contraseñas no coinciden');
            return;
        }
        
        if (tempPassword === newPassword) {
            showError('La nueva contraseña debe ser diferente a la contraseña temporal');
            return;
        }
        
        try {
            // Mostrar estado de carga
            const submitBtn = changePasswordForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Cambiando...';
            submitBtn.disabled = true;
            
            // Enviar datos al servidor
            const response = await fetch('/api/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email, 
                    tempPassword: currentPassword, 
                    newPassword 
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showSuccess('Contraseña cambiada exitosamente');
                
                // Limpiar localStorage
                localStorage.removeItem('userEmail');
                localStorage.removeItem('maskedEmail');
                
                // Redirigir al login después de 2 segundos
                setTimeout(() => {
                    window.location.href = '/views/index.html';
                }, 2000);
                
            } else {
                showError(data.error || 'Error al cambiar la contraseña');
            }
            
        } catch (error) {
            console.error('Error:', error);
            showError('Error de conexión. Por favor, intenta de nuevo.');
        } finally {
            // Restaurar botón
            const submitBtn = changePasswordForm.querySelector('button[type="submit"]');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
    
    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
    }
    
    // Limpiar mensajes de error al escribir
    document.getElementById('tempPassword').addEventListener('input', function() {
        errorMessage.style.display = 'none';
    });
    
    document.getElementById('newPassword').addEventListener('input', function() {
        errorMessage.style.display = 'none';
    });
    
    document.getElementById('confirmPassword').addEventListener('input', function() {
        errorMessage.style.display = 'none';
    });

    // Botón para volver al login
    const backToLoginBtn = document.getElementById('backToLoginBtn');
    if (backToLoginBtn) {
        backToLoginBtn.addEventListener('click', function() {
            localStorage.removeItem('userEmail');
            localStorage.removeItem('maskedEmail');
            window.location.href = '/views/index.html';
        });
    }
});
