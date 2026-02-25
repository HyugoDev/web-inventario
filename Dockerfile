# 1. Etapa de dependencias (Instalación completa)
FROM node:20-alpine AS deps
# libc6-compat es necesaria para librerías nativas en Alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiamos ambos para que npm ci no falle
COPY package*.json ./
RUN npm ci

# 2. Etapa de construcción (Build)
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Etapa de producción (Imagen final)
FROM node:20-alpine AS runtime
# Instalamos curl para que el Healthcheck de Dokploy funcione
RUN apk add --no-cache curl
WORKDIR /app

# Variables de entorno
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Seguridad: Creamos un usuario para no correr como root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 astro

# Instalamos SOLO dependencias de producción y limpiamos caché
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copiamos el build y asignamos permisos al usuario astro de una vez
COPY --from=build --chown=astro:nodejs /app/dist ./dist

# Monitoreo de salud: Si el puerto 3000 no responde, el contenedor se reinicia
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Usamos el usuario limitado
USER astro

EXPOSE 3000

# Comando para arrancar el servidor
CMD ["npm", "run", "start"]