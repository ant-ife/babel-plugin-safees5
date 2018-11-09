const babel = require('babel-core')
const codeFrame = require('babel-code-frame')
const { readFileSync } = require('fs')

const transform = (file, opts = {}) => new Promise((resolve, reject) => {
  babel.transformFile(file, {
    ...opts,
    babelrc: false, // Keep the file origin smell
  }, function (err, result) {
    if (err) {
      if (err.loc) {
        console.log(`${file} syntax error:`)
        console.log(codeFrame(readFileSync(file, 'utf8'), err.loc.line, err.loc.column))
      }
      reject(err)
    }
    resolve(result)
  })
})

module.exports = transform
