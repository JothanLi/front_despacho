FROM node:20.19-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine
WORKDIR /usr/share/nginx/html

ENV VENTAS_UPSTREAM=ventas-service:8080 \
    DESPACHOS_UPSTREAM=despachos-service:8080 \
    NGINX_ENVSUBST_FILTER='^(VENTAS_UPSTREAM|DESPACHOS_UPSTREAM)$'

COPY --from=build /app/dist ./
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 8080
USER 101

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
