#!/bin/bash

# Script para probar la API de Anomaly Detection
# Uso: ./test_api.sh

BASE_URL="http://localhost:8000"
CONTENT_TYPE="Content-Type: application/json"

echo "🧪 Probando API de Detección de Anomalías"
echo "=========================================="

# 1. Health Check
echo -e "\n1️⃣ Health Check:"
curl -s "${BASE_URL}/api/v1/anomaly/health" | jq '.'

# 2. Info del servicio
echo -e "\n2️⃣ Información del servicio:"
curl -s "${BASE_URL}/info" | jq '.'

# 3. Test Features
echo -e "\n3️⃣ Test Features (características extraídas):"
curl -s -X POST "${BASE_URL}/api/v1/anomaly/test-features" \
  -H "${CONTENT_TYPE}" \
  -d @test_session.json | jq '.'

# 4. Predicción Normal
echo -e "\n4️⃣ Predicción - Sesión Normal:"
curl -s -X POST "${BASE_URL}/api/v1/anomaly/predict" \
  -H "${CONTENT_TYPE}" \
  -d @test_session.json | jq '.'

# 5. Predicción con sesión intensa (posible anomalía)
echo -e "\n5️⃣ Predicción - Sesión Intensa (posible anomalía):"
curl -s -X POST "${BASE_URL}/api/v1/anomaly/predict" \
  -H "${CONTENT_TYPE}" \
  -d '{
    "_id": {"$oid": "6874ac9acce77ea8580e6159"},
    "userId": "YEMGG1WruaXs0n17A49Nwu8sl9M2",
    "date": {"$date": {"$numberLong": "1752455170842"}},
    "startTime": {"$date": {"$numberLong": "1752455188213"}},
    "endTime": {"$date": {"$numberLong": "1752455225797"}},
    "totalDuration": {"$numberInt": "15"},
    "totalRestTime": {"$numberInt": "2"},
    "totalSets": {"$numberInt": "8"},
    "exercises": [
      {
        "id": "2e518f2c-1c67-467f-991d-4bd7e7a466e1",
        "name": "Press de banca",
        "muscleGroup": "PECHO",
        "sets": [
          {
            "id": "8e171bae-4d51-481c-8ab6-240aface7a94",
            "reps": {"$numberInt": "20"},
            "weight": {"$numberInt": "100"},
            "restTime": {"$numberInt": "1"},
            "completed": true
          }
        ],
        "order": {"$numberInt": "1"}
      }
    ],
    "statistics": {
      "setsByMuscleGroup": {"PECHO": {"$numberInt": "1"}},
      "totalCompletedSets": {"$numberInt": "1"},
      "totalRestTime": {"$numberInt": "2"}
    },
    "createdAt": {"$date": {"$numberLong": "1752476826891"}},
    "updatedAt": {"$date": {"$numberLong": "1752476826891"}},
    "__v": {"$numberInt": "0"}
  }' | jq '.'

# 6. Predicción con formato real de app móvil
echo -e "\n6️⃣ Predicción - Formato Real App Móvil:"
curl -s -X POST "${BASE_URL}/api/v1/anomaly/predict-real" \
  -H "${CONTENT_TYPE}" \
  -d @test_real_session.json | jq '.'

# 7. Test Features con formato real
echo -e "\n7️⃣ Test Features - Formato Real:"
curl -s -X POST "${BASE_URL}/api/v1/anomaly/test-features-real" \
  -H "${CONTENT_TYPE}" \
  -d @test_real_session.json | jq '.'

echo -e "\n✅ Pruebas completadas!" 