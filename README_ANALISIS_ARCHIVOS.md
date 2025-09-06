# Módulo de Análisis de Archivos - FinScope

## Descripción

El módulo "Análisis de Archivos" permite a los usuarios subir archivos PDF y Excel para realizar análisis financiero automático. Este módulo reemplaza al anterior módulo de "Transacciones" y proporciona capacidades avanzadas de procesamiento de datos.

## Características Principales

### 1. Carga de Archivos
- **Formatos soportados**: PDF (.pdf), Excel (.xlsx, .xls)
- **Tamaño máximo**: 10MB por archivo
- **Interfaz drag & drop**: Arrastra y suelta archivos fácilmente
- **Validación automática**: Verificación de tipo y tamaño de archivo

### 2. Procesamiento Inteligente
- **Extracción de datos**: Análisis automático de tablas y texto
- **Detección de patrones**: Identificación de montos, fechas y categorías financieras
- **Limpieza de datos**: Procesamiento y normalización de información extraída

### 3. Análisis Financiero
- **Cálculo de totales**: Ingresos, gastos y balance neto
- **Análisis temporal**: Tendencias por fecha
- **Categorización**: Identificación automática de categorías financieras
- **Métricas estadísticas**: Distribución, promedios y medianas

### 4. Visualización de Datos
- **Gráficos automáticos**: Generación de visualizaciones con matplotlib
- **Múltiples tipos de gráficos**: Histogramas, gráficos de barras, líneas temporales
- **Integración web**: Visualización directa en el navegador

## Estructura Técnica

### Frontend
- **Archivo HTML**: `views/transacciones.html` (renombrado conceptualmente)
- **JavaScript**: `scripts/analisis-archivos/analisis-archivos.js`
- **Estilos**: `styles/styles.css` (sección específica para análisis de archivos)

### Backend Python
- **API Principal**: `python-backend/api/app.py`
- **Procesador**: `python-backend/file_processing/file_processor.py`
- **Dependencias**: `python-backend/requirements.txt`

### Base de Datos
- **Tabla principal**: `ProcessedFiles`
- **Campos**: ID, Usuario, Nombre archivo, Tipo, Tamaño, Datos originales, Resultados análisis, Gráficos, Estado, Fecha procesamiento

## Librerías Utilizadas

### Python
- **pandas**: Manipulación y análisis de datos
- **numpy**: Cálculos numéricos
- **matplotlib**: Generación de gráficos
- **seaborn**: Visualizaciones estadísticas avanzadas
- **PyPDF2**: Procesamiento de archivos PDF
- **pdfplumber**: Extracción avanzada de tablas de PDF
- **openpyxl**: Procesamiento de archivos Excel modernos
- **xlrd**: Soporte para archivos Excel antiguos

### JavaScript
- **Fetch API**: Comunicación con el backend
- **File API**: Manejo de archivos en el navegador
- **Drag & Drop API**: Interfaz de arrastrar y soltar

## Flujo de Trabajo

1. **Carga de Archivo**
   - Usuario selecciona o arrastra archivo
   - Validación de tipo y tamaño
   - Envío al backend de Python

2. **Procesamiento**
   - Extracción de datos según tipo de archivo
   - Análisis de patrones financieros
   - Generación de métricas y estadísticas

3. **Análisis**
   - Cálculo de totales y balances
   - Identificación de tendencias
   - Categorización automática

4. **Visualización**
   - Generación de gráficos con matplotlib
   - Conversión a base64 para web
   - Presentación en interfaz

5. **Almacenamiento**
   - Guardado en base de datos
   - Historial de archivos procesados
   - Acceso a resultados anteriores

## Endpoints API

### Procesar Archivo
```
POST /api/analisis-archivos/procesar
Content-Type: multipart/form-data
Body: file, userId
```

### Obtener Historial
```
GET /api/analisis-archivos/historial?userId={id}
```

### Obtener Resultados
```
GET /api/analisis-archivos/resultados/{fileId}?userId={id}
```

## Configuración

### Instalación de Dependencias Python
```bash
cd python-backend
pip install -r requirements.txt
```

### Inicio del Servidor Python
```bash
cd python-backend
python api/app.py
```

### Inicio del Servidor Node.js
```bash
npm start
```

## Uso

1. **Acceder al módulo**: Navegar a "Análisis de Archivos" en el menú lateral
2. **Subir archivo**: Arrastrar archivo o hacer clic para seleccionar
3. **Procesar**: Hacer clic en "Analizar Archivo"
4. **Ver resultados**: Revisar análisis y gráficos generados
5. **Historial**: Consultar archivos procesados anteriormente

## Características Avanzadas

### Detección de Patrones
- Montos monetarios en diferentes formatos
- Fechas en múltiples formatos
- Palabras clave financieras
- Categorías automáticas

### Análisis Inteligente
- Clasificación automática de ingresos/gastos
- Detección de anomalías
- Tendencias temporales
- Correlaciones entre variables

### Visualizaciones Dinámicas
- Gráficos responsivos
- Múltiples tipos de visualización
- Exportación de imágenes
- Interactividad web

## Limitaciones Actuales

- Tamaño máximo de archivo: 10MB
- Formatos soportados: PDF, Excel (.xlsx, .xls)
- Procesamiento síncrono (puede ser lento para archivos grandes)
- Análisis básico de patrones (mejorable con ML)

## Futuras Mejoras

- Procesamiento asíncrono
- Soporte para más formatos (CSV, JSON)
- Análisis con machine learning
- Exportación de reportes
- Integración con APIs externas
- Análisis en tiempo real

## Solución de Problemas

### Error de Carga de Archivo
- Verificar tamaño (máximo 10MB)
- Verificar formato (PDF o Excel)
- Verificar conexión a internet

### Error de Procesamiento
- Verificar que el archivo no esté corrupto
- Verificar que contenga datos financieros legibles
- Revisar logs del servidor Python

### Error de Visualización
- Verificar que los gráficos se generaron correctamente
- Verificar conexión con el backend
- Recargar la página

## Soporte

Para problemas técnicos o sugerencias, contactar al equipo de desarrollo o revisar los logs del sistema.
