import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [
        'C:/Users/AVH-COM-330/.gemini/antigravity/brain/adacf84f-06ac-4e01-bc1e-3553a5b4b551',
        'C:/Users/AVH-COM-330/Documents/Proyecto_Propio_Mike'
      ]
    }
  }
})
