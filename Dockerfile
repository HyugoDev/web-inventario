# --- ESTADIO 1: EL TEMPLO (Preparación) ---
FROM node:20-alpine AS builder
# Instalamos curl para bajar el podador y libc6-compat para compatibilidad
RUN apk add --no-cache libc6-compat curl && \
    # Descargamos el binario de node-prune directamente
    curl -sf https://gobinaries.com/tj/node-prune | sh

WORKDIR /app

# Cache Mount para no ensuciar la imagen con la caché de npm
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .
RUN npm run build

# --- ESTADIO 2: LA PURGA (Optimización extrema) ---
# Instalamos solo producción y ejecutamos la poda divina
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev && \
    /usr/local/bin/node-prune && \
    # Limpieza manual usando comandos compatibles con Alpine (sh)
    find node_modules -type f -name "*.md" -exec rm -f {} + && \
    find node_modules -type f -name "*.ts" -exec rm -f {} + && \
    find node_modules -type d -name "test" -exec rm -rf {} +

# --- ESTADIO 3: EL REINO DIVINO (Runtime puro) ---
FROM node:20-alpine AS runtime

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

WORKDIR /app

# Usuario celestial
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 astro

# Copiamos solo la esencia del proyecto
COPY --from=builder --chown=astro:nodejs /app/dist ./dist
COPY --from=builder --chown=astro:nodejs /app/node_modules ./node_modules

# Healthcheck usando Fetch de Node 20 (nativo, sin curl en la imagen final)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

USER astro
EXPOSE 3000
# Comando para arrancar el servidor
CMD ["npm", "run", "start"]