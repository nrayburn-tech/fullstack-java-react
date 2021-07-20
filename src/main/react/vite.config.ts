import { resolve } from 'path';

import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';
import styleImport from 'vite-plugin-style-import';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        login: resolve(__dirname, 'login', 'index.html'),
        index: resolve(__dirname, 'user', 'index.html'),
        admin: resolve(__dirname, 'admin', 'index.html')
      },
      output: {
        manualChunks: undefined
      }
    },
    outDir: resolve(__dirname, '..', 'resources', 'static'),
    emptyOutDir: true
  },
  plugins: [
    reactRefresh(),
    styleImport({
      libs: [
        {
          libraryName: 'antd',
          esModule: true,
          resolveStyle: (name) => {
            return `antd/es/${name}/style/index`;
          }
        }
      ]
    })
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080/'
    }
  }
});
