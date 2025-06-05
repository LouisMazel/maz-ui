import { defineConfig } from '@maz-ui/cli'

export default defineConfig({
  outputCssFilePath: './css/maz-ui-variables.css',
  theme: {
    colors: {
      primary: 'hsl(210, 100%, 56%)',
      secondary: 'hsl(164, 76%, 46%)',
      info: 'hsl(188, 78%, 41%)',
      success: 'hsl(80, 61%, 50%)',
      warning: 'hsl(40, 97%, 59%)',
      danger: 'hsl(1, 100%, 71%)',
      bgOverlay: 'hsla(0, 0%, 0%, 0.3)',
      lightTheme: {
        textColor: 'hsl(0, 0%, 85%)',
        colorMuted: 'hsla(0, 0%, 0%, 0.54)',
        bgColor: 'hsl(0, 0%, 100%)',
      },
      darkTheme: {
        textColor: 'hsl(210, 8%, 14%)',
        colorMuted: 'hsla(0, 0%, 89%, 0.54)',
        bgColor: 'hsl(235, 16%, 15%)',
      },
    },
    borderRadius: '0.5rem',
    borderWidth: '0.125rem',
    fontFamily: '',
  },
})
