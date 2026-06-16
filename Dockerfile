FROM node:22-alpine AS build

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run prisma:generate
RUN npm run build
RUN npm prune --omit=dev

FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache libc6-compat

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
