# 🚀 Guía de Despliegue en Producción

## 📋 Requisitos Previos

- Docker instalado
- Docker Compose instalado
- Puerto 8001 disponible
- Acceso a los archivos de modelo (`models/modelo_isolation.pkl`, `models/scaler.pkl`)

## 🐳 Opción 1: Despliegue con Docker (Recomendado)

### Paso 1: Preparar el entorno
```bash
# Navegar al directorio del proyecto
cd anomaly_service

# Verificar que los archivos de modelo estén presentes
ls -la models/
# Deberías ver: modelo_isolation.pkl y scaler.pkl
```

### Paso 2: Construir e iniciar el servicio
```bash
# Construir la imagen Docker
./deploy.sh build

# Iniciar el servicio
./deploy.sh start

# Verificar el estado
./deploy.sh status
```

### Paso 3: Verificar el despliegue
```bash
# Health check
curl http://localhost:8001/api/v1/anomaly/health

# Información del servicio
./deploy.sh info
```

## 🔧 Comandos Útiles

```bash
# Ver logs en tiempo real
./deploy.sh logs

# Reiniciar el servicio
./deploy.sh restart

# Detener el servicio
./deploy.sh stop

# Limpiar recursos Docker
./deploy.sh cleanup
```

## 🌐 Acceso a la API

Una vez desplegado, la API estará disponible en:

- **Health Check**: `http://localhost:8001/api/v1/anomaly/health`
- **Documentación**: `http://localhost:8001/docs`
- **Predicción (JSON estándar)**: `POST http://localhost:8001/api/v1/anomaly/predict-real`
- **Predicción (MongoDB)**: `POST http://localhost:8001/api/v1/anomaly/predict`

## 🔄 Opción 2: Despliegue Manual (Sin Docker)

### Paso 1: Instalar dependencias
```bash
cd anomaly_service
pip install -r requirements.txt
```

### Paso 2: Configurar variables de entorno
```bash
export PYTHONPATH=/ruta/completa/a/anomaly_service
export PYTHONUNBUFFERED=1
```

### Paso 3: Ejecutar la aplicación
```bash
# Opción 1: Directamente
python main.py

# Opción 2: Con uvicorn (recomendado para producción)
uvicorn main:app --host 0.0.0.0 --port 8001 --workers 1
```

## 🔒 Configuración de Producción

### Variables de Entorno Recomendadas
```bash
# En el archivo .env o en el sistema
PYTHONPATH=/app
PYTHONUNBUFFERED=1
LOG_LEVEL=INFO
```

### Configuración de Nginx (Opcional)
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location /anomaly/ {
        proxy_pass http://localhost:8001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📊 Monitoreo

### Health Check
```bash
curl -f http://localhost:8001/api/v1/anomaly/health
```

### Logs
```bash
# Con Docker
docker logs anomaly-detection-api

# Sin Docker
tail -f logs/app.log
```

### Métricas de Uso
- **Endpoint más usado**: `/api/v1/anomaly/predict-real`
- **Tiempo de respuesta típico**: 200-500ms
- **Uso de memoria**: ~200MB por instancia

## 🚨 Troubleshooting

### Problema: Puerto 8001 ocupado
```bash
# Verificar qué está usando el puerto
lsof -i :8001

# Cambiar puerto en docker-compose.yml
ports:
  - "8002:8000"  # Cambiar 8001 por 8002
```

### Problema: Modelo no encontrado
```bash
# Verificar que los archivos estén en models/
ls -la models/

# Si faltan, copiarlos desde el directorio de entrenamiento
cp /ruta/a/modelo_isolation.pkl models/
cp /ruta/a/scaler.pkl models/
```

### Problema: Error de permisos
```bash
# Dar permisos al script de despliegue
chmod +x deploy.sh

# En sistemas Unix, puede necesitar sudo para Docker
sudo docker-compose up -d
```

## 🔄 Actualización en Producción

### Con Docker
```bash
# Detener el servicio
./deploy.sh stop

# Actualizar código (git pull, etc.)

# Reconstruir e iniciar
./deploy.sh build
./deploy.sh start
```

### Sin Docker
```bash
# Detener el proceso
pkill -f "python main.py"

# Actualizar código
git pull

# Reiniciar
python main.py
```

## 📈 Escalabilidad

### Múltiples Instancias
```bash
# En docker-compose.yml, agregar:
services:
  anomaly-detection-1:
    # ... configuración
    ports:
      - "8001:8000"
  
  anomaly-detection-2:
    # ... configuración
    ports:
      - "8002:8000"
```

### Load Balancer
```nginx
upstream anomaly_backend {
    server localhost:8001;
    server localhost:8002;
}

server {
    location /anomaly/ {
        proxy_pass http://anomaly_backend/;
    }
}
```

## 🛡️ Seguridad

### Firewall
```bash
# Permitir solo el puerto necesario
sudo ufw allow 8001
```

### Rate Limiting
```nginx
# En Nginx
limit_req_zone $binary_remote_addr zone=anomaly:10m rate=10r/s;
location /anomaly/ {
    limit_req zone=anomaly burst=20 nodelay;
    proxy_pass http://localhost:8001/;
}
```

## 📝 Notas Importantes

1. **Puerto**: El servicio corre en puerto 8001 para no conflictuar con tu API de exercise
2. **Modelos**: Los archivos de modelo deben estar en `models/`
3. **Memoria**: El servicio usa ~200MB de RAM
4. **CPU**: Un core es suficiente para la mayoría de casos
5. **Logs**: Los logs se muestran en stdout/stderr
6. **Restart**: El servicio se reinicia automáticamente si falla

## 🆘 Soporte

Si encuentras problemas:

1. Verificar logs: `./deploy.sh logs`
2. Verificar estado: `./deploy.sh status`
3. Reiniciar: `./deploy.sh restart`
4. Reconstruir: `./deploy.sh build && ./deploy.sh start` 