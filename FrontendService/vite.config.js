import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'web3': 'web3',
      '@web3-react/core': '@web3-react/core',
    }
  }
})
