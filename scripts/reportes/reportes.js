// FinScope - Reportes
let transaccionesData = [];
let categoriasData = [];
let reportesHistorial = [];

document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    if (!localStorage.getItem('usuarioAutenticado')) {
        window.location.href = '/views/index.html';
        return;
    }

    // Configurar event listeners
    document.getElementById('downloadTransactionsPDF').addEventListener('click', () => descargarReportePDF('transacciones'));
    document.getElementById('downloadCategoriesPDF').addEventListener('click', () => descargarReportePDF('categorias'));
    document.getElementById('logoutBtn').addEventListener('click', cerrarSesion);
    
    // Cargar datos iniciales
    cargarDatosIniciales();
});

async function cargarDatosIniciales() {
    try {
        console.log('=== INICIANDO CARGA DE DATOS ===');
        
        // Verificar autenticación primero
        const token = getAuthToken();
        const usuario = JSON.parse(localStorage.getItem('usuarioAutenticado') || 'null');
        
        console.log('Estado de autenticación:', {
            token: token ? 'Presente' : 'Ausente',
            usuario: usuario ? 'Presente' : 'Ausente'
        });
        
        if (!token || !usuario) {
            console.error('Usuario no autenticado');
            mostrarError('Debes iniciar sesión para ver los reportes.');
            return;
        }
        
        // Cargar datos secuencialmente para mejor debugging
        console.log('Iniciando carga de datos...');
        
        // Intentar cargar datos reales primero
        try {
            console.log('Intentando cargar transacciones reales...');
            await cargarTransacciones();
            console.log('Transacciones reales cargadas exitosamente');
        } catch (error) {
            console.warn('Error al cargar transacciones reales, usando datos de prueba:', error);
            cargarDatosPruebaTransacciones();
        }
        
        try {
            console.log('Intentando cargar categorías reales...');
            await cargarCategorias();
            console.log('Categorías reales cargadas exitosamente');
        } catch (error) {
            console.warn('Error al cargar categorías reales, usando datos de prueba:', error);
            cargarDatosPruebaCategorias();
        }
        
        console.log('Cargando historial de reportes...');
        await cargarHistorialReportes();
        console.log('=== CARGA DE DATOS COMPLETADA ===');
        
    } catch (error) {
        console.error('Error crítico al cargar datos iniciales:', error);
        console.error('Stack trace:', error.stack);
        mostrarError(`Error crítico: ${error.message}`);
    }
}

async function cargarTransacciones() {
    try {
        console.log('Iniciando carga de transacciones...');
        const token = getAuthToken();
        console.log('Token obtenido:', token ? 'Sí' : 'No');
        
        if (!token) {
            throw new Error('Token de autenticación no encontrado');
        }
        
        // Agregar timeout para evitar carga infinita
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout: La petición tardó demasiado')), 10000);
        });
        
        const apiPromise = apiRequest('/api/transactions', 'GET');
        const response = await Promise.race([apiPromise, timeoutPromise]);
        
        console.log('Respuesta de transacciones:', response);
        
        if (response.success) {
            // La API devuelve 'transactions' no 'data'
            transaccionesData = response.transactions || [];
            console.log('Transacciones cargadas:', transaccionesData.length);
            
            if (transaccionesData.length === 0) {
                console.log('No hay transacciones en la base de datos');
                mostrarReporteTransacciones(); // Mostrará el mensaje de "Sin transacciones"
            } else {
                mostrarReporteTransacciones();
            }
        } else {
            // Manejar diferentes tipos de errores
            if (response.error && response.error.includes('Token de acceso requerido')) {
                throw new Error('Debes iniciar sesión para ver los reportes');
            } else if (response.error && response.error.includes('Token inválido')) {
                throw new Error('Tu sesión ha expirado, por favor inicia sesión nuevamente');
            } else if (response.error && response.error.includes('Error de conexión')) {
                throw new Error('Error de conexión con el servidor');
            } else {
                throw new Error(response.message || response.error || 'Error al cargar transacciones');
            }
        }
    } catch (error) {
        console.error('Error al cargar transacciones:', error);
        mostrarErrorTransacciones(`Error al cargar las transacciones: ${error.message}`);
    }
}

async function cargarCategorias() {
    try {
        console.log('Iniciando carga de categorías...');
        const token = getAuthToken();
        console.log('Token obtenido:', token ? 'Sí' : 'No');
        
        if (!token) {
            throw new Error('Token de autenticación no encontrado');
        }
        
        // Agregar timeout para evitar carga infinita
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout: La petición tardó demasiado')), 10000);
        });
        
        const apiPromise = apiRequest('/api/categories', 'GET');
        const response = await Promise.race([apiPromise, timeoutPromise]);
        
        console.log('Respuesta de categorías:', response);
        
        if (response.success) {
            // La API devuelve 'categories' no 'data'
            categoriasData = response.categories || [];
            console.log('Categorías cargadas:', categoriasData.length);
            
            if (categoriasData.length === 0) {
                console.log('No hay categorías en la base de datos');
                mostrarReporteCategorias(); // Mostrará el mensaje de "Sin categorías"
            } else {
                mostrarReporteCategorias();
            }
        } else {
            // Manejar diferentes tipos de errores
            if (response.error && response.error.includes('Token de acceso requerido')) {
                throw new Error('Debes iniciar sesión para ver los reportes');
            } else if (response.error && response.error.includes('Token inválido')) {
                throw new Error('Tu sesión ha expirado, por favor inicia sesión nuevamente');
            } else if (response.error && response.error.includes('Error de conexión')) {
                throw new Error('Error de conexión con el servidor');
            } else {
                throw new Error(response.message || response.error || 'Error al cargar categorías');
            }
        }
    } catch (error) {
        console.error('Error al cargar categorías:', error);
        mostrarErrorCategorias(`Error al cargar las categorías: ${error.message}`);
    }
}

async function cargarHistorialReportes() {
    try {
        // Por ahora usamos datos simulados, pero se puede conectar a una API real
        reportesHistorial = JSON.parse(localStorage.getItem('reportesHistorial') || '[]');
        mostrarHistorialReportes();
    } catch (error) {
        console.error('Error al cargar historial:', error);
        mostrarErrorHistorial('Error al cargar el historial');
    }
}

function mostrarReporteTransacciones() {
    const container = document.getElementById('transactionsReportContent');
    
    if (transaccionesData.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                </div>
                <h3>No hay transacciones</h3>
                <p>No se encontraron transacciones registradas en la base de datos.</p>
            </div>
        `;
        return;
    }

    // Calcular resumen
    const totalIngresos = transaccionesData.filter(t => t.Type === 'ingreso')
        .reduce((sum, t) => sum + parseFloat(t.Amount), 0);
    const totalGastos = transaccionesData.filter(t => t.Type === 'gasto')
        .reduce((sum, t) => sum + parseFloat(t.Amount), 0);
    const balance = totalIngresos - totalGastos;

    container.innerHTML = `
        <div class="report-summary">
            <div class="summary-card">
                <div class="summary-icon income">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                </div>
                <div class="summary-content">
                    <h3>Total Ingresos</h3>
                    <p class="summary-value income">$${totalIngresos.toFixed(2)}</p>
                </div>
            </div>
            
            <div class="summary-card">
                <div class="summary-icon expense">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                </div>
                <div class="summary-content">
                    <h3>Total Gastos</h3>
                    <p class="summary-value expense">$${totalGastos.toFixed(2)}</p>
                </div>
            </div>
            
            <div class="summary-card">
                <div class="summary-icon ${balance >= 0 ? 'balance-positive' : 'balance-negative'}">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                </div>
                <div class="summary-content">
                    <h3>Balance</h3>
                    <p class="summary-value ${balance >= 0 ? 'balance-positive' : 'balance-negative'}">$${balance.toFixed(2)}</p>
                </div>
            </div>
        </div>
        
        <div class="report-table-container">
            <h3>Detalle de Transacciones (${transaccionesData.length} registros)</h3>
            <div class="table-responsive">
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Categoría</th>
                            <th>Descripción</th>
                            <th>Tipo</th>
                            <th>Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${transaccionesData.map(transaccion => `
                            <tr>
                                <td>${formatearFecha(transaccion.TransactionDate)}</td>
                                <td>
                                    <span class="category-badge ${transaccion.CategoryName.toLowerCase()}">
                                        ${transaccion.CategoryName}
                                    </span>
                                </td>
                                <td>${transaccion.Description || '-'}</td>
                                <td>
                                    <span class="type-badge ${transaccion.Type}">
                                        ${transaccion.Type.charAt(0).toUpperCase() + transaccion.Type.slice(1)}
                                    </span>
                                </td>
                                <td class="amount ${transaccion.Type}">
                                    $${parseFloat(transaccion.Amount).toFixed(2)}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function mostrarReporteCategorias() {
    const container = document.getElementById('categoriesReportContent');
    
    if (categoriasData.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                </div>
                <h3>No hay categorías</h3>
                <p>No se encontraron categorías registradas en la base de datos.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="categories-grid">
            ${categoriasData.map(categoria => `
                <div class="category-card">
                    <div class="category-icon ${categoria.Name.toLowerCase()}">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                        </svg>
                    </div>
                    <div class="category-content">
                        <h3>${categoria.Name}</h3>
                        <p class="category-description">Categoría de ${categoria.Type}</p>
                        <div class="category-stats">
                            <span class="stat-item">
                                <strong>ID:</strong> ${categoria.Id}
                            </span>
                            <span class="stat-item">
                                <strong>Tipo:</strong> ${categoria.Type}
                            </span>
                            <span class="stat-item">
                                <strong>Por defecto:</strong> ${categoria.IsDefault ? 'Sí' : 'No'}
                            </span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function mostrarHistorialReportes() {
    const container = document.getElementById('reportsHistory');
    
    if (reportesHistorial.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h3>No hay reportes generados</h3>
                <p>Aún no se han generado reportes. Los reportes aparecerán aquí una vez que los descargues.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="history-list">
            ${reportesHistorial.map(reporte => `
                <div class="history-item">
                    <div class="history-info">
                        <h4>${reporte.titulo}</h4>
                        <p>Generado el ${formatearFecha(reporte.fechaGeneracion)} a las ${formatearHora(reporte.fechaGeneracion)}</p>
                        <span class="report-type">${reporte.tipo}</span>
                    </div>
                    <div class="history-actions">
                        <button class="btn btn-secondary btn-sm" onclick="redescargarReporte('${reporte.id}')">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            PDF
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarReporte('${reporte.id}')">
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

async function descargarReportePDF(tipo) {
    try {
        const boton = document.getElementById(`download${tipo.charAt(0).toUpperCase() + tipo.slice(1)}PDF`);
        const textoOriginal = boton.innerHTML;
        
        // Mostrar estado de carga
        boton.innerHTML = `
            <svg class="animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generando...
        `;
        boton.disabled = true;

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configuración del documento
        doc.setFontSize(20);
        doc.text('FinScope - Reporte Financiero', 20, 30);
        
        doc.setFontSize(12);
        doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}`, 20, 45);
        
        if (tipo === 'transacciones') {
            await generarPDFTransacciones(doc);
        } else if (tipo === 'categorias') {
            await generarPDFCategorias(doc);
        }
        
        // Guardar PDF
        const nombreArchivo = `finscope-reporte-${tipo}-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(nombreArchivo);
        
        // Agregar al historial
        agregarAlHistorial(tipo, nombreArchivo);
        
        // Restaurar botón
        boton.innerHTML = textoOriginal;
        boton.disabled = false;
        
        mostrarExito(`Reporte ${tipo} descargado exitosamente`);
        
    } catch (error) {
        console.error('Error al generar PDF:', error);
        mostrarError('Error al generar el PDF. Asegúrate de que la librería jsPDF esté cargada.');
        
        // Restaurar botón
        const boton = document.getElementById(`download${tipo.charAt(0).toUpperCase() + tipo.slice(1)}PDF`);
        boton.innerHTML = textoOriginal;
        boton.disabled = false;
    }
}

async function generarPDFTransacciones(doc) {
    if (transaccionesData.length === 0) {
            doc.setFontSize(14);
        doc.text('No hay transacciones para mostrar', 20, 70);
        return;
    }

            // Resumen
            doc.setFontSize(16);
            doc.text('Resumen de Transacciones', 20, 70);
            
    const totalIngresos = transaccionesData.filter(t => t.Type === 'ingreso')
        .reduce((sum, t) => sum + parseFloat(t.Amount), 0);
    const totalGastos = transaccionesData.filter(t => t.Type === 'gasto')
        .reduce((sum, t) => sum + parseFloat(t.Amount), 0);
            const balance = totalIngresos - totalGastos;
            
            doc.setFontSize(12);
            doc.text(`Total Ingresos: $${totalIngresos.toFixed(2)}`, 20, 85);
            doc.text(`Total Gastos: $${totalGastos.toFixed(2)}`, 20, 95);
            doc.text(`Balance: $${balance.toFixed(2)}`, 20, 105);
            
            // Tabla de transacciones
            doc.setFontSize(14);
            doc.text('Detalle de Transacciones', 20, 125);
            
            let yPos = 140;
    transaccionesData.forEach((transaccion, index) => {
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 20;
                }
                
                doc.setFontSize(10);
        doc.text(`${formatearFecha(transaccion.TransactionDate)}`, 20, yPos);
        doc.text(transaccion.CategoryName, 60, yPos);
        doc.text(transaccion.Description || '-', 100, yPos);
        doc.text(transaccion.Type, 150, yPos);
        doc.text(`$${parseFloat(transaccion.Amount).toFixed(2)}`, 170, yPos);
                
                yPos += 10;
            });
        }
        
async function generarPDFCategorias(doc) {
    if (categoriasData.length === 0) {
        doc.setFontSize(14);
        doc.text('No hay categorías para mostrar', 20, 70);
        return;
    }

    // Título
    doc.setFontSize(16);
    doc.text('Categorías Financieras', 20, 70);
    
    let yPos = 85;
    categoriasData.forEach((categoria, index) => {
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }
        
        doc.setFontSize(12);
        doc.text(`${categoria.Id}. ${categoria.Name}`, 20, yPos);
        doc.setFontSize(10);
        doc.text(`Tipo: ${categoria.Type}`, 20, yPos + 8);
        doc.text(`Por defecto: ${categoria.IsDefault ? 'Sí' : 'No'}`, 20, yPos + 16);
        
        yPos += 30;
    });
}

function agregarAlHistorial(tipo, nombreArchivo) {
    const nuevoReporte = {
        id: Date.now().toString(),
        tipo: tipo === 'transacciones' ? 'Transacciones' : 'Categorías',
        titulo: `Reporte de ${tipo === 'transacciones' ? 'Transacciones' : 'Categorías'}`,
        fechaGeneracion: new Date().toISOString(),
        nombreArchivo: nombreArchivo
    };
    
    reportesHistorial.unshift(nuevoReporte);
    localStorage.setItem('reportesHistorial', JSON.stringify(reportesHistorial));
    mostrarHistorialReportes();
}

function redescargarReporte(reporteId) {
    const reporte = reportesHistorial.find(r => r.id === reporteId);
    if (reporte) {
        // Simular redescarga (en un caso real, se regeneraría el PDF)
        mostrarExito(`Redescargando ${reporte.titulo}...`);
    }
}

function eliminarReporte(reporteId) {
    if (confirm('¿Estás seguro de que quieres eliminar este reporte del historial?')) {
        reportesHistorial = reportesHistorial.filter(r => r.id !== reporteId);
        localStorage.setItem('reportesHistorial', JSON.stringify(reportesHistorial));
        mostrarHistorialReportes();
        mostrarExito('Reporte eliminado del historial');
    }
}

function mostrarErrorTransacciones(mensaje) {
    document.getElementById('transactionsReportContent').innerHTML = `
        <div class="error-state">
            <div class="error-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <h3>Error</h3>
            <p>${mensaje}</p>
        </div>
    `;
}

function mostrarErrorCategorias(mensaje) {
    document.getElementById('categoriesReportContent').innerHTML = `
        <div class="error-state">
            <div class="error-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <h3>Error</h3>
            <p>${mensaje}</p>
        </div>
    `;
}

function mostrarErrorHistorial(mensaje) {
    document.getElementById('reportsHistory').innerHTML = `
        <div class="error-state">
            <div class="error-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <h3>Error</h3>
            <p>${mensaje}</p>
        </div>
    `;
}

function mostrarError(mensaje) {
    console.error('Error general:', mensaje);
    
    // Mostrar error en ambas secciones
    mostrarErrorTransacciones(mensaje);
    mostrarErrorCategorias(mensaje);
    
    // También mostrar un alert para que el usuario sepa que hay un problema
    alert(`Error: ${mensaje}`);
}

function mostrarExito(mensaje) {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `
        <div class="notification-content">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>${mensaje}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function cerrarSesion() {
    localStorage.removeItem('usuarioAutenticado');
    localStorage.removeItem('token');
    window.location.href = '/views/index.html';
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES');
}

function formatearHora(fecha) {
    return new Date(fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

function getCategoryName(categoria) {
    const categorias = {
        'alimentacion': 'Alimentación',
        'transporte': 'Transporte',
        'entretenimiento': 'Entretenimiento',
        'servicios': 'Servicios',
        'salario': 'Salario',
        'inversiones': 'Inversiones',
        'otros': 'Otros'
    };
    return categorias[categoria] || categoria;
}

// Usar la función apiRequest global del proyecto

// Funciones de datos de prueba
function cargarDatosPruebaTransacciones() {
    console.log('Cargando datos de prueba para transacciones...');
    transaccionesData = [
        {
            Id: 1,
            Amount: 1500.00,
            Type: 'ingreso',
            Description: 'Salario mensual',
            TransactionDate: '2024-01-15',
            CategoryName: 'Salario',
            CategoryColor: '#10b981'
        },
        {
            Id: 2,
            Amount: 300.00,
            Type: 'gasto',
            Description: 'Compra de supermercado',
            TransactionDate: '2024-01-16',
            CategoryName: 'Alimentación',
            CategoryColor: '#f59e0b'
        },
        {
            Id: 3,
            Amount: 50.00,
            Type: 'gasto',
            Description: 'Transporte público',
            TransactionDate: '2024-01-17',
            CategoryName: 'Transporte',
            CategoryColor: '#3b82f6'
        }
    ];
    mostrarReporteTransacciones();
}

function cargarDatosPruebaCategorias() {
    console.log('Cargando datos de prueba para categorías...');
    categoriasData = [
        {
            Id: 1,
            Name: 'Alimentación',
            Type: 'gasto',
            Color: '#f59e0b',
            IsDefault: true
        },
        {
            Id: 2,
            Name: 'Transporte',
            Type: 'gasto',
            Color: '#3b82f6',
            IsDefault: true
        },
        {
            Id: 3,
            Name: 'Entretenimiento',
            Type: 'gasto',
            Color: '#8b5cf6',
            IsDefault: true
        },
        {
            Id: 4,
            Name: 'Salario',
            Type: 'ingreso',
            Color: '#10b981',
            IsDefault: true
        }
    ];
    mostrarReporteCategorias();
}
