FROM node:alpine as prod

ENV NODE_ENV=production

EXPOSE 3001 5001

WORKDIR /src/app

COPY package*.json ./

RUN npm install --silent && npm cache clean --force

COPY . .

CMD ["node","build/index.js"]