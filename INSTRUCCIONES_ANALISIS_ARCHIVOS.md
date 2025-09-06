# 🚀 Instrucciones para Análisis de Archivos - FinScope

## 📋 **Pasos para Configurar y Ejecutar**

### **Paso 1: Configurar Base de Datos**
1. **Ejecutar el script SQL:**
   ```sql
   -- Ejecutar en SQL Server Management Studio
   database/FinScopeDB_Creacion.sql
   ```

2. **Verificar que la tabla ProcessedFiles existe:**
   ```sql
   SELECT * FROM ProcessedFiles;
   ```

### **Paso 2: Configurar Python**
1. **Editar configuración de base de datos:**
   - Abrir: `python-backend/config.env`
   - Cambiar `tu_password_aqui` por tu contraseña real de SQL Server

2. **Instalar dependencias Python:**
   ```bash
   # Opción 1: Ejecutar el script automático
   python-backend/install_dependencies.bat
   
   # Opción 2: Manual
   cd python-backend
   pip install -r requirements.txt
   ```

### **Paso 3: Ejecutar la Aplicación**

#### **Opción A: Script Automático (Recomendado)**
```bash
# Doble clic en:
start_analisis_archivos.bat
```

#### **Opción B: Manual**
```bash
# Terminal 1 - Servidor Node.js
npm start

# Terminal 2 - Servidor Python
cd python-backend
python start_server.py
```

## 🌐 **URLs de Acceso**

- **Aplicación Web:** http://localhost:3000
- **API Python:** http://localhost:5000
- **Módulo Análisis:** http://localhost:3000/analisis-archivos

## ✅ **Verificar que Funciona**

1. **Abrir navegador:** http://localhost:3000
2. **Hacer login** con tu usuario
3. **Ir a "Análisis de Archivos"** en el menú lateral
4. **Subir un archivo PDF o Excel**
5. **Ver el análisis y gráficos generados**

## 🔧 **Solución de Problemas**

### **Error: "No se pudo conectar a la base de datos"**
- Verificar que SQL Server esté ejecutándose
- Verificar la contraseña en `python-backend/config.env`
- Verificar que la base de datos `FinScopeDB` existe

### **Error: "ModuleNotFoundError"**
- Ejecutar: `python-backend/install_dependencies.bat`
- O manualmente: `pip install -r requirements.txt`

### **Error: "Puerto ya en uso"**
- Cerrar otros programas que usen puertos 3000 o 5000
- O cambiar los puertos en los archivos de configuración

### **Error al subir archivo**
- Verificar que el archivo sea PDF o Excel
- Verificar que el tamaño sea menor a 10MB
- Verificar que ambos servidores estén ejecutándose

## 📁 **Archivos Importantes**

- `views/analisis-archivos.html` - Interfaz web
- `scripts/analisis-archivos/analisis-archivos.js` - Lógica frontend
- `python-backend/api/app.py` - API de procesamiento
- `python-backend/file_processing/file_processor.py` - Procesador de archivos
- `database/FinScopeDB_Creacion.sql` - Estructura de base de datos

## 🎯 **Funcionalidades Disponibles**

✅ **Carga de archivos** (PDF, Excel)
✅ **Análisis automático** de datos financieros
✅ **Generación de gráficos** con matplotlib
✅ **Detección de patrones** (montos, fechas, categorías)
✅ **Historial de archivos** procesados
✅ **Interfaz drag & drop** moderna
✅ **Validación de archivos** automática

## 📊 **Tipos de Análisis**

- **Distribución de montos** (histograma)
- **Palabras clave frecuentes** (gráfico de barras)
- **Tendencias temporales** (gráfico de líneas)
- **Métricas estadísticas** (totales, promedios, medianas)
- **Clasificación automática** (ingresos vs gastos)

¡Listo! Tu módulo de Análisis de Archivos está completamente funcional. 🎉
