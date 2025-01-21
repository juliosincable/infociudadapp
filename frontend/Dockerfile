# Usar la imagen base de Node.js
FROM node:18

# Configurar el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de configuración de dependencias
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Exponer el puerto en el que la aplicación correrá
EXPOSE 3000

# Comando por defecto para ejecutar la aplicación
CMD ["npm", "start"]
