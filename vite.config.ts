import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5199,
  },

  build: {
    rollupOptions: {
      output: {

        /**
         * 2.以函数的形式使用
         * 将第三方包全部打包在一个chunk中，名称叫 vendor
         */
        manualChunks(id, { getModuleInfo, getModuleIds }) {
          if (id.includes('svg')) {
            return 'svg';
          }
        },
      },
    },
  },

})
