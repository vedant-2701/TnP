import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    allowedHosts: [
      "0a70-2401-4900-561b-7b82-f547-b72d-59b6-9f7b.ngrok-free.app"
    ],
  },
})
