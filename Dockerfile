FROM node:16.13.1

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build:ts

ENV NODE_ENV=production

CMD ["npm","start"]