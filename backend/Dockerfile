FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 4370
ENV DATA_PATH=/data
ENV USERS_FILE_PATH=/auth.json

CMD ["npm", "start"]
