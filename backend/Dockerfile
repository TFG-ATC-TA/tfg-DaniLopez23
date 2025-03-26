# Desarrollo: docker build --target development -t backend-dev .
# Producción: docker build --target production -t backend-prod .

ARG NODE_VERSION=18-bookworm-slim

# ========= ETAPA DE DESARROLLO =========
FROM node:${NODE_VERSION} AS development

WORKDIR /app

# Instalar herramientas de desarrollo
RUN apt-get update && apt-get install -y --no-install-recommends curl

# Copiar e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar código fuente
COPY . .

# Variables de entorno para desarrollo
ENV NODE_ENV=development
ENV DEBUG=app:*

# Exponer puertos
EXPOSE 3001

# Comando para desarrollo
CMD ["npm", "run", "dev"]

# ========= ETAPA DE PRODUCCIÓN =========
FROM node:${NODE_VERSION} AS production

WORKDIR /app

# Crear usuario no-root
RUN adduser --disabled-password --gecos "" appuser && chown -R appuser:appuser /app
USER appuser

# Copiar solo lo necesario
COPY --chown=appuser:appuser package*.json ./
COPY --chown=appuser:appuser bin ./bin
COPY --chown=appuser:appuser public ./public

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

# Variables de entorno para producción
ENV NODE_ENV=production
ENV PORT=3001

# Salud del contenedor
HEALTHCHECK --interval=30s --timeout=10s \
    CMD curl -f http://localhost:3001/health || exit 1

EXPOSE 3001

# Comando para producción
CMD ["npm", "start"]