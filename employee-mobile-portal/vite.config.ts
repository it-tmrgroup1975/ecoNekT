import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path" // ตอนนี้จะใช้งานได้ไม่แดงแล้วหลังจากลง @types/node

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // กำหนด Alias
    },
  },
})