FROM node:20-alpine AS builder
WORKDIR /app

# On copie le dossier partagé et les dépendances
COPY shared/ ./shared/
COPY frontend/package*.json ./frontend/

WORKDIR /app/frontend
RUN npm install

# 🪄 L'ASTUCE MAGIQUE EST ICI :
# On crée un raccourci à la racine pour que 'shared' trouve 'zod'
RUN ln -s /app/frontend/node_modules /app/node_modules

# On copie le reste du code et on build
COPY frontend/ ./
RUN npm run build

# Étape Nginx
FROM nginx:alpine
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]