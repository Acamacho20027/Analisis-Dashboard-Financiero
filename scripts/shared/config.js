// Configuración global de la aplicación
const CONFIG = {
    // URL base de la API
    API_BASE_URL: window.location.origin,
    
    // Configuración de autenticación
    AUTH: {
        TOKEN_KEY: 'authToken',
        USER_KEY: 'usuarioAutenticado',
        USER_DATA_KEY: 'userData'
    },
    
    // Configuración de la aplicación
    APP: {
        NAME: 'FinScope',
        VERSION: '1.0.0'
    }
};

// Función para obtener el token de autenticación
function getAuthToken() {
    return localStorage.getItem(CONFIG.AUTH.TOKEN_KEY);
}

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
    return localStorage.getItem(CONFIG.AUTH.USER_KEY) === 'true' && getAuthToken();
}

// Función para hacer peticiones a la API
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, finalOptions);
        
        if (!response.ok) {
            if (response.status === 401) {
                // Token expirado o inválido
                handleAuthError();
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// Función para manejar errores de autenticación
function handleAuthError() {
    localStorage.removeItem(CONFIG.AUTH.USER_KEY);
    localStorage.removeItem(CONFIG.AUTH.TOKEN_KEY);
    localStorage.removeItem(CONFIG.AUTH.USER_DATA_KEY);
    
    // Redirigir al login
    if (window.location.pathname !== '/views/index.html' && window.location.pathname !== '/') {
        window.location.href = '/views/index.html';
    }
}

// Función para hacer logout
function logout() {
    localStorage.removeItem(CONFIG.AUTH.USER_KEY);
    localStorage.removeItem(CONFIG.AUTH.TOKEN_KEY);
    localStorage.removeItem(CONFIG.AUTH.USER_DATA_KEY);
    localStorage.removeItem('transacciones');
    localStorage.removeItem('categories');
    
    window.location.href = '/views/index.html';
}

// Función para mostrar mensajes de error
function showErrorMessage(message, duration = 5000) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        errorDiv.className = 'error-message';
        
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, duration);
    } else {
        alert(message);
    }
}

// Función para mostrar mensajes de éxito
function showSuccessMessage(message, duration = 3000) {
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, duration);
    } else {
        alert(message);
    }
}

// Función para formatear moneda
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(amount);
}

// Función para formatear fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Función para formatear fecha corta
function formatShortDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
        month: 'short',
        day: 'numeric'
    });
}

// Exportar funciones para uso global
window.CONFIG = CONFIG;
window.getAuthToken = getAuthToken;
window.isAuthenticated = isAuthenticated;
window.apiRequest = apiRequest;
window.logout = logout;
window.showErrorMessage = showErrorMessage;
window.showSuccessMessage = showSuccessMessage;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.formatShortDate = formatShortDate;
