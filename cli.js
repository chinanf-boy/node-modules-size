#!/usr/bin/env node
'use strict';
const meow = require('meow');
const nodeModulesSize = require('.');

const cli = meow(`
	Usage
		$ node-modules-size [cwd]

`);

(async function run() {
	const {twoLog} = require('two-log');
	const chalk = require('chalk');

	let l = twoLog(cli.flags['D'])
	l.start('search node_modules ...',{log: 'info'})

	let cwd = cli.input[0] ? cli.input[0] : process.cwd()
	let r  = await nodeModulesSize(cwd)

	if(r){
		l.stop("good", {ora: 'succeed'})
		Object.keys(r).forEach(p =>{
			console.log(p,chalk.green(r[p]))
		})
	}else{
		l.stop("error", {ora: 'fail'})
	}
})()
