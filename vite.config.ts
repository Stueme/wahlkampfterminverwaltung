
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/wahlkampfterminverwaltung/',
  server: {
    open: true,
    port: 3000,
  }
})
