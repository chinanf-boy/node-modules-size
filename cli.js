#!/usr/bin/env node
'use strict';
const meow = require('meow');
const path = require('path');

const nodeModulesSize = require('.');

const cli = meow(`
	Usage
		$ node-modules-size [cwd]

`);

(async function run() {
	const {twoLog} = require('two-log');
	const chalk = require('chalk');

	console.time("size run")

	let l = twoLog(cli.flags['D'])
	l.start('search node_modules ...',{log: 'info'})

	let cwd = cli.input[0] ? cli.input[0] : process.cwd()
	let r  = await nodeModulesSize(cwd)

	if(r){
		l.stop("good", {ora: 'succeed'})
		Object.keys(r).forEach(p =>{
			let relative = '\n❤️ >>> '+p
			if(p !== 'total'){
				relative = path.relative(cwd, p)
			}
			console.log(relative,chalk.green(r[p]))
		})
	}else{
		l.stop("error", {ora: 'fail'})
	}
	console.timeEnd("size run")

})()
