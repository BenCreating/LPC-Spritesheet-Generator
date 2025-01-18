set -e

scripts=$(dirname "$0")

node "$scripts/merge-definitions.js"
node "$scripts/generate-importmap.js"
