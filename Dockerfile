FROM node:alpine

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 3030

CMD ["npm", "start"]