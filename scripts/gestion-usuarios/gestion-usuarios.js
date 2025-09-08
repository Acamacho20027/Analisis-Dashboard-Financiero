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
            // Crear nuevo usuario (esto requeriría una ruta de creación)
            showErrorMessage('La creación de usuarios no está implementada aún');
            return;
        }
        
        if (response.success) {
            showSuccessMessage(isEditMode ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente');
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

// Cerrar sesión
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
}