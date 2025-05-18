ARG NGINX_ENV=local
FROM nginx:alpine

ARG NGINX_ENV

COPY nginx_${NGINX_ENV}.conf /etc/nginx/nginx.conf
