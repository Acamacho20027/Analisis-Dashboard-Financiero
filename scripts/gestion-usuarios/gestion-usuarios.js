// Gestión de Usuarios - JavaScript
let users = [];
let roles = [];
let currentUserId = null;
let isEditMode = false;

// Inicializar la página
document.addEventListener('DOMContentLoaded', function() {
    checkAuthAndRole();
    loadUsers();
    loadRoles();
    
    // Configurar logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioAutenticado');
        window.location.href = '/';
    });
});

// Verificar autenticación y rol
async function checkAuthAndRole() {
    try {
        // Verificar autenticación básica primero
        if (!isAuthenticated()) {
            window.location.href = '/';
            return;
        }

        // Esperar a que apiRequest esté disponible
        if (typeof apiRequest !== 'function') {
            console.error('apiRequest no está disponible');
            window.location.href = '/';
            return;
        }

        const response = await apiRequest('/api/profile');
        if (response.success && response.user) {
            const user = response.user;
            
            // Mostrar nombre del usuario
            const userNameElement = document.getElementById('userName');
            if (userNameElement) {
                userNameElement.textContent = `${user.firstName} ${user.lastName}`;
            }
            
            // Verificar si es administrador
            if (user.roleId !== 2) {
                showErrorMessage('No tienes permisos para acceder a esta página');
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000);
                return;
            }
        } else {
            console.error('Error en respuesta de perfil:', response);
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error verificando autenticación:', error);
        window.location.href = '/';
    }
}

// Cargar usuarios
async function loadUsers() {
    try {
        showLoading(true);
        
        const response = await apiRequest('/api/users');
        if (response.success) {
            users = response.users;
            displayUsers(users);
        } else {
            showErrorMessage('Error al cargar usuarios');
        }
    } catch (error) {
        console.error('Error cargando usuarios:', error);
        showErrorMessage('Error al cargar usuarios');
    } finally {
        showLoading(false);
    }
}

// Cargar roles
async function loadRoles() {
    try {
        const response = await apiRequest('/api/roles');
        if (response.success) {
            roles = response.roles;
            populateRolesSelect();
        }
    } catch (error) {
        console.error('Error cargando roles:', error);
    }
}

// Mostrar usuarios en la tabla
function displayUsers(usersToShow) {
    const tbody = document.getElementById('usersTableBody');
    const emptyState = document.getElementById('emptyState');
    
    if (usersToShow.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    tbody.innerHTML = usersToShow.map(user => `
        <tr>
            <td>${user.Id}</td>
            <td>${user.FirstName} ${user.LastName}</td>
            <td>${user.Email}</td>
            <td>
                <span class="role-badge role-${user.RoleId}">
                    ${user.RoleName}
                </span>
            </td>
            <td>
                <span class="status-badge ${user.IsActive ? 'active' : 'inactive'}">
                    ${user.IsActive ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>${user.LastLoginAt ? formatDate(user.LastLoginAt) : 'Nunca'}</td>
            <td>
                <button onclick="editUser(${user.Id})" class="btn btn-sm btn-outline">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteUser(${user.Id})" class="btn btn-sm btn-danger" 
                        ${user.Id === currentUserId ? 'disabled' : ''}>
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Filtrar usuarios
function filterUsers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredUsers = users.filter(user => 
        user.FirstName.toLowerCase().includes(searchTerm) ||
        user.LastName.toLowerCase().includes(searchTerm) ||
        user.Email.toLowerCase().includes(searchTerm) ||
        user.RoleName.toLowerCase().includes(searchTerm)
    );
    displayUsers(filteredUsers);
}

// Abrir modal de usuario
function openUserModal(userId = null) {
    const modal = document.getElementById('userModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('userForm');
    
    // Limpiar formulario
    form.reset();
    
    if (userId) {
        // Modo edición
        isEditMode = true;
        currentUserId = userId;
        modalTitle.textContent = 'Editar Usuario';
        
        const user = users.find(u => u.Id === userId);
        if (user) {
            document.getElementById('firstName').value = user.FirstName;
            document.getElementById('lastName').value = user.LastName;
            document.getElementById('email').value = user.Email;
            document.getElementById('roleId').value = user.RoleId;
            document.getElementById('isActive').value = user.IsActive ? 'true' : 'false';
        }
    } else {
        // Modo creación
        isEditMode = false;
        currentUserId = null;
        modalTitle.textContent = 'Nuevo Usuario';
    }
    
    modal.style.display = 'block';
}

// Cerrar modal
function closeModal() {
    document.getElementById('userModal').style.display = 'none';
    isEditMode = false;
    currentUserId = null;
}

// Guardar usuario
async function saveUser() {
    try {
        const form = document.getElementById('userForm');
        const formData = new FormData(form);
        
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            roleId: parseInt(formData.get('roleId')),
            isActive: formData.get('isActive') === 'true'
        };
        
        // Validación básica
        if (!userData.firstName || !userData.lastName || !userData.email || !userData.roleId) {
            showErrorMessage('Todos los campos son requeridos');
            return;
        }
        
        let response;
        if (isEditMode) {
            // Actualizar usuario existente
            response = await apiRequest(`/api/users/${currentUserId}`, {
                method: 'PUT',
                body: JSON.stringify(userData)
            });
        } else {
            // Crear nuevo usuario
            response = await apiRequest('/api/users', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
        }
        
        if (response.success) {
            if (isEditMode) {
                showSuccessMessage('Usuario actualizado exitosamente');
            } else {
                // Mostrar contraseña temporal para el nuevo usuario
                const tempPassword = response.tempPassword;
                showSuccessMessage(`Usuario creado exitosamente. Contraseña temporal: ${tempPassword}`);
                
                // Mostrar modal con la contraseña temporal
                showTempPasswordModal(response.userId, tempPassword);
            }
            closeModal();
            loadUsers();
        } else {
            showErrorMessage(response.error || 'Error al guardar usuario');
        }
        
    } catch (error) {
        console.error('Error guardando usuario:', error);
        showErrorMessage('Error al guardar usuario');
    }
}

// Editar usuario
function editUser(userId) {
    openUserModal(userId);
}

// Eliminar usuario
function deleteUser(userId) {
    const user = users.find(u => u.Id === userId);
    if (user) {
        currentUserId = userId;
        document.getElementById('deleteModal').style.display = 'block';
    }
}

// Cerrar modal de eliminación
function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
    currentUserId = null;
}

// Confirmar eliminación
async function confirmDelete() {
    try {
        const response = await apiRequest(`/api/users/${currentUserId}`, {
            method: 'DELETE'
        });
        
        if (response.success) {
            showSuccessMessage('Usuario eliminado exitosamente');
            closeDeleteModal();
            loadUsers();
        } else {
            showErrorMessage(response.error || 'Error al eliminar usuario');
        }
        
    } catch (error) {
        console.error('Error eliminando usuario:', error);
        showErrorMessage('Error al eliminar usuario');
    }
}

// Poblar select de roles
function populateRolesSelect() {
    const select = document.getElementById('roleId');
    select.innerHTML = '<option value="">Seleccionar rol...</option>';
    
    roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role.Id;
        option.textContent = role.Name;
        select.appendChild(option);
    });
}

// Mostrar/ocultar loading
function showLoading(show) {
    const loadingState = document.getElementById('loadingState');
    const tableContainer = document.querySelector('.table-container');
    
    if (show) {
        loadingState.style.display = 'block';
        tableContainer.style.display = 'none';
    } else {
        loadingState.style.display = 'none';
        tableContainer.style.display = 'block';
    }
}

// Formatear fecha
function formatDate(dateString) {
    if (!dateString) return 'Nunca';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Mostrar mensaje de éxito
function showSuccessMessage(message) {
    showMessage(message, 'success');
}

// Mostrar mensaje de error
function showErrorMessage(message) {
    showMessage(message, 'error');
}

// Mostrar mensaje
function showMessage(message, type) {
    const container = document.getElementById('messageContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    container.appendChild(messageDiv);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 5000);
}

// Mostrar modal con contraseña temporal
function showTempPasswordModal(userId, tempPassword) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header success">
                <div class="modal-icon success">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h3 class="modal-title">¡Usuario Creado Exitosamente!</h3>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <p class="modal-message">El usuario ha sido creado correctamente. A continuación se muestra la contraseña temporal que debe compartir con el usuario.</p>
                <div class="modal-details">
                    <div class="detail-item">
                        <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                        <span>Contraseña temporal generada automáticamente</span>
                    </div>
                    <div class="detail-item">
                        <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>Usuario verificado automáticamente</span>
                    </div>
                    <div class="detail-item">
                        <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                        <span>Debe cambiarse en el primer inicio de sesión</span>
                    </div>
                </div>
                <div class="form-group" style="margin-top: 1.5rem;">
                    <label>Contraseña Temporal:</label>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <input type="text" id="tempPasswordDisplay" value="${tempPassword}" readonly 
                               style="flex: 1; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-family: monospace; font-size: 18px; letter-spacing: 3px; text-align: center; background-color: #f9fafb;">
                        <button onclick="copyTempPassword()" class="btn btn-outline" style="padding: 12px 16px;">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px; margin-right: 8px;">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                            Copiar
                        </button>
                    </div>
                </div>
                <div class="alert alert-warning" style="margin-top: 1.5rem;">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 20px; height: 20px; margin-right: 8px;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    <strong>Importante:</strong> Esta contraseña temporal debe ser compartida con el usuario de forma segura.
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" onclick="this.closest('.modal').remove()">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Entendido
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Copiar contraseña temporal al portapapeles
function copyTempPassword() {
    const tempPasswordInput = document.getElementById('tempPasswordDisplay');
    if (tempPasswordInput) {
        tempPasswordInput.select();
        tempPasswordInput.setSelectionRange(0, 99999); // Para dispositivos móviles
        document.execCommand('copy');
        
        // Mostrar confirmación
        const button = event.target.closest('button');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copiado';
        button.style.backgroundColor = '#10b981';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.backgroundColor = '';
        }, 2000);
    }
}

// Cerrar sesión
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
}