FROM node:16-slim

WORKDIR /app

COPY package.json .

RUN npm i

COPY . . 

ARG START_SCRIPT="start-dev"

ENV START_SCRIPT=${START_SCRIPT}

CMD npm run ${START_SCRIPT}