import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glb'],
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei', '@react-three/rapier', 'meshline'],
          'react-vendor': ['react', 'react-dom'],
          'icons-vendor': ['react-icons'],
          'motion-vendor': ['framer-motion'],
          'styled-vendor': ['styled-components'],
        },
      },
    },
  },
})
