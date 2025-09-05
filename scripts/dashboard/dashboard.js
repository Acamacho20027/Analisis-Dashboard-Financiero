// FinScope - Dashboard Principal
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación usando el config.js
    if (!isAuthenticated()) {
        window.location.href = '/views/index.html';
        return;
    }
    
    // Inicializar la aplicación
    initApp();
    
    // Configurar event listeners
    setupEventListeners();
});

// Usar funciones del config.js

// Inicializar la aplicación
async function initApp() {
    console.log('Iniciando aplicación...');
    
    try {
        // Configurar fecha actual en el formulario
        const fechaInput = document.getElementById('fecha');
        if (fechaInput) {
            const today = new Date().toISOString().split('T')[0];
            fechaInput.value = today;
            console.log('Fecha configurada:', today);
        }
        
        // Cargar categorías disponibles
        console.log('Cargando categorías...');
        try {
            await loadCategories();
            console.log('Categorías cargadas correctamente');
        } catch (error) {
            console.warn('Error al cargar categorías:', error);
        }
        
        // Cargar transacciones existentes
        console.log('Cargando transacciones...');
        try {
            await loadTransactions();
            console.log('Transacciones cargadas correctamente');
        } catch (error) {
            console.warn('Error al cargar transacciones:', error);
        }
        
        // Actualizar métricas con datos reales
        console.log('Actualizando métricas...');
        try {
            await updateMetrics();
            console.log('Métricas actualizadas correctamente');
        } catch (error) {
            console.warn('Error al actualizar métricas:', error);
        }
        
        // Inicializar gráfica de balance
        console.log('Inicializando gráfica de balance...');
        try {
            await initBalanceChart();
            console.log('Gráfica de balance inicializada correctamente');
        } catch (error) {
            console.warn('Error al inicializar gráfica de balance:', error);
        }
        
        // Inicializar gráfica de balance anual
        console.log('Inicializando gráfica de balance anual...');
        try {
            await initAnnualBalanceChart();
            console.log('Gráfica de balance anual inicializada correctamente');
        } catch (error) {
            console.warn('Error al inicializar gráfica de balance anual:', error);
        }
        
        console.log('Aplicación inicializada correctamente');
        
    } catch (error) {
        console.error('Error crítico al inicializar la aplicación:', error);
        showErrorMessage('Error al cargar los datos del dashboard');
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Formulario de transacción
    const transaccionForm = document.getElementById('transaccionForm');
    if (transaccionForm) {
        transaccionForm.addEventListener('submit', handleNewTransaction);
    }
    
    // Actualizar categorías cuando cambie el tipo
    const tipoSelect = document.getElementById('tipo');
    if (tipoSelect) {
        tipoSelect.addEventListener('change', updateCategoriesByType);
    }
    
    // Botón de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Actualizar categorías según el tipo seleccionado
function updateCategoriesByType() {
    const tipoSelect = document.getElementById('tipo');
    const categoriaSelect = document.getElementById('categoria');
    
    if (!tipoSelect || !categoriaSelect) return;
    
    const selectedType = tipoSelect.value;
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    
    // Limpiar opciones existentes
    categoriaSelect.innerHTML = '';
    
    // Agregar opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecciona una categoría';
    categoriaSelect.appendChild(defaultOption);
    
    if (selectedType) {
        // Filtrar categorías por tipo
        const filteredCategories = categories.filter(c => c.Type === selectedType);
        
        filteredCategories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.Id;
            option.textContent = cat.Name;
            categoriaSelect.appendChild(option);
        });
    }
}

// Cargar categorías disponibles
async function loadCategories() {
    try {
        const response = await apiRequest('/api/categories');
        
        if (response && response.success) {
            // Guardar categorías en localStorage para uso en formularios
            localStorage.setItem('categories', JSON.stringify(response.categories));
            
            // Actualizar select de categorías si existe
            updateCategorySelects(response.categories);
        } else {
            console.warn('No se pudieron cargar las categorías:', response?.error);
        }
    } catch (error) {
        console.error('Error al cargar categorías:', error);
        // No lanzar la excepción, solo registrar el error
    }
}

// Actualizar selects de categorías
function updateCategorySelects(categories) {
    const categoriaSelect = document.getElementById('categoria');
    if (!categoriaSelect) return;
    
    // Limpiar opciones existentes
    categoriaSelect.innerHTML = '';
    
    // Agregar opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecciona una categoría';
    categoriaSelect.appendChild(defaultOption);
    
    // Agrupar categorías por tipo
    const ingresos = categories.filter(c => c.Type === 'ingreso');
    const gastos = categories.filter(c => c.Type === 'gasto');
    
    // Agregar categorías de ingresos
    if (ingresos.length > 0) {
        const ingresosGroup = document.createElement('optgroup');
        ingresosGroup.label = 'Ingresos';
        ingresos.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.Id;
            option.textContent = cat.Name;
            ingresosGroup.appendChild(option);
        });
        categoriaSelect.appendChild(ingresosGroup);
    }
    
    // Agregar categorías de gastos
    if (gastos.length > 0) {
        const gastosGroup = document.createElement('optgroup');
        gastosGroup.label = 'Gastos';
        gastos.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.Id;
            option.textContent = cat.Name;
            gastosGroup.appendChild(option);
        });
        categoriaSelect.appendChild(gastosGroup);
    }
}

// Cargar transacciones desde la base de datos
async function loadTransactions() {
    try {
        const response = await apiRequest('/api/transactions');
        
        if (response.success) {
            // Guardar transacciones en localStorage para uso en gráficas
            localStorage.setItem('transacciones', JSON.stringify(response.transactions));
            return response.transactions;
        }
        
        return [];
    } catch (error) {
        console.error('Error al cargar transacciones:', error);
        return [];
    }
}

// Manejar nueva transacción
async function handleNewTransaction(e) {
    e.preventDefault();
    
    const fecha = document.getElementById('fecha').value;
    const categoryId = document.getElementById('categoria').value;
    const monto = parseFloat(document.getElementById('monto').value);
    const tipo = document.getElementById('tipo').value;
    const descripcion = document.getElementById('descripcion')?.value || '';
    
    if (!fecha || !categoryId || !monto || !tipo) {
        showErrorMessage('Por favor completa todos los campos');
        return;
    }
    
    // Mostrar indicador de carga
    const submitBtn = document.querySelector('#transaccionForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creando...';
    submitBtn.disabled = true;
    
    try {
        console.log('Iniciando creación de transacción...');
        
        // Crear transacción en la base de datos
        const response = await apiRequest('/api/transactions', {
            method: 'POST',
            body: JSON.stringify({
                amount: monto,
                type: tipo,
                categoryId: parseInt(categoryId),
                description: descripcion,
                transactionDate: fecha
            })
        });
        
        console.log('Respuesta del servidor:', response);
        
        if (response && response.success) {
            console.log('Transacción creada exitosamente, actualizando dashboard...');
            showSuccessMessage('Transacción creada exitosamente');
            
            // Limpiar formulario primero
            document.getElementById('transaccionForm').reset();
            document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
            console.log('Formulario limpiado');
            
            // Intentar actualizar el dashboard, pero no fallar si hay error
            try {
                await refreshDashboard();
                console.log('Dashboard actualizado correctamente');
            } catch (refreshError) {
                console.warn('Error al actualizar dashboard, pero la transacción se creó:', refreshError);
                // No mostrar error al usuario ya que la transacción se creó correctamente
            }
        } else {
            // Mostrar error específico del servidor
            const errorMsg = response?.error || 'Error desconocido';
            console.error('Error del servidor:', errorMsg);
            showErrorMessage('Error al crear la transacción: ' + errorMsg);
        }
        
    } catch (error) {
        console.error('Error inesperado al crear transacción:', error);
        console.error('Stack trace:', error.stack);
        showErrorMessage('Error inesperado. Por favor intenta nuevamente.');
    } finally {
        // Restaurar botón
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Actualizar métricas con datos reales de la base de datos
async function updateMetrics() {
    try {
        // Obtener resumen de transacciones del mes actual
        const response = await apiRequest('/api/transactions/summary?period=month');
        
        if (response.success) {
            const summary = response.summary;
            
            // Actualizar elementos en el DOM
            updateMetricElement('balanceTotal', summary.balance);
            updateMetricElement('ingresosMes', summary.ingresos);
            updateMetricElement('gastosMes', summary.gastos);
            updateMetricElement('ahorroMes', summary.balance); // El balance es el ahorro
            
            // Calcular porcentajes de cambio (simulado por ahora)
            updateMetricChange('balanceChange', '+12.5%', 'positive');
            updateMetricChange('ingresosChange', '+8.2%', 'positive');
            updateMetricChange('gastosChange', '-5.1%', 'negative');
            updateMetricChange('ahorroChange', '+15.3%', 'positive');
        }
    } catch (error) {
        console.error('Error al actualizar métricas:', error);
        // Usar datos del localStorage como fallback
        updateMetricsFromLocalStorage();
    }
}

// Actualizar elemento de métrica
function updateMetricElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = `$${value.toFixed(2)}`;
    }
}

// Actualizar cambio de métrica
function updateMetricChange(elementId, change, type) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = change;
        element.className = `metric-change ${type}`;
    }
}

// Fallback: actualizar métricas desde localStorage
function updateMetricsFromLocalStorage() {
    const transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
    
    const totalIngresos = transacciones
        .filter(t => t.Type === 'ingreso')
        .reduce((sum, t) => sum + parseFloat(t.Amount), 0);
    
    const totalGastos = transacciones
        .filter(t => t.Type === 'gasto')
        .reduce((sum, t) => sum + parseFloat(t.Amount), 0);
    
    const balanceTotal = totalIngresos - totalGastos;
    
    updateMetricElement('balanceTotal', balanceTotal);
    updateMetricElement('ingresosMes', totalIngresos);
    updateMetricElement('gastosMes', totalGastos);
    updateMetricElement('ahorroMes', balanceTotal);
}

// Inicializar gráfica de balance con datos reales
async function initBalanceChart() {
    const balanceCtx = document.getElementById('balanceChart');
    if (!balanceCtx) {
        console.warn('No se encontró el elemento balanceChart');
        return;
    }
    
    // Destruir gráfico existente si existe
    if (window.balanceChart) {
        try {
            window.balanceChart.destroy();
        } catch (error) {
            console.warn('Error al destruir gráfico existente:', error);
        }
    }
    
    try {
        // Obtener transacciones de los últimos 6 meses
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 6);
        
        const response = await apiRequest(`/api/transactions?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`);
        
        let transacciones = [];
        if (response.success) {
            transacciones = response.transactions;
        } else {
            // Fallback: usar datos del localStorage
            transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
        }
        
        // Agrupar por mes
        const balanceMensual = {};
        transacciones.forEach(t => {
            try {
                const transactionDate = t.TransactionDate || t.fecha;
                if (!transactionDate) return;
                
                const mes = transactionDate.substring(0, 7); // YYYY-MM
                if (!balanceMensual[mes]) {
                    balanceMensual[mes] = 0;
                }
                if (t.Type === 'ingreso' || t.tipo === 'ingreso') {
                    balanceMensual[mes] += parseFloat(t.Amount || t.monto || 0);
                } else {
                    balanceMensual[mes] -= parseFloat(t.Amount || t.monto || 0);
                }
            } catch (error) {
                console.warn('Error procesando transacción:', t, error);
            }
        });
        
        const meses = Object.keys(balanceMensual).sort();
        const balances = meses.map(mes => balanceMensual[mes]);
        
        // Verificar que Chart.js esté disponible
        if (typeof Chart === 'undefined') {
            console.error('Chart.js no está disponible');
            return;
        }
        
        // Crear gráfica
        window.balanceChart = new Chart(balanceCtx, {
            type: 'line',
            data: {
                labels: meses.map(mes => {
                    const [year, month] = mes.split('-');
                    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                    return `${monthNames[parseInt(month) - 1]} ${year}`;
                }),
                datasets: [{
                    label: 'Balance Mensual',
                    data: balances,
                    borderColor: '#1e40af',
                    backgroundColor: 'rgba(30, 64, 175, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f3f4f6'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
        
    } catch (error) {
        console.error('Error al inicializar gráfica:', error);
        // Crear gráfica vacía en caso de error
        createEmptyChart(balanceCtx);
    }
}

// Crear gráfica vacía en caso de error
function createEmptyChart(ctx) {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js no está disponible para gráfico vacío');
        return;
    }
    
    window.balanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
                label: 'Balance Mensual',
                data: [0, 0, 0, 0, 0, 0],
                borderColor: '#1e40af',
                backgroundColor: 'rgba(30, 64, 175, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f3f4f6'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Inicializar gráfica de balance anual
async function initAnnualBalanceChart() {
    const balanceAnualCtx = document.getElementById('balanceAnualChart');
    if (!balanceAnualCtx) {
        console.warn('No se encontró el elemento balanceAnualChart');
        return;
    }
    
    // Destruir gráfico existente si existe
    if (window.balanceAnualChart) {
        try {
            window.balanceAnualChart.destroy();
        } catch (error) {
            console.warn('Error al destruir gráfico anual existente:', error);
        }
    }
    
    try {
        // Obtener transacciones del año actual
        const currentYear = new Date().getFullYear();
        const startDate = `${currentYear}-01-01`;
        const endDate = `${currentYear}-12-31`;
        
        const response = await apiRequest(`/api/transactions?startDate=${startDate}&endDate=${endDate}`);
        
        let transacciones = [];
        if (response.success) {
            transacciones = response.transactions;
        } else {
            // Fallback: usar datos del localStorage
            transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
        }
        
        // Calcular balance anual
        let totalIngresos = 0;
        let totalGastos = 0;
        
        transacciones.forEach(t => {
            try {
                const monto = parseFloat(t.Amount || t.monto || 0);
                if (t.Type === 'ingreso' || t.tipo === 'ingreso') {
                    totalIngresos += monto;
                } else {
                    totalGastos += monto;
                }
            } catch (error) {
                console.warn('Error procesando transacción para balance anual:', t, error);
            }
        });
        
        const balanceAnual = totalIngresos - totalGastos;
        
        // Actualizar métricas del balance anual
        updateMetricElement('balanceAnual', balanceAnual);
        updateMetricElement('ingresosAnuales', totalIngresos);
        updateMetricElement('gastosAnuales', totalGastos);
        
        // Calcular cambio porcentual (simulado)
        const cambioPorcentual = balanceAnual > 0 ? '+15.2%' : '-8.5%';
        const tipoCambio = balanceAnual > 0 ? 'positive' : 'negative';
        updateMetricChange('balanceAnualChange', cambioPorcentual, tipoCambio);
        
        // Agrupar por mes para el gráfico
        const balanceMensual = {};
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        
        // Inicializar todos los meses con 0
        for (let i = 0; i < 12; i++) {
            balanceMensual[i] = 0;
        }
        
        transacciones.forEach(t => {
            try {
                const transactionDate = t.TransactionDate || t.fecha;
                if (transactionDate) {
                    const mes = new Date(transactionDate).getMonth();
                    const monto = parseFloat(t.Amount || t.monto || 0);
                    
                    if (t.Type === 'ingreso' || t.tipo === 'ingreso') {
                        balanceMensual[mes] += monto;
                    } else {
                        balanceMensual[mes] -= monto;
                    }
                }
            } catch (error) {
                console.warn('Error procesando transacción para gráfico anual:', t, error);
            }
        });
        
        // Verificar que Chart.js esté disponible
        if (typeof Chart === 'undefined') {
            console.error('Chart.js no está disponible para gráfico anual');
            return;
        }
        
        // Crear gráfica de barras para el balance anual
        window.balanceAnualChart = new Chart(balanceAnualCtx, {
            type: 'bar',
            data: {
                labels: meses,
                datasets: [{
                    label: 'Balance Mensual',
                    data: Object.values(balanceMensual),
                    backgroundColor: Object.values(balanceMensual).map(val => 
                        val >= 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'
                    ),
                    borderColor: Object.values(balanceMensual).map(val => 
                        val >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
                    ),
                    borderWidth: 2,
                    borderRadius: 6,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.y;
                                return `Balance: $${value.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f3f4f6'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toFixed(0);
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
        
    } catch (error) {
        console.error('Error al inicializar gráfica anual:', error);
        // Crear gráfica vacía en caso de error
        createEmptyAnnualChart(balanceAnualCtx);
    }
}

// Crear gráfica vacía para balance anual
function createEmptyAnnualChart(ctx) {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js no está disponible para gráfico anual vacío');
        return;
    }
    
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    window.balanceAnualChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: meses,
            datasets: [{
                label: 'Balance Mensual',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(156, 163, 175, 0.3)',
                borderColor: 'rgba(156, 163, 175, 1)',
                borderWidth: 2,
                borderRadius: 6,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f3f4f6'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Función para refrescar todo el dashboard
async function refreshDashboard() {
    try {
        console.log('Iniciando actualización del dashboard...');
        
        // Recargar transacciones
        console.log('Recargando transacciones...');
        await loadTransactions();
        
        // Actualizar métricas
        console.log('Actualizando métricas...');
        await updateMetrics();
        
        // Reinicializar gráficas
        console.log('Reinicializando gráficas...');
        await initBalanceChart();
        await initAnnualBalanceChart();
        
        console.log('Dashboard actualizado correctamente');
    } catch (error) {
        console.error('Error al actualizar dashboard:', error);
        console.error('Stack trace del error:', error.stack);
        throw error;
    }
}

// Manejar logout
function handleLogout() {
    logout(); // Usar función del config.js
}
