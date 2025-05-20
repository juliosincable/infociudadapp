# --- Etapa 1: Construcción de la aplicación frontend ---
# Usa una imagen de Node.js para instalar dependencias y compilar tu app Ionic/Vite
# Usamos la versión alpine para una imagen más pequeña
FROM node:18-alpine AS builder

WORKDIR /app

# Copia los archivos de configuración de paquetes (package.json, package-lock.json o yarn.lock)
# Esto aprovecha el cache de Docker si las dependencias no cambian
COPY package*.json ./

# Instala TODAS las dependencias (producción y desarrollo)
# Necesitamos las dependencias de desarrollo (como 'typescript') para el paso de 'build'.
RUN npm install

# Copia todo el código fuente de tu aplicación al contenedor
COPY . .

# ¡CRUCIAL! Ejecuta el script de construcción de tu aplicación.
# Esto generará los archivos estáticos (HTML, CSS, JS) que Nginx servirá.
# Asume que tienes un script 'build' en tu package.json, por ejemplo: "build": "tsc && vite build"
RUN npm run build

# --- Etapa 2: Servir la aplicación con Nginx ---
# Usa una imagen ligera de Nginx como base para el servidor web
FROM nginx:alpine

# Elimina la configuración por defecto de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Crea una configuración simple para SPA directamente en el Dockerfile:
RUN echo "server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files \$uri \$uri/ /index.html; } }" > /etc/nginx/conf.d/default.conf

# Copia la salida de la compilación (los archivos estáticos) desde la etapa 'builder'
# La ruta de salida de Vite es comúnmente 'dist'. Si Ionic usa otra (ej. 'www'), ajusta.
# Asegúrate de que '/app/dist' sea la ruta correcta donde Vite guarda los archivos compilados.
COPY --from=builder /app/dist /usr/share/nginx/html

# Expone el puerto 80, que es el puerto HTTP estándar que Nginx usará.
EXPOSE 80

# ¡EL COMANDO CRÍTICO! Mantiene Nginx en ejecución en primer plano.
# Si este comando no se ejecuta, el contenedor se detendrá inmediatamente.
CMD ["nginx", "-g", "daemon off;"]
