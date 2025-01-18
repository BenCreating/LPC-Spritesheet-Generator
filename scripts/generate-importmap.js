import { Generator } from '@jspm/generator'
import fs from 'node:fs'
import path from 'node:path'

const generator = new Generator({
  defaultProvider: 'nodemodules',

  env: ['production', 'browser', 'module']
})

const templatePath = path.join(import.meta.dirname, '../index.template.html')
const html = fs.readFileSync(templatePath, 'utf-8')
await generator.linkHtml(html)
const updatedHtml = await generator.htmlInject(
  html,
  {
    esModuleShims: false
  }
)

const builtHtmlPath = path.join(import.meta.dirname, '../index.html')
fs.writeFileSync(builtHtmlPath, updatedHtml)
