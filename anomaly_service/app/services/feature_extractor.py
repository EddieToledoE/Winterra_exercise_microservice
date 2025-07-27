import pandas as pd
import numpy as np
from typing import Dict, List, Any
from datetime import datetime

class FeatureExtractor:
    """Servicio para extraer características de sesiones de ejercicio"""
    
    # Pesos musculares para el cálculo de rendimiento ajustado
    MUSCLE_WEIGHTS = {
        'sets_cuadricep': 1.0,
        'sets_isquios': 1.0,
        'sets_gluteo': 1.0,
        'sets_espalda': 0.8,
        'sets_pecho': 0.8,
        'sets_hombros': 0.6,
        'sets_hombro': 0.6,
        'sets_hombro_lateral': 0.6,
        'sets_hombro_posterior': 0.6,
        'sets_bíceps': 0.4,
        'sets_biceps': 0.4,
        'sets_tricep': 0.4,
        'sets_abdomen': 0.3,
        'sets_abdominales': 0.3,
        'sets_pantorrilla': 0.3,
        'sets_antebrazos': 0.2,
    }
    
    @staticmethod
    def extract_exercise_features(exercises: List[Dict]) -> Dict[str, float]:
        """Extrae características de los ejercicios de una sesión"""
        total_sets = 0
        all_weights = []
        all_reps = []
        all_rest = []
        muscles_worked = set()

        for ex in exercises:
            muscles_worked.add(ex.get("muscleGroup", "").strip().upper())
            sets = ex.get("sets", [])
            for s in sets:
                if s.get("completed", True):  # solo incluir sets completados
                    total_sets += 1
                    # Asegurar que los valores sean números
                    weight = s.get("weight", 0)
                    reps = s.get("reps", 0)
                    rest = s.get("restTime", 0)
                    
                    # Convertir a float si es necesario
                    if isinstance(weight, dict):
                        weight = 0.0
                    if isinstance(reps, dict):
                        reps = 0.0
                    if isinstance(rest, dict):
                        rest = 0.0
                    
                    all_weights.append(float(weight))
                    all_reps.append(float(reps))
                    all_rest.append(float(rest))

        return {
            "total_sets": total_sets,
            "avg_weight": round(np.mean(all_weights), 2) if all_weights else 0,
            "std_weight": round(np.std(all_weights), 2) if all_weights else 0,
            "avg_reps": round(np.mean(all_reps), 2) if all_reps else 0,
            "std_reps": round(np.std(all_reps), 2) if all_reps else 0,
            "avg_restTime": round(np.mean(all_rest), 2) if all_rest else 0,
            "total_volume": round(sum([w * r for w, r in zip(all_weights, all_reps)]), 2),
            "muscle_groups_count": len(muscles_worked)
        }
    
    @staticmethod
    def expand_sets_by_muscle_group(statistics: Dict) -> Dict[str, int]:
        """Expande los sets por grupo muscular en características numéricas"""
        muscle_sets = statistics.get('setsByMuscleGroup', {})
        return {f'sets_{muscle.lower().replace(" ", "_")}': count 
                for muscle, count in muscle_sets.items()}
    
    @staticmethod
    def get_dominant_muscle_group(statistics: Dict) -> str:
        """Obtiene el grupo muscular dominante (más sets ese día)"""
        sets = statistics.get('setsByMuscleGroup', {})
        if sets:
            return max(sets.items(), key=lambda x: x[1])[0]
        return None
    
    @staticmethod
    def compute_adjusted_performance(features: Dict) -> float:
        """Calcula el rendimiento ajustado basado en pesos musculares"""
        total = 0.0
        for col, weight in FeatureExtractor.MUSCLE_WEIGHTS.items():
            total += features.get(col, 0) * weight
        return total * features['avg_weight'] * features['avg_reps']
    
    def extract_features_from_session(self, session_data: Dict) -> Dict[str, float]:
        """Extrae todas las características necesarias de una sesión"""
        
        # Extraer características básicas de ejercicios
        exercise_features = self.extract_exercise_features(session_data.get('exercises', []))
        
        # Extraer características de músculos
        muscle_features = self.expand_sets_by_muscle_group(session_data.get('statistics', {}))
        
        # Características básicas de la sesión
        total_duration = session_data.get('totalDuration', 0)
        total_rest_time = session_data.get('totalRestTime', 0)
        total_sets = exercise_features['total_sets']
        
        # Calcular características derivadas
        intensity_index = exercise_features['total_volume'] / total_duration if total_duration > 0 else 0
        rest_per_set = total_rest_time / total_sets if total_sets > 0 else 0
        
        # Combinar todas las características
        features = {
            **exercise_features,
            **muscle_features,
            'totalDuration': total_duration,
            'totalRestTime': total_rest_time,
            'intensity_index': intensity_index,
            'rest_per_set': rest_per_set,
            'dominant_muscle_group': self.get_dominant_muscle_group(session_data.get('statistics', {}))
        }
        
        # Calcular rendimiento ajustado
        features['adjusted_performance'] = self.compute_adjusted_performance(features)
        
        return features 