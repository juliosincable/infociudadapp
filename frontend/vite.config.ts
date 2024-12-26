import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['history']
    }
  },
  server: {
    host: '0.0.0.0', // Permitir que el servidor sea accesible externamente
    port: 3000,      // Especificar el puerto 3000
    https: false     // Asegurarse de que HTTPS esté deshabilitado
  }
});
