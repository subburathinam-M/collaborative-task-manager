import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    commonjsOptions: {
      include: [/axios/, /node_modules/]
    }
  },
  optimizeDeps: {
    include: ['axios']
  }
})