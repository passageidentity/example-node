FROM node:14-alpine

WORKDIR /app
COPY *.json ./
RUN npm i
COPY . .
EXPOSE 5000
RUN npm install --production=true
CMD ["npm", "start"]