import { writeFileSync } from 'node:fs'
import { dirname, extname, relative, resolve } from 'node:path'
import { codecovVitePlugin } from '@codecov/vite-plugin'
import { getExternalDependencies, ViteExportNames } from '@maz-ui/vite-config'
import vue from '@vitejs/plugin-vue'

import { glob } from 'glob'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import pkg from './package.json' with { type: 'json' }

function resolver(path: string) {
  return resolve(import.meta.dirname, path)
}

function getEntries(pattern: string) {
  return [
    relative('src', pattern.slice(0, pattern.length - extname(pattern).length)),
    resolver(pattern),
  ]
}

const testPaths = [
  '**/__tests__/**/*',
  '**/__fixtures__/**/*',
  '**/__mocks__/**/*',
  '**/*.spec.ts',
  'src/**/*.test.ts',
]

const entries = Object.fromEntries(
  glob.sync('src/**/*.ts', {
    ignore: ['**/ts-helpers/**/*', ...testPaths],
  })
    .map(getEntries),
)

// The declarations of a package with `"type": "module"` must use extensioned relative specifiers to resolve
// under `moduleResolution` `node16`/`nodenext`
function appendDeclarationExtensions(files: Map<string, string>) {
  const emitted = new Set(files.keys())
  for (const [filePath, content] of files) {
    if (!filePath.endsWith('.d.ts'))
      continue
    const rewritten = content.replace(/(['"])(\.\.?\/[^'"]*)\1/g, (match, quote: string, specifier: string) => {
      if (/\.[cm]?[jt]sx?$|\.vue$|\.json$|\.css$|\.svg$/.test(specifier))
        return match
      const target = resolve(dirname(filePath), specifier)
      if (emitted.has(`${target}.d.ts`))
        return `${quote}${specifier}.js${quote}`
      if (emitted.has(`${target}/index.d.ts`))
        return `${quote}${specifier}/index.js${quote}`
      return match
    })
    if (rewritten !== content)
      writeFileSync(filePath, rewritten)
  }
}

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  return {
    plugins: [
      vue(),
      ViteExportNames({ helpers: 'index' }),
      dts({
        tsconfigPath: resolver('./tsconfig.json'),
        entryRoot: resolver('src'),
        outDirs: resolver('dist'),
        include: ['src/**/*.ts'],
        exclude: testPaths,
        afterBuild: appendDeclarationExtensions,
      }),
      codecovVitePlugin({
        enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
        bundleName: 'utils',
        uploadToken: process.env.CODECOV_TOKEN,
        telemetry: false,
      }),
    ],

    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    },

    build: {
      emptyOutDir: true,
      sourcemap: isProduction ? false : 'inline',
      target: 'es2022',
      lib: {
        entry: {
          ...entries,
          'index': 'src/index.ts',
          'helpers/index': 'src/helpers/index.ts',
        },
        formats: ['es'],
        fileName: (_, name) => `${name}.js`,
      },
      rolldownOptions: {
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          unknownGlobalSideEffects: false,
          manualPureFunctions: isProduction
            ? ['console.log', 'console.debug']
            : [],
        },
        external: getExternalDependencies(pkg),
        output: {
          format: 'es',
          comments: { legal: false },
          minify: isProduction
            ? {
                compress: { dropDebugger: true, dropConsole: false, joinVars: false },
                mangle: false,
              }
            : false,
          chunkFileNames: 'chunks/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]',
          exports: 'named',
          minifyInternalExports: true,
        },
      },
    },
  }
})
