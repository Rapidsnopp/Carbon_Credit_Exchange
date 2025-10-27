import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Thêm polyfill cho 'buffer'
      buffer: 'buffer/',
    },
  },
  define: {
    // Cung cấp biến global `Buffer` cho trình duyệt
    'global.Buffer': global.Buffer,
  },
})
