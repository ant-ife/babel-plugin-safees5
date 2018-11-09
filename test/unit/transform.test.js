const path = require('path')
const assert = require('assert')
const transform = require('./util')
const testFile = path.resolve(__dirname, '../fixtures/src/code.js')
const safees5 = require('../../index')

describe('transform code', function () {
  it('should be same if use the safees5 plugin', async function () {
    const safeCode = await transform(testFile, {
      presets: ['es2015'],
      plugins: ['transform-runtime', safees5],
    })

    const origCode = await transform(testFile, {
      presets: ['es2015'],
      plugins: ['transform-runtime'],
    })
    assert(safeCode.code === origCode.code)
  })

  it('should ignore somethings with the ignoreFiles options', async function () {
    await transform(testFile, {
      presets: ['es2015'],
      plugins: [
        'transform-runtime',
        [safees5, {
          ignoreFiles: [
            path.resolve(__dirname, '../fixtures/src'),
          ],
        }],
      ],
    })

    await transform(testFile, {
      presets: ['es2015'],
      plugins: [
        'transform-runtime',
        [safees5, {
          ignoreFiles: [
            '/Users/xkw/github/babel-plugin-safees5/test/fixtures/src/code.js',
            'src/code.js',
          ],
        }],
      ],
    })
  })

  it('should ignore somethings with the ignoreCallers options', async function () {
    await transform(testFile, {
      presets: ['es2015'],
      plugins: [
        'transform-runtime',
        [safees5, {
          ignoreCallers: [
            {
              caller: 'ary',
              method: 'includes',
            },
          ],
        }],
      ],
    })
  })
})
