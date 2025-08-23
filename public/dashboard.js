// Dashboard principal de FinanzApp
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard cargando...');
    console.log('Estado de autenticación:', localStorage.getItem('isAuthenticated'));
    
    // Verificar autenticación
    if (localStorage.getItem('isAuthenticated') !== 'true') {
        // Mostrar mensaje de error y redirigir
        document.body.innerHTML = `
            <div class="min-h-screen bg-gray-50 flex items-center justify-center">
                <div class="bg-white p-8 rounded-lg shadow-md text-center">
                    <h1 class="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
                    <p class="text-gray-600 mb-6">No tienes permisos para acceder al dashboard.</p>
                    <button onclick="window.location.href='/'" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        Volver al Login
                    </button>
                </div>
            </div>
        `;
        return;
    }
    
    // Inicializar la aplicación
    initApp();
    
    // Event listeners
    setupEventListeners();
    
    // Cargar datos iniciales
    loadInitialData();
});

// Inicializar la aplicación
function initApp() {
    // Configurar fecha actual en el formulario
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        const today = new Date().toISOString().split('T')[0];
        fechaInput.value = today;
    }
    
    // Cargar transacciones existentes
    loadTransactions();
    
    // Actualizar métricas
    updateMetrics();
    
    // Inicializar gráficas
    initCharts();
}

// Configurar event listeners
function setupEventListeners() {
    // Formulario de transacción
    const transaccionForm = document.getElementById('transaccionForm');
    if (transaccionForm) {
        transaccionForm.addEventListener('submit', handleNewTransaction);
    }
    
    // Botón de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Botón ver más transacciones
    const verMasBtn = document.getElementById('verMasBtn');
    if (verMasBtn) {
        verMasBtn.addEventListener('click', showAllTransactions);
    }
    
    // Botones de exportación
    const exportarPDFBtn = document.getElementById('exportarPDF');
    if (exportarPDFBtn) {
        exportarPDFBtn.addEventListener('click', exportToPDF);
    }
    
    const exportarExcelBtn = document.getElementById('exportarExcel');
    if (exportarExcelBtn) {
        exportarExcelBtn.addEventListener('click', exportToExcel);
    }
}

// Cargar datos iniciales
function loadInitialData() {
    // Cargar transacciones de ejemplo si no existen
    if (!localStorage.getItem('transactions')) {
        loadSampleData();
    }
}

// Cargar datos de ejemplo
function loadSampleData() {
    const sampleTransactions = [
        {
            id: 1,
            fecha: '2024-01-15',
            categoria: 'salario',
            monto: 2500.00,
            tipo: 'ingreso',
            descripcion: 'Salario mensual'
        },
        {
            id: 2,
            fecha: '2024-01-16',
            categoria: 'alimentacion',
            monto: 45.50,
            tipo: 'gasto',
            descripcion: 'Supermercado'
        },
        {
            id: 3,
            fecha: '2024-01-17',
            categoria: 'transporte',
            monto: 25.00,
            tipo: 'gasto',
            descripcion: 'Gasolina'
        },
        {
            id: 4,
            fecha: '2024-01-18',
            categoria: 'entretenimiento',
            monto: 80.00,
            tipo: 'gasto',
            descripcion: 'Cine y cena'
        },
        {
            id: 5,
            fecha: '2024-01-19',
            categoria: 'inversiones',
            monto: 500.00,
            tipo: 'ingreso',
            descripcion: 'Dividendos'
        }
    ];
    
    localStorage.setItem('transactions', JSON.stringify(sampleTransactions));
}

// Manejar nueva transacción
function handleNewTransaction(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const transaction = {
        id: Date.now(),
        fecha: formData.get('fecha'),
        categoria: formData.get('categoria'),
        monto: parseFloat(formData.get('monto')),
        tipo: formData.get('tipo'),
        descripcion: formData.get('descripcion') || 'Sin descripción'
    };
    
    // Validar transacción
    if (!transaction.fecha || !transaction.categoria || !transaction.monto || !transaction.tipo) {
        showMessage('Por favor, completa todos los campos', 'error');
        return;
    }
    
    // Agregar transacción
    addTransaction(transaction);
    
    // Limpiar formulario
    e.target.reset();
    
    // Restaurar fecha actual
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        const today = new Date().toISOString().split('T')[0];
        fechaInput.value = today;
    }
    
    // Actualizar interfaz
    updateMetrics();
    loadTransactions();
    updateCharts();
    
    showMessage('Transacción agregada exitosamente', 'success');
}

// Agregar transacción al localStorage
function addTransaction(transaction) {
    const transactions = getTransactions();
    transactions.unshift(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Obtener transacciones del localStorage
function getTransactions() {
    const transactions = localStorage.getItem('transactions');
    return transactions ? JSON.parse(transactions) : [];
}

// Cargar transacciones en la interfaz
function loadTransactions() {
    const transactions = getTransactions();
    const container = document.getElementById('transaccionesList');
    
    if (!container) return;
    
    // Mostrar solo las primeras 5 transacciones
    const recentTransactions = transactions.slice(0, 5);
    
    container.innerHTML = recentTransactions.map(transaction => `
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-4">
                <div class="w-10 h-10 ${transaction.tipo === 'ingreso' ? 'bg-green-100' : 'bg-red-100'} rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 ${transaction.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${transaction.tipo === 'ingreso' ? 'M7 11l5-5m0 0l5 5m-5-5v12' : 'M7 13l5 5m0 0l5-5m-5 5V6'}"></path>
                    </svg>
                </div>
                <div>
                    <p class="font-medium text-gray-800">${getCategoryName(transaction.categoria)}</p>
                    <p class="text-sm text-gray-500">${formatDate(transaction.fecha)}</p>
                </div>
            </div>
            <div class="text-right">
                <p class="font-semibold ${transaction.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}">
                    ${transaction.tipo === 'ingreso' ? '+' : '-'}$${transaction.monto.toFixed(2)}
                </p>
                <p class="text-xs text-gray-500 capitalize">${transaction.tipo}</p>
            </div>
        </div>
    `).join('');
}

// Mostrar todas las transacciones
function showAllTransactions() {
    const transactions = getTransactions();
    const container = document.getElementById('transaccionesList');
    
    if (!container) return;
    
    container.innerHTML = transactions.map(transaction => `
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-4">
                <div class="w-10 h-10 ${transaction.tipo === 'ingreso' ? 'bg-green-100' : 'bg-red-100'} rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 ${transaction.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${transaction.tipo === 'ingreso' ? 'M7 11l5-5m0 0l5 5m-5-5v12' : 'M7 13l5 5m0 0l5-5m-5 5V6'}"></path>
                    </svg>
                </div>
                <div>
                    <p class="font-medium text-gray-800">${getCategoryName(transaction.categoria)}</p>
                    <p class="text-sm text-gray-500">${formatDate(transaction.fecha)}</p>
                    <p class="text-xs text-gray-400">${transaction.descripcion}</p>
                </div>
            </div>
            <div class="text-right">
                <p class="font-semibold ${transaction.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}">
                    ${transaction.tipo === 'ingreso' ? '+' : '-'}$${transaction.monto.toFixed(2)}
                </p>
                <p class="text-xs text-gray-500 capitalize">${transaction.tipo}</p>
            </div>
        </div>
    `).join('');
    
    // Cambiar texto del botón
    const verMasBtn = document.getElementById('verMasBtn');
    if (verMasBtn) {
        verMasBtn.textContent = 'Ver menos';
        verMasBtn.onclick = () => {
            loadTransactions();
            verMasBtn.textContent = 'Ver más';
            verMasBtn.onclick = showAllTransactions;
        };
    }
}

// Actualizar métricas
function updateMetrics() {
    const transactions = getTransactions();
    const currentMonth = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0');
    
    let balanceTotal = 0;
    let ingresosMes = 0;
    let gastosMes = 0;
    
    transactions.forEach(transaction => {
        if (transaction.tipo === 'ingreso') {
            balanceTotal += transaction.monto;
            if (transaction.fecha.startsWith(currentMonth)) {
                ingresosMes += transaction.monto;
            }
        } else {
            balanceTotal -= transaction.monto;
            if (transaction.fecha.startsWith(currentMonth)) {
                gastosMes += transaction.monto;
            }
        }
    });
    
    // Actualizar elementos en la interfaz
    const balanceTotalEl = document.getElementById('balanceTotal');
    const ingresosMesEl = document.getElementById('ingresosMes');
    const gastosMesEl = document.getElementById('gastosMes');
    
    if (balanceTotalEl) balanceTotalEl.textContent = `$${balanceTotal.toFixed(2)}`;
    if (ingresosMesEl) ingresosMesEl.textContent = `$${ingresosMes.toFixed(2)}`;
    if (gastosMesEl) gastosMesEl.textContent = `$${gastosMes.toFixed(2)}`;
}

// Inicializar gráficas
function initCharts() {
    initBalanceChart();
    initCategoriaChart();
    initIngresosGastosChart();
}

// Gráfica de balance mensual
function initBalanceChart() {
    const ctx = document.getElementById('balanceChart');
    if (!ctx) return;
    
    const transactions = getTransactions();
    const monthlyData = getMonthlyBalance(transactions);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthlyData.labels,
            datasets: [{
                label: 'Balance Mensual',
                data: monthlyData.balances,
                borderColor: '#1e40af',
                backgroundColor: 'rgba(30, 64, 175, 0.1)',
                tension: 0.4,
                fill: true
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
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}

// Gráfica de gastos por categoría
function initCategoriaChart() {
    const ctx = document.getElementById('categoriaChart');
    if (!ctx) return;
    
    const transactions = getTransactions();
    const categoryData = getCategoryData(transactions);
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categoryData.labels,
            datasets: [{
                data: categoryData.values,
                backgroundColor: [
                    '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Gráfica de ingresos vs gastos mensual
function initIngresosGastosChart() {
    const ctx = document.getElementById('ingresosGastosChart');
    if (!ctx) return;
    
    const transactions = getTransactions();
    const monthlyData = getMonthlyIncomeExpenses(transactions);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthlyData.labels,
            datasets: [
                {
                    label: 'Ingresos',
                    data: monthlyData.ingresos,
                    backgroundColor: '#22c55e',
                    borderColor: '#16a34a',
                    borderWidth: 1
                },
                {
                    label: 'Gastos',
                    data: monthlyData.gastos,
                    backgroundColor: '#ef4444',
                    borderColor: '#dc2626',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}

// Actualizar gráficas
function updateCharts() {
    // Destruir gráficas existentes y recrearlas
    Chart.helpers.each(Chart.instances, function(instance) {
        instance.destroy();
    });
    
    initCharts();
}

// Obtener datos de balance mensual
function getMonthlyBalance(transactions) {
    const monthlyData = {};
    
    transactions.forEach(transaction => {
        const month = transaction.fecha.substring(0, 7); // YYYY-MM
        if (!monthlyData[month]) {
            monthlyData[month] = 0;
        }
        
        if (transaction.tipo === 'ingreso') {
            monthlyData[month] += transaction.monto;
        } else {
            monthlyData[month] -= transaction.monto;
        }
    });
    
    const labels = Object.keys(monthlyData).sort();
    const balances = labels.map(month => monthlyData[month]);
    
    return { labels, balances };
}

// Obtener datos por categoría
function getCategoryData(transactions) {
    const categoryData = {};
    
    transactions.forEach(transaction => {
        if (transaction.tipo === 'gasto') {
            const category = transaction.categoria;
            categoryData[category] = (categoryData[category] || 0) + transaction.monto;
        }
    });
    
    const labels = Object.keys(categoryData).map(cat => getCategoryName(cat));
    const values = Object.values(categoryData);
    
    return { labels, values };
}

// Obtener datos de ingresos vs gastos mensual
function getMonthlyIncomeExpenses(transactions) {
    const monthlyData = {};
    
    transactions.forEach(transaction => {
        const month = transaction.fecha.substring(0, 7);
        if (!monthlyData[month]) {
            monthlyData[month] = { ingresos: 0, gastos: 0 };
        }
        
        if (transaction.tipo === 'ingreso') {
            monthlyData[month].ingresos += transaction.monto;
        } else {
            monthlyData[month].gastos += transaction.monto;
        }
    });
    
    const labels = Object.keys(monthlyData).sort();
    const ingresos = labels.map(month => monthlyData[month].ingresos);
    const gastos = labels.map(month => monthlyData[month].gastos);
    
    return { labels, ingresos, gastos };
}

// Exportar a PDF
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const transactions = getTransactions();
    
    // Título
    doc.setFontSize(20);
    doc.text('Reporte de Transacciones FinanzApp', 20, 20);
    
    // Fecha del reporte
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 35);
    
    // Tabla de transacciones
    let yPosition = 50;
    
    transactions.forEach((transaction, index) => {
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
        }
        
        doc.setFontSize(10);
        doc.text(`${index + 1}. ${getCategoryName(transaction.categoria)}`, 20, yPosition);
        doc.text(`${formatDate(transaction.fecha)}`, 80, yPosition);
        doc.text(`$${transaction.monto.toFixed(2)}`, 130, yPosition);
        doc.text(transaction.tipo, 170, yPosition);
        
        yPosition += 10;
    });
    
    // Guardar PDF
    doc.save('reporte-transacciones.pdf');
    showMessage('Reporte PDF exportado exitosamente', 'success');
}

// Exportar a Excel
function exportToExcel() {
    const transactions = getTransactions();
    
    // Preparar datos para Excel
    const excelData = [
        ['#', 'Fecha', 'Categoría', 'Monto', 'Tipo', 'Descripción']
    ];
    
    transactions.forEach((transaction, index) => {
        excelData.push([
            index + 1,
            formatDate(transaction.fecha),
            getCategoryName(transaction.categoria),
            transaction.monto,
            transaction.tipo,
            transaction.descripcion
        ]);
    });
    
    // Crear workbook y worksheet
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transacciones');
    
    // Guardar archivo
    XLSX.writeFile(wb, 'transacciones.xlsx');
    showMessage('Reporte Excel exportado exitosamente', 'success');
}

// Manejar logout
function handleLogout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}

// Funciones auxiliares
function getCategoryName(category) {
    const categories = {
        'alimentacion': 'Alimentación',
        'transporte': 'Transporte',
        'entretenimiento': 'Entretenimiento',
        'servicios': 'Servicios',
        'salario': 'Salario',
        'inversiones': 'Inversiones'
    };
    return categories[category] || category;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
}

function showMessage(message, type) {
    // Remover mensajes existentes
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Crear nuevo mensaje
    const messageElement = document.createElement('div');
    messageElement.className = `message fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
        type === 'error' 
            ? 'bg-red-100 border border-red-400 text-red-700' 
            : 'bg-green-100 border border-green-400 text-green-700'
    }`;
    messageElement.textContent = message;
    
    // Insertar en el body
    document.body.appendChild(messageElement);
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}
