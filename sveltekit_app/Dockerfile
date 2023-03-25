# Build stage
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:18 AS deploy-node
WORKDIR /app
COPY --from=build /app/package*.json .
RUN npm ci --omit dev
COPY --from=build /app/build .
COPY --from=build /app/prisma .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
