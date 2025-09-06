import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Usar backend sin GUI para evitar problemas de threading
import matplotlib.pyplot as plt
import seaborn as sns
import base64
import io
from typing import Dict, List, Tuple, Optional
import PyPDF2
import pdfplumber
import openpyxl
import xlrd
from datetime import datetime
import re

class FileProcessor:
    """Procesador de archivos PDF y Excel para análisis financiero"""
    
    def __init__(self):
        self.supported_formats = ['.pdf', '.xlsx', '.xls']
        self.financial_keywords = [
            'ingreso', 'gasto', 'pago', 'cobro', 'transferencia', 'deposito',
            'retiro', 'compra', 'venta', 'factura', 'recibo', 'saldo',
            'monto', 'cantidad', 'precio', 'total', 'subtotal', 'iva'
        ]
    
    def process_file(self, file_path: str, file_type: str) -> Dict:
        """
        Procesa un archivo y extrae datos financieros
        
        Args:
            file_path: Ruta del archivo
            file_type: Tipo de archivo (pdf, xlsx, xls)
            
        Returns:
            Dict con los datos extraídos y análisis
        """
        try:
            # Extraer datos del archivo
            if file_type.lower() == 'pdf':
                data = self._extract_pdf_data(file_path)
            elif file_type.lower() in ['xlsx', 'xls']:
                data = self._extract_excel_data(file_path)
            else:
                raise ValueError(f"Tipo de archivo no soportado: {file_type}")
            
            # Procesar y limpiar datos
            processed_data = self._process_financial_data(data)
            
            # Generar análisis
            analysis = self._generate_analysis(processed_data)
            
            # Generar gráficos
            charts = self._generate_charts(processed_data)
            
            return {
                'success': True,
                'data': processed_data,
                'analysis': analysis,
                'charts': charts,
                'total_records': len(processed_data) if processed_data else 0
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'data': None,
                'analysis': None,
                'charts': None
            }
    
    def _extract_pdf_data(self, file_path: str) -> List[Dict]:
        """Extrae datos de un archivo PDF"""
        data = []
        
        try:
            # Intentar con pdfplumber primero (mejor para tablas)
            with pdfplumber.open(file_path) as pdf:
                for page_num, page in enumerate(pdf.pages):
                    # Extraer tablas
                    tables = page.extract_tables()
                    for table in tables:
                        if table and len(table) > 1:  # Al menos header + 1 fila
                            headers = table[0]
                            for row in table[1:]:
                                if row and len(row) == len(headers):
                                    row_data = dict(zip(headers, row))
                                    row_data['page'] = page_num + 1
                                    data.append(row_data)
                    
                    # Extraer texto y buscar patrones financieros
                    text = page.extract_text()
                    if text:
                        financial_data = self._extract_financial_patterns(text)
                        data.extend(financial_data)
        
        except Exception as e:
            print(f"Error con pdfplumber: {e}")
            # Fallback a PyPDF2
            try:
                with open(file_path, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    for page_num, page in enumerate(pdf_reader.pages):
                        text = page.extract_text()
                        if text:
                            financial_data = self._extract_financial_patterns(text)
                            data.extend(financial_data)
            except Exception as e2:
                print(f"Error con PyPDF2: {e2}")
                raise e2
        
        return data
    
    def _extract_excel_data(self, file_path: str) -> List[Dict]:
        """Extrae datos de un archivo Excel"""
        data = []
        
        try:
            # Leer todas las hojas
            excel_file = pd.ExcelFile(file_path)
            print(f"📊 Hojas encontradas: {excel_file.sheet_names}")
            
            for sheet_name in excel_file.sheet_names:
                df = pd.read_excel(file_path, sheet_name=sheet_name)
                print(f"📋 Procesando hoja: {sheet_name}")
                print(f"📋 Columnas: {df.columns.tolist()}")
                print(f"📋 Primeras 3 filas:")
                print(df.head(3))
                
                # Buscar columnas financieras
                financial_columns = self._identify_financial_columns(df.columns.tolist())
                print(f"💰 Columnas financieras detectadas: {financial_columns}")
                
                # Convertir a diccionario y procesar datos financieros
                for index, row in df.iterrows():
                    row_data = {}
                    
                    # Procesar cada columna
                    for col in df.columns:
                        value = row[col]
                        row_data[col] = value
                        
                        # Si es una columna financiera, extraer montos
                        if col in financial_columns:
                            if pd.notna(value) and isinstance(value, (int, float)):
                                if 'amounts' not in row_data:
                                    row_data['amounts'] = []
                                row_data['amounts'].append(float(value))
                                print(f"💰 Monto detectado en {col}: {value}")
                    
                    # Buscar fechas en las columnas
                    date_columns = [col for col in df.columns if isinstance(col, str) and ('fecha' in col.lower() or 'date' in col.lower())]
                    for col in date_columns:
                        if pd.notna(row[col]):
                            if 'dates' not in row_data:
                                row_data['dates'] = []
                            try:
                                # Convertir a string de forma segura
                                date_str = str(row[col])
                                row_data['dates'].append(date_str)
                            except Exception as e:
                                print(f"⚠️ Error procesando fecha en {col}: {e}")
                                pass
                    
                    # Buscar palabras clave financieras en el texto
                    text_columns = [col for col in df.columns if df[col].dtype == 'object']
                    keywords_found = []
                    for col in text_columns:
                        if pd.notna(row[col]):
                            try:
                                text = str(row[col]).lower()
                                for keyword in self.financial_keywords:
                                    if keyword in text:
                                        keywords_found.append(keyword)
                            except Exception as e:
                                print(f"⚠️ Error procesando texto en {col}: {e}")
                                pass
                    
                    if keywords_found:
                        row_data['keywords'] = keywords_found
                    
                    # Agregar metadatos
                    row_data['sheet'] = sheet_name
                    row_data['row'] = index + 1
                    
                    # Solo agregar si tiene datos financieros relevantes
                    if any(key in row_data for key in ['amounts', 'dates', 'keywords']):
                        data.append(row_data)
                        print(f"📝 Fila {index + 1} agregada con datos: {list(row_data.keys())}")
        
        except Exception as e:
            print(f"Error al leer Excel: {e}")
            raise e
        
        print(f"📊 Total de filas con datos relevantes: {len(data)}")
        return data
    
    def _identify_financial_columns(self, columns: List[str]) -> List[str]:
        """Identifica columnas que contienen datos financieros"""
        financial_keywords = [
            'ingreso', 'gasto', 'pago', 'cobro', 'monto', 'cantidad', 'precio', 
            'total', 'subtotal', 'saldo', 'income', 'expense', 'amount', 'price',
            'ingresos', 'gastos', 'ganancia', 'profit', 'revenue', 'cost'
        ]
        
        financial_columns = []
        for col in columns:
            if isinstance(col, str):
                col_lower = col.lower().strip()
                for keyword in financial_keywords:
                    if keyword in col_lower:
                        financial_columns.append(col)
                        print(f"🔍 Columna financiera detectada: {col} (palabra clave: {keyword})")
                        break
        
        return financial_columns
    
    def _extract_financial_patterns(self, text: str) -> List[Dict]:
        """Extrae patrones financieros del texto"""
        data = []
        
        # Patrones para detectar montos
        amount_patterns = [
            r'\$[\d,]+\.?\d*',  # $1,234.56
            r'[\d,]+\.?\d*\s*(pesos|dolares|usd)',  # 1234.56 pesos
            r'[\d,]+\.?\d*',  # 1234.56
        ]
        
        # Patrones para detectar fechas
        date_patterns = [
            r'\d{1,2}/\d{1,2}/\d{4}',  # MM/DD/YYYY
            r'\d{4}-\d{1,2}-\d{1,2}',  # YYYY-MM-DD
            r'\d{1,2}-\d{1,2}-\d{4}',  # MM-DD-YYYY
        ]
        
        # Asegurar que text sea string
        if not isinstance(text, str):
            text = str(text)
        
        lines = text.split('\n')
        for line_num, line in enumerate(lines):
            # Asegurar que line sea string
            if not isinstance(line, str):
                line = str(line)
            
            line_data = {'line': line_num + 1, 'text': line}
            
            # Buscar montos
            for pattern in amount_patterns:
                matches = re.findall(pattern, line, re.IGNORECASE)
                if matches:
                    line_data['amounts'] = matches
            
            # Buscar fechas
            for pattern in date_patterns:
                matches = re.findall(pattern, line)
                if matches:
                    line_data['dates'] = matches
            
            # Buscar palabras clave financieras
            financial_matches = []
            for keyword in self.financial_keywords:
                if keyword.lower() in line.lower():
                    financial_matches.append(keyword)
            
            if financial_matches:
                line_data['keywords'] = financial_matches
            
            # Solo agregar si tiene información relevante
            if any(key in line_data for key in ['amounts', 'dates', 'keywords']):
                data.append(line_data)
        
        return data
    
    def _process_financial_data(self, raw_data: List[Dict]) -> List[Dict]:
        """Procesa y limpia los datos financieros extraídos"""
        processed_data = []
        
        for item in raw_data:
            processed_item = {}
            
            # Procesar montos
            if 'amounts' in item:
                amounts = []
                for amount_str in item['amounts']:
                    try:
                        # Asegurar que amount_str sea string antes de usar regex
                        if isinstance(amount_str, (int, float)):
                            amount = float(amount_str)
                            amounts.append(amount)
                        else:
                            # Limpiar y convertir a float
                            clean_amount = re.sub(r'[^\d.-]', '', str(amount_str))
                            if clean_amount:
                                amount = float(clean_amount)
                                amounts.append(amount)
                    except ValueError:
                        continue
                
                if amounts:
                    processed_item['amounts'] = amounts
                    processed_item['total_amount'] = sum(amounts)
            
            # Procesar fechas
            if 'dates' in item:
                dates = []
                for date_str in item['dates']:
                    try:
                        # Intentar parsear diferentes formatos
                        for fmt in ['%m/%d/%Y', '%Y-%m-%d', '%m-%d-%Y']:
                            try:
                                date = datetime.strptime(date_str, fmt)
                                dates.append(date.strftime('%Y-%m-%d'))
                                break
                            except ValueError:
                                continue
                    except:
                        continue
                
                if dates:
                    processed_item['dates'] = dates
            
            # Procesar palabras clave
            if 'keywords' in item:
                processed_item['keywords'] = item['keywords']
            
            # Agregar texto original
            processed_item['original_text'] = item.get('text', '')
            
            # Agregar metadatos
            processed_item['source'] = item.get('sheet', item.get('page', 'unknown'))
            processed_item['row'] = item.get('row', item.get('line', 0))
            
            # Solo agregar si tiene datos útiles
            if any(key in processed_item for key in ['amounts', 'dates', 'keywords']):
                processed_data.append(processed_item)
        
        return processed_data
    
    def _generate_analysis(self, data: List[Dict]) -> Dict:
        """Genera análisis de los datos financieros"""
        print(f"🔍 Generando análisis para {len(data)} registros")
        
        if not data:
            return {
                'total_income': 0,
                'total_expenses': 0,
                'net_balance': 0,
                'total_records': 0,
                'date_range': None,
                'top_keywords': [],
                'amount_distribution': {}
            }
        
        # Calcular totales
        total_amounts = []
        all_dates = []
        all_keywords = []
        
        for item in data:
            if 'amounts' in item:
                total_amounts.extend(item['amounts'])
            if 'dates' in item:
                all_dates.extend(item['dates'])
            if 'keywords' in item:
                all_keywords.extend(item['keywords'])
        
        # Análisis de montos - buscar específicamente en los datos procesados
        total_income = 0
        total_expenses = 0
        
        for item in data:
            if 'amounts' in item:
                print(f"💰 Procesando amounts: {item['amounts']}")
                for amount in item['amounts']:
                    if amount > 0:
                        total_income += amount
                    else:
                        total_expenses += abs(amount)
            
            # También buscar en columnas específicas de ingresos y gastos
            for key, value in item.items():
                if isinstance(value, (int, float)) and pd.notna(value) and isinstance(key, str):
                    key_lower = key.lower()
                    if 'ingreso' in key_lower or 'income' in key_lower or 'revenue' in key_lower:
                        total_income += abs(value)
                        print(f"💰 Ingreso detectado en {key}: {value}")
                    elif 'gasto' in key_lower or 'expense' in key_lower or 'cost' in key_lower:
                        total_expenses += abs(value)
                        print(f"💰 Gasto detectado en {key}: {value}")
        
        print(f"💰 Total ingresos calculados: {total_income}")
        print(f"💰 Total gastos calculados: {total_expenses}")
        
        # Análisis de fechas
        date_range = None
        if all_dates:
            sorted_dates = sorted(set(all_dates))
            date_range = {
                'start': sorted_dates[0],
                'end': sorted_dates[-1],
                'total_days': len(sorted_dates)
            }
        
        # Análisis de palabras clave
        keyword_counts = {}
        for keyword in all_keywords:
            keyword_counts[keyword] = keyword_counts.get(keyword, 0) + 1
        
        top_keywords = sorted(keyword_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        
        # Distribución de montos
        amount_distribution = {
            'min': min(total_amounts) if total_amounts else 0,
            'max': max(total_amounts) if total_amounts else 0,
            'avg': np.mean(total_amounts) if total_amounts else 0,
            'median': np.median(total_amounts) if total_amounts else 0
        }
        
        return {
            'total_income': total_income,
            'total_expenses': total_expenses,
            'net_balance': total_income - total_expenses,
            'total_records': len(data),
            'date_range': date_range,
            'top_keywords': top_keywords,
            'amount_distribution': amount_distribution
        }
    
    def _generate_charts(self, data: List[Dict]) -> List[Dict]:
        """Genera gráficos de los datos financieros"""
        charts = []
        
        if not data:
            return charts
        
        # Configurar estilo
        plt.style.use('seaborn-v0_8')
        sns.set_palette("husl")
        
        # 1. Gráfico de distribución de montos
        amounts = []
        for item in data:
            if 'amounts' in item:
                amounts.extend(item['amounts'])
        
        if amounts:
            chart1 = self._create_amount_distribution_chart(amounts)
            charts.append(chart1)
        
        # 1.5. Gráfico de ingresos vs gastos
        income_expense_data = self._extract_income_expense_data(data)
        if income_expense_data:
            chart_ie = self._create_income_expense_chart(income_expense_data)
            charts.append(chart_ie)
        
        # 2. Gráfico de palabras clave
        keywords = []
        for item in data:
            if 'keywords' in item:
                keywords.extend(item['keywords'])
        
        if keywords:
            chart2 = self._create_keywords_chart(keywords)
            charts.append(chart2)
        
        # 3. Gráfico de tendencia temporal (si hay fechas)
        dates_amounts = []
        for item in data:
            if 'dates' in item and 'amounts' in item:
                for date in item['dates']:
                    for amount in item['amounts']:
                        dates_amounts.append({'date': date, 'amount': amount})
        
        if dates_amounts:
            chart3 = self._create_temporal_chart(dates_amounts)
            charts.append(chart3)
        
        return charts
    
    def _create_amount_distribution_chart(self, amounts: List[float]) -> Dict:
        """Crea gráfico de distribución de montos"""
        plt.figure(figsize=(10, 6))
        
        # Histograma
        plt.hist(amounts, bins=20, alpha=0.7, edgecolor='black')
        plt.title('Distribución de Montos Financieros')
        plt.xlabel('Monto')
        plt.ylabel('Frecuencia')
        plt.grid(True, alpha=0.3)
        
        # Convertir a base64
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png', dpi=300, bbox_inches='tight')
        img_buffer.seek(0)
        img_base64 = base64.b64encode(img_buffer.getvalue()).decode()
        plt.close()
        
        return {
            'title': 'Distribución de Montos',
            'data': img_base64,
            'type': 'histogram'
        }
    
    def _create_keywords_chart(self, keywords: List[str]) -> Dict:
        """Crea gráfico de palabras clave más frecuentes"""
        keyword_counts = {}
        for keyword in keywords:
            keyword_counts[keyword] = keyword_counts.get(keyword, 0) + 1
        
        # Top 10 palabras clave
        top_keywords = sorted(keyword_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        
        if not top_keywords:
            return None
        
        plt.figure(figsize=(12, 6))
        
        keywords_list = [item[0] for item in top_keywords]
        counts_list = [item[1] for item in top_keywords]
        
        plt.barh(keywords_list, counts_list)
        plt.title('Palabras Clave Financieras Más Frecuentes')
        plt.xlabel('Frecuencia')
        plt.ylabel('Palabras Clave')
        plt.grid(True, alpha=0.3)
        
        # Convertir a base64
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png', dpi=300, bbox_inches='tight')
        img_buffer.seek(0)
        img_base64 = base64.b64encode(img_buffer.getvalue()).decode()
        plt.close()
        
        return {
            'title': 'Palabras Clave Frecuentes',
            'data': img_base64,
            'type': 'bar'
        }
    
    def _create_temporal_chart(self, dates_amounts: List[Dict]) -> Dict:
        """Crea gráfico de tendencia temporal"""
        # Agrupar por fecha
        daily_totals = {}
        for item in dates_amounts:
            date = item['date']
            amount = item['amount']
            if date in daily_totals:
                daily_totals[date] += amount
            else:
                daily_totals[date] = amount
        
        # Ordenar por fecha
        sorted_dates = sorted(daily_totals.items())
        dates = [item[0] for item in sorted_dates]
        amounts = [item[1] for item in sorted_dates]
        
        plt.figure(figsize=(12, 6))
        
        # Convertir fechas a formato numérico para el gráfico
        try:
            # Intentar convertir fechas a datetime
            import datetime
            date_objects = []
            for date_str in dates:
                try:
                    # Intentar diferentes formatos de fecha
                    if isinstance(date_str, str):
                        # Formato YYYY-MM-DD
                        if '-' in date_str and len(date_str.split('-')[0]) == 4:
                            date_obj = datetime.datetime.strptime(date_str, '%Y-%m-%d')
                        else:
                            # Formato DD/MM/YYYY
                            date_obj = datetime.datetime.strptime(date_str, '%d/%m/%Y')
                    else:
                        date_obj = date_str
                    date_objects.append(date_obj)
                except:
                    # Si no se puede convertir, usar índice
                    date_objects.append(len(date_objects))
            
            plt.plot(date_objects, amounts, marker='o', linewidth=2, markersize=6)
        except:
            # Si falla la conversión, usar índices
            plt.plot(range(len(dates)), amounts, marker='o', linewidth=2, markersize=6)
            plt.xticks(range(len(dates)), dates, rotation=45)
        
        plt.title('Tendencia de Montos por Fecha')
        plt.xlabel('Fecha')
        plt.ylabel('Monto Total')
        plt.grid(True, alpha=0.3)
        
        # Convertir a base64
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png', dpi=300, bbox_inches='tight')
        img_buffer.seek(0)
        img_base64 = base64.b64encode(img_buffer.getvalue()).decode()
        plt.close()
        
        return {
            'title': 'Tendencia Temporal',
            'data': img_base64,
            'type': 'line'
        }
    
    def _extract_income_expense_data(self, data: List[Dict]) -> Dict:
        """Extrae datos de ingresos y gastos para gráficos"""
        income_data = []
        expense_data = []
        
        for item in data:
            for key, value in item.items():
                if isinstance(value, (int, float)) and pd.notna(value) and isinstance(key, str):
                    key_lower = key.lower()
                    if 'ingreso' in key_lower or 'income' in key_lower or 'revenue' in key_lower:
                        income_data.append(abs(value))
                    elif 'gasto' in key_lower or 'expense' in key_lower or 'cost' in key_lower:
                        expense_data.append(abs(value))
        
        return {
            'income': income_data,
            'expense': expense_data
        }
    
    def _create_income_expense_chart(self, data: Dict) -> Dict:
        """Crea gráfico de ingresos vs gastos"""
        income = data['income']
        expense = data['expense']
        
        if not income and not expense:
            return None
        
        plt.figure(figsize=(12, 6))
        
        categories = []
        values = []
        colors = []
        
        if income:
            categories.append('Ingresos')
            values.append(sum(income))
            colors.append('#2E8B57')  # Verde para ingresos
        
        if expense:
            categories.append('Gastos')
            values.append(sum(expense))
            colors.append('#DC143C')  # Rojo para gastos
        
        plt.bar(categories, values, color=colors, alpha=0.7, edgecolor='black')
        plt.title('Resumen de Ingresos vs Gastos')
        plt.ylabel('Monto ($)')
        plt.grid(True, alpha=0.3)
        
        # Agregar valores en las barras
        for i, v in enumerate(values):
            plt.text(i, v + max(values) * 0.01, f'${v:,.2f}', 
                    ha='center', va='bottom', fontweight='bold')
        
        # Convertir a base64
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png', dpi=300, bbox_inches='tight')
        img_buffer.seek(0)
        img_base64 = base64.b64encode(img_buffer.getvalue()).decode()
        plt.close()
        
        return {
            'title': 'Ingresos vs Gastos',
            'data': img_base64,
            'type': 'bar'
        }
