FROM node:17.2 as base
RUN mkdir -p /var/www/hal9001/app
WORKDIR /var/www/hal9001/app
RUN apt-get update
RUN npm install -g ts-node && npm install -g typescript
COPY package*.json ./
RUN npm i
COPY . .