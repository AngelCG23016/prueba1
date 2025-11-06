# ---- Stage 1: build Angular app ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# ---- Stage 2: servidor Nginx ----
FROM nginx:stable-alpine

# 1) Copiar el contenido prerendered si existe (browser/)
COPY --from=build /app/dist/frontend-angular/browser/ /usr/share/nginx/html/

# 2) Copia genérica por seguridad: copia el resto de dist al root
COPY --from=build /app/dist/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]