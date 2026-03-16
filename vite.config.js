import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import htmlPlugin from 'vite-plugin-html-config'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    htmlPlugin({
      title: 'Accuflow Liff'
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});