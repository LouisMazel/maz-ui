import { cleanTempDirs, createTempDir, getContext, writeFakeMazUi, writeFile } from '../../__tests__/helpers.ts'
import { getProjectInfo } from '../../tools/get-project-info.ts'
import { readProjectInfo, renderProjectInfo } from '../info.ts'

const COMPONENTS = ['MazBtn', 'MazInput', 'MazCard']

afterEach(() => {
  cleanTempDirs()
})

function createVueApp(directory: string, { mainTs = '', viteConfig = '' } = {}): void {
  writeFile(directory, 'package.json', JSON.stringify({ dependencies: { 'maz-ui': '^5.0.0' } }))
  writeFakeMazUi(directory, { version: '5.8.0' })
  writeFile(directory, 'src/main.ts', mainTs)
  writeFile(directory, 'vite.config.ts', viteConfig)
}

describe('given readProjectInfo', () => {
  describe('when a Vue app installs maz-ui with its plugins and the Vite plugin', () => {
    it('then it reports the setup and the tools already used', async () => {
      const cwd = createTempDir()
      createVueApp(cwd, {
        mainTs: 'import { MazUi } from \'maz-ui/plugins/maz-ui\'\nimport { ToastPlugin } from \'maz-ui/plugins/toast\'\napp.use(MazUi, { theme: { preset } })\napp.use(ToastPlugin)\n',
        viteConfig: 'import { MazUi } from \'@maz-ui/vite-plugin\'\nimport { MazComponentsResolver } from \'maz-ui/resolvers\'\nexport default { plugins: [MazUi(), Components({ resolvers: [MazComponentsResolver()] })] }\n',
      })
      writeFile(cwd, 'src/App.vue', '<template><MazBtn /><MazBtn /><maz-input /><MazUnknown /></template>\n<script setup lang="ts">\nimport { useToast } from \'maz-ui/composables/useToast\'\nimport { debounce } from \'@maz-ui/utils/helpers/debounce\'\nconst a = ref<MazBtnProps>()\n</script>\n')
      writeFile(cwd, 'src/theme.ts', 'import { definePreset } from \'@maz-ui/themes\'\nexport const brandPreset = definePreset({ base: mazUi, overrides: {} })\n')

      const [app] = await readProjectInfo(cwd, COMPONENTS)

      expect(app).toMatchObject({
        path: '.',
        framework: 'vue',
        versions: { 'maz-ui': '5.8.0' },
        plugins: ['ToastPlugin'],
        aos: false,
        mazUiPlugin: true,
        iconsByName: true,
        componentsAutoImported: true,
        presets: ['brandPreset'],
        usage: { components: [['MazBtn', 2], ['MazInput', 1]], tools: [['debounce', 1], ['useToast', 1]] },
      })
    })
  })

  describe('when a Nuxt app enables plugins in its config', () => {
    it('then it reads them from the mazUi options', async () => {
      const cwd = createTempDir()
      writeFile(cwd, 'package.json', JSON.stringify({ devDependencies: { '@maz-ui/nuxt': '^5.0.0' } }))
      writeFile(cwd, 'nuxt.config.ts', 'export default defineNuxtConfig({ modules: [\'@maz-ui/nuxt\'], mazUi: { plugins: { toast: true, dialog: false, wait: true } } })\n')

      const [app] = await readProjectInfo(cwd, COMPONENTS)

      expect(app).toMatchObject({ framework: 'nuxt', plugins: ['ToastPlugin', 'WaitPlugin'], aos: false, mazUiPlugin: true, iconsByName: true, componentsAutoImported: true, versions: {} })
    })
  })

  describe('when a monorepo has apps with and without maz-ui', () => {
    it('then it lists the apps that use maz-ui', async () => {
      const cwd = createTempDir()
      writeFile(cwd, 'package.json', JSON.stringify({ private: true }))
      writeFile(cwd, 'pnpm-workspace.yaml', 'packages:\n  - apps/*\n')
      createVueApp(`${cwd}/apps/web`)
      writeFile(cwd, 'apps/api/package.json', JSON.stringify({ dependencies: { express: '^5.0.0' } }))

      expect((await readProjectInfo(cwd, COMPONENTS)).map(app => app.path)).toEqual(['apps/web'])
    })
  })
})

describe('given renderProjectInfo', () => {
  describe('when no app uses maz-ui', () => {
    it('then it points to the setup guide', () => {
      expect(renderProjectInfo([])).toContain('`get_setup_guide`')
    })
  })

  describe('when a Vue app misses plugins, the Vite plugin and the MazUi plugin', () => {
    it('then it tells what to add', async () => {
      const cwd = createTempDir()
      createVueApp(cwd)

      const output = renderProjectInfo(await readProjectInfo(cwd, COMPONENTS))

      expect(output).toContain('## Project: Vue')
      expect(output).toContain('- Installed: maz-ui 5.8.0')
      expect(output).toContain('`app.use(MazUi)` (`maz-ui/plugins/maz-ui`) not found')
      expect(output).toContain('- Toast, dialog and wait: `useToast`, `useDialog` and `useWait` need no plugin')
      expect(output).toContain('- Animations on scroll: disabled')
      expect(output).toContain('import each one')
      expect(output).toContain('add `MazUi()` of `@maz-ui/vite-plugin` to use them by name')
      expect(output).toContain('Theme presets: the default one')
      expect(output).not.toContain('already used')
    })
  })

  describe('when a Vue app has its setup, presets and tools', () => {
    it('then it lists them', async () => {
      const cwd = createTempDir()
      createVueApp(cwd, {
        mainTs: 'app.use(MazUi)\napp.use(ToastPlugin)\n',
        viteConfig: 'export default { plugins: [MazUi(), Components({ resolvers: [MazComponentsResolver()] })] }\n',
      })
      writeFile(cwd, 'src/App.vue', '<script setup lang="ts">\nimport { useToast } from \'maz-ui/composables/useToast\'\n</script>\n')
      writeFile(cwd, 'src/theme.ts', 'export const brandPreset = definePreset({ base: mazUi, overrides: {} })\n')

      const output = renderProjectInfo(await readProjectInfo(cwd, COMPONENTS))

      expect(output).not.toContain('not found')
      expect(output).toContain('- Deprecated: `app.use(ToastPlugin)` still works, removed in v6')
      expect(output).toContain('- Components: auto-imported in the templates. Composables: deep imports')
      expect(output).toContain('- Icons: by name in the icon props')
      expect(output).toContain('- Theme presets: `brandPreset`')
      expect(output).toContain('- Composables, directives and helpers already used: `useToast` (1)')
    })
  })

  describe('when a Nuxt app of a monorepo has every plugin', () => {
    it('then it names the app and asks for nothing', async () => {
      const cwd = createTempDir()
      writeFile(cwd, 'pnpm-workspace.yaml', 'packages:\n  - apps/*\n')
      writeFile(cwd, 'package.json', JSON.stringify({ private: true }))
      writeFile(cwd, 'apps/shop/package.json', JSON.stringify({ dependencies: { '@maz-ui/nuxt': '^5.0.0' } }))
      writeFile(cwd, 'apps/shop/nuxt.config.ts', 'export default { mazUi: { plugins: { toast: true, dialog: true, wait: true, aos: true } } }\n')
      writeFile(cwd, 'apps/shop/app.vue', '<template><MazCard /></template>\n')

      const output = renderProjectInfo(await readProjectInfo(cwd, COMPONENTS))

      expect(output).toContain('## App `apps/shop`: Nuxt (`@maz-ui/nuxt`)')
      expect(output).toContain('no package of the ecosystem in node_modules')
      expect(output).toContain('- Animations on scroll: enabled (`useAos`).\n')
      expect(output).toContain('- Deprecated: `mazUi.plugins` still works, removed in v6')
      expect(output).toContain('Components: auto-imported in the templates. Composables: auto-imported.')
      expect(output).toContain('- Components already used: `MazCard` (1)')
    })
  })
})

describe('given the setup of the toasts, dialogs, loaders and animations', () => {
  describe('when the installed maz-ui is older and its composables need their plugin', () => {
    it('then it tells the plugins to install', async () => {
      const cwd = createTempDir()
      createVueApp(cwd, { mainTs: 'app.use(MazUi)\napp.use(ToastPlugin)\n' })

      const output = renderProjectInfo(await readProjectInfo(cwd, COMPONENTS), { standaloneComposables: false })

      expect(output).toContain('- Plugins: `ToastPlugin`. Before using `useToast`, `useDialog`, `useWait` or `useAos`, install the missing plugin once: `app.use(ToastPlugin)` from `maz-ui/plugins/toast` in `main.ts`.')
      expect(output).not.toContain('Deprecated')
    })
  })

  describe('when the installed maz-ui is older and a Nuxt app enables every plugin', () => {
    it('then nothing is left to install', async () => {
      const cwd = createTempDir()
      writeFile(cwd, 'package.json', JSON.stringify({ dependencies: { '@maz-ui/nuxt': '^5.0.0' } }))
      writeFile(cwd, 'nuxt.config.ts', 'export default { mazUi: { plugins: { toast: true, dialog: true, wait: true, aos: true } } }\n')

      const output = renderProjectInfo(await readProjectInfo(cwd, COMPONENTS), { standaloneComposables: false })

      expect(output).toContain('- Plugins: `ToastPlugin`, `DialogPlugin`, `WaitPlugin`, `AosPlugin`.\n')
    })
  })

  describe('when the installed maz-ui is older and a Nuxt app enables no plugin', () => {
    it('then it tells the option of the module', async () => {
      const cwd = createTempDir()
      writeFile(cwd, 'package.json', JSON.stringify({ dependencies: { '@maz-ui/nuxt': '^5.0.0' } }))
      writeFile(cwd, 'nuxt.config.ts', 'export default { mazUi: {} }\n')

      const output = renderProjectInfo(await readProjectInfo(cwd, COMPONENTS), { standaloneComposables: false })

      expect(output).toContain('- Plugins: none. Before using `useToast`, `useDialog`, `useWait` or `useAos`, install the missing plugin once: `mazUi: { plugins: { toast: true } }` in `nuxt.config`.')
    })
  })

  describe('when a Vue app installs no plugin', () => {
    it('then toast, dialog and wait need nothing and aos tells how to enable it', async () => {
      const cwd = createTempDir()
      createVueApp(cwd, { mainTs: 'app.use(MazUi, { theme: { preset } })\n' })

      const output = renderProjectInfo(await readProjectInfo(cwd, COMPONENTS))

      expect(output).toContain('- Toast, dialog and wait: `useToast`, `useDialog` and `useWait` need no plugin, their global options go in `app.use(MazUi, { toast, dialog })`.')
      expect(output).toContain('- Animations on scroll: disabled, enable them with `app.use(MazUi, { aos: true })` and `import \'maz-ui/aos.css\'` before using `useAos`.')
      expect(output).not.toContain('Before using')
      expect(output).not.toContain('Deprecated')
    })
  })

  describe('when a Vue app still installs the deprecated plugins and enables aos in MazUi', () => {
    it('then it reports the deprecated plugins with their replacement', async () => {
      const cwd = createTempDir()
      createVueApp(cwd, { mainTs: 'app.use(MazUi, { theme: { preset }, aos: { delay: 100 } })\napp.use(ToastPlugin)\napp.use(WaitPlugin)\n' })

      const [app] = await readProjectInfo(cwd, COMPONENTS)
      const output = renderProjectInfo([app])

      expect(app.aos).toBe(true)
      expect(output).toContain('- Animations on scroll: enabled (`useAos`).')
      expect(output).toContain('- Deprecated: `app.use(ToastPlugin)`, `app.use(WaitPlugin)` still works, removed in v6: remove it and move its options to `app.use(MazUi, { toast, dialog })`.')
    })
  })

  describe('when a Nuxt app uses the deprecated plugins option', () => {
    it('then it reports the option with the new ones', async () => {
      const cwd = createTempDir()
      writeFile(cwd, 'package.json', JSON.stringify({ devDependencies: { '@maz-ui/nuxt': '^5.0.0' } }))
      writeFile(cwd, 'nuxt.config.ts', 'export default defineNuxtConfig({ mazUi: { plugins: { toast: { position: \'top\' }, aos: true } } })\n')

      const output = renderProjectInfo(await readProjectInfo(cwd, COMPONENTS))

      expect(output).toContain('their global options go in `mazUi.toast` and `mazUi.dialog` in `nuxt.config`.')
      expect(output).toContain('- Animations on scroll: enabled (`useAos`).')
      expect(output).toContain('- Deprecated: `mazUi.plugins` still works, removed in v6')
    })
  })

  describe('when a Nuxt app does not enable aos', () => {
    it('then it gives the Nuxt option', async () => {
      const cwd = createTempDir()
      writeFile(cwd, 'package.json', JSON.stringify({ devDependencies: { '@maz-ui/nuxt': '^5.0.0' } }))
      writeFile(cwd, 'nuxt.config.ts', 'export default defineNuxtConfig({ mazUi: { toast: { position: \'top\' } } })\n')

      const output = renderProjectInfo(await readProjectInfo(cwd, COMPONENTS))

      expect(output).toContain('enable them with `mazUi: { aos: true }` before using `useAos`.')
      expect(output).not.toContain('Deprecated')
    })
  })
})

describe('given the get_project_info tool', () => {
  describe('when it runs in a project', () => {
    it('then it renders the info of its apps', async () => {
      const cwd = createTempDir()
      createVueApp(cwd)

      expect(await getProjectInfo({ ...getContext(), cwd })).toContain('# maz-ui in this project\n\n## Project: Vue')
    })
  })
})
