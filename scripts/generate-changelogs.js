#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const packagesDir = path.join(__dirname, '..', 'packages')
const rootDir = path.join(__dirname, '..')

function generateGlobalChangelog() {
  console.log('🔄 Generating global changelog...')

  try {
    execSync('conventional-changelog -p conventionalcommits -i CHANGELOG.md -s -r 0', {
      cwd: rootDir,
      stdio: 'inherit',
    })
    console.log('✅ Global changelog generated!')
  } catch (error) {
    console.error('❌ Error generating global changelog:', error.message)
  }
}

function generatePackageChangelog(packagePath, packageName) {
  console.log(`🔄 Generating changelog for ${packageName}...`)

  const changelogPath = path.join(packagePath, 'CHANGELOG.md')

  try {
    execSync(
      `conventional-changelog -p conventionalcommits -i CHANGELOG.md -s --context '{"linkCompare": false}' --lernaPackage ${packageName}`,
      {
        cwd: packagePath,
        stdio: 'inherit',
      },
    )
    console.log(`✅ Changelog generated for ${packageName}!`)
  } catch (error) {
    console.error(`❌ Error generating changelog for ${packageName}:`, error.message)
  }
}

function getPackages() {
  const packages = []

  if (fs.existsSync(packagesDir)) {
    const packageFolders = fs.readdirSync(packagesDir)

    for (const folder of packageFolders) {
      const packagePath = path.join(packagesDir, folder)
      const packageJsonPath = path.join(packagePath, 'package.json')

      if (fs.existsSync(packageJsonPath)) {
        try {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
          if (!packageJson.private) {
            packages.push({
              name: packageJson.name,
              path: packagePath,
            })
          }
        } catch (error) {
          console.warn(`⚠️ Unable to read ${packageJsonPath}:`, error.message)
        }
      }
    }
  }

  return packages
}

function main() {
  console.log('🚀 Starting changelog generation...\n')

  generateGlobalChangelog()

  console.log('\n📦 Generating package changelogs...')
  const packages = getPackages()

  for (const pkg of packages) {
    generatePackageChangelog(pkg.path, pkg.name)
  }

  console.log('\n✨ Changelog generation completed!')
}

main()
