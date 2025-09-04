# 📊 Módulo de Categorías Financieras

## 🎯 Descripción

El módulo de **Categorías Financieras** es una funcionalidad avanzada que proporciona análisis inteligente de las transacciones financieras del usuario utilizando técnicas de ciencia de datos con Python.

## 🚀 Características Principales

### 1. **Análisis de Gastos por Categoría**
- Visualización de distribución de gastos por categoría
- Gráficos de barras y pastel interactivos
- Análisis de patrones de gasto
- Clustering de categorías similares

### 2. **Evolución del Balance**
- Seguimiento temporal del balance financiero
- Líneas de tendencia y predicciones
- Análisis mensual de ingresos vs gastos
- Identificación de patrones temporales

### 3. **Distribución Ingresos vs Gastos**
- Comparación mensual de ingresos y gastos
- Análisis por día de la semana
- Resumen financiero con métricas clave
- Visualizaciones multi-panel

## 🛠️ Tecnologías Utilizadas

### **Backend Python**
- **pandas**: Manipulación y análisis de datos
- **numpy**: Cálculos numéricos avanzados
- **scikit-learn**: Machine learning (clustering, regresión)
- **matplotlib**: Generación de gráficos
- **seaborn**: Visualizaciones estadísticas avanzadas

### **Integración**
- **Flask**: API REST para Python
- **pyodbc**: Conexión a SQL Server
- **Node.js**: Proxy y autenticación
- **Chart.js**: Gráficos de fallback

## 📁 Estructura de Archivos

```
python-backend/
├── api/
│   └── app.py                    # API Flask principal
├── analysis/
│   └── financial_analyzer.py     # Lógica de análisis
├── database_connection.py        # Conexión a SQL Server
├── config.py                     # Configuración
├── requirements.txt              # Dependencias Python
└── start_python_api.py          # Script de inicio
```

## 🔧 Instalación y Configuración

### 1. **Instalar Python**
```bash
# Descargar desde https://www.python.org/downloads/
# Asegúrate de marcar "Add Python to PATH"
```

### 2. **Instalar Dependencias**
```bash
cd python-backend
pip install -r requirements.txt
```

### 3. **Configurar Base de Datos**
```bash
# Crear archivo .env en python-backend/
DB_SERVER=localhost
DB_NAME=FinScopeDB
DB_USER=sa
DB_PASSWORD=tu_password
```

### 4. **Iniciar Servicios**
```bash
# Terminal 1 - Node.js
npm start

# Terminal 2 - Python
cd python-backend
python start_python_api.py
```

## 🌐 API Endpoints

### **Análisis de Gastos**
```http
POST /api/categorias/analisis-gastos
Content-Type: application/json
Authorization: Bearer <token>

{
  "user_id": 1,
  "transacciones": [...]
}
```

### **Evolución del Balance**
```http
POST /api/categorias/evolucion-balance
Content-Type: application/json
Authorization: Bearer <token>

{
  "user_id": 1,
  "transacciones": [...]
}
```

### **Distribución Ingresos vs Gastos**
```http
POST /api/categorias/distribucion-ingresos-gastos
Content-Type: application/json
Authorization: Bearer <token>

{
  "user_id": 1,
  "transacciones": [...]
}
```

### **Resumen de Categorías**
```http
GET /api/categorias/resumen?user_id=1
Authorization: Bearer <token>
```

## 📊 Tipos de Análisis

### **Análisis Descriptivo**
- Estadísticas básicas de transacciones
- Distribución por categorías
- Patrones temporales

### **Análisis Predictivo**
- Líneas de tendencia
- Predicciones de balance
- Identificación de anomalías

### **Machine Learning**
- Clustering de categorías
- Regresión para predicciones
- Análisis de patrones

## 🎨 Visualizaciones

### **Gráficos Generados**
1. **Gráfico de Barras**: Gastos por categoría
2. **Gráfico de Pastel**: Distribución porcentual
3. **Gráfico de Líneas**: Evolución temporal
4. **Gráfico de Barras Agrupadas**: Comparación mensual
5. **Gráfico de Barras Horizontales**: Ranking de categorías
6. **Gráfico de Resumen**: Métricas principales

### **Características de Diseño**
- Colores consistentes con el tema de la aplicación
- Responsive design para todos los dispositivos
- Animaciones suaves y transiciones
- Tooltips informativos
- Leyendas claras y descriptivas

## 🔄 Flujo de Datos

1. **Usuario accede** al módulo de Categorías Financieras
2. **Frontend solicita** datos de transacciones al servidor Node.js
3. **Node.js obtiene** transacciones de SQL Server
4. **Node.js envía** datos al servidor Python
5. **Python procesa** datos con pandas y scikit-learn
6. **Python genera** gráficos con matplotlib
7. **Python retorna** gráficos en base64
8. **Frontend muestra** visualizaciones al usuario

## 🛡️ Fallback sin Python

Si Python no está disponible, el módulo funciona con:
- **Chart.js** para gráficos básicos
- **Datos de ejemplo** para demostración
- **Funcionalidad reducida** pero operativa

## 🚨 Solución de Problemas

### **Error de Conexión a Python**
```bash
# Verificar que Python esté instalado
python --version

# Verificar que el servidor esté ejecutándose
curl http://localhost:5000/health
```

### **Error de Dependencias**
```bash
# Reinstalar dependencias
pip install -r requirements.txt --force-reinstall
```

### **Error de Base de Datos**
```bash
# Verificar conexión a SQL Server
# Revisar configuración en .env
```

## 📈 Métricas y KPIs

### **Métricas Calculadas**
- Total de transacciones por categoría
- Promedio de gastos mensuales
- Tasa de crecimiento del balance
- Distribución temporal de gastos
- Patrones de gasto por día de la semana

### **Insights Generados**
- Categorías con mayor gasto
- Tendencias de ahorro
- Patrones estacionales
- Recomendaciones de optimización

## 🔮 Futuras Mejoras

- [ ] Análisis de sentimientos en descripciones
- [ ] Predicciones con redes neuronales
- [ ] Análisis de correlaciones entre categorías
- [ ] Alertas automáticas de patrones anómalos
- [ ] Comparación con benchmarks del mercado
- [ ] Análisis de cohortes de usuarios

## 📞 Soporte

Para problemas específicos del módulo de Categorías Financieras:

1. **Verificar logs** del servidor Python
2. **Revisar configuración** de base de datos
3. **Comprobar dependencias** de Python
4. **Contactar al equipo** de desarrollo

---

**🎉 ¡El módulo de Categorías Financieras está listo para proporcionar insights valiosos sobre tus finanzas personales!**
