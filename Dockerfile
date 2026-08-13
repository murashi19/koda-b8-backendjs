FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 8080

CMD ["sh", "-c", "npx sequelize-cli db:migrate && npm start"]