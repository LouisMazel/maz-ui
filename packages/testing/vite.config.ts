import { defineConfig, loadEnv } from 'vite'
import { join } from 'path'
import vue from '@vitejs/plugin-vue'

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  // https://vitejs.dev/config/
  return defineConfig({
    plugins: [vue()],
    server: {
      port: (process.env.PORT ?? 2000) as number,
      host: process.env.HOST ?? '0.0.0.0',
    },
    resolve: {
      alias: {
        '@': join(__dirname, 'src'),
        '~': join(__dirname, 'src'),
      },
    },
  })
}
