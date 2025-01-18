import { exec as callbackExec } from 'node:child_process'
import path from 'node:path'
import { promisify } from 'node:util'
import chokidar from 'chokidar'
import express from 'express'

const exec = promisify(callbackExec)

const buildScript = path.join(import.meta.dirname, 'scripts/build.sh')

function build() {
  return exec(buildScript)
}

chokidar.watch(
  [
    'javascript/',
    'resources/',
    'index.js',
    'index.template.html',
    // Watch these files instead of trying to watch the entire node_modules folder
    'package.json',
    'package-lock.json'
  ].map(projectRelativePath => path.join(import.meta.dirname, projectRelativePath)),
  {
    ignored: /-definitions\.json$/, // Ignore the generated combined definition files
    ignoreInitial: true
  }
).on('all', () => {
  console.log('Rebuilding assets')
  build()
})

console.log('Building assets')
await build()

const app = express()

app.use('/', express.static(import.meta.dirname))

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
