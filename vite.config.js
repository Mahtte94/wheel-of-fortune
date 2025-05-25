import { defineConfig , loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
  define: {
    __APP_ENV__: JSON.stringify(env.APP_ENV),
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
}
})