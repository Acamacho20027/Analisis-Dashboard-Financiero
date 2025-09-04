import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta
import base64
import io
from typing import List, Dict, Any

class FinancialAnalyzer:
    def __init__(self):
        # Configurar estilo de matplotlib
        plt.style.use('seaborn-v0_8')
        sns.set_palette("husl")
        
        # Configuración de colores personalizados
        self.colors = {
            'primary': '#3b82f6',
            'success': '#10b981',
            'warning': '#f59e0b',
            'danger': '#ef4444',
            'info': '#06b6d4',
            'purple': '#8b5cf6',
            'pink': '#ec4899',
            'indigo': '#6366f1'
        }
    
    def prepare_data(self, transactions: List[Dict[str, Any]]) -> pd.DataFrame:
        """Prepara los datos de transacciones para análisis"""
        if not transactions:
            return pd.DataFrame()
        
        df = pd.DataFrame(transactions)
        
        # Convertir tipos de datos
        df['Amount'] = pd.to_numeric(df['Amount'], errors='coerce')
        df['TransactionDate'] = pd.to_datetime(df['TransactionDate'])
        
        # Agregar columnas derivadas
        df['Year'] = df['TransactionDate'].dt.year
        df['Month'] = df['TransactionDate'].dt.month
        df['MonthName'] = df['TransactionDate'].dt.strftime('%B')
        df['Weekday'] = df['TransactionDate'].dt.day_name()
        
        # Separar ingresos y gastos
        df['IsIncome'] = df['Type'] == 'ingreso'
        df['IsExpense'] = df['Type'] == 'gasto'
        
        return df
    
    def analyze_expenses_by_category(self, transactions: List[Dict[str, Any]]) -> str:
        """Genera análisis de gastos por categoría con clustering"""
        df = self.prepare_data(transactions)
        
        if df.empty:
            return self._create_empty_chart("No hay datos de transacciones")
        
        # Filtrar solo gastos
        expenses = df[df['IsExpense']].copy()
        
        if expenses.empty:
            return self._create_empty_chart("No hay gastos registrados")
        
        # Agrupar por categoría
        category_summary = expenses.groupby('CategoryName').agg({
            'Amount': ['sum', 'count', 'mean'],
            'TransactionDate': 'min'
        }).round(2)
        
        category_summary.columns = ['Total', 'Cantidad', 'Promedio', 'Primera_Transaccion']
        category_summary = category_summary.sort_values('Total', ascending=False)
        
        # Crear gráfico
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 8))
        
        # Gráfico de barras
        bars = ax1.bar(range(len(category_summary)), category_summary['Total'], 
                      color=[self.colors['primary'], self.colors['success'], 
                            self.colors['warning'], self.colors['danger'],
                            self.colors['info'], self.colors['purple']])
        
        ax1.set_title('Gastos por Categoría', fontsize=16, fontweight='bold', pad=20)
        ax1.set_xlabel('Categorías', fontsize=12)
        ax1.set_ylabel('Monto Total ($)', fontsize=12)
        ax1.set_xticks(range(len(category_summary)))
        ax1.set_xticklabels(category_summary.index, rotation=45, ha='right')
        
        # Agregar valores en las barras
        for i, bar in enumerate(bars):
            height = bar.get_height()
            ax1.text(bar.get_x() + bar.get_width()/2., height + height*0.01,
                    f'${height:,.0f}', ha='center', va='bottom', fontweight='bold')
        
        # Gráfico de pastel
        wedges, texts, autotexts = ax2.pie(category_summary['Total'], 
                                          labels=category_summary.index,
                                          autopct='%1.1f%%',
                                          colors=[self.colors['primary'], self.colors['success'], 
                                                self.colors['warning'], self.colors['danger'],
                                                self.colors['info'], self.colors['purple']])
        
        ax2.set_title('Distribución de Gastos', fontsize=16, fontweight='bold', pad=20)
        
        # Mejorar apariencia
        plt.tight_layout()
        plt.subplots_adjust(top=0.9)
        
        return self._fig_to_base64(fig)
    
    def analyze_balance_evolution(self, transactions: List[Dict[str, Any]]) -> str:
        """Genera análisis de evolución del balance con predicción"""
        df = self.prepare_data(transactions)
        
        if df.empty:
            return self._create_empty_chart("No hay datos de transacciones")
        
        # Calcular balance acumulado por fecha
        df_sorted = df.sort_values('TransactionDate')
        df_sorted['BalanceChange'] = df_sorted.apply(
            lambda x: x['Amount'] if x['IsIncome'] else -x['Amount'], axis=1
        )
        df_sorted['CumulativeBalance'] = df_sorted['BalanceChange'].cumsum()
        
        # Agrupar por fecha para obtener balance diario
        daily_balance = df_sorted.groupby('TransactionDate')['CumulativeBalance'].last().reset_index()
        daily_balance = daily_balance.sort_values('TransactionDate')
        
        # Crear gráfico
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 12))
        
        # Gráfico de evolución del balance
        ax1.plot(daily_balance['TransactionDate'], daily_balance['CumulativeBalance'], 
                marker='o', linewidth=2, markersize=6, color=self.colors['primary'])
        ax1.fill_between(daily_balance['TransactionDate'], daily_balance['CumulativeBalance'], 
                        alpha=0.3, color=self.colors['primary'])
        
        ax1.set_title('Evolución del Balance', fontsize=16, fontweight='bold', pad=20)
        ax1.set_xlabel('Fecha', fontsize=12)
        ax1.set_ylabel('Balance ($)', fontsize=12)
        ax1.grid(True, alpha=0.3)
        
        # Agregar línea de tendencia
        if len(daily_balance) > 1:
            x_numeric = np.arange(len(daily_balance))
            z = np.polyfit(x_numeric, daily_balance['CumulativeBalance'], 1)
            p = np.poly1d(z)
            ax1.plot(daily_balance['TransactionDate'], p(x_numeric), 
                    "--", color=self.colors['danger'], alpha=0.8, linewidth=2, label='Tendencia')
            ax1.legend()
        
        # Análisis mensual
        monthly_data = df_sorted.groupby(['Year', 'Month']).agg({
            'Amount': lambda x: x[df_sorted.loc[x.index, 'IsIncome']].sum() - 
                              x[df_sorted.loc[x.index, 'IsExpense']].sum(),
            'TransactionDate': 'count'
        }).reset_index()
        
        monthly_data['MonthYear'] = monthly_data.apply(
            lambda x: f"{x['Year']}-{x['Month']:02d}", axis=1
        )
        
        bars = ax2.bar(range(len(monthly_data)), monthly_data['Amount'], 
                      color=[self.colors['success'] if x > 0 else self.colors['danger'] 
                            for x in monthly_data['Amount']])
        
        ax2.set_title('Balance Mensual', fontsize=16, fontweight='bold', pad=20)
        ax2.set_xlabel('Mes', fontsize=12)
        ax2.set_ylabel('Balance ($)', fontsize=12)
        ax2.set_xticks(range(len(monthly_data)))
        ax2.set_xticklabels(monthly_data['MonthYear'], rotation=45, ha='right')
        ax2.axhline(y=0, color='black', linestyle='-', alpha=0.3)
        
        # Agregar valores en las barras
        for i, bar in enumerate(bars):
            height = bar.get_height()
            ax2.text(bar.get_x() + bar.get_width()/2., height + (height*0.01 if height > 0 else height*0.01),
                    f'${height:,.0f}', ha='center', va='bottom' if height > 0 else 'top', fontweight='bold')
        
        plt.tight_layout()
        return self._fig_to_base64(fig)
    
    def analyze_income_expense_distribution(self, transactions: List[Dict[str, Any]]) -> str:
        """Genera análisis de distribución de ingresos vs gastos con clustering"""
        df = self.prepare_data(transactions)
        
        if df.empty:
            return self._create_empty_chart("No hay datos de transacciones")
        
        # Separar ingresos y gastos
        income = df[df['IsIncome']].copy()
        expenses = df[df['IsExpense']].copy()
        
        if income.empty and expenses.empty:
            return self._create_empty_chart("No hay transacciones registradas")
        
        # Crear gráfico
        fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(16, 12))
        
        # 1. Comparación mensual de ingresos vs gastos
        if not income.empty and not expenses.empty:
            monthly_income = income.groupby(['Year', 'Month'])['Amount'].sum().reset_index()
            monthly_expenses = expenses.groupby(['Year', 'Month'])['Amount'].sum().reset_index()
            
            # Crear índice común
            all_months = set()
            for _, row in monthly_income.iterrows():
                all_months.add((row['Year'], row['Month']))
            for _, row in monthly_expenses.iterrows():
                all_months.add((row['Year'], row['Month']))
            
            all_months = sorted(all_months)
            months_labels = [f"{year}-{month:02d}" for year, month in all_months]
            
            income_values = []
            expense_values = []
            
            for year, month in all_months:
                income_val = monthly_income[(monthly_income['Year'] == year) & 
                                          (monthly_income['Month'] == month)]['Amount'].sum()
                expense_val = monthly_expenses[(monthly_expenses['Year'] == year) & 
                                             (monthly_expenses['Month'] == month)]['Amount'].sum()
                income_values.append(income_val)
                expense_values.append(expense_val)
            
            x = np.arange(len(months_labels))
            width = 0.35
            
            ax1.bar(x - width/2, income_values, width, label='Ingresos', 
                   color=self.colors['success'], alpha=0.8)
            ax1.bar(x + width/2, expense_values, width, label='Gastos', 
                   color=self.colors['danger'], alpha=0.8)
            
            ax1.set_title('Ingresos vs Gastos Mensuales', fontsize=14, fontweight='bold')
            ax1.set_xlabel('Mes')
            ax1.set_ylabel('Monto ($)')
            ax1.set_xticks(x)
            ax1.set_xticklabels(months_labels, rotation=45, ha='right')
            ax1.legend()
            ax1.grid(True, alpha=0.3)
        
        # 2. Distribución por categorías de gastos
        if not expenses.empty:
            category_expenses = expenses.groupby('CategoryName')['Amount'].sum().sort_values(ascending=True)
            
            bars = ax2.barh(range(len(category_expenses)), category_expenses.values,
                           color=[self.colors['primary'], self.colors['success'], 
                                self.colors['warning'], self.colors['danger'],
                                self.colors['info'], self.colors['purple']][:len(category_expenses)])
            
            ax2.set_title('Gastos por Categoría', fontsize=14, fontweight='bold')
            ax2.set_xlabel('Monto ($)')
            ax2.set_yticks(range(len(category_expenses)))
            ax2.set_yticklabels(category_expenses.index)
            
            # Agregar valores
            for i, bar in enumerate(bars):
                width = bar.get_width()
                ax2.text(width + width*0.01, bar.get_y() + bar.get_height()/2,
                        f'${width:,.0f}', ha='left', va='center', fontweight='bold')
        
        # 3. Análisis de patrones temporales (días de la semana)
        if not expenses.empty:
            weekday_expenses = expenses.groupby('Weekday')['Amount'].sum()
            weekday_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            weekday_expenses = weekday_expenses.reindex(weekday_order, fill_value=0)
            
            ax3.bar(range(len(weekday_expenses)), weekday_expenses.values,
                   color=self.colors['info'], alpha=0.8)
            
            ax3.set_title('Gastos por Día de la Semana', fontsize=14, fontweight='bold')
            ax3.set_xlabel('Día de la Semana')
            ax3.set_ylabel('Monto ($)')
            ax3.set_xticks(range(len(weekday_expenses)))
            ax3.set_xticklabels([day[:3] for day in weekday_expenses.index], rotation=45)
            ax3.grid(True, alpha=0.3)
        
        # 4. Resumen financiero
        total_income = income['Amount'].sum() if not income.empty else 0
        total_expenses = expenses['Amount'].sum() if not expenses.empty else 0
        balance = total_income - total_expenses
        
        categories = ['Ingresos', 'Gastos', 'Balance']
        values = [total_income, total_expenses, balance]
        colors = [self.colors['success'], self.colors['danger'], 
                 self.colors['primary'] if balance >= 0 else self.colors['warning']]
        
        bars = ax4.bar(categories, values, color=colors, alpha=0.8)
        ax4.set_title('Resumen Financiero', fontsize=14, fontweight='bold')
        ax4.set_ylabel('Monto ($)')
        
        # Agregar valores en las barras
        for bar, value in zip(bars, values):
            height = bar.get_height()
            ax4.text(bar.get_x() + bar.get_width()/2., height + height*0.01,
                    f'${value:,.0f}', ha='center', va='bottom', fontweight='bold')
        
        plt.tight_layout()
        return self._fig_to_base64(fig)
    
    def _create_empty_chart(self, message: str) -> str:
        """Crea un gráfico vacío con mensaje"""
        fig, ax = plt.subplots(figsize=(10, 6))
        ax.text(0.5, 0.5, message, ha='center', va='center', 
               fontsize=16, color='gray', transform=ax.transAxes)
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)
        ax.axis('off')
        return self._fig_to_base64(fig)
    
    def _fig_to_base64(self, fig) -> str:
        """Convierte figura de matplotlib a base64"""
        buffer = io.BytesIO()
        fig.savefig(buffer, format='png', dpi=300, bbox_inches='tight', 
                   facecolor='white', edgecolor='none')
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.getvalue()).decode()
        plt.close(fig)
        return image_base64
