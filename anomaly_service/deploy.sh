#!/bin/bash

# Script de despliegue para Anomaly Detection API
# Uso: ./deploy.sh [start|stop|restart|logs|build]

set -e

SERVICE_NAME="anomaly-detection"
CONTAINER_NAME="anomaly-detection-api"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Función para verificar si Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker no está instalado. Por favor instala Docker primero."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose no está instalado. Por favor instala Docker Compose primero."
        exit 1
    fi
}

# Función para construir la imagen
build_image() {
    print_status "Construyendo imagen Docker..."
    docker-compose build --no-cache
    print_status "Imagen construida exitosamente"
}

# Función para iniciar el servicio
start_service() {
    print_status "Iniciando servicio de detección de anomalías..."
    docker-compose up -d
    print_status "Servicio iniciado en puerto 8001"
    print_status "Health check disponible en: http://localhost:8001/api/v1/anomaly/health"
}

# Función para detener el servicio
stop_service() {
    print_status "Deteniendo servicio..."
    docker-compose down
    print_status "Servicio detenido"
}

# Función para reiniciar el servicio
restart_service() {
    print_status "Reiniciando servicio..."
    docker-compose restart
    print_status "Servicio reiniciado"
}

# Función para mostrar logs
show_logs() {
    print_status "Mostrando logs del servicio..."
    docker-compose logs -f
}

# Función para verificar estado
check_status() {
    print_status "Verificando estado del servicio..."
    
    if docker ps | grep -q $CONTAINER_NAME; then
        print_status "✅ Servicio está ejecutándose"
        
        # Verificar health check
        if curl -f http://localhost:8001/api/v1/anomaly/health &> /dev/null; then
            print_status "✅ Health check exitoso"
        else
            print_warning "⚠️ Health check falló - el servicio puede estar iniciando"
        fi
    else
        print_error "❌ Servicio no está ejecutándose"
    fi
}

# Función para mostrar información del servicio
show_info() {
    print_status "Información del servicio:"
    echo "  - Nombre del contenedor: $CONTAINER_NAME"
    echo "  - Puerto: 8001"
    echo "  - Health check: http://localhost:8001/api/v1/anomaly/health"
    echo "  - API docs: http://localhost:8001/docs"
    echo "  - Endpoints principales:"
    echo "    * POST http://localhost:8001/api/v1/anomaly/predict-real"
    echo "    * POST http://localhost:8001/api/v1/anomaly/predict"
    echo "    * GET  http://localhost:8001/api/v1/anomaly/health"
}

# Función para limpiar recursos
cleanup() {
    print_status "Limpiando recursos Docker..."
    docker-compose down --volumes --remove-orphans
    docker system prune -f
    print_status "Limpieza completada"
}

# Función para mostrar ayuda
show_help() {
    echo "Script de despliegue para Anomaly Detection API"
    echo ""
    echo "Uso: $0 [COMANDO]"
    echo ""
    echo "Comandos disponibles:"
    echo "  build     - Construir imagen Docker"
    echo "  start     - Iniciar servicio"
    echo "  stop      - Detener servicio"
    echo "  restart   - Reiniciar servicio"
    echo "  logs      - Mostrar logs"
    echo "  status    - Verificar estado"
    echo "  info      - Mostrar información del servicio"
    echo "  cleanup   - Limpiar recursos Docker"
    echo "  help      - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0 build && $0 start"
    echo "  $0 status"
    echo "  $0 logs"
}

# Verificar Docker al inicio
check_docker

# Procesar argumentos
case "${1:-help}" in
    build)
        build_image
        ;;
    start)
        start_service
        ;;
    stop)
        stop_service
        ;;
    restart)
        restart_service
        ;;
    logs)
        show_logs
        ;;
    status)
        check_status
        ;;
    info)
        show_info
        ;;
    cleanup)
        cleanup
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Comando desconocido: $1"
        show_help
        exit 1
        ;;
esac 