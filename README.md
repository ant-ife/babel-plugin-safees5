# babel-plugin-safees5

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![License][license-image]][license-url]

Throw warning if there are es6 code like `'string'.startsWith`, `[].includes`, etc that babel won't transform.

## Why

If you write code like this

```js
const ary = [1, 2, 3]
ary.includes(2)
Array.includes(ary, 2)

const str = '123'
str.startsWith('1')
String.startsWith(str, '1')
```

Normally, if your babel configuration doesn't add the plugin [babel-transform-runtime](https://www.npmjs.com/package/babel-plugin-transform-runtime), you will got this code transformed:

```js
'use strict';

var ary = [1, 2, 3];
ary.includes(2);
Array.includes(ary, 2);

var str = '123';
str.startsWith('1');
String.startsWith(str, '1');
```

The dangerous methods `ary.includes`, `str.startsWith('1')` won't be transformed. And the class static methods `Array.includes(ary, 2)`, `String.startsWith(str, '1')` also won't be transformed.

If you add the babel-transform-runtime plugin, you will got this code:

```js
'use strict';

var _startsWith = require('babel-runtime/core-js/string/starts-with');

var _startsWith2 = _interopRequireDefault(_startsWith);

var _includes = require('babel-runtime/core-js/array/includes');

var _includes2 = _interopRequireDefault(_includes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ary = [1, 2, 3];
ary.includes(2);
(0, _includes2.default)(ary, 2);

var str = '123';
str.startsWith('1');
(0, _startsWith2.default)(str, '1');
```

As you can see, the class static methods are been transformed, but the `ary.includes(2)` and the `str.startsWith('1')` are not be transformed to es5 code which will cause crash in the lower version of browser.

So we got this plugin to warn you if your code using the dangerous es6 instance methods, here is our defaults warning list:

```js
[
  "at",
  "codePointAt",
  "endsWith",
  "fromCodePoint",
  "includes",
  "matchAll",
  "padStart",
  "padEnd",
  "raw",
  "repeat",
  "startsWith",
  "trimLeft",
  "trimRight",
  "trimStart",
  "trimEnd",
  "every",
  "fill",
  "find",
  "findIndex",
  "includes",
  "lastIndexOf",
  "of",
  "reduceRight",
]
```

If your instance method using the methods above, your console will log something like this:

![](https://gw.alipayobjects.com/zos/rmsportal/uZlxTuZaiwgfIUucYnhi.png)

## How to use

#### This plugin won't transform your origin code like babel, it only throws warning!
#### This plugin won't transform your origin code like babel, it only throws warning!
#### This plugin won't transform your origin code like babel, it only throws warning!

### Install
```
npm i babel-plugin-safees5 -D
```

### Example

Add the plugin to your .babelrc configuration:

```js
{
  "presets": ...,
  "plugins": [
    ...,
    "safees5",
  ],
}
```

### Options

```js
{
  "presets": ...,
  "plugins": [
    ...,
   ["safees5", {
     ignoreFiles: [
       'src/router',
     ],
     ignoreInstanceNames: [
       'this',
     ]
   }],
  ],
}
```

| key                 | default | required | description                               |
| ------------------- | ------- | -------- | ----------------------------------------- |
| ignoreFiles         | null    | false    | The files to ignore this plugin           |
| ignoreInstanceNames | null    | false    | The instances names to ignore this plugin |



## License

  MIT

[npm-image]: https://img.shields.io/npm/v/ua-spy.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ua-spy
[travis-image]: https://travis-ci.org/ant-ife/babel-plugin-safees5.svg?branch=master
[travis-url]: https://travis-ci.org/ant-ife/babel-plugin-safees5
[codecov-image]: https://codecov.io/gh/ant-ife/babel-plugin-safees5/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/ant-ife/babel-plugin-safees5
[license-image]: http://img.shields.io/npm/l/ua-spy.svg?style=flat-square
[license-url]: LICENSE
