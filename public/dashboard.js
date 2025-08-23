// FinScope - Dashboard Principal
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    if (localStorage.getItem('usuarioAutenticado') !== 'true') {
        window.location.href = 'index.html';
        return;
    }
    
    // Inicializar la aplicación
    initApp();
    
    // Configurar event listeners
    setupEventListeners();
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
    
    // Inicializar gráfica de balance
    initBalanceChart();
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
}

// Cargar transacciones
function loadTransactions() {
    const transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
    return transacciones;
}

// Manejar nueva transacción
function handleNewTransaction(e) {
    e.preventDefault();
    
    const fecha = document.getElementById('fecha').value;
    const categoria = document.getElementById('categoria').value;
    const monto = parseFloat(document.getElementById('monto').value);
    const tipo = document.getElementById('tipo').value;
    
    if (!fecha || !categoria || !monto || !tipo) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    const transaccion = {
        id: Date.now(),
        fecha: fecha,
        categoria: categoria,
        monto: monto,
        tipo: tipo,
        descripcion: `${categoria} - ${tipo}`
    };
    
    // Obtener transacciones existentes
    let transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
    transacciones.unshift(transaccion);
    
    // Guardar en localStorage
    localStorage.setItem('transacciones', JSON.stringify(transacciones));
    
    // Actualizar métricas y gráfica
    updateMetrics();
    initBalanceChart();
    
    // Limpiar formulario
    document.getElementById('transaccionForm').reset();
    document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
    
    alert('Transacción agregada exitosamente');
}

// Actualizar métricas
function updateMetrics() {
    const transacciones = loadTransactions();
    
    const totalIngresos = transacciones
        .filter(t => t.tipo === 'ingreso')
        .reduce((sum, t) => sum + t.monto, 0);
    
    const totalGastos = transacciones
        .filter(t => t.tipo === 'gasto')
        .reduce((sum, t) => sum + t.monto, 0);
    
    const balanceTotal = totalIngresos - totalGastos;
    
    // Actualizar elementos en el DOM
    const balanceTotalElement = document.getElementById('balanceTotal');
    const ingresosMesElement = document.getElementById('ingresosMes');
    const gastosMesElement = document.getElementById('gastosMes');
    
    if (balanceTotalElement) balanceTotalElement.textContent = `$${balanceTotal.toFixed(2)}`;
    if (ingresosMesElement) ingresosMesElement.textContent = `$${totalIngresos.toFixed(2)}`;
    if (gastosMesElement) gastosMesElement.textContent = `$${totalGastos.toFixed(2)}`;
}

// Inicializar gráfica de balance
function initBalanceChart() {
    const balanceCtx = document.getElementById('balanceChart');
    if (!balanceCtx) return;
    
    const transacciones = loadTransactions();
    
    // Agrupar por mes
    const balanceMensual = {};
    transacciones.forEach(t => {
        const mes = t.fecha.substring(0, 7); // YYYY-MM
        if (!balanceMensual[mes]) {
            balanceMensual[mes] = 0;
        }
        if (t.tipo === 'ingreso') {
            balanceMensual[mes] += t.monto;
        } else {
            balanceMensual[mes] -= t.monto;
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
}

// Manejar logout
function handleLogout() {
    localStorage.removeItem('usuarioAutenticado');
    window.location.href = 'index.html';
}
