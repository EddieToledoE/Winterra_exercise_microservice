from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """Configuración del servicio de anomalías"""
    
    # Configuración de la API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Anomaly Detector API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "API para detección de anomalías en sesiones de ejercicio"
    
    # Configuración de modelos
    MODEL_PATH: str = "models/modelo_isolation.pkl"
    SCALER_PATH: str = "models/scaler.pkl"
    
    # Configuración del servidor
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False
    
    # Configuración de CORS
    BACKEND_CORS_ORIGINS: list = ["*"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Instancia global de configuración
settings = Settings() 