import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/detection': 'https://visvine-api.pushed.nz',
      '/api/v1': '/api/v1',
    },
  },
})
