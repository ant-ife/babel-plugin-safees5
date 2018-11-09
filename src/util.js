const R = require('ramda')
const { codeFrameColumns } = require('@babel/code-frame')
const path = require('path')
const fs = require('fs')

exports.DEFAULT_DANGEROUS_METHODS = [
  'at',
  'codePointAt',
  'endsWith',
  'fromCodePoint',
  'includes',
  'matchAll',
  'padStart',
  'padEnd',
  'raw',
  'repeat',
  'startsWith',
  'trimLeft',
  'trimRight',
  'trimStart',
  'trimEnd',
  'every',
  'fill',
  'find',
  'findIndex',
  'includes',
  'lastIndexOf',
  'of',
  'reduceRight',
]

exports.printWarn = (msg, path) => {
  const file = R.path(['hub', 'file'], path)
  const loc = R.path(['node', 'property', 'loc'], path)
  /* istanbul ignore if  */
  if (!file || !loc) {
    return
  }
  let warn = `${file.opts.filename}: ${msg}\n`
  try {
    warn += codeFrameColumns(file.code, loc)
  } catch (err) /* istanbul ignore next */ {
    warn = err.message
  }
  console.warn(warn)
}

exports.findMainDirectory = (baseDir, filename) => {
  let depth = 10
  let pathNow = baseDir
  let result = null
  while (--depth) {
    try {
      const packagePath = path.join(pathNow, filename)
      fs.accessSync(packagePath)
      result = packagePath
      break
    } catch (e) {
      if (pathNow === '/') {
        break
      }
    }
    pathNow = path.join(pathNow, '..')
  }
  if (result) {
    result = path.basename(result)
  }
  return result
}

exports.dirIncludes = R.curry((source, target) => {
  if (source === target) {
    return true
  }

  let dirs = []
  try {
    dirs = R.pipe(
      fs.readdirSync,
      R.map(f => path.join(source, f))
    )(source)
    return R.contains(target, dirs)
  } catch (err) {
    return false
  }
})
