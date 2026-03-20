FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "run", "start"]
