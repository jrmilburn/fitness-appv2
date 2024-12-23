FROM node:18-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN apt-get update && \
    apt-get install -y openssl && \
    npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

RUN npm run build


CMD ["npm", "start"]
