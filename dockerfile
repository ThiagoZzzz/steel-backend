# 1: deps (instalación de dependencias de producción)
FROM dhi.io/node:24-alpine3.22-dev AS deps
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

# 2: runner
FROM dhi.io/node:24-alpine3.22-dev AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

# exponer el puerto de Express
EXPOSE 3000

# copiar dependencias limpias
COPY --from=deps /usr/src/app/node_modules ./node_modules

# copiar resto del código fuente
COPY . .

# usuario no-root
USER node

# ejecutar la app
CMD ["npm", "start"]