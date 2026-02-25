# --- ESTADIO 1: EL TEMPLO (Preparación) ---
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat && \
    npm install -g node-prune

WORKDIR /app

# Usamos un "Cache Mount" para que la carpeta .npm no se guarde en la imagen
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .
RUN npm run build

# --- ESTADIO 2: LA PURGA (Optimización extrema de node_modules) ---
# Instalamos solo producción y podamos agresivamente
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev && \
    node-prune && \
    # Limpieza manual de archivos que node-prune olvida
    find node_modules -type f -name "*.md" -delete && \
    find node_modules -type f -name "*.ts" -delete && \
    find node_modules -type d -name "test" -exec rm -rf {} +

# --- ESTADIO 3: EL REINO DIVINO (Runtime puro) ---
FROM node:20-alpine AS runtime

# Variables de entorno sagradas
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    PATH="/app/node_modules/.bin:$PATH"

WORKDIR /app

# Creamos el usuario celestial
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 astro

# COPIA ATÓMICA: Solo lo estrictamente necesario
# No copiamos package.json ni npm porque ya no los usaremos
COPY --from=builder --chown=astro:nodejs /app/dist ./dist
COPY --from=builder --chown=astro:nodejs /app/node_modules ./node_modules

# Healthcheck usando Fetch nativo de Node 20 (cero dependencias extra)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

USER astro
EXPOSE 3000

# Comando para arrancar el servidor
CMD ["npm", "run", "start"]