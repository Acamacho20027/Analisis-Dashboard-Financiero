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
            
            alert('Archivo procesado exitosamente');
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
    if (!confirm('¿Estás seguro de que quieres eliminar este archivo? Esta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token de autenticación no encontrado');
        }
        
        // Mostrar indicador de carga
        const fileCard = document.querySelector(`[data-file-id="${archivoId}"]`);
        if (fileCard) {
            const deleteBtn = fileCard.querySelector('.btn-danger');
            const originalText = deleteBtn.innerHTML;
            deleteBtn.innerHTML = `
                <svg class="animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Eliminando...
            `;
            deleteBtn.disabled = true;
        }
        
        const response = await fetch(`/api/analisis-archivos/eliminar/${archivoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Mostrar mensaje de éxito
            alert('Archivo eliminado exitosamente');
            
            // Recargar la lista de archivos
            cargarArchivosProcesados();
        } else {
            throw new Error(result.error || 'Error al eliminar el archivo');
        }
        
    } catch (error) {
        console.error('Error al eliminar archivo:', error);
        alert('Error al eliminar el archivo: ' + error.message);
        
        // Restaurar botón en caso de error
        const fileCard = document.querySelector(`[data-file-id="${archivoId}"]`);
        if (fileCard) {
            const deleteBtn = fileCard.querySelector('.btn-danger');
            deleteBtn.innerHTML = `
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Eliminar
            `;
            deleteBtn.disabled = false;
        }
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
