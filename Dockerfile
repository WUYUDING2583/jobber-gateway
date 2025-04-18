FROM node:23-alpine3.20 as builder

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY .npmrc ./
COPY src ./src
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile && pnpm build

FROM node:23-alpine3.20
WORKDIR /app
RUN apk add --no-cache curl

COPY package.json ./
COPY tsconfig.json ./
COPY .npmrc ./

RUN npm install -g pnpm pm2
RUN pnpm install --frozen-lockfile --prod
COPY --from=builder /app/build ./build

EXPOSE 4000

CMD ["pnpm", "start"]