import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, 'public')

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-public-directories',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const urlPath = req.url ? req.url.split('?')[0] : ''
          const cleanPath = urlPath.replace(/\/+$/, '')
          if (cleanPath && !cleanPath.includes('.')) {
            const candidate = path.join(publicDir, cleanPath, 'index.html')
            if (fs.existsSync(candidate)) {
              const query = req.url && req.url.includes('?') ? '?' + req.url.split('?')[1] : ''
              req.url = `${cleanPath}/index.html${query}`
            }
          }
          next()
        })
      },
    },
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5002',
        changeOrigin: true,
      },
    },
  },
})
