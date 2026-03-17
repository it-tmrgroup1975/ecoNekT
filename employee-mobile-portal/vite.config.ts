import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // เชื่อมต่อ Tailwind v4
  ],
  server: {
    port: 3000, // กำหนด Port ให้คงที่สำหรับ Admin
    proxy: {
      '/api': 'http://localhost:8000' // Proxy ไปยัง Django Backend
    }
  }
})