#!/usr/bin/env node
'use strict';
const meow = require('meow');
const path = require('path');
const chalk = require('chalk');
const getName = require('get-module-name')
const whatTime = require('what-time');

let cy = chalk.cyan
let y = chalk.yellow
let b = chalk.blue
let z = chalk.magenta


const nodeModulesSize = require('.');

const cli = meow(`
${z(require('./package.json').version)}

	Usage

		node-modules-size ${y('[cwd]')} ${z('[Options]')}

	Options

		${cy('-P')}  :  < process.cwd() >

		{ use bash:"screencapture -W -P" ${b('select and save the picture')}}
`);

(async function run() {
	const {twoLog} = require('two-log');

	let startTime = Date.now()

	let l = twoLog(cli.flags['D'])
	l.start('search node_modules ... ',{log: 'info'})

	let cwd = cli.input[0] ? cli.input[0] : process.cwd()
	let r  = await nodeModulesSize(cwd)

	// show Size
	if(r && Object.keys(r).length){

		l.stop("good", {ora: 'succeed'})
		Object.keys(r).forEach(p =>{
			let relative = '\n❤️   > '+ p
			if(p !== 'total'){
				relative = path.relative(cwd, p)
				console.log(relative,chalk.green(r[p]))
			}else{
				console.log(relative,chalk.bgRed(` ${r[p]} `))
			}
		})
	}else{
		l.stop("error: no node_modules", {ora: 'fail'})
	}

	// Time run time
	let endTime = Date.now()
	let t =  endTime - startTime
	if(t > 1000){
		console.log(`⏰   < ${z( whatTime(t / 1000) + t % 1000 +'ms')}`)
	}else{
		console.log(`⏰   >_< ${z(t + 'ms')}`)
	}
	// picture save cli options
	let p = cli.flags['P']
	if(p){ // picture save use screencapture
		const execa = require('execa');
		let cwd = process.cwd()
		let name = await getName()

		let filename = `${name}.png`

		if(typeof p !== 'boolean'){
			cwd = path.resolve(cwd, p)
			!path.extname(cwd) && (cwd = path.resolve(cwd,filename))

		}else{
			cwd = path.resolve(cwd,filename)
		}

		await execa('screencapture',["-W","-P",cwd]).then(r =>{
			console.log('picture save', z(path.relative(process.cwd(),cwd)))
		})

	}


})()
