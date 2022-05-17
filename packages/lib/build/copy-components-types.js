const {
  renameSync,
  existsSync,
  statSync,
  mkdirSync,
  copyFileSync,
} = require('fs')

const { readdirSync } = require('fs')
const { resolve } = require('path')
const { join } = require('path/posix')

const INPUT_COMPONENT_DIR = resolve(__dirname, './../types/components')
const OUTPUT_TYPES_FILES = resolve(__dirname, './../components')

/**
 * Look ma, it's cp -R.
 * @param {string} src The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 */
function copyRecursiveSync(src, dest) {
  const exists = existsSync(src)
  const stats = exists && statSync(src)
  const isDirectory = exists && stats.isDirectory()
  if (isDirectory) {
    const destDirExists = existsSync(dest)
    if (!destDirExists) {
      mkdirSync(dest)
    }
    readdirSync(src).forEach(function (childItemName) {
      copyRecursiveSync(join(src, childItemName), join(dest, childItemName))
    })
  } else {
    copyFileSync(src, dest)
  }
}

function renameAllFiles() {
  const componentsTypesList = readdirSync(OUTPUT_TYPES_FILES).filter((name) =>
    name.endsWith('.vue.d.ts'),
  )
  componentsTypesList.forEach((name) => {
    const componentName = name.split('.')[0]
    renameSync(
      `${OUTPUT_TYPES_FILES}/${name}`,
      `${OUTPUT_TYPES_FILES}/${componentName}.d.ts`,
    )
  })
}
copyRecursiveSync(INPUT_COMPONENT_DIR, OUTPUT_TYPES_FILES)
renameAllFiles()
