// FinScope - Dashboard Principal
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación usando el config.js
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
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
    try {
        // Configurar fecha actual en el formulario
        const fechaInput = document.getElementById('fecha');
        if (fechaInput) {
            const today = new Date().toISOString().split('T')[0];
            fechaInput.value = today;
        }
        
        // Cargar categorías disponibles
        await loadCategories();
        
        // Cargar transacciones existentes
        await loadTransactions();
        
        // Actualizar métricas con datos reales
        await updateMetrics();
        
        // Inicializar gráfica de balance
        await initBalanceChart();
        
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
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
        
        if (response.success) {
            // Guardar categorías en localStorage para uso en formularios
            localStorage.setItem('categories', JSON.stringify(response.categories));
            
            // Actualizar select de categorías si existe
            updateCategorySelects(response.categories);
        }
    } catch (error) {
        console.error('Error al cargar categorías:', error);
        throw error;
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
    
    try {
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
        
        if (response.success) {
            showSuccessMessage('Transacción creada exitosamente');
            
            // Recargar datos
            await loadTransactions();
            await updateMetrics();
            await initBalanceChart();
            
            // Limpiar formulario
            document.getElementById('transaccionForm').reset();
            document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
        }
        
    } catch (error) {
        console.error('Error al crear transacción:', error);
        showErrorMessage('Error al crear la transacción');
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
    if (!balanceCtx) return;
    
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
            const transactionDate = t.TransactionDate || t.fecha;
            const mes = transactionDate.substring(0, 7); // YYYY-MM
            if (!balanceMensual[mes]) {
                balanceMensual[mes] = 0;
            }
            if (t.Type === 'ingreso' || t.tipo === 'ingreso') {
                balanceMensual[mes] += parseFloat(t.Amount || t.monto);
            } else {
                balanceMensual[mes] -= parseFloat(t.Amount || t.monto);
            }
        });
        
        const meses = Object.keys(balanceMensual).sort();
        const balances = meses.map(mes => balanceMensual[mes]);
        
        // Crear gráfica
        new Chart(balanceCtx, {
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
    new Chart(ctx, {
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

// Manejar logout
function handleLogout() {
    logout(); // Usar función del config.js
}
