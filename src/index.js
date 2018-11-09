const R = require('ramda')
const { join, resolve } = require('path')
const {
  DEFAULT_DANGEROUS_METHODS,
  printWarn,
  findMainDirectory,
  dirIncludes,
} = require('./util')

module.exports = function () {
  const upperPath = join(__dirname, '../..')
  const projectDir = findMainDirectory(upperPath, 'package.json') ||
    join(__dirname, '..')
  const relativePath = (p) => resolve(projectDir, p)

  return {
    visitor: {
      MemberExpression (path, state) {
        const { ignoreFiles, ignoreCallers } = state.opts

        const file = R.path(['hub', 'file', 'opts', 'filename'], path)
        const ignoreFilesContains =  R.any(
          R.pipe(
            relativePath,
            dirIncludes(R.__, relativePath(file)),
          )
        )

        /* istanbul ignore if */
        if (!file) {
          return
        }

        if (R.is(Array, ignoreFiles) && ignoreFilesContains(ignoreFiles)) {
          return
        }

        const methodName = R.path([
          'node',
          'property',
          'name',
        ], path)

        const caller = R.path([
          'node',
          'object',
          'name',
        ], path)

        const ignoreCallerContains = R.any(R.equals({
          caller,
          method: methodName,
        }))

        if (R.is(Array, ignoreCallers) && ignoreCallerContains(ignoreCallers)) {
          return
        }

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


