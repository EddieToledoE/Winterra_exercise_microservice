import joblib
import numpy as np
from typing import Dict, Any, Optional
from app.models.session_models import AnomalyPredictionResponse

class AnomalyPredictor:
    def __init__(self):
        self.model = None
        self.scaler = None
        self._load_models()
    
    def _load_models(self):
        """Carga el modelo entrenado y el scaler"""
        try:
            self.model = joblib.load('models/modelo_isolation.pkl')
            self.scaler = joblib.load('models/scaler.pkl')
        except FileNotFoundError as e:
            raise Exception(f"Error al cargar el modelo: {e}")
    
    def predict(self, features: np.ndarray) -> tuple[bool, float]:
        """
        Realiza la predicción de anomalía
        
        Args:
            features: Array de características escaladas
            
        Returns:
            tuple: (es_anomalia, risk_score)
        """
        if self.model is None or self.scaler is None:
            raise Exception("Modelo no cargado correctamente")
        
        # Escalar las características
        features_scaled = self.scaler.transform(features.reshape(1, -1))
        
        # Predecir anomalía
        prediction = self.model.predict(features_scaled)
        # El Isolation Forest devuelve -1 para anomalías, 1 para normal
        is_anomaly = prediction[0] == -1
        
        # Obtener el score de anomalía (más bajo = más anómalo)
        anomaly_score = self.model.score_samples(features_scaled)[0]
        
        return is_anomaly, anomaly_score
    
    def clasificar_anomalia(self, features_dict: Dict[str, Any]) -> str:
        """
        Clasifica el tipo de anomalía basado en las características
        
        Args:
            features_dict: Diccionario con las características extraídas
            
        Returns:
            str: Tipo de anomalía detectada
        """
        total_sets = features_dict.get('total_sets', 0)
        adjusted_performance = features_dict.get('adjusted_performance', 0)
        avg_reps = features_dict.get('avg_reps', 0)
        rest_per_set = features_dict.get('rest_per_set', 0)
        std_weight = features_dict.get('std_weight', 0)
        
        if total_sets <= 2 and adjusted_performance < 1000:
            return 'Sesión muy corta'
        elif adjusted_performance > 13000 and avg_reps < 6:
            return 'Carga excesiva'
        elif rest_per_set > 180:
            return 'Descanso excesivo'
        elif std_weight > 25:
            return 'Pesos inestables'
        else:
            return 'Desempeño irregular'
    
    def get_prediction_details(self, features: np.ndarray, features_dict: Dict[str, Any], 
                             session_summary: Dict[str, Any]) -> AnomalyPredictionResponse:
        """
        Obtiene detalles completos de la predicción incluyendo clasificación
        
        Args:
            features: Array de características
            features_dict: Diccionario con características para clasificación
            session_summary: Resumen de la sesión
            
        Returns:
            AnomalyPredictionResponse: Respuesta completa con clasificación
        """
        is_anomaly, risk_score = self.predict(features)
        
        # Determinar el mensaje y clasificación
        if is_anomaly:
            anomaly_type = self.clasificar_anomalia(features_dict)
            prediction = "Anomalía"
            message = f"Se detectó una anomalía: {anomaly_type}"
        else:
            prediction = "Normal"
            anomaly_type = "Ninguna"
            message = "La sesión se considera normal"
        
        return AnomalyPredictionResponse(
            prediction=prediction,
            risk_score=float(risk_score),
            features_used=features_dict,
            session_summary=session_summary,
            message=message,
            anomaly_type=anomaly_type
        ) 