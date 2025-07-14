#!/bin/bash

# Script para configurar MongoDB Atlas

echo "🚀 Configurando MongoDB Atlas..."

# 1. Crear cluster en Atlas
echo "📊 Pasos para crear cluster en MongoDB Atlas:"
echo "1. Ve a https://cloud.mongodb.com"
echo "2. Crea una cuenta gratuita"
echo "3. Crea un nuevo cluster (M0 - Gratis)"
echo "4. Configura la región más cercana a tu servidor"

# 2. Configurar red
echo ""
echo "🌐 Configurando acceso de red:"
echo "1. En Atlas, ve a Network Access"
echo "2. Agrega tu IP de AWS: $(curl -s ifconfig.me)"
echo "3. O agrega 0.0.0.0/0 para acceso desde cualquier lugar (solo desarrollo)"

# 3. Crear usuario de base de datos
echo ""
echo "👤 Creando usuario de base de datos:"
echo "1. En Atlas, ve a Database Access"
echo "2. Crea un nuevo usuario"
echo "3. Username: winterra_user"
echo "4. Password: (genera una contraseña segura)"
echo "5. Role: Read and write to any database"

# 4. Obtener connection string
echo ""
echo "🔗 Connection String:"
echo "1. En Atlas, ve a Clusters > Connect"
echo "2. Selecciona 'Connect your application'"
echo "3. Copia el connection string"
echo "4. Reemplaza <username>, <password> y <dbname>"

# 5. Configurar variables de entorno
echo ""
echo "⚙️ Configurando variables de entorno:"
echo "Crea el archivo .env con:"
echo "MONGODB_URI=mongodb+srv://winterra_user:tu_password@cluster.mongodb.net/winterra_exercise?retryWrites=true&w=majority"

echo ""
echo "✅ Configuración completada!"
echo "📝 Recuerda actualizar el .env con tu connection string real" 