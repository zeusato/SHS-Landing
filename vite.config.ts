import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/SHS-Landing/', // đúng bằng tên repo của đại ca
})
