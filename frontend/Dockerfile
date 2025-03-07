FROM node:18-bookworm-slim AS BUILD_IMAGE

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .


