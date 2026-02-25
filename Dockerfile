# 1. Etapa de dependencias
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# IMPORTANTE: Copiar ambos archivos para que npm ci funcione
COPY package*.json ./
RUN npm ci

# 2. Etapa de construcción
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Etapa de producción
FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 astro

# Copiamos los archivos de configuración de dependencias
COPY package*.json ./

# Ahora npm ci sí encontrará el package-lock.json
RUN npm ci --omit=dev

# Copiamos el build desde la etapa anterior
COPY --from=build /app/dist ./dist

# Cambiamos permisos para el usuario astro
RUN chown -R astro:nodejs /app

USER astro

EXPOSE 3000

# Comando para arrancar el servidor
CMD ["npm", "run", "start"]