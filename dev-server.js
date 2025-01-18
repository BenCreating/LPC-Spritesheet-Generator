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
    './javascript/',
    './resources/',
    './package.json',
    './package-lock.json',
    './index.js',
    './index.template.html'
  ].map(projectRelativePath => path.join(import.meta.dirname, projectRelativePath)),
  {
    ignored: /-definitions\.json$/,
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

app.listen(8080, () => {
  console.log('Server running at http://localhost:8080')
})
