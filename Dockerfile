# Build the Nuxt static site
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
# Match the npm version that generated package-lock.json (lockfileVersion 3, npm 11).
# node:22-alpine ships npm 10, which misreads nested optional wasm deps as missing.
RUN npm install -g npm@11 && npm ci

COPY . .
RUN npm run generate

# Serve the generated static files with NGINX
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/.output/public /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
