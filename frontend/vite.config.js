import path from "path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    watch: {
      usePolling: true,
    },
    proxy: {
    // API REST
    '/api': {
      target: 'http://backend:3001',
      changeOrigin: true,
    },
    // Socket.IO (todas las variantes)
    '/socket.io': {
      target: 'http://backend:3001',  // Puede ser http o ws
      ws: true,  // ¡Esencial para WebSockets!
      changeOrigin: true,
    }
  } 
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
})
