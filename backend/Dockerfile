FROM node:20-slim
RUN apt-get update && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update && apt-get install -y google-chrome-stable --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /app
COPY shared/ ./shared/
COPY backend/package*.json ./backend/

WORKDIR /app/backend
RUN npm install

# 🪄 L'ASTUCE MAGIQUE POUR RÉSOUDRE L'ERREUR ZOD :
RUN ln -s /app/backend/node_modules /app/node_modules

COPY backend/ ./
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
CMD ["sh", "-c", "npx prisma db push && npm start"]