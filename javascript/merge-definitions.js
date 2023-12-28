import core from '@actions/core'
import fs from 'fs'

// This is run automatically when the site is deployed to GitHub Pages
try {
  mergeDefinitions(['palette', 'animation', 'category'])
  mergeSheetDefinitions()
} catch (error) {
  core.setFailed(error.message)
}

function mergeDefinitions(types) {
  types.forEach(type => {
    const merged = mergeFilesInDirectory(`./resources/${type}-definitions`)
    fs.writeFileSync(`./resources/${type}-definitions.json`, JSON.stringify(merged))
  })
}

function mergeSheetDefinitions() {
  const directoryPath = './resources/sheet-definitions'
  const itemsInDirectory = fs.readdirSync(directoryPath, { withFileTypes: true })

  const merged = {}

  itemsInDirectory.forEach(item => {
    if (!item.isDirectory()) return

    const category = item.name
    const mergedFiles = mergeFilesInDirectory(`${directoryPath}/${category}`)

    merged[category] = mergedFiles
  })

  fs.writeFileSync('./resources/sheet-definitions.json', JSON.stringify(merged))
}

function mergeFilesInDirectory(directoryPath) {
  const files = fs.readdirSync(directoryPath, { withFileTypes: true })
  const merged = {}

  files.forEach(file => {
    if (!file.isFile()) return

    const path = `${directoryPath}/${file.name}`
    const assetName = file.name.replace(/\.json$/, '')
    const parsed = JSON.parse(fs.readFileSync(path))

    merged[assetName] = parsed
  })

  return merged
}
