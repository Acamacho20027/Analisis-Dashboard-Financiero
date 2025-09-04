// FinScope - Estadísticas
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar gráficos
    inicializarGraficos();
    
    // Configurar logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('usuarioAutenticado');
        window.location.href = '/views/index.html';
    });
});

function inicializarGraficos() {
    // Gráfico de gastos por categoría
    const categoriaCtx = document.getElementById('categoriaChart');
    if (categoriaCtx) {
        new Chart(categoriaCtx, {
            type: 'doughnut',
            data: {
                labels: ['Alimentación', 'Transporte', 'Entretenimiento', 'Servicios'],
                datasets: [{
                    data: [35, 25, 20, 20],
                    backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444'
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
                    }
                }
            }
        });
    }

    // Gráfico de ingresos vs gastos mensual
    const ingresosGastosCtx = document.getElementById('ingresosGastosChart');
    if (ingresosGastosCtx) {
        new Chart(ingresosGastosCtx, {
            type: 'bar',
            data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
                datasets: [
                    {
                        label: 'Ingresos',
                        data: [2500, 2800, 3200, 3000, 3500, 3800],
                        backgroundColor: '#10b981',
                        borderRadius: 8
                    },
                    {
                        label: 'Gastos',
                        data: [1800, 2000, 2200, 1900, 2400, 2100],
                        backgroundColor: '#ef4444',
                        borderRadius: 8
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true
                        }
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
}
