from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from database_connection import DatabaseConnection
from analysis.financial_analyzer import FinancialAnalyzer

app = Flask(__name__)
CORS(app)

# Inicializar componentes
db = DatabaseConnection()
analyzer = FinancialAnalyzer()

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint de salud del servicio"""
    return jsonify({
        'status': 'healthy',
        'service': 'FinScope Python Analytics',
        'version': '1.0.0'
    })

@app.route('/api/categorias/analisis-gastos', methods=['POST'])
def analisis_gastos():
    """Genera análisis de gastos por categoría"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        transacciones = data.get('transacciones', [])
        
        if not user_id:
            return jsonify({'error': 'user_id es requerido'}), 400
        
        # Si no se proporcionan transacciones, obtenerlas de la base de datos
        if not transacciones:
            if not db.connect():
                return jsonify({'error': 'Error de conexión a la base de datos'}), 500
            
            transacciones = db.get_transactions(user_id)
            db.close()
        
        # Generar análisis
        grafico_base64 = analyzer.analyze_expenses_by_category(transacciones)
        
        return jsonify({
            'success': True,
            'grafico_base64': grafico_base64,
            'total_transacciones': len(transacciones)
        })
        
    except Exception as e:
        return jsonify({'error': f'Error interno: {str(e)}'}), 500

@app.route('/api/categorias/evolucion-balance', methods=['POST'])
def evolucion_balance():
    """Genera análisis de evolución del balance"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        transacciones = data.get('transacciones', [])
        
        if not user_id:
            return jsonify({'error': 'user_id es requerido'}), 400
        
        # Si no se proporcionan transacciones, obtenerlas de la base de datos
        if not transacciones:
            if not db.connect():
                return jsonify({'error': 'Error de conexión a la base de datos'}), 500
            
            transacciones = db.get_transactions(user_id)
            db.close()
        
        # Generar análisis
        grafico_base64 = analyzer.analyze_balance_evolution(transacciones)
        
        return jsonify({
            'success': True,
            'grafico_base64': grafico_base64,
            'total_transacciones': len(transacciones)
        })
        
    except Exception as e:
        return jsonify({'error': f'Error interno: {str(e)}'}), 500

@app.route('/api/categorias/distribucion-ingresos-gastos', methods=['POST'])
def distribucion_ingresos_gastos():
    """Genera análisis de distribución de ingresos vs gastos"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        transacciones = data.get('transacciones', [])
        
        if not user_id:
            return jsonify({'error': 'user_id es requerido'}), 400
        
        # Si no se proporcionan transacciones, obtenerlas de la base de datos
        if not transacciones:
            if not db.connect():
                return jsonify({'error': 'Error de conexión a la base de datos'}), 500
            
            transacciones = db.get_transactions(user_id)
            db.close()
        
        # Generar análisis
        grafico_base64 = analyzer.analyze_income_expense_distribution(transacciones)
        
        return jsonify({
            'success': True,
            'grafico_base64': grafico_base64,
            'total_transacciones': len(transacciones)
        })
        
    except Exception as e:
        return jsonify({'error': f'Error interno: {str(e)}'}), 500

@app.route('/api/categorias/resumen', methods=['GET'])
def resumen_categorias():
    """Obtiene resumen de categorías financieras"""
    try:
        user_id = request.args.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'user_id es requerido'}), 400
        
        if not db.connect():
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        # Obtener resumen del usuario
        resumen = db.get_user_summary(user_id)
        
        # Obtener transacciones para análisis adicional
        transacciones = db.get_transactions(user_id)
        db.close()
        
        # Calcular métricas adicionales
        if transacciones:
            df = analyzer.prepare_data(transacciones)
            
            # Categorías más utilizadas
            if not df.empty:
                categorias_populares = df['CategoryName'].value_counts().head(5).to_dict()
                
                # Patrones temporales
                gastos_por_mes = df[df['IsExpense']].groupby('Month')['Amount'].sum().to_dict()
                ingresos_por_mes = df[df['IsIncome']].groupby('Month')['Amount'].sum().to_dict()
                
                resumen.update({
                    'categorias_populares': categorias_populares,
                    'gastos_por_mes': gastos_por_mes,
                    'ingresos_por_mes': ingresos_por_mes,
                    'total_categorias': len(df['CategoryName'].unique())
                })
        
        return jsonify({
            'success': True,
            'resumen': resumen
        })
        
    except Exception as e:
        return jsonify({'error': f'Error interno: {str(e)}'}), 500

if __name__ == '__main__':
    print("🚀 Iniciando FinScope Python Analytics API...")
    print("📊 Servicio de análisis financiero con Python")
    print("🔗 Conectando con base de datos SQL Server...")
    
    # Verificar conexión a la base de datos
    if db.connect():
        print("✅ Conexión a la base de datos establecida")
        db.close()
    else:
        print("⚠️  Advertencia: No se pudo conectar a la base de datos")
    
    print("🌐 Servidor iniciado en http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
