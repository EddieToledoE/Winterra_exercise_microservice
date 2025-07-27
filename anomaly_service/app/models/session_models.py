# app/models/session_models.py
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class Set(BaseModel):
    id: str
    reps: int
    weight: float
    restTime: float
    completed: bool = True

class Exercise(BaseModel):
    id: str
    name: str
    muscleGroup: str
    sets: List[Set]
    order: Optional[int]

class Statistics(BaseModel):
    setsByMuscleGroup: Dict[str, int]
    totalCompletedSets: int
    totalRestTime: float

class Session(BaseModel):
    userId: str
    date: datetime
    startTime: datetime
    endTime: datetime
    totalDuration: float
    totalRestTime: float
    totalSets: Optional[int]  # ya no se usa, pero por compatibilidad
    exercises: List[Exercise]
    statistics: Statistics
    notes: Optional[str] = ""
    createdAt: datetime
    updatedAt: datetime

# Modelos para la API de anomalías
class SessionInput(BaseModel):
    """Modelo para entrada de sesión en formato MongoDB Extended JSON"""
    _id: Dict[str, str]
    userId: str
    date: Dict[str, Dict[str, str]]
    startTime: Dict[str, Dict[str, str]]
    endTime: Dict[str, Dict[str, str]]
    totalDuration: Dict[str, str]
    totalRestTime: Dict[str, str]
    totalSets: Dict[str, str]
    exercises: list
    statistics: Dict[str, Any]
    createdAt: Dict[str, Dict[str, str]]
    updatedAt: Dict[str, Dict[str, str]]
    __v: Dict[str, str]

class RealSessionInput(BaseModel):
    """Modelo para entrada de sesión en formato JSON estándar (como lo envía la app móvil)"""
    _id: str
    userId: str
    date: str  # ISO date string
    startTime: str  # ISO date string
    endTime: str  # ISO date string
    totalDuration: int
    totalRestTime: int
    totalSets: int
    exercises: list
    statistics: Dict[str, Any]
    createdAt: str  # ISO date string
    updatedAt: str  # ISO date string
    __v: int

class AnomalyPredictionResponse(BaseModel):
    """Modelo para respuesta de predicción de anomalía"""
    prediction: str  # "Normal" o "Anomalía"
    risk_score: float
    features_used: Dict[str, Any]
    session_summary: Dict[str, Any]
    message: str
    anomaly_type: str  # Tipo específico de anomalía o "Ninguna"

class ErrorResponse(BaseModel):
    """Modelo para respuestas de error"""
    detail: str
