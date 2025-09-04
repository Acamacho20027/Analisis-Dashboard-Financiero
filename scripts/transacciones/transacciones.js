// FinScope - Transacciones
document.addEventListener('DOMContentLoaded', function() {
    // Cargar transacciones existentes
    cargarTransacciones();
    
    // Configurar formulario
    document.getElementById('transaccionForm').addEventListener('submit', agregarTransaccion);
    
    // Configurar filtros
    document.getElementById('filtrarTodas').addEventListener('click', () => filtrarTransacciones('todas'));
    document.getElementById('filtrarIngresos').addEventListener('click', () => filtrarTransacciones('ingreso'));
    document.getElementById('filtrarGastos').addEventListener('click', () => filtrarTransacciones('gasto'));
    
    // Configurar logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('usuarioAutenticado');
        window.location.href = '/views/index.html';
    });
    
    // Establecer fecha actual por defecto
    document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
});

function agregarTransaccion(e) {
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
    
    // Recargar la lista
    cargarTransacciones();
    
    // Limpiar formulario
    document.getElementById('transaccionForm').reset();
    document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
    
    alert('Transacción agregada exitosamente');
}

function cargarTransacciones() {
    const transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
    const transaccionesList = document.getElementById('transaccionesList');
    
    if (transacciones.length === 0) {
        transaccionesList.innerHTML = `
            <div class="text-center text-gray-500 py-8">
                <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                <p class="text-lg font-medium">No hay transacciones</p>
                <p class="text-sm">Agrega tu primera transacción usando el formulario de arriba</p>
            </div>
        `;
    } else {
        transaccionesList.innerHTML = transacciones.map(transaccion => `
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-4">
                    <div class="w-10 h-10 ${transaccion.tipo === 'ingreso' ? 'bg-green-100' : 'bg-red-100'} rounded-lg flex items-center justify-center">
                        <svg class="w-5 h-5 ${transaccion.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                        </svg>
                    </div>
                    <div>
                        <p class="font-medium text-gray-800">${getCategoryName(transaccion.categoria)}</p>
                        <p class="text-sm text-gray-600">${transaccion.fecha}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-semibold ${transaccion.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}">
                        ${transaccion.tipo === 'ingreso' ? '+' : '-'}$${transaccion.monto.toFixed(2)}
                    </p>
                    <p class="text-sm text-gray-500 capitalize">${transaccion.tipo}</p>
                </div>
            </div>
        `).join('');
    }
    
    // Actualizar métricas
    actualizarMetricas(transacciones);
}

function filtrarTransacciones(tipo) {
    const transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
    const transaccionesList = document.getElementById('transaccionesList');
    
    // Actualizar botones de filtro
    document.getElementById('filtrarTodas').className = 'px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300';
    document.getElementById('filtrarIngresos').className = 'px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300';
    document.getElementById('filtrarGastos').className = 'px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300';
    
    if (tipo === 'todas') {
        document.getElementById('filtrarTodas').className = 'px-3 py-1 text-sm bg-primary text-white rounded-lg';
        cargarTransacciones();
        return;
    }
    
    if (tipo === 'ingreso') {
        document.getElementById('filtrarIngresos').className = 'px-3 py-1 text-sm bg-primary text-white rounded-lg';
    } else {
        document.getElementById('filtrarGastos').className = 'px-3 py-1 text-sm bg-primary text-white rounded-lg';
    }
    
    const transaccionesFiltradas = transacciones.filter(t => t.tipo === tipo);
    
    if (transaccionesFiltradas.length === 0) {
        transaccionesList.innerHTML = `
            <div class="text-center text-gray-500 py-8">
                <p class="text-lg font-medium">No hay ${tipo === 'ingreso' ? 'ingresos' : 'gastos'}</p>
                <p class="text-sm">Agrega transacciones de tipo ${tipo === 'ingreso' ? 'ingreso' : 'gasto'}</p>
            </div>
        `;
    } else {
        transaccionesList.innerHTML = transaccionesFiltradas.map(transaccion => `
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-4">
                    <div class="w-10 h-10 ${transaccion.tipo === 'ingreso' ? 'bg-green-100' : 'bg-red-100'} rounded-lg flex items-center justify-center">
                        <svg class="w-5 h-5 ${transaccion.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                        </svg>
                    </div>
                    <div>
                        <p class="font-medium text-gray-800">${getCategoryName(transaccion.categoria)}</p>
                        <p class="text-sm text-gray-600">${transaccion.fecha}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-semibold ${transaccion.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}">
                        ${transaccion.tipo === 'ingreso' ? '+' : '-'}$${transaccion.monto.toFixed(2)}
                    </p>
                    <p class="text-sm text-gray-500 capitalize">${transaccion.tipo}</p>
                </div>
            </div>
        `).join('');
    }
}

function actualizarMetricas(transacciones) {
    const totalTransacciones = transacciones.length;
    const totalIngresos = transacciones.filter(t => t.tipo === 'ingreso').length;
    const totalGastos = transacciones.filter(t => t.tipo === 'gasto').length;
    
    // Encontrar categoría más usada
    const categorias = {};
    transacciones.forEach(t => {
        categorias[t.categoria] = (categorias[t.categoria] || 0) + 1;
    });
    
    const categoriaMasUsada = Object.keys(categorias).reduce((a, b) => 
        categorias[a] > categorias[b] ? a : b, '');
    
    // Actualizar elementos en el DOM
    document.getElementById('totalTransacciones').textContent = totalTransacciones;
    document.getElementById('totalIngresos').textContent = totalIngresos;
    document.getElementById('totalGastos').textContent = totalGastos;
    document.getElementById('categoriaMasUsada').textContent = getCategoryName(categoriaMasUsada) || '-';
}

function getCategoryName(categoria) {
    const categorias = {
        'alimentacion': 'Alimentación',
        'transporte': 'Transporte',
        'entretenimiento': 'Entretenimiento',
        'servicios': 'Servicios',
        'salario': 'Salario',
        'inversiones': 'Inversiones'
    };
    return categorias[categoria] || categoria;
}
