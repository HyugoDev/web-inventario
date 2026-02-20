# 1. Etapa de dependencias
FROM node:20-slim AS deps
WORKDIR /app
COPY package*.json ./
# Instalamos todas las dependencias (incluyendo las de desarrollo para el build)
RUN npm install

# 2. Etapa de construcción
FROM node:20-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Etapa de producción (la imagen final, muy ligera)
FROM node:20-slim AS runtime
WORKDIR /app

# Solo copiamos lo estrictamente necesario para ejecutar
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

# Instalamos solo dependencias de producción para ahorrar espacio
RUN npm install --omit=dev

# Variables de entorno por defecto
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# Comando para arrancar el servidor
CMD ["node", "./dist/server/entry.mjs"]