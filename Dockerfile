FROM node:alpine
WORKDIR /src/app
COPY package.json .
RUN npm install
ENV HTTP_PORT=3001
ENV HTTPS_PORT=5001
EXPOSE 3001 5001
COPY . .
CMD ["node","build/index.js"]