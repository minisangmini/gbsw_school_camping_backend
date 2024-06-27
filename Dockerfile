FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
COPY .env ./
RUN npm install --omit=dev

EXPOSE 3000
CMD ["node", "dist/main"]