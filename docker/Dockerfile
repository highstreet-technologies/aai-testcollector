FROM node:10-alpine
WORKDIR /home/node/
COPY dist dist
COPY package.json .
RUN npm install
ENTRYPOINT node dist/server.js
