import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api/': {
        target: `${process.env.API_URL}/`,
        changeOrigin: true,
      },
    },
  },
  define: {
    'process.env': {},
  },
});
