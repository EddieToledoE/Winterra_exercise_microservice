#!/bin/bash

# Script de despliegue para AWS EC2

echo "🚀 Iniciando despliegue..."

# Detener la aplicación actual
echo "📦 Deteniendo aplicación actual..."
pm2 stop winterra-exercise-api || true

# Navegar al directorio del proyecto
cd /home/ubuntu/winterra-exercise-api/Winterra_exercise_microservice

# Actualizar código desde Git
echo "🔄 Actualizando código desde Git..."
git pull origin main

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm ci --only=production

# Compilar TypeScript
echo "🔨 Compilando aplicación..."
npm run build

# Crear directorio de logs si no existe
mkdir -p logs

# Iniciar aplicación con PM2
echo "🚀 Iniciando aplicación..."
pm2 start ecosystem.config.js --env production

# Guardar configuración de PM2
pm2 save

echo "✅ Despliegue completado exitosamente!"
echo "📊 Estado de la aplicación:"
pm2 status 