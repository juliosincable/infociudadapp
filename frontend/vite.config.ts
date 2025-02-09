import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'axios': resolve(__dirname, 'node_modules/axios/index.js'), // Alias específico para axios
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    hmr: {
      overlay: false,
    },
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // URL de tu backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
