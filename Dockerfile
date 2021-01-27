FROM node:alpine
WORKDIR /src/app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3001 5001
CMD ["node","build/index.js"]