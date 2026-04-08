import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 6767,
  },
  envDir: '.',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
