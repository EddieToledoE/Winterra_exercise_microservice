# Servicio de Detección de Anomalías en Ejercicio

Este microservicio detecta anomalías en sesiones de ejercicio usando un modelo de Isolation Forest entrenado con datos de entrenamiento.

## 🚀 Características

- **Detección de Anomalías**: Analiza sesiones de ejercicio para identificar patrones anómalos
- **Extracción de Características**: Procesa datos de ejercicios para extraer features relevantes
- **API REST**: Endpoints para predicción y análisis de sesiones
- **Formato MongoDB**: Compatible con datos de MongoDB desde app móvil

## 📁 Estructura del Proyecto

```
anomaly_service/
├── app/
│   ├── api/
│   │   ├── endpoints/
│   │   │   └── anomaly.py          # Endpoints de anomalías
│   │   └── routes.py               # Configuración de rutas
│   ├── core/
│   │   └── config.py               # Configuración del servicio
│   ├── models/
│   │   └── session_models.py       # Modelos Pydantic
│   ├── services/
│   │   ├── anomaly_predictor.py    # Servicio de predicción
│   │   └── feature_extractor.py    # Extracción de características
│   └── utils/
│       └── mongodb_parser.py       # Parser de MongoDB
├── models/
│   ├── modelo_isolation.pkl        # Modelo entrenado
│   └── scaler.pkl                  # Scaler para normalización
├── main.py                         # Servidor principal
├── requirements.txt                 # Dependencias
└── README.md                       # Documentación
```

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
cd anomaly_service
```

2. **Instalar dependencias**
```bash
pip install -r requirements.txt
```

3. **Ejecutar el servicio**
```bash
python main.py
```

El servicio estará disponible en `http://localhost:8000`

## 📡 API Endpoints

### 1. Predicción de Anomalías
**POST** `/api/v1/anomaly/predict`

Recibe datos de sesión de ejercicio y retorna predicción de anomalía.

**Ejemplo de entrada:**
```json
{
  "_id": {"$oid": "6874ac9acce77ea8580e6158"},
  "userId": "YEMGG1WruaXs0n17A49Nwu8sl9M2",
  "date": {"$date": {"$numberLong": "1752455170842"}},
  "startTime": {"$date": {"$numberLong": "1752455188213"}},
  "endTime": {"$date": {"$numberLong": "1752455225797"}},
  "totalDuration": {"$numberInt": "37"},
  "totalRestTime": {"$numberInt": "16"},
  "totalSets": {"$numberInt": "2"},
  "exercises": [
    {
      "id": "2e518f2c-1c67-467f-991d-4bd7e7a466e1",
      "name": "Press de banca",
      "muscleGroup": "PECHO",
      "sets": [
        {
          "id": "8e171bae-4d51-481c-8ab6-240aface7a94",
          "reps": {"$numberInt": "12"},
          "weight": {"$numberInt": "25"},
          "restTime": {"$numberInt": "13"},
          "completed": true
        }
      ],
      "order": {"$numberInt": "1"}
    }
  ],
  "statistics": {
    "setsByMuscleGroup": {"PECHO": {"$numberInt": "2"}},
    "totalCompletedSets": {"$numberInt": "2"},
    "totalRestTime": {"$numberInt": "16"}
  },
  "createdAt": {"$date": {"$numberLong": "1752476826891"}},
  "updatedAt": {"$date": {"$numberLong": "1752476826891"}},
  "__v": {"$numberInt": "0"}
}
```

**Ejemplo de respuesta:**
```json
{
  "prediction": "Normal",
  "risk_score": 0.123,
  "features_used": {
    "adjusted_performance": 45.6,
    "avg_weight": 27.5,
    "avg_reps": 11.0,
    "std_weight": 2.5,
    "rest_per_set": 8.0,
    "total_sets": 2.0,
    "totalDuration": 37.0
  },
  "session_summary": {
    "total_volume": 330.0,
    "intensity_index": 8.92,
    "muscle_groups_count": 1,
    "dominant_muscle_group": "PECHO"
  },
  "message": "Predicción completada exitosamente"
}
```

### 2. Prueba de Extracción de Características
**POST** `/api/v1/anomaly/test-features`

Endpoint para debugging que muestra las características extraídas.

### 3. Health Check
**GET** `/api/v1/anomaly/health`

Verifica el estado del servicio.

### 4. Información del Servicio
**GET** `/info`

Información general del servicio.

## 🔧 Características Extraídas

El servicio extrae las siguientes características de cada sesión:

### Características Básicas
- `total_sets`: Total de series completadas
- `avg_weight`: Peso promedio por serie
- `std_weight`: Desviación estándar del peso
- `avg_reps`: Repeticiones promedio
- `std_reps`: Desviación estándar de repeticiones
- `avg_restTime`: Tiempo de descanso promedio
- `total_volume`: Volumen total (peso × repeticiones)

### Características Derivadas
- `intensity_index`: Índice de intensidad (volumen/duración)
- `rest_per_set`: Tiempo de descanso por serie
- `adjusted_performance`: Rendimiento ajustado por grupos musculares
- `muscle_groups_count`: Número de grupos musculares trabajados
- `dominant_muscle_group`: Grupo muscular dominante

### Características por Grupo Muscular
- `sets_pecho`, `sets_espalda`, `sets_hombros`, etc.

## 🎯 Uso desde App Móvil

```javascript
// Ejemplo de llamada desde JavaScript
const sessionData = {
  // ... datos de sesión en formato MongoDB
};

const response = await fetch('http://localhost:8000/api/v1/anomaly/predict', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(sessionData)
});

const result = await response.json();
console.log('Predicción:', result.prediction);
console.log('Score de riesgo:', result.risk_score);
```

## 📊 Interpretación de Resultados

- **Predicción**: "Normal" o "Anomalía"
- **Risk Score**: Puntuación de 0 a 1 (mayor = más anómalo)
- **Features Used**: Características utilizadas por el modelo
- **Session Summary**: Resumen de la sesión procesada

## 🔍 Debugging

Para ver las características extraídas de una sesión:

```bash
curl -X POST "http://localhost:8000/api/v1/anomaly/test-features" \
  -H "Content-Type: application/json" \
  -d @session_data.json
```

## 📝 Notas Técnicas

- **Modelo**: Isolation Forest de scikit-learn
- **Preprocesamiento**: StandardScaler para normalización
- **Formato de entrada**: Compatible con MongoDB Extended JSON
- **CORS**: Configurado para permitir requests desde apps móviles

## 🚨 Troubleshooting

### Error: "Error cargando modelos"
- Verificar que los archivos `modelo_isolation.pkl` y `scaler.pkl` estén en la carpeta `models/`

### Error: "Característica requerida faltante"
- Verificar que la sesión contenga todos los campos necesarios
- Revisar el formato de los datos de entrada

### Error: "Error parseando fecha/número"
- Verificar el formato de MongoDB en los datos de entrada
- Asegurar que las fechas y números tengan el formato correcto 