
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/termine-anzeige-vue-3-projekt/',
  server: {
    open: true,
    port: 3000,
  }
})
