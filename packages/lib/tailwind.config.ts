// Tailwind CSS configuration (https://tailwindcss.com/docs/configuration)
import type { Config } from 'tailwindcss'
import tailwindConfigBase from './tailwindcss/tailwind.config'
import plugin from 'tailwindcss/plugin'

export default <Config>{
  mode: 'build',
  presets: [tailwindConfigBase],
  content: {
    files: ['./modules/**/*', './components/**/*', 'tailwindcss/**/*', '!components_tmp/**/*'],
    transform: {
      vue: (content) => {
        const regex = /<style[^>]*>([\S\s]*?)<\/style>/g
        return content.replaceAll(regex, '')
      },
    },
  },
  prefix: 'maz-',
  corePlugins: {
    preflight: false,
    container: false,
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('em', ({ container }) => {
        container.walkRules((rule) => {
          rule.selector = `.em\\:${rule.selector.slice(1)}`
          rule.walkDecls((decl) => {
            decl.value = decl.value.replace('rem', 'em')
          })
        })
      })
    }),
  ],
}
