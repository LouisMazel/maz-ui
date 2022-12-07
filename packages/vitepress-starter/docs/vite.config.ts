import { join } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    fs: {
      allow: ['./../../lib'],
    },
  },
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
      '~': join(__dirname, 'src'),
      '@package': join(__dirname, './../../../lib/package'),
      '@components': join(__dirname, './../../../lib/package/components'),
    }
  }
});