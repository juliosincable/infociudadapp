# Usar la imagen base de Node
FROM node:18

# Crear directorio de la aplicación
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto de la aplicación
EXPOSE 4000

# Comando para ejecutar la aplicación en modo desarrollo
CMD ["npm", "run", "dev"]

RUN npm install -g nodemon

