FROM node:14-alpine

WORKDIR /app
COPY *.json ./
RUN npm install --production=true
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
