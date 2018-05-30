#!/usr/bin/env node
'use strict';
const meow = require('meow');
const nodeModulesSize = require('.');

const cli = meow(`
	Usage
	  $ node-modules-size [input]

	Options
	  --foo  Lorem ipsum [Default: false]

	Examples
	  $ node-modules-size
	  unicorns & rainbows
	  $ node-modules-size ponies
	  ponies & rainbows
`);

console.log(nodeModulesSize(cli.input[0] || 'unicorns'));
