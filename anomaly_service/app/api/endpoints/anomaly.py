from fastapi import APIRouter, HTTPException
from app.models.session_models import SessionInput, RealSessionInput, AnomalyPredictionResponse, ErrorResponse
from app.services.feature_extractor import FeatureExtractor
from app.services.anomaly_predictor import AnomalyPredictor
from app.utils.mongodb_parser import MongoDBParser
import numpy as np

router = APIRouter()
feature_extractor = FeatureExtractor()
anomaly_predictor = AnomalyPredictor()

def convert_session_format(session_input: SessionInput) -> dict:
    """Convierte el formato MongoDB Extended JSON a formato estándar"""
    return MongoDBParser.convert_session_data(session_input.dict())

@router.post("/predict", response_model=AnomalyPredictionResponse)
async def predict_anomaly(session: SessionInput):
    """
    Predice anomalías en una sesión de ejercicio usando formato MongoDB Extended JSON
    """
    try:
        # Convertir formato MongoDB a estándar
        session_data = convert_session_format(session)
        
        # Extraer características
        features_dict = feature_extractor.extract_features_from_session(session_data)
        
        # Crear array de características para el modelo
        features_array = np.array([
            features_dict['adjusted_performance'],
            features_dict['avg_weight'],
            features_dict['avg_reps'],
            features_dict['std_weight'],
            features_dict['rest_per_set'],
            features_dict['total_sets'],
            features_dict['totalDuration']
        ])
        
        # Crear resumen de sesión
        session_summary = {
            "total_volume": features_dict.get('total_volume', 0),
            "intensity_index": features_dict.get('intensity_index', 0),
            "muscle_groups_count": features_dict.get('muscle_groups_count', 0),
            "dominant_muscle_group": features_dict.get('dominant_muscle_group', 'N/A')
        }
        
        # Obtener predicción con clasificación
        response = anomaly_predictor.get_prediction_details(
            features_array, features_dict, session_summary
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")

@router.post("/predict-real", response_model=AnomalyPredictionResponse)
async def predict_anomaly_real(session: RealSessionInput):
    """
    Predice anomalías en una sesión de ejercicio usando formato JSON estándar
    """
    try:
        # Extraer características directamente del formato estándar
        features_dict = feature_extractor.extract_features_from_session(session.dict())
        
        # Crear array de características para el modelo
        features_array = np.array([
            features_dict['adjusted_performance'],
            features_dict['avg_weight'],
            features_dict['avg_reps'],
            features_dict['std_weight'],
            features_dict['rest_per_set'],
            features_dict['total_sets'],
            features_dict['totalDuration']
        ])
        
        # Crear resumen de sesión
        session_summary = {
            "total_volume": features_dict.get('total_volume', 0),
            "intensity_index": features_dict.get('intensity_index', 0),
            "muscle_groups_count": features_dict.get('muscle_groups_count', 0),
            "dominant_muscle_group": features_dict.get('dominant_muscle_group', 'N/A')
        }
        
        # Obtener predicción con clasificación
        response = anomaly_predictor.get_prediction_details(
            features_array, features_dict, session_summary
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")

@router.get("/health")
async def health_check():
    """Verificación de salud del servicio"""
    return {"status": "healthy", "service": "anomaly-detection"}

@router.post("/test-features")
async def test_feature_extraction(session: SessionInput):
    """
    Endpoint para probar la extracción de características con formato MongoDB
    """
    try:
        session_data = convert_session_format(session)
        features = feature_extractor.extract_features_from_session(session_data)
        return {
            "message": "Características extraídas exitosamente",
            "features": features
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en extracción: {str(e)}")

@router.post("/test-features-real")
async def test_feature_extraction_real(session: RealSessionInput):
    """
    Endpoint para probar la extracción de características con formato JSON estándar
    """
    try:
        features = feature_extractor.extract_features_from_session(session.dict())
        return {
            "message": "Características extraídas exitosamente",
            "features": features
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en extracción: {str(e)}") 