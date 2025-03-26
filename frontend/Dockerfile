# Desarrollo: docker build --target development -t frontend-dev .
# Producción: docker build --target production -t frontend-prod .

ARG NODE_VERSION=18-bookworm-slim

# ========= ETAPA DE DESARROLLO =========
FROM node:${NODE_VERSION} AS development

WORKDIR /app

# Instalar dependencias con cache
COPY package*.json ./
RUN npm install --include=dev

# Copiar código fuente
COPY . .

# Variables de entorno para desarrollo
ENV NODE_ENV=development
ENV VITE_API_URL=http://localhost:3001

# Exponer puerto de Vite
EXPOSE 5173

# Comando para desarrollo
CMD ["npm", "run", "dev", "--", "--host"]

# ========= ETAPA DE PRODUCCIÓN =========
FROM node:${NODE_VERSION} AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.25-alpine AS production

# Copiar build de producción
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto HTTP
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s \
    CMD curl -f http://localhost/ || exit 1