FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./


RUN npm ci --only=production && npm cache clean --force

COPY . .

FROM node:22-alpine 

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/. ./
RUN npm run build
COPY --from=builder /app/dist ./dist


ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# Comando para arrancar el servidor
CMD ["npm", "run", "start"]