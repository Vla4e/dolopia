import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import compression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.PNG'],
  logLevel: 'silent',
  plugins: [
    vue()
    // Generate .gz files
    // compression({
    //   algorithm: 'gzip',
    //   ext: '.gz',
    //   deleteOriginFile: false, // Keep the original uncompressed files
    // }),
    // // Generate .br files
    // compression({
    //   algorithm: 'brotliCompress',
    //   ext: '.br',
    //   deleteOriginFile: false,
    // }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
