const R = require('ramda')
const { join } = require('path')
const {
  DEFAULT_DANGEROUS_METHODS,
  printWarn,
  findMainDirectory,
} = require('./util')

module.exports = function () {
  const upperPath = join(__dirname, '../..')
  const projectDir = findMainDirectory(upperPath, 'package.json') || join(__dirname, '..')
  console.log('projectDir is', projectDir)

  return {
    visitor: {
      MemberExpression (path, { opts = {} }) {
        const { ignoreFiles, ignoreInstanceNames } = opts
        const methodName = R.path([
          'node',
          'property',
          'name',
        ], path)
        if (R.contains(methodName, DEFAULT_DANGEROUS_METHODS)) {
          const warn = `\nPlease take care of this method: ${methodName}` +
            '\nIf it\'s a string or array instance method, use another way' +
            '\nBabel won\'t transform this, and it will crash in low version of Android'
          printWarn(warn, path)
        }
      },
    },
  }
}


