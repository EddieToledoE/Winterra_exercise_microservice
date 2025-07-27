# Usar imagen base de Python oficial
FROM python:3.11-slim

# Establecer directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar archivos de dependencias
COPY requirements.txt .

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código de la aplicación
COPY . .

# Crear directorio para modelos si no existe
RUN mkdir -p models

# Exponer puerto
EXPOSE 8000

# Variables de entorno
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Comando para ejecutar la aplicación
CMD ["python", "main.py"] 