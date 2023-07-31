FROM node
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 1000
CMD [ "node","index.js" ]