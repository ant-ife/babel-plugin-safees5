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
})
