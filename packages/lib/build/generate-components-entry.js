// @ts-check
/* eslint-disable no-console */
const { writeFileSync } = require('node:fs')
const { componentsList } = require('./get-component-list')
const render = require('json-templater/string')
const { resolve } = require('node:path')
const { EOL } = require('node:os')
const logger = require('./logger')

const COMPONENTS_OUTPUT_PATH = resolve(
  __dirname,
  './../package/components/index.ts',
)

const COMPONENTS_IMPORT_TEMPLATE =
  "export { default as {{name}} } from '{{path}}'"
const COMPONENTS_TEMPLATE = `/* Automatically generated by './build/generate-components-entry.js' */

{{include}}
`

/**
 * @param {string} template
 * @param {string} importTemplate
 * @param {string} outputPath
 */
const buildEntry = (template, importTemplate, outputPath) => {
  try {
    const includeComponentTemplate = []

    for (const component of componentsList) {
      includeComponentTemplate.push(
        render(importTemplate, {
          name: component.name,
          path: component.relativePath,
        }),
      )
    }

    const file = render(template, {
      include: includeComponentTemplate.join(EOL),
    })

    writeFileSync(outputPath, file)

    logger.success('[GenPackageComponentsEntry] ✅')
  } catch (error) {
    logger.error(
      '[GenPackageComponentsEntry] 🔴 Error occurred while generating package components entry file',
      error,
    )
  }
}

buildEntry(
  COMPONENTS_TEMPLATE,
  COMPONENTS_IMPORT_TEMPLATE,
  COMPONENTS_OUTPUT_PATH,
)
