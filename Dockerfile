# 1. Etapa de dependencias (Caché eficiente)
FROM node:20-alpine AS deps
# Instalamos libc6-compat porque algunas librerías de Node (como Sharp) lo necesitan en Alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# 2. Etapa de construcción
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Etapa de producción (Imagen final ultra ligera)
FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Creamos un usuario sin privilegios para mayor seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 astro

# Copiamos solo lo necesario
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

# Instalamos solo dependencias de producción de forma limpia
RUN npm ci --omit=dev

USER astro

EXPOSE 3000

# Comando para arrancar el servidor
CMD ["npm", "run", "start"]