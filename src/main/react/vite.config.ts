import { defineConfig } from 'vite';
import { resolve } from 'path';
import reactRefresh from '@vitejs/plugin-react-refresh';
import styleImport from 'vite-plugin-style-import';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        login: resolve(__dirname, 'login.html'),
        index: resolve(__dirname, 'index.html')
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

// With undefined and not lazy loading form.
// dist/assets/favicon.17e50649.svg   1.49kb
// dist/index.html                    0.45kb
// dist/assets/index.32fbe31e.css     266.32kb / brotli: 21.77kb
// dist/assets/index.352b9e3f.js      745.58kb / brotli: skipped (large chunk)

// With undefined and lazy loading form.
// dist/assets/favicon.17e50649.svg    1.49kb
// dist/index.html                     0.45kb
// dist/assets/AddressForm.df5a2943.js    64.34kb / brotli: 17.65kb
// dist/assets/AddressForm.1cd0535f.css   110.33kb / brotli: 7.26kb
// dist/assets/index.823eaf12.css      155.99kb / brotli: 15.45kb
// dist/assets/index.fc3c8193.js       682.97kb / brotli: skipped (large chunk)

// With default and not lazy loading form.
// dist/assets/favicon.17e50649.svg   1.49kb
// dist/index.html                    0.57kb
// dist/assets/index.0f6347ea.css     0.06kb / brotli: 0.05kb
// dist/assets/index.e9a015ec.js      4.26kb / brotli: 1.31kb
// dist/assets/vendor.c59dd2f4.css    266.26kb / brotli: 21.80kb
// dist/assets/vendor.0caa1b19.js     742.10kb / brotli: skipped (large chunk)

// With default and lazy loading form.
// dist/assets/favicon.17e50649.svg    1.49kb
// dist/index.html                     0.57kb
// dist/assets/index.0f6347ea.css      0.06kb / brotli: 0.05kb
// dist/assets/AddressForm.d7c4ad38.js    1.42kb / brotli: 0.56kb
// dist/assets/index.799da07a.js       3.77kb / brotli: 1.31kb
// dist/assets/AddressForm.1cd0535f.css   110.33kb / brotli: 7.26kb
// dist/assets/vendor.5e6c4b80.css     155.93kb / brotli: 15.43kb
// dist/assets/vendor.3e668620.js      742.10kb / brotli: skipped (large chunk)
