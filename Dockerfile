# Build the Nuxt static site
FROM node:22-alpine AS builder

WORKDIR /app

ARG NUXT_PUBLIC_EMAILJS_SERVICE_ID=""
ARG NUXT_PUBLIC_EMAILJS_TEMPLATE_ID=""
ARG NUXT_PUBLIC_EMAILJS_PUBLIC_KEY=""

ENV NUXT_PUBLIC_EMAILJS_SERVICE_ID=$NUXT_PUBLIC_EMAILJS_SERVICE_ID
ENV NUXT_PUBLIC_EMAILJS_TEMPLATE_ID=$NUXT_PUBLIC_EMAILJS_TEMPLATE_ID
ENV NUXT_PUBLIC_EMAILJS_PUBLIC_KEY=$NUXT_PUBLIC_EMAILJS_PUBLIC_KEY

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run generate

# Serve the generated static files with NGINX
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/.output/public /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
