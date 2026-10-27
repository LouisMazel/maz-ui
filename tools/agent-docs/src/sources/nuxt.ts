import { readFileSync } from 'node:fs'

export interface NuxtAutoImports {
  /** Components auto-imported by default */
  components: string[]
  /** Composables auto-imported by default */
  composables: string[]
  /** Composables auto-imported when the matching `mazUi.plugins.<name>` option is enabled */
  pluginComposables: Record<string, string>
}

function objectKeys(source: string, constName: string): string[] {
  const match = new RegExp(`const ${constName}[^=]*=\\s*\\{([\\s\\S]*?)\\n\\}`).exec(source)

  return match ? [...match[1].matchAll(/(\w+)\s*:\s*true/g)].map(entry => entry[1]) : []
}

export function collectNuxtAutoImports(moduleFile: string): NuxtAutoImports {
  const source = readFileSync(moduleFile, 'utf8')

  return {
    components: objectKeys(source, 'COMPONENT_NAMES'),
    composables: [...objectKeys(source, 'mazUiComposables'), ...objectKeys(source, 'pluginComposables')],
    pluginComposables: {
      useToast: 'toast',
      useDialog: 'dialog',
      useAos: 'aos',
      useWait: 'wait',
    },
  }
}
