import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import polyfillNode from 'rollup-plugin-polyfill-node';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['buffer', 'process'],
  },
  build: {
    rollupOptions: {
      plugins: [polyfillNode()],
    },
  },
  define: {
    global: 'globalThis',
  },
});
