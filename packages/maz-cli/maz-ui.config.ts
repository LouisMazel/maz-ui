import { defineConfig } from './src/cli'

export default defineConfig({
  outputCssFilePath: './variables.css',
  theme: {
    colors: {
      primary: '#8d17fe',
      secondary: '#50e3c2',
    },
  },
})
