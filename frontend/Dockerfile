# --- Etapa 1: Construcción de la aplicación frontend ---
# Usa una imagen de Node.js para instalar dependencias y compilar tu app Ionic/Vite
# Usamos la versión alpine para una imagen más pequeña para un tamaño de imagen final más pequeño.
FROM node:18-alpine AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración de paquetes (package.json y package-lock.json o yarn.lock)
# Esto es una optimización de caché de Docker: si estas dependencias no cambian, Docker no reinstalará todo.
COPY package*.json ./

# Instala TODAS las dependencias.
# Necesitamos las dependencias de desarrollo (como 'typescript', 'vite') para el paso de 'build'.
RUN npm install --legacy-peer-deps

# AÑADIDO: Instala SASS para poder compilar archivos SCSS
RUN npm install -D sass

# Copia todo el código fuente de tu aplicación al contenedor.
COPY . .

# ¡CRUCIAL! Ejecuta el script de construcción de tu aplicación.
# Esto generará los archivos estáticos (HTML, CSS, JS) que Nginx servirá.
# Asegúrate de que tienes un script 'build' en tu package.json, por ejemplo: "build": "tsc && vite build"
RUN npm run build

# --- Etapa 2: Servir la aplicación con Nginx ---
# Usa una imagen ligera de Nginx como base para el servidor web.
FROM nginx:alpine

# Elimina la configuración por defecto de Nginx si existe, para evitar conflictos.
RUN rm -f /etc/nginx/conf.d/default.conf

# REPARADO: Copia tu archivo de configuración personalizado 'nginx-custom.conf'.
# ESTO SOLUCIONA EL ERROR "nginx.conf": not found (LÍNEA 37)
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

# Copia la salida de la compilación (los archivos estáticos) desde la etapa 'builder'
# Asume que la ruta de salida de Vite es 'dist'. Si Ionic usa otra (ej. 'www'), ajústala.
# La ruta de origen es /app/dist dentro de la etapa 'builder'.
# La ruta de destino es /usr/share/nginx/html, donde Nginx busca los archivos web por defecto.
COPY --from=builder /app/dist /usr/share/nginx/html

# Expone el puerto 80 del contenedor, que es el puerto HTTP estándar para el tráfico web.
EXPOSE 80

# El comando principal para mantener Nginx en ejecución en primer plano.
# Esto es necesario para que el contenedor siga funcionando.
CMD ["nginx", "-g", "daemon off;"]