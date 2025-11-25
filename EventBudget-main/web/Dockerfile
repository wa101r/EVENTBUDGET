FROM node:20-alpine

WORKDIR /app

# Install curl (ใช้ apk)
RUN apk update && apk add curl

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000
CMD ["yarn", "dev"]
