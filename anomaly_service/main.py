from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api.routes import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestión del ciclo de vida de la aplicación"""
    # Startup
    print("🚀 Iniciando servicio de detección de anomalías...")
    yield
    # Shutdown
    print("🛑 Cerrando servicio de detección de anomalías...")

# Crear aplicación FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    lifespan=lifespan
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rutas de la API
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    """Endpoint raíz"""
    return {
        "message": "Servicio de Detección de Anomalías en Ejercicio",
        "version": settings.VERSION,
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/anomaly/health"
    }

@app.get("/info")
async def info():
    """Información del servicio"""
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "description": settings.DESCRIPTION,
        "endpoints": {
            "predict_anomaly": f"{settings.API_V1_STR}/anomaly/predict",
            "test_features": f"{settings.API_V1_STR}/anomaly/test-features",
            "health": f"{settings.API_V1_STR}/anomaly/health"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
