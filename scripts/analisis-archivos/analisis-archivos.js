// FinScope - Análisis de Archivos
document.addEventListener('DOMContentLoaded', function() {
    // Cargar archivos procesados existentes
    cargarArchivosProcesados();
    
    // Configurar formulario de carga de archivos
    configurarCargaArchivos();
    
    // Los filtros han sido removidos
    
    // Configurar logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('usuarioAutenticado');
        window.location.href = '/views/index.html';
    });
});

function configurarCargaArchivos() {
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileSelected = document.getElementById('fileSelected');
    const fileUploadForm = document.getElementById('fileUploadForm');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    // Configurar drag and drop
    fileUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        fileUploadArea.classList.add('dragover');
    });
    
    fileUploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
    });
    
    fileUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            manejarSeleccionArchivo(files[0]);
        }
    });
    
    // Configurar click para seleccionar archivo
    fileUploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Configurar input de archivo
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            manejarSeleccionArchivo(e.target.files[0]);
        }
    });
    
    // Configurar botón de eliminar archivo
    document.getElementById('removeFile').addEventListener('click', function() {
        fileInput.value = '';
        fileUploadArea.style.display = 'block';
        fileSelected.style.display = 'none';
        analyzeBtn.disabled = true;
    });
    
    // Configurar envío del formulario
    fileUploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        procesarArchivo();
    });
}

function manejarSeleccionArchivo(file) {
    // Validar tipo de archivo
    const tiposPermitidos = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (!tiposPermitidos.includes(file.type)) {
        alert('Tipo de archivo no soportado. Por favor selecciona un archivo PDF o Excel.');
        return;
    }
    
    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        alert('El archivo es demasiado grande. El tamaño máximo permitido es 10MB.');
        return;
    }
    
    // Mostrar información del archivo
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatearTamañoArchivo(file.size);
    document.getElementById('fileType').textContent = obtenerTipoArchivo(file.type);
    
    // Mostrar sección de archivo seleccionado
    document.getElementById('fileUploadArea').style.display = 'none';
    document.getElementById('fileSelected').style.display = 'block';
    document.getElementById('analyzeBtn').disabled = false;
}

function formatearTamañoArchivo(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function obtenerTipoArchivo(mimeType) {
    const tipos = {
        'application/pdf': 'PDF',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel (.xlsx)',
        'application/vnd.ms-excel': 'Excel (.xls)'
    };
    return tipos[mimeType] || 'Desconocido';
}

async function procesarArchivo() {
    const fileInput = document.getElementById('fileInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');
    
    if (!fileInput.files[0]) {
        alert('Por favor selecciona un archivo primero.');
        return;
    }
    
    // Mostrar estado de carga
    analyzeBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    
    try {
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        
        // Obtener usuario autenticado
        const usuario = JSON.parse(localStorage.getItem('userData') || '{}');
        if (!usuario.id) {
            throw new Error('Usuario no autenticado');
        }
        
        formData.append('userId', usuario.id);
        
        // Obtener token JWT del localStorage
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token de autenticación no encontrado');
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos timeout
        
        const response = await fetch('/api/analisis-archivos/procesar', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        const result = await response.json();
        console.log('Resultado del servidor:', result);
        
        if (result.success) {
            // Mostrar resultados
            mostrarResultadosAnalisis(result);
            
            // Recargar lista de archivos
            cargarArchivosProcesados();
            
            // Limpiar formulario
            fileInput.value = '';
            document.getElementById('fileUploadArea').style.display = 'block';
            document.getElementById('fileSelected').style.display = 'none';
            
            // Mostrar modal de éxito
            mostrarModalExito();
        } else {
            throw new Error(result.error || 'Error al procesar el archivo');
        }
        
    } catch (error) {
        console.error('Error al procesar archivo:', error);
        
        let errorMessage = 'Error al procesar el archivo: ';
        if (error.name === 'AbortError') {
            errorMessage += 'Timeout - El archivo tardó demasiado en procesarse. Intenta con un archivo más pequeño.';
        } else if (error.message.includes('ECONNRESET')) {
            errorMessage += 'Conexión perdida con el servidor. Verifica que el servidor Python esté funcionando.';
        } else {
            errorMessage += error.message;
        }
        
        alert(errorMessage);
    } finally {
        // Restaurar estado del botón
        analyzeBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

function mostrarResultadosAnalisis(resultado) {
    console.log('Mostrando resultados:', resultado);
    
    const analysisResults = document.getElementById('analysisResults');
    const analysisSummary = document.getElementById('analysisSummary');
    const chartsContainer = document.getElementById('chartsContainer');
    
    // Validar que el resultado no sea null o undefined
    if (!resultado) {
        console.error('Resultado es null o undefined');
        return;
    }
    
    // Mostrar resumen
    analysisSummary.innerHTML = `
        <div class="summary-grid">
            <div class="summary-item">
                <h3>Archivo Procesado</h3>
                <p>${resultado.fileName}</p>
            </div>
            <div class="summary-item">
                <h3>Total de Registros</h3>
                <p>${resultado.totalRecords || 0}</p>
            </div>
            <div class="summary-item">
                <h3>Ingresos Detectados</h3>
                <p>$${resultado.totalIncome || 0}</p>
            </div>
            <div class="summary-item">
                <h3>Gastos Detectados</h3>
                <p>$${resultado.totalExpenses || 0}</p>
            </div>
        </div>
    `;
    
    // Mostrar gráficos
    if (resultado.charts && resultado.charts.length > 0) {
        chartsContainer.innerHTML = resultado.charts.map(chart => {
            if (chart && chart.title && chart.data) {
                return `
                    <div class="chart-item">
                        <h3>${chart.title}</h3>
                        <img src="data:image/png;base64,${chart.data}" alt="${chart.title}" class="chart-image">
                    </div>
                `;
            }
            return '';
        }).filter(html => html !== '').join('');
        
        if (chartsContainer.innerHTML === '') {
            chartsContainer.innerHTML = '<p>No se generaron gráficos válidos para este archivo.</p>';
        }
    } else {
        chartsContainer.innerHTML = '<p>No se generaron gráficos para este archivo.</p>';
    }
    
    // Mostrar sección de resultados
    analysisResults.style.display = 'block';
}

async function cargarArchivosProcesados() {
    try {
        const usuario = JSON.parse(localStorage.getItem('userData') || '{}');
        if (!usuario.id) {
            return;
        }
        
        // Obtener token JWT del localStorage
        const token = localStorage.getItem('authToken');
        if (!token) {
            return;
        }
        
        const response = await fetch(`/api/analisis-archivos/historial?userId=${usuario.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const result = await response.json();
        
        if (result.success) {
            mostrarArchivosProcesados(result.archivos);
        }
        
    } catch (error) {
        console.error('Error al cargar archivos procesados:', error);
    }
}

function mostrarArchivosProcesados(archivos) {
    const filesList = document.getElementById('filesList');
    
    if (archivos.length === 0) {
        filesList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <h3>No hay archivos analizados</h3>
                <p>Sube tu primer archivo para comenzar el análisis financiero</p>
            </div>
        `;
    } else {
        filesList.innerHTML = `
            <div class="files-header">
                <h3>Archivos Analizados (${archivos.length})</h3>
                <div class="files-summary">
                    <span class="summary-item completed">${archivos.filter(a => a.status === 'completed').length} Completados</span>
                    <span class="summary-item error">${archivos.filter(a => a.status === 'error').length} Con errores</span>
                </div>
            </div>
            <div class="files-grid">
                ${archivos.map(archivo => `
                    <div class="file-card" data-file-id="${archivo.id}">
                        <div class="file-header">
                            <div class="file-icon">
                                ${obtenerIconoArchivo(archivo.fileType)}
                            </div>
                            <div class="file-info">
                                <h4 class="file-name">${archivo.fileName}</h4>
                                <div class="file-meta">
                                    <span class="file-type-badge">${archivo.fileType.toUpperCase()}</span>
                                    <span class="file-size">${formatearTamañoArchivo(archivo.fileSize)}</span>
                                </div>
                            </div>
                            <div class="file-status">
                                <span class="status-badge status-${archivo.status}">${obtenerTextoEstado(archivo.status)}</span>
                            </div>
                        </div>
                        
                        <div class="file-content">
                            <div class="file-details">
                                <div class="detail-item">
                                    <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span>${formatearFecha(archivo.processedAt)}</span>
                                </div>
                                
                                ${archivo.status === 'error' && archivo.errorMessage ? `
                                    <div class="error-message">
                                        <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <span>${archivo.errorMessage}</span>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        
                        <div class="file-actions">
                            ${archivo.status === 'completed' ? `
                                <button class="btn btn-primary" onclick="verAnalisis(${archivo.id})" title="Ver análisis">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                    Ver Análisis
                                </button>
                            ` : ''}
                            <button class="btn btn-danger" onclick="eliminarArchivo(${archivo.id})" title="Eliminar archivo">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                Eliminar
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

function obtenerTextoEstado(estado) {
    const estados = {
        'processing': 'Procesando',
        'completed': 'Completado',
        'error': 'Error'
    };
    return estados[estado] || estado;
}

// La función de filtrado ha sido removida

// La función verResultados ha sido removida

async function eliminarArchivo(archivoId) {
    // Mostrar modal de confirmación
    mostrarModalConfirmacion(archivoId);
}

// Variable para almacenar el ID del archivo a eliminar
let archivoIdAEliminar = null;

async function confirmarEliminacion() {
    if (!archivoIdAEliminar) return;
    
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token de autenticación no encontrado');
        }
        
        // Mostrar indicador de carga en el botón
        const confirmBtn = document.getElementById('deleteConfirmBtn');
        const originalText = confirmBtn.innerHTML;
        confirmBtn.innerHTML = `
            <svg class="animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Eliminando...
        `;
        confirmBtn.disabled = true;
        
        const response = await fetch(`/api/analisis-archivos/eliminar/${archivoIdAEliminar}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Restaurar botón antes de cerrar modal
            const confirmBtn = document.getElementById('deleteConfirmBtn');
            confirmBtn.innerHTML = `
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Eliminar
            `;
            confirmBtn.disabled = false;
            
            // Cerrar modal de confirmación
            cerrarModalConfirmacion();
            
            // Mostrar modal de éxito
            mostrarModalExitoEliminacion();
            
            // Recargar la lista de archivos
            cargarArchivosProcesados();
        } else {
            throw new Error(result.error || 'Error al eliminar el archivo');
        }
        
    } catch (error) {
        console.error('Error al eliminar archivo:', error);
        alert('Error al eliminar el archivo: ' + error.message);
        
        // Restaurar botón en caso de error
        const confirmBtn = document.getElementById('deleteConfirmBtn');
        confirmBtn.innerHTML = `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Eliminar
        `;
        confirmBtn.disabled = false;
    }
}

function obtenerIconoArchivo(tipo) {
    const iconos = {
        'pdf': `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="text-red-500">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9h4v4h-4V9z"></path>
            </svg>
        `,
        'xlsx': `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="text-green-500">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
        `,
        'xls': `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="text-green-500">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
        `
    };
    
    return iconos[tipo] || iconos['pdf'];
}

function formatearFecha(fecha) {
    const date = new Date(fecha);
    const ahora = new Date();
    const diffMs = ahora - date;
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDias === 0) {
        return 'Hoy ' + date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDias === 1) {
        return 'Ayer ' + date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDias < 7) {
        return `Hace ${diffDias} días`;
    } else {
        return date.toLocaleDateString('es-ES');
    }
}

function formatearMonto(monto) {
    if (monto === 0) return '0';
    if (monto < 1000) return monto.toFixed(2);
    if (monto < 1000000) return (monto / 1000).toFixed(1) + 'K';
    return (monto / 1000000).toFixed(1) + 'M';
}

// Funciones del Modal de Éxito
function mostrarModalExito() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
        
        // Agregar event listener para cerrar modal
        const closeBtn = document.getElementById('modalCloseBtn');
        if (closeBtn) {
            closeBtn.onclick = cerrarModal;
        }
        
        // Cerrar modal al hacer clic fuera del contenido
        modal.onclick = function(event) {
            if (event.target === modal) {
                cerrarModal();
            }
        };
        
        // Cerrar modal con tecla Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                cerrarModal();
            }
        });
    }
}

function cerrarModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restaurar scroll del body
        
        // Remover event listeners
        const closeBtn = document.getElementById('modalCloseBtn');
        if (closeBtn) {
            closeBtn.onclick = null;
        }
        
        modal.onclick = null;
        document.removeEventListener('keydown', cerrarModal);
    }
}

// Funciones del Modal de Confirmación de Eliminación
function mostrarModalConfirmacion(archivoId) {
    archivoIdAEliminar = archivoId;
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Agregar event listeners
        const cancelBtn = document.getElementById('deleteCancelBtn');
        const confirmBtn = document.getElementById('deleteConfirmBtn');
        
        if (cancelBtn) {
            cancelBtn.onclick = cerrarModalConfirmacion;
        }
        
        if (confirmBtn) {
            confirmBtn.onclick = confirmarEliminacion;
        }
        
        // Cerrar modal al hacer clic fuera del contenido
        modal.onclick = function(event) {
            if (event.target === modal) {
                cerrarModalConfirmacion();
            }
        };
        
        // Cerrar modal con tecla Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                cerrarModalConfirmacion();
            }
        });
    }
}

function cerrarModalConfirmacion() {
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Restaurar botón de confirmación por si acaso
        const confirmBtn = document.getElementById('deleteConfirmBtn');
        if (confirmBtn) {
            confirmBtn.innerHTML = `
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Eliminar
            `;
            confirmBtn.disabled = false;
        }
        
        // Limpiar variable
        archivoIdAEliminar = null;
        
        // Remover event listeners
        const cancelBtn = document.getElementById('deleteCancelBtn');
        
        if (cancelBtn) {
            cancelBtn.onclick = null;
        }
        
        if (confirmBtn) {
            confirmBtn.onclick = null;
        }
        
        modal.onclick = null;
        document.removeEventListener('keydown', cerrarModalConfirmacion);
    }
}

// Funciones del Modal de Éxito de Eliminación
function mostrarModalExitoEliminacion() {
    const modal = document.getElementById('deleteSuccessModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Agregar event listener para cerrar modal
        const closeBtn = document.getElementById('deleteSuccessCloseBtn');
        if (closeBtn) {
            closeBtn.onclick = cerrarModalExitoEliminacion;
        }
        
        // Cerrar modal al hacer clic fuera del contenido
        modal.onclick = function(event) {
            if (event.target === modal) {
                cerrarModalExitoEliminacion();
            }
        };
        
        // Cerrar modal con tecla Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                cerrarModalExitoEliminacion();
            }
        });
    }
}

function cerrarModalExitoEliminacion() {
    const modal = document.getElementById('deleteSuccessModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Remover event listeners
        const closeBtn = document.getElementById('deleteSuccessCloseBtn');
        if (closeBtn) {
            closeBtn.onclick = null;
        }
        
        modal.onclick = null;
        document.removeEventListener('keydown', cerrarModalExitoEliminacion);
    }
}

// ===== FUNCIONES PARA MODAL DE ANÁLISIS =====

// Variable para almacenar los datos del análisis actual
let analisisActual = null;

async function verAnalisis(archivoId) {
    try {
        // Mostrar modal con loading
        mostrarModalAnalisis();
        mostrarLoadingAnalisis();
        
        // Obtener token JWT del localStorage
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token de autenticación no encontrado');
        }
        
        // Obtener usuario autenticado
        const usuario = JSON.parse(localStorage.getItem('userData') || '{}');
        if (!usuario.id) {
            throw new Error('Usuario no autenticado');
        }
        
        // Hacer petición para obtener los resultados del análisis
        const response = await fetch(`/api/analisis-archivos/resultados/${archivoId}?userId=${usuario.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            analisisActual = result;
            mostrarContenidoAnalisis(result);
        } else {
            throw new Error(result.error || 'Error al obtener el análisis');
        }
        
    } catch (error) {
        console.error('Error al obtener análisis:', error);
        mostrarErrorAnalisis('Error al cargar el análisis: ' + error.message);
    }
}

function mostrarModalAnalisis() {
    const modal = document.getElementById('analysisViewModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Configurar event listeners
        const closeBtn = document.getElementById('analysisModalCloseBtn');
        const downloadJPG = document.getElementById('downloadJPG');
        
        if (closeBtn) closeBtn.onclick = cerrarModalAnalisis;
        if (downloadJPG) downloadJPG.onclick = () => descargarAnalisis('jpg');
        
        // Cerrar modal al hacer clic fuera del contenido
        modal.onclick = function(event) {
            if (event.target === modal) {
                cerrarModalAnalisis();
            }
        };
        
        // Cerrar modal con tecla Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                cerrarModalAnalisis();
            }
        });
    }
}

function cerrarModalAnalisis() {
    const modal = document.getElementById('analysisViewModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Limpiar contenido
        const content = document.getElementById('analysisModalContent');
        if (content) {
            content.innerHTML = '';
        }
        
        // Limpiar datos
        analisisActual = null;
        
        // Remover event listeners
        const closeBtn = document.getElementById('analysisModalCloseBtn');
        const downloadJPG = document.getElementById('downloadJPG');
        
        if (closeBtn) closeBtn.onclick = null;
        if (downloadJPG) downloadJPG.onclick = null;
        
        modal.onclick = null;
        document.removeEventListener('keydown', cerrarModalAnalisis);
    }
}

function mostrarLoadingAnalisis() {
    const content = document.getElementById('analysisModalContent');
    const title = document.getElementById('analysisModalTitle');
    
    if (content) {
        content.innerHTML = `
            <div class="modal-details">
                <div class="detail-item">
                    <svg class="detail-icon animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    <span>Cargando análisis...</span>
                </div>
                <div class="detail-item">
                    <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span>Obteniendo los datos del archivo procesado</span>
                </div>
            </div>
        `;
    }
    
    if (title) {
        title.textContent = 'Cargando Análisis...';
    }
}

function mostrarErrorAnalisis(mensaje) {
    const content = document.getElementById('analysisModalContent');
    const title = document.getElementById('analysisModalTitle');
    
    if (content) {
        content.innerHTML = `
            <div class="modal-details">
                <div class="detail-item error">
                    <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Error al cargar el análisis</span>
                </div>
                <div class="detail-item error">
                    <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>${mensaje}</span>
                </div>
            </div>
        `;
    }
    
    if (title) {
        title.textContent = 'Error al Cargar Análisis';
    }
}

function mostrarContenidoAnalisis(resultado) {
    const content = document.getElementById('analysisModalContent');
    const title = document.getElementById('analysisModalTitle');
    
    // Debug: Mostrar información de los datos recibidos
    console.log('Datos completos del análisis:', resultado);
    console.log('Gráficos recibidos:', resultado.charts);
    
    if (resultado.charts) {
        resultado.charts.forEach((chart, index) => {
            console.log(`Gráfico ${index}:`, {
                title: chart?.title,
                hasData: !!chart?.data,
                dataLength: chart?.data ? chart.data.length : 0,
                dataPreview: chart?.data ? chart.data.substring(0, 50) + '...' : 'No data'
            });
        });
    }
    
    if (title) {
        title.textContent = `Análisis: ${resultado.fileName}`;
    }
    
    if (content) {
        // Mostrar resumen
        const summaryHTML = `
            <div class="analysis-summary">
                <h3>Resumen del Análisis</h3>
                <div class="summary-grid">
                    <div class="summary-item">
                        <h4>Archivo</h4>
                        <p>${resultado.fileName}</p>
                    </div>
                    <div class="summary-item">
                        <h4>Tipo</h4>
                        <p>${resultado.fileType.toUpperCase()}</p>
                    </div>
                    <div class="summary-item">
                        <h4>Total Ingresos</h4>
                        <p>$${resultado.analysis?.total_income || 0}</p>
                    </div>
                    <div class="summary-item">
                        <h4>Total Gastos</h4>
                        <p>$${resultado.analysis?.total_expenses || 0}</p>
                    </div>
                    <div class="summary-item">
                        <h4>Balance</h4>
                        <p>$${(resultado.analysis?.total_income || 0) - (resultado.analysis?.total_expenses || 0)}</p>
                    </div>
                    <div class="summary-item">
                        <h4>Transacciones</h4>
                        <p>${resultado.data?.length || 0}</p>
                    </div>
                </div>
            </div>
        `;
        
        // Mostrar gráficos
        let chartsHTML = '';
        if (resultado.charts && resultado.charts.length > 0) {
            chartsHTML = `
                <div class="charts-container">
                    ${resultado.charts.map(chart => {
                        if (chart && chart.title && chart.data) {
                            return `
                                <div class="chart-item">
                                    <h3>${chart.title}</h3>
                                    <img src="data:image/png;base64,${chart.data}" alt="${chart.title}" class="chart-image">
                                </div>
                            `;
                        }
                        return '';
                    }).filter(html => html !== '').join('')}
                </div>
            `;
        } else {
            chartsHTML = `
                <div class="charts-container">
                    <div class="chart-item">
                        <h3>Sin gráficos disponibles</h3>
                        <p>No se generaron gráficos para este archivo.</p>
                    </div>
                </div>
            `;
        }
        
        content.innerHTML = `
            <div class="analysis-content">
                ${summaryHTML}
                ${chartsHTML}
            </div>
        `;
    }
}

function descargarAnalisis(formato) {
    if (!analisisActual || !analisisActual.charts || analisisActual.charts.length === 0) {
        alert('No hay gráficos disponibles para descargar');
        return;
    }
    
    // Verificar que los gráficos tengan datos válidos
    const chartsValidos = analisisActual.charts.filter(chart => chart && chart.data && chart.data.trim() !== '');
    
    if (chartsValidos.length === 0) {
        alert('Los gráficos no contienen datos válidos para descargar');
        return;
    }
    
    console.log('Gráficos disponibles para descarga:', chartsValidos.length);
    console.log('Datos del primer gráfico:', chartsValidos[0] ? {
        title: chartsValidos[0].title,
        hasData: !!chartsValidos[0].data,
        dataLength: chartsValidos[0].data ? chartsValidos[0].data.length : 0
    } : 'No hay gráficos');
    
    try {
        // Mostrar indicador de carga
        const downloadBtn = document.getElementById('downloadJPG');
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = `
            <svg class="animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generando...
        `;
        downloadBtn.disabled = true;
        
        // Si solo hay un gráfico válido, descargarlo directamente
        if (chartsValidos.length === 1) {
            descargarImagenSimple(chartsValidos[0], formato, downloadBtn, originalText);
            return;
        }
        
        // Para múltiples gráficos, crear un canvas combinado
        crearCanvasCombinado(chartsValidos, formato, downloadBtn, originalText);
        
    } catch (error) {
        console.error('Error al generar descarga:', error);
        alert('Error al generar el archivo de descarga: ' + error.message);
        
        // Restaurar botón en caso de error
        const downloadBtn = document.getElementById('downloadJPG');
        if (downloadBtn) {
            downloadBtn.innerHTML = 'Descargar JPG';
            downloadBtn.disabled = false;
        }
    }
}

function descargarImagenSimple(chart, formato, downloadBtn, originalText) {
    try {
        // Validar que el gráfico tenga datos
        if (!chart || !chart.data || chart.data.trim() === '') {
            throw new Error('El gráfico no contiene datos válidos');
        }
        
        console.log('Descargando gráfico simple:', {
            title: chart.title,
            dataLength: chart.data.length,
            formato: formato
        });
        
        // Convertir base64 a blob
        const byteCharacters = atob(chart.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        
        let mimeType = 'image/png';
        if (formato === 'jpg') {
            mimeType = 'image/jpeg';
        }
        
        const blob = new Blob([byteArray], { type: mimeType });
        
        // Crear URL y descargar
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analisis_${analisisActual.fileName.replace(/\.[^/.]+$/, '')}_${chart.title.replace(/[^a-zA-Z0-9]/g, '_')}.${formato}`;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Restaurar botón
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
        
        console.log(`Descarga completada: ${a.download}`);
        
    } catch (error) {
        console.error('Error en descarga simple:', error);
        alert('Error al descargar la imagen: ' + error.message);
        
        // Restaurar botón
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
    }
}

function crearCanvasCombinado(charts, formato, downloadBtn, originalText) {
    try {
        // Crear un canvas para combinar todos los gráficos
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calcular dimensiones del canvas
        const chartsPerRow = 2;
        const chartWidth = 800;
        const chartHeight = 600;
        const padding = 20;
        const titleHeight = 40;
        
        const totalCharts = charts.length;
        const rows = Math.ceil(totalCharts / chartsPerRow);
        
        canvas.width = (chartWidth + padding) * chartsPerRow + padding;
        canvas.height = (chartHeight + titleHeight + padding) * rows + padding + 100;
        
        // Fondo blanco
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Título principal
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Análisis Financiero - ${analisisActual.fileName}`, canvas.width / 2, 30);
        
        // Fecha de generación
        ctx.fillStyle = '#64748b';
        ctx.font = '14px Arial';
        ctx.fillText(`Generado el ${new Date().toLocaleDateString('es-ES')}`, canvas.width / 2, 50);
        
        // Cargar y dibujar cada gráfico
        let chartsLoaded = 0;
        
        const loadChart = (chart, index) => {
            return new Promise((resolve) => {
                // Validar que el gráfico tenga datos
                if (!chart || !chart.data || chart.data.trim() === '') {
                    console.warn(`Gráfico ${index} no tiene datos válidos, saltando...`);
                    chartsLoaded++;
                    resolve();
                    return;
                }
                
                const img = new Image();
                
                img.onload = () => {
                    try {
                        const row = Math.floor(index / chartsPerRow);
                        const col = index % chartsPerRow;
                        
                        const x = col * (chartWidth + padding) + padding;
                        const y = row * (chartHeight + titleHeight + padding) + 80;
                        
                        // Título del gráfico
                        ctx.fillStyle = '#1e293b';
                        ctx.font = 'bold 16px Arial';
                        ctx.textAlign = 'left';
                        ctx.fillText(chart.title, x, y);
                        
                        // Dibujar imagen escalada
                        ctx.drawImage(img, x, y + titleHeight, chartWidth, chartHeight);
                        
                        chartsLoaded++;
                        console.log(`Gráfico ${index} cargado correctamente`);
                        resolve();
                    } catch (error) {
                        console.error('Error al dibujar gráfico:', error);
                        chartsLoaded++;
                        resolve();
                    }
                };
                
                img.onerror = (error) => {
                    console.error('Error al cargar imagen:', error);
                    chartsLoaded++;
                    resolve();
                };
                
                // Cargar la imagen
                try {
                    img.src = `data:image/png;base64,${chart.data}`;
                } catch (error) {
                    console.error('Error al establecer src de imagen:', error);
                    chartsLoaded++;
                    resolve();
                }
            });
        };
        
        // Cargar todos los gráficos
        const loadPromises = charts.map((chart, index) => loadChart(chart, index));
        
        Promise.all(loadPromises).then(() => {
            try {
                // Convertir canvas a blob y descargar
                canvas.toBlob((blob) => {
                    if (!blob) {
                        throw new Error('No se pudo generar el archivo');
                    }
                    
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `analisis_${analisisActual.fileName.replace(/\.[^/.]+$/, '')}.${formato}`;
                    a.style.display = 'none';
                    
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    // Restaurar botón
                    downloadBtn.innerHTML = originalText;
                    downloadBtn.disabled = false;
                    
                    console.log(`Descarga completada: ${a.download}`);
                }, `image/${formato}`, 0.9);
                
            } catch (error) {
                console.error('Error al generar blob:', error);
                alert('Error al generar el archivo de descarga: ' + error.message);
                
                // Restaurar botón
                downloadBtn.innerHTML = originalText;
                downloadBtn.disabled = false;
            }
        }).catch((error) => {
            console.error('Error al cargar gráficos:', error);
            alert('Error al cargar los gráficos: ' + error.message);
            
            // Restaurar botón
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
        });
        
    } catch (error) {
        console.error('Error en canvas combinado:', error);
        alert('Error al crear el archivo combinado: ' + error.message);
        
        // Restaurar botón
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
    }
}
