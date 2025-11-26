import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    commonjsOptions: {
      include: [/axios/, /node_modules/]
    }
  },
  optimizeDeps: {
    include: ['axios']
  }
})