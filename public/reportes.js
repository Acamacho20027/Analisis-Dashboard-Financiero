// FinScope - Reportes
document.addEventListener('DOMContentLoaded', function() {
    // Configurar botones de exportación
    document.getElementById('exportarPDF').addEventListener('click', exportarPDF);
    document.getElementById('exportarExcel').addEventListener('click', exportarExcel);
    
    // Configurar logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('usuarioAutenticado');
        window.location.href = 'index.html';
    });
    
    // Establecer fechas por defecto
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    
    document.getElementById('fechaDesde').value = primerDiaMes.toISOString().split('T')[0];
    document.getElementById('fechaHasta').value = hoy.toISOString().split('T')[0];
});

function exportarPDF() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Título del reporte
        doc.setFontSize(20);
        doc.text('FinScope - Reporte Financiero', 20, 30);
        
        // Fecha de generación
        doc.setFontSize(12);
        doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, 20, 45);
        
        // Obtener transacciones filtradas
        const transacciones = obtenerTransaccionesFiltradas();
        
        if (transacciones.length === 0) {
            doc.setFontSize(14);
            doc.text('No hay transacciones para el período seleccionado', 20, 70);
        } else {
            // Resumen
            doc.setFontSize(16);
            doc.text('Resumen de Transacciones', 20, 70);
            
            const totalIngresos = transacciones.filter(t => t.tipo === 'ingreso')
                .reduce((sum, t) => sum + t.monto, 0);
            const totalGastos = transacciones.filter(t => t.tipo === 'gasto')
                .reduce((sum, t) => sum + t.monto, 0);
            const balance = totalIngresos - totalGastos;
            
            doc.setFontSize(12);
            doc.text(`Total Ingresos: $${totalIngresos.toFixed(2)}`, 20, 85);
            doc.text(`Total Gastos: $${totalGastos.toFixed(2)}`, 20, 95);
            doc.text(`Balance: $${balance.toFixed(2)}`, 20, 105);
            
            // Tabla de transacciones
            doc.setFontSize(14);
            doc.text('Detalle de Transacciones', 20, 125);
            
            let yPos = 140;
            transacciones.forEach((transaccion, index) => {
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 20;
                }
                
                doc.setFontSize(10);
                doc.text(`${transaccion.fecha}`, 20, yPos);
                doc.text(getCategoryName(transaccion.categoria), 60, yPos);
                doc.text(`$${transaccion.monto.toFixed(2)}`, 120, yPos);
                doc.text(transaccion.tipo, 160, yPos);
                
                yPos += 10;
            });
        }
        
        // Guardar PDF
        doc.save('finscope-reporte.pdf');
        alert('Reporte PDF generado exitosamente');
        
    } catch (error) {
        console.error('Error al generar PDF:', error);
        alert('Error al generar el PDF. Asegúrate de que la librería jsPDF esté cargada.');
    }
}

function exportarExcel() {
    try {
        // Obtener transacciones filtradas
        const transacciones = obtenerTransaccionesFiltradas();
        
        if (transacciones.length === 0) {
            alert('No hay transacciones para el período seleccionado');
            return;
        }
        
        // Preparar datos para Excel
        const datos = [
            ['Fecha', 'Categoría', 'Monto', 'Tipo', 'Descripción']
        ];
        
        transacciones.forEach(transaccion => {
            datos.push([
                transaccion.fecha,
                getCategoryName(transaccion.categoria),
                transaccion.monto,
                transaccion.tipo,
                transaccion.descripcion || ''
            ]);
        });
        
        // Crear workbook y worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(datos);
        
        // Ajustar ancho de columnas
        const colWidths = [
            { wch: 12 }, // Fecha
            { wch: 15 }, // Categoría
            { wch: 12 }, // Monto
            { wch: 10 }, // Tipo
            { wch: 25 }  // Descripción
        ];
        ws['!cols'] = colWidths;
        
        // Agregar worksheet al workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Transacciones');
        
        // Generar archivo Excel
        XLSX.writeFile(wb, 'finscope-transacciones.xlsx');
        alert('Reporte Excel generado exitosamente');
        
    } catch (error) {
        console.error('Error al generar Excel:', error);
        alert('Error al generar el Excel. Asegúrate de que la librería SheetJS esté cargada.');
    }
}

function obtenerTransaccionesFiltradas() {
    const fechaDesde = document.getElementById('fechaDesde').value;
    const fechaHasta = document.getElementById('fechaHasta').value;
    const categoria = document.getElementById('categoriaFiltro').value;
    const tipo = document.getElementById('tipoFiltro').value;
    
    // Obtener todas las transacciones
    let transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
    
    // Aplicar filtros
    if (fechaDesde) {
        transacciones = transacciones.filter(t => t.fecha >= fechaDesde);
    }
    
    if (fechaHasta) {
        transacciones = transacciones.filter(t => t.fecha <= fechaHasta);
    }
    
    if (categoria) {
        transacciones = transacciones.filter(t => t.categoria === categoria);
    }
    
    if (tipo) {
        transacciones = transacciones.filter(t => t.tipo === tipo);
    }
    
    return transacciones;
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
