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
# ¡CAMBIO CLAVE AQUÍ!
RUN npm install --legacy-peer-deps

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

# Crea un nuevo archivo de configuración para Nginx que:
# 1. Sirva los archivos estáticos de tu aplicación Ionic/React.
# 2. Actúe como proxy inverso para todas las peticiones que empiecen con /api/ y las redirija al backend.
RUN echo "server { \
  listen 80; \
  \
  # Configuración para servir los archivos estáticos de tu frontend (Ionic/React)
  location / { \
    root /usr/share/nginx/html; \
    index index.html; \
    try_files \$uri \$uri/ /index.html; \
  } \
  \
  # Configuración de proxy para redirigir peticiones /api/ al servicio backend
  location /api/ { \
    # 'backend' es el nombre del servicio Docker de tu backend (definido en docker-compose.yml)
    # '4000' es el puerto interno en el que tu aplicación Node.js de backend está escuchando
    proxy_pass http://backend:4000/api/; \
    \
    # Encabezados para pasar información útil (como la IP real del cliente) al backend
    proxy_set_header Host \$host; \
    proxy_set_header X-Real-IP \$remote_addr; \
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for; \
    proxy_set_header X-Forwarded-Proto \$scheme; \
  } \
}" > /etc/nginx/conf.d/default.conf

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