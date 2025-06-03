import { defineConfig } from '@mazui/cli'

export default defineConfig({
  outputCssFilePath: './src/css/maz-ui-variables.css',
  theme: {
    colors: {
      primary: 'hsl(210, 100%, 56%)',
      secondary: 'hsl(164, 76%, 46%)',
      lightTheme: {
        textColor: 'hsl(0, 0%, 85%)',
        colorMuted: 'hsla(0, 0%, 0%, 0.54)',
        bgColor: 'hsl(0, 0%, 100%)',
      },
      darkTheme: {
        textColor: 'hsl(210, 8%, 14%)',
        colorMuted: 'hsla(0, 0%, 100%, 0.54)',
        bgColor: 'hsl(235, 16%, 15%)',
      },
    },
  },
})
