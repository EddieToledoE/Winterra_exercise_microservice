from fastapi import APIRouter
from app.api.endpoints import anomaly

# Crear router principal
api_router = APIRouter()

# Incluir rutas de anomalías
api_router.include_router(
    anomaly.router,
    prefix="/anomaly",
    tags=["anomaly-detection"]
)
