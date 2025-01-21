import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const config: UserConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    host: true,
    port: 3000,
    strictPort: true,  // Asegurar que Vite falle si el puerto está ocupado
    hmr: {
      overlay: false,
    },
    cors: true,  // Habilitar CORS
  },
  build: {
    outDir: 'dist',
    sourcemap: true,  // Generar mapas de código fuente para la depuración
  },
};

export default defineConfig(config);

