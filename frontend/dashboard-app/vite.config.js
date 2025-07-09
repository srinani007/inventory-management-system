import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/auth': {
        target: 'http://localhost:8081', // user-service
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/auth/, '/api/auth'),
      },
      '/api/inventory': {
        target: 'http://localhost:8082', // inventory-service
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/inventory/, '/api/inventory'),
      },
      '/api/orders': {
        target: 'http://localhost:8083', // order-service
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/orders/, '/api/orders'),
      },
      '/api/notify': {
        target: 'http://localhost:8084', // notification-service
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/notify/, '/api/notify'),
      },
    },
  },
});
