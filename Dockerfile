FROM node:alpine as build

EXPOSE 3001 5001

WORKDIR /app

RUN mkdir -p build/

COPY package*.json ./

RUN npm install --silent

RUN npm install -g typescript

COPY src/ ./src

COPY tsconfig.json ./

RUN tsc

FROM node:alpine as prod 

RUN apk add --no-cache tini

COPY package*.json ./

COPY --from=build /app/build ./build 

RUN npm install --silent && npm cache clean --force

ENTRYPOINT ["/sbin/tini","--"]

CMD ["node","build/index.js"]
