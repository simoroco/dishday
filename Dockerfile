FROM node:18-alpine

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY prisma ./prisma
RUN npx prisma generate

COPY server ./server

WORKDIR /app/client
COPY client/package*.json ./
RUN npm install

COPY client/public ./public
COPY client/src ./src

RUN npm run build

WORKDIR /app

RUN mkdir -p /app/server/data/photos

ENV NODE_ENV=production
ENV PORT=5000
ENV DATABASE_URL=file:/app/server/data/dishday.db

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && node server/seed.js 2>/dev/null || true && node server/index.js"]
