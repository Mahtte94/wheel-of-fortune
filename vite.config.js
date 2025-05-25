import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  define: {
    __APP_ENV__: process.env.VITE_VERCEL_ENV,
  },
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://yrgobanken.vip",
        changeOrigin: true,
        secure: false,
      }
    }
  }
})