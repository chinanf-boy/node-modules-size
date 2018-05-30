# node-modules-size [![Build Status](https://travis-ci.org/chinanf-boy/node-modules-size.svg?branch=master)](https://travis-ci.org/chinanf-boy/node-modules-size) [![codecov](https://codecov.io/gh/chinanf-boy/node-modules-size/badge.svg?branch=master)](https://codecov.io/gh/chinanf-boy/node-modules-size?branch=master) [![explain](http://llever.com/explain.svg)](https://github.com/chinanf-boy/node-modules-size-explain)

> cli to show node_modules size

[中文](./readme.md) | ~~[english](./readme.en.md)~~

## Install



```
npm i -g node-modules-size
```




## Usage

```js
const nodeModulesSize = require('node-modules-size');

nodeModulesSize('unicorns');
//=> 'unicorns & rainbows'
```


## API

### nodeModulesSize(input, [options])

#### input

name: | input
---------|----------
Type: | `string`
Desc: | Lorem ipsum.

#### options

##### foo

 name: | foo
---------|----------
Type: | `boolean`
Default: | `false`
Desc: | Lorem ipsum.


## CLI

```
npm install --global node-modules-size
```

```
$ node-modules-size --help

  Usage
    node-modules-size [input]

  Options
    --foo  Lorem ipsum [Default: false]

  Examples
    $ node-modules-size
    unicorns & rainbows
    $ node-modules-size ponies
    ponies & rainbows
```


## License

MIT © [chinanf-boy](http://llever.com)
