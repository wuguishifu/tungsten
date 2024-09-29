# build frontend
FROM node:18-alpine AS build-frontend
LABEL org.opencontainers.image.description All-in-one docker container for Tungsten (https://github.com/wuguishifu/tungsten). Built by Bo Bramer (@wuguishifu)

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# build backend + serve
FROM node:18-alpine

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

COPY --from=build-frontend /app/frontend/dist ./public
EXPOSE 4370

ENV VITE_PUBLIC_API_URL=http://localhost:4370
ENV NODE_ENV=production
ENV DATA_PATH=/data
ENV USERS_FILE_PATH=/auth.json

CMD ["node", "server.js"]
