# Etapa base: definición común
FROM python:3.10-slim as base

# Argumento de entorno (development o production)
ARG ENVIRONMENT=production

# Variables para evitar prompts y errores en pip
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Crear directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copiar dependencias
COPY requirements.txt .

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt


# ============ DEVELOPMENT STAGE ============
FROM base as development

# Copiar código fuente completo en desarrollo
COPY . .

# Exponer el puerto para desarrollo
EXPOSE 8000

# Iniciar en modo desarrollo con autoreload
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--log-level", "debug", "--reload"]


# ============ PRODUCTION STAGE ============
FROM base as production

# Copiar solo lo necesario
COPY model /app/model
COPY main.py /app/main.py

# Exponer puerto
EXPOSE 8000

# Comando optimizado para producción
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
