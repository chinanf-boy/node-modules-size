#!/usr/bin/env node
'use strict';
const meow = require('meow');
const nodeModulesSize = require('.');

const cli = meow(`
	Usage
		$ node-modules-size [cwd]

`);

(async function run() {
	let cwd = cli.input[0] ? cli.input[0] : process.cwd()
	let r  = await nodeModulesSize(cwd)
	console.log(r)
})()
