// FinScope - Categorías Financieras
document.addEventListener('DOMContentLoaded', async function() {
    // Verificar autenticación y rol primero
    await checkAuthAndRole();
    
    // Inicializar análisis de categorías después de la autenticación
    inicializarAnalisisCategorias();
    
    // Configurar logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('token');
        window.location.href = '/';
    });
});

// Verificar autenticación y rol del usuario
async function checkAuthAndRole() {
    try {
        // Verificar autenticación básica primero
        if (!isAuthenticated()) {
            window.location.href = '/';
            return;
        }

        const token = localStorage.getItem('token');
        const response = await fetch('/api/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error('Error en respuesta del servidor:', response.status);
            localStorage.removeItem('token');
            localStorage.removeItem('usuarioAutenticado');
            window.location.href = '/';
            return;
        }

        const data = await response.json();
        
        if (data.success && data.user) {
            const user = data.user;
            
            // Mostrar nombre del usuario
            const userNameElement = document.getElementById('userName');
            if (userNameElement) {
                userNameElement.textContent = `${user.firstName} ${user.lastName}`;
            }
            
            // Verificar si es administrador para mostrar menú de gestión de usuarios
            const adminMenu = document.getElementById('adminMenu');
            if (adminMenu) {
                if (user.roleId === 2) { // 2 = Administrador
                    adminMenu.style.display = 'block';
                } else {
                    adminMenu.style.display = 'none';
                }
            }
        } else {
            console.error('Error en datos de perfil:', data);
            localStorage.removeItem('token');
            localStorage.removeItem('usuarioAutenticado');
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error al verificar autenticación:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioAutenticado');
        window.location.href = '/';
    }
}

async function inicializarAnalisisCategorias() {
    try {
        console.log('=== INICIANDO ANÁLISIS DE CATEGORÍAS FINANCIERAS ===');
        
        // Obtener datos de transacciones desde la base de datos
        console.log('Obteniendo transacciones del usuario...');
        const transacciones = await obtenerTransacciones();
        console.log('Transacciones obtenidas:', transacciones.length);
        
        if (transacciones.length === 0) {
            console.log('No hay transacciones para analizar');
            mostrarMensajeSinDatos();
            return;
        }
        
        // Generar análisis de gastos por categoría
        console.log('Generando análisis de gastos...');
        await generarAnalisisGastos(transacciones);
        
        // Generar evolución del balance
        console.log('Generando evolución del balance...');
        await generarEvolucionBalance(transacciones);
        
        // Generar distribución ingresos vs gastos
        console.log('Generando distribución ingresos vs gastos...');
        await generarDistribucionIngresosGastos(transacciones);
        
        console.log('Análisis completado exitosamente');
        
    } catch (error) {
        console.error('Error al inicializar análisis:', error);
        mostrarError('Error al cargar los datos de categorías financieras');
    }
}

// Mostrar mensaje cuando no hay datos
function mostrarMensajeSinDatos() {
    const container = document.querySelector('.main-content');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <h2>No hay datos para mostrar</h2>
                <p>Para ver el análisis de categorías financieras, necesitas tener transacciones registradas.</p>
                <p>Ve al <a href="/views/dashboard.html">Dashboard</a> para agregar tus primeras transacciones.</p>
            </div>
        `;
    }
}

async function obtenerTransacciones() {
    try {
        const token = localStorage.getItem('token');
        
        console.log('Token de autenticación:', token ? 'Presente' : 'No encontrado');
        
        if (!token) {
            console.log('No hay token, usando datos de ejemplo');
            return generarDatosEjemplo();
        }
        
        // Obtener transacciones de los últimos 6 meses
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 6);
        
        console.log('Obteniendo transacciones del usuario autenticado...');
        
        const response = await fetch(`/api/transactions?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Respuesta del servidor:', response.status, response.statusText);
        
        if (!response.ok) {
            console.log('Error al obtener transacciones del servidor, usando datos de ejemplo');
            return generarDatosEjemplo();
        }
        
        const data = await response.json();
        console.log('Datos recibidos del servidor:', data);
        
        if (data.success && data.transactions) {
            const transactions = data.transactions;
            console.log('Transacciones procesadas:', transactions.length, 'registros');
            
            if (transactions.length > 0) {
                console.log('Primera transacción:', JSON.stringify(transactions[0], null, 2));
            }
            
            return transactions;
        } else {
            console.log('No se obtuvieron transacciones del servidor, usando datos de ejemplo');
            return generarDatosEjemplo();
        }
    } catch (error) {
        console.error('Error al obtener transacciones:', error);
        console.log('Usando datos de ejemplo como fallback');
        return generarDatosEjemplo();
    }
}

function generarDatosEjemplo() {
    // Generar datos de ejemplo basados en transacciones reales
    const categorias = ['Alimentación', 'Transporte', 'Entretenimiento', 'Servicios', 'Salario', 'Inversiones'];
    const tipos = ['gasto', 'ingreso'];
    const transacciones = [];
    
    // Generar transacciones de los últimos 6 meses
    for (let i = 0; i < 30; i++) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - Math.floor(Math.random() * 180)); // Últimos 6 meses
        
        const tipo = tipos[Math.floor(Math.random() * tipos.length)];
        const categoria = categorias[Math.floor(Math.random() * categorias.length)];
        const monto = Math.floor(Math.random() * 2000) + 100; // Entre $100 y $2100
        
        transacciones.push({
            Id: i + 1,
            Amount: monto,
            Type: tipo,
            CategoryName: categoria,
            TransactionDate: fecha.toISOString().split('T')[0],
            Description: `${tipo === 'gasto' ? 'Gasto en' : 'Ingreso de'} ${categoria}`
        });
    }
    
    return transacciones;
}

async function generarAnalisisGastos(transacciones) {
    try {
        console.log('Generando análisis de gastos con', transacciones.length, 'transacciones');
        // Generar gráfico directamente con los datos
        generarGraficoBasicoGastos(transacciones);
    } catch (error) {
        console.error('Error al generar análisis de gastos:', error);
        // Fallback a gráfico básico
        generarGraficoBasicoGastos(transacciones);
    }
}

async function generarEvolucionBalance(transacciones) {
    try {
        console.log('Generando evolución del balance con', transacciones.length, 'transacciones');
        // Generar gráfico directamente con los datos
        generarGraficoBasicoBalance(transacciones);
    } catch (error) {
        console.error('Error al generar evolución del balance:', error);
        generarGraficoBasicoBalance(transacciones);
    }
}

async function generarDistribucionIngresosGastos(transacciones) {
    try {
        console.log('Generando distribución ingresos vs gastos con', transacciones.length, 'transacciones');
        // Generar gráfico directamente con los datos
        generarGraficoBasicoDistribucion(transacciones);
    } catch (error) {
        console.error('Error al generar distribución ingresos vs gastos:', error);
        generarGraficoBasicoDistribucion(transacciones);
    }
}

function mostrarGraficoPython(canvasId, graficoBase64) {
    const canvas = document.getElementById(canvasId);
    if (canvas) {
        const img = document.createElement('img');
        img.src = `data:image/png;base64,${graficoBase64}`;
        img.style.width = '100%';
        img.style.height = '400px';
        img.style.objectFit = 'contain';
        
        // Limpiar canvas anterior
        canvas.innerHTML = '';
        canvas.appendChild(img);
    }
}

// Gráficos de fallback si Python no está disponible
function generarGraficoBasicoGastos(transacciones) {
    console.log('Generando gráfico de gastos con datos:', transacciones);
    const gastosPorCategoria = {};
    
    // Procesar datos reales de transacciones
    if (transacciones && transacciones.length > 0) {
        console.log('Procesando', transacciones.length, 'transacciones para gastos por categoría');
        
        transacciones.forEach(transaccion => {
            console.log('Transacción completa:', JSON.stringify(transaccion, null, 2));
            console.log('Transacción resumida:', {
                id: transaccion.Id,
                amount: transaccion.Amount,
                type: transaccion.Type,
                categoryName: transaccion.CategoryName,
                description: transaccion.Description,
                date: transaccion.TransactionDate
            });
            
            if (transaccion.Type === 'gasto' || transaccion.type === 'gasto') {
                const categoria = transaccion.CategoryName || transaccion.categoryName || 'Sin Categoría';
                const monto = parseFloat(transaccion.Amount || transaccion.amount || 0);
                
                if (!gastosPorCategoria[categoria]) {
                    gastosPorCategoria[categoria] = 0;
                }
                gastosPorCategoria[categoria] += monto;
                
                console.log(`Agregando gasto: $${monto} en categoría "${categoria}"`);
            }
        });
    }
    
    console.log('Gastos por categoría procesados:', JSON.stringify(gastosPorCategoria, null, 2));
    
    // Si no hay datos reales, usar datos de ejemplo
    if (Object.keys(gastosPorCategoria).length === 0) {
        console.log('No hay datos reales de gastos, usando datos de ejemplo');
        gastosPorCategoria['Alimentación'] = 1200;
        gastosPorCategoria['Transporte'] = 800;
        gastosPorCategoria['Entretenimiento'] = 600;
        gastosPorCategoria['Servicios'] = 400;
    }
    
    console.log('Datos finales para gráfico de gastos:', JSON.stringify(gastosPorCategoria, null, 2));
    
    const ctx = document.getElementById('expensesChart');
    if (ctx) {
        console.log('Creando gráfico de gastos en canvas:', ctx);
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(gastosPorCategoria),
                datasets: [{
                    data: Object.values(gastosPorCategoria),
                    backgroundColor: [
                        '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
                        '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: $${context.parsed.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
        console.log('Gráfico de gastos creado exitosamente');
    } else {
        console.error('No se encontró el canvas expensesChart');
    }
}

function generarGraficoBasicoBalance(transacciones) {
    console.log('Generando gráfico de evolución del balance con datos:', transacciones);
    
    // Procesar datos reales de transacciones para evolución del balance
    let balanceData = [];
    let labels = [];
    
    if (transacciones && transacciones.length > 0) {
        // Agrupar por mes y calcular balance acumulado
        const balancePorMes = {};
        
        transacciones.forEach(transaccion => {
            const fecha = new Date(transaccion.TransactionDate || transaccion.transactionDate);
            const mes = fecha.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
            const monto = parseFloat(transaccion.Amount || transaccion.amount || 0);
            
            if (!balancePorMes[mes]) {
                balancePorMes[mes] = 0;
            }
            
            if (transaccion.Type === 'ingreso' || transaccion.type === 'ingreso') {
                balancePorMes[mes] += monto;
            } else if (transaccion.Type === 'gasto' || transaccion.type === 'gasto') {
                balancePorMes[mes] -= monto;
            }
        });
        
        // Convertir a arrays ordenados
        const meses = Object.keys(balancePorMes).sort();
        let balanceAcumulado = 0;
        
        meses.forEach(mes => {
            balanceAcumulado += balancePorMes[mes];
            balanceData.push(balanceAcumulado);
            labels.push(mes);
        });
    }
    
    // Si no hay datos reales, usar datos de ejemplo
    if (balanceData.length === 0) {
        labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
        balanceData = [2500, 2800, 3200, 3000, 3500, 3800];
    }
    
    console.log('Datos para gráfico de balance:', { labels, balanceData });
    
    const ctx = document.getElementById('balanceChart');
    if (ctx) {
        console.log('Creando gráfico de balance en canvas:', ctx);
        
        // Crear gradiente para las barras
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.9)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.4)');
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Balance Acumulado',
                    data: balanceData,
                    backgroundColor: gradient,
                    borderColor: '#3b82f6',
                    borderWidth: 2,
                    borderRadius: 12,
                    borderSkipped: false,
                    hoverBackgroundColor: 'rgba(59, 130, 246, 1)',
                    hoverBorderColor: '#1d4ed8',
                    hoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                size: 12
                            },
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'rect',
                            padding: 20,
                            color: '#374151',
                            font: {
                                size: 13,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#3b82f6',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                return 'Balance: $' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                elements: {
                    bar: {
                        borderJoinStyle: 'round'
                    }
                }
            }
        });
        
        console.log('Gráfico de balance creado exitosamente');
    } else {
        console.error('No se encontró el canvas balanceChart');
    }
}

function generarGraficoBasicoDistribucion(transacciones) {
    console.log('Generando gráfico de distribución ingresos vs gastos con datos:', transacciones);
    
    // Procesar datos reales de transacciones
    let ingresosData = [];
    let gastosData = [];
    let labels = [];
    
    if (transacciones && transacciones.length > 0) {
        // Agrupar por mes
        const datosPorMes = {};
        
        transacciones.forEach(transaccion => {
            const fecha = new Date(transaccion.TransactionDate || transaccion.transactionDate);
            const mes = fecha.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
            const monto = parseFloat(transaccion.Amount || transaccion.amount || 0);
            
            if (!datosPorMes[mes]) {
                datosPorMes[mes] = { ingresos: 0, gastos: 0 };
            }
            
            if (transaccion.Type === 'ingreso' || transaccion.type === 'ingreso') {
                datosPorMes[mes].ingresos += monto;
            } else if (transaccion.Type === 'gasto' || transaccion.type === 'gasto') {
                datosPorMes[mes].gastos += monto;
            }
        });
        
        // Convertir a arrays ordenados
        const meses = Object.keys(datosPorMes).sort();
        meses.forEach(mes => {
            labels.push(mes);
            ingresosData.push(datosPorMes[mes].ingresos);
            gastosData.push(datosPorMes[mes].gastos);
        });
    }
    
    // Si no hay datos reales, usar datos de ejemplo
    if (labels.length === 0) {
        labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
        ingresosData = [2500, 2800, 3200, 3000, 3500, 3800];
        gastosData = [1800, 2000, 2200, 1900, 2400, 2100];
    }
    
    console.log('Datos para gráfico de distribución:', { labels, ingresosData, gastosData });
    
    const ctx = document.getElementById('incomeExpenseChart');
    if (ctx) {
        console.log('Creando gráfico de distribución en canvas:', ctx);
        
        // Crear gradientes para las barras
        const gradientIngresos = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradientIngresos.addColorStop(0, 'rgba(16, 185, 129, 0.8)');
        gradientIngresos.addColorStop(1, 'rgba(16, 185, 129, 0.3)');
        
        const gradientGastos = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradientGastos.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
        gradientGastos.addColorStop(1, 'rgba(239, 68, 68, 0.3)');
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Ingresos',
                        data: ingresosData,
                        backgroundColor: gradientIngresos,
                        borderColor: '#10b981',
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                        hoverBackgroundColor: 'rgba(16, 185, 129, 1)',
                        hoverBorderColor: '#059669',
                        hoverBorderWidth: 3
                    },
                    {
                        label: 'Gastos',
                        data: gastosData,
                        backgroundColor: gradientGastos,
                        borderColor: '#ef4444',
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                        hoverBackgroundColor: 'rgba(239, 68, 68, 1)',
                        hoverBorderColor: '#dc2626',
                        hoverBorderWidth: 3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                size: 12
                            },
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'rect',
                            padding: 20,
                            color: '#374151',
                            font: {
                                size: 13,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#10b981',
                        borderWidth: 2,
                        cornerRadius: 12,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                elements: {
                    bar: {
                        borderJoinStyle: 'round'
                    }
                }
            }
        });
        
        console.log('Gráfico de distribución creado exitosamente');
    } else {
        console.error('No se encontró el canvas incomeExpenseChart');
    }
}

function mostrarError(mensaje) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = mensaje;
    errorDiv.style.display = 'block';
    errorDiv.style.margin = '20px';
    errorDiv.style.padding = '15px';
    errorDiv.style.backgroundColor = '#fee2e2';
    errorDiv.style.color = '#dc2626';
    errorDiv.style.borderRadius = '8px';
    
    document.querySelector('.main-content').insertBefore(errorDiv, document.querySelector('.main-content').firstChild);
}
