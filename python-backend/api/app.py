from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import tempfile
from werkzeug.utils import secure_filename
from database_connection import DatabaseConnection
from analysis.financial_analyzer import FinancialAnalyzer
from file_processing.file_processor import FileProcessor

app = Flask(__name__)
CORS(app)

# Inicializar componentes
db = DatabaseConnection()
analyzer = FinancialAnalyzer()
file_processor = FileProcessor()

# Configuración para archivos
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'xlsx', 'xls'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB máximo

# Crear directorio de uploads si no existe
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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

# ===== ENDPOINTS PARA ANÁLISIS DE ARCHIVOS =====

@app.route('/api/analisis-archivos/procesar', methods=['POST'])
def procesar_archivo():
    """Procesa un archivo PDF o Excel para análisis financiero"""
    try:
        print("🔍 Iniciando procesamiento de archivo...")
        
        # Verificar que se envió un archivo
        if 'file' not in request.files:
            print("❌ No se envió ningún archivo")
            return jsonify({'success': False, 'error': 'No se envió ningún archivo'}), 400
        
        file = request.files['file']
        user_id = request.form.get('userId')
        
        print(f"📁 Archivo recibido: {file.filename}")
        print(f"👤 User ID: {user_id}")
        
        if not user_id:
            print("❌ user_id es requerido")
            return jsonify({'success': False, 'error': 'user_id es requerido'}), 400
        
        if file.filename == '':
            print("❌ No se seleccionó ningún archivo")
            return jsonify({'success': False, 'error': 'No se seleccionó ningún archivo'}), 400
        
        if not allowed_file(file.filename):
            print(f"❌ Tipo de archivo no soportado: {file.filename}")
            return jsonify({'success': False, 'error': 'Tipo de archivo no soportado. Use PDF o Excel.'}), 400
        
        # Guardar archivo temporalmente
        filename = secure_filename(file.filename)
        file_extension = filename.rsplit('.', 1)[1].lower()
        
        # Crear archivo temporal con nombre único
        temp_file_path = tempfile.mktemp(suffix=f'.{file_extension}')
        file.save(temp_file_path)
        
        try:
            print(f"🔄 Procesando archivo: {temp_file_path}")
            # Procesar archivo con timeout (compatible con Windows)
            import threading
            import time
            
            result = None
            error_occurred = False
            
            def process_file_with_timeout():
                nonlocal result, error_occurred
                try:
                    result = file_processor.process_file(temp_file_path, file_extension)
                except Exception as e:
                    error_occurred = True
                    result = {'success': False, 'error': f'Error en procesamiento: {str(e)}'}
            
            # Crear thread para procesamiento
            process_thread = threading.Thread(target=process_file_with_timeout)
            process_thread.daemon = True
            process_thread.start()
            
            # Esperar máximo 30 segundos
            process_thread.join(timeout=30)
            
            if process_thread.is_alive():
                print("⏰ Timeout en el procesamiento del archivo")
                result = {'success': False, 'error': 'Timeout en el procesamiento del archivo'}
            elif error_occurred:
                print(f"❌ Error en procesamiento: {result.get('error', 'Error desconocido')}")
            else:
                print(f"✅ Resultado del procesamiento: {result['success']}")
            
            # Verificar que el resultado sea válido
            if not result or 'success' not in result:
                print("❌ Resultado inválido del procesador")
                result = {'success': False, 'error': 'Error en el procesamiento del archivo'}
            
            if result['success']:
                # Guardar en base de datos
                if not db.connect():
                    return jsonify({'error': 'Error de conexión a la base de datos'}), 500
                
                # Insertar registro en ProcessedFiles
                file_size = os.path.getsize(temp_file_path)
                original_data = json.dumps(result['data']) if result['data'] else None
                analysis_results = json.dumps(result['analysis']) if result['analysis'] else None
                charts_data = json.dumps(result['charts']) if result['charts'] else None
                
                query = """
                    INSERT INTO ProcessedFiles (UserId, FileName, FileType, FileSize, OriginalData, AnalysisResults, ChartsData, Status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """
                
                cursor = db.cursor
                cursor.execute(query, [
                    user_id, filename, file_extension, file_size,
                    original_data, analysis_results, charts_data, 'completed'
                ])
                db.conn.commit()
                
                # Obtener el ID del último registro insertado
                cursor.execute("SELECT SCOPE_IDENTITY()")
                file_id = cursor.fetchone()[0]
                db.close()
                
                return jsonify({
                    'success': True,
                    'fileId': file_id,
                    'fileName': filename,
                    'totalRecords': result['total_records'],
                    'totalIncome': result['analysis']['total_income'] if result['analysis'] else 0,
                    'totalExpenses': result['analysis']['total_expenses'] if result['analysis'] else 0,
                    'charts': result['charts'] if result['charts'] else []
                })
            else:
                # Guardar error en base de datos
                if not db.connect():
                    return jsonify({'error': 'Error de conexión a la base de datos'}), 500
                
                query = """
                    INSERT INTO ProcessedFiles (UserId, FileName, FileType, FileSize, Status, ErrorMessage)
                    VALUES (?, ?, ?, ?, ?, ?)
                """
                
                file_size = os.path.getsize(temp_file_path)
                cursor = db.cursor
                cursor.execute(query, [
                    user_id, filename, file_extension, file_size,
                    'error', result['error']
                ])
                db.conn.commit()
                db.close()
                
                return jsonify({'error': result['error']}), 400
        
        finally:
            # Limpiar archivo temporal con manejo de errores
            try:
                import time
                time.sleep(0.1)  # Pequeño delay para asegurar que el archivo se libere
                if os.path.exists(temp_file_path):
                    os.unlink(temp_file_path)
                    print(f"🗑️ Archivo temporal eliminado: {temp_file_path}")
            except Exception as cleanup_error:
                print(f"⚠️ No se pudo eliminar archivo temporal: {cleanup_error}")
                # No es crítico si no se puede eliminar el archivo temporal
        
    except Exception as e:
        print(f"❌ Error interno: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': f'Error interno: {str(e)}'}), 500

@app.route('/api/analisis-archivos/historial', methods=['GET'])
def obtener_historial_archivos():
    """Obtiene el historial de archivos procesados de un usuario"""
    try:
        user_id = request.args.get('userId')
        
        if not user_id:
            return jsonify({'error': 'user_id es requerido'}), 400
        
        if not db.connect():
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        query = """
            SELECT Id, FileName, FileType, FileSize, ProcessedAt, Status, ErrorMessage
            FROM ProcessedFiles
            WHERE UserId = ?
            ORDER BY ProcessedAt DESC
        """
        
        cursor = db.cursor
        cursor.execute(query, [user_id])
        archivos = cursor.fetchall()
        db.close()
        
        # Convertir a lista de diccionarios
        archivos_list = []
        for archivo in archivos:
            archivos_list.append({
                'id': archivo[0],
                'fileName': archivo[1],
                'fileType': archivo[2],
                'fileSize': archivo[3],
                'processedAt': archivo[4].isoformat() if archivo[4] else None,
                'status': archivo[5],
                'errorMessage': archivo[6]
            })
        
        return jsonify({
            'success': True,
            'archivos': archivos_list
        })
        
    except Exception as e:
        return jsonify({'error': f'Error interno: {str(e)}'}), 500

@app.route('/api/analisis-archivos/eliminar/<int:file_id>', methods=['DELETE'])
def eliminar_archivo(file_id):
    """Elimina un archivo procesado de la base de datos"""
    try:
        user_id = request.args.get('userId')
        
        if not user_id:
            return jsonify({'error': 'user_id es requerido'}), 400
        
        if not db.connect():
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        # Verificar que el archivo pertenece al usuario
        check_query = "SELECT Id FROM ProcessedFiles WHERE Id = ? AND UserId = ?"
        cursor = db.cursor
        cursor.execute(check_query, [file_id, user_id])
        archivo = cursor.fetchone()
        
        if not archivo:
            db.close()
            return jsonify({'error': 'Archivo no encontrado'}), 404
        
        # Eliminar el archivo
        delete_query = "DELETE FROM ProcessedFiles WHERE Id = ? AND UserId = ?"
        cursor.execute(delete_query, [file_id, user_id])
        db.conn.commit()
        db.close()
        
        return jsonify({
            'success': True,
            'message': 'Archivo eliminado exitosamente'
        })
        
    except Exception as e:
        return jsonify({'error': f'Error interno: {str(e)}'}), 500

@app.route('/api/analisis-archivos/resultados/<int:file_id>', methods=['GET'])
def obtener_resultados_archivo(file_id):
    """Obtiene los resultados de análisis de un archivo específico"""
    try:
        user_id = request.args.get('userId')
        
        if not user_id:
            return jsonify({'error': 'user_id es requerido'}), 400
        
        if not db.connect():
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
        
        query = """
            SELECT FileName, FileType, OriginalData, AnalysisResults, ChartsData, Status, ErrorMessage
            FROM ProcessedFiles
            WHERE Id = ? AND UserId = ?
        """
        
        cursor = db.cursor
        cursor.execute(query, [file_id, user_id])
        archivo = cursor.fetchone()
        db.close()
        
        if not archivo:
            return jsonify({'error': 'Archivo no encontrado'}), 404
        
        if archivo[5] != 'completed':
            return jsonify({'error': f'Archivo no procesado correctamente: {archivo[6] or "Error desconocido"}'}), 400
        
        # Parsear datos JSON
        original_data = json.loads(archivo[2]) if archivo[2] else None
        analysis_results = json.loads(archivo[3]) if archivo[3] else None
        charts_data = json.loads(archivo[4]) if archivo[4] else None
        
        return jsonify({
            'success': True,
            'fileName': archivo[0],
            'fileType': archivo[1],
            'data': original_data,
            'analysis': analysis_results,
            'charts': charts_data
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
