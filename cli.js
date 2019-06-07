#!/usr/bin/env node
'use strict';
const path = require('path');
const meow = require('meow');
const chalk = require('yobrave-util');
const prettyBytes = require('pretty-bytes');
const getName = require('get-module-name');
const whatTime = require('what-time');

const cy = chalk.c;
const y = chalk.y;
const b = chalk.b;
const z = chalk.m;

const nodeModulesSize = require('.');

const cli = meow(`
${z(require('./package.json').version)}

	Usage

		node-modules-size ${y('[cwd]')} ${z('[Options]')}

	Options

		${cy('-P')} picture  :  < process.cwd() >

		{ use bash:"screencapture -W -P" ${b('select and save the picture')}}

		${cy('-m')} match  :  < *node_modules >

		{ -m "*node_modules,*" ${b(
			'match is Array.prototype.every for path'
		)} cover options}

		${cy('-i')} ignore  :  < *.git >

		{ -i "*.git" ${b('ignore is Array.prototype.some for path')} cover options}
`);

(async function run() {
	const {twoLog} = require('two-log');

	const startTime = Date.now();

	const l = twoLog(cli.flags.D);
	l.start('search node_modules ... ', {log: 'info'});

	const cwd = cli.input[0] ? cli.input[0] : process.cwd();
	const match = cli.flags.m;
	const ignore = cli.flags.i;

	const r = await nodeModulesSize(cwd, {match, ignore});

	// Show Size
	if (r && Object.keys(r).length) {
		l.stop('good', {ora: 'succeed'});
		Object.keys(r)
			.sort(function(a, b) {
				// sort

				return r[a] - r[b];
			})
			.forEach(p => {
				// print all size
				let humanSize = prettyBytes(r[p])
				let relative = '\n❤️   > ' + p;
				if (p !== 'total') {
					relative = path.relative(cwd, p);
					console.log(relative, chalk.g(humanSize));
				} else {
					console.log(relative, chalk.colors.bgRed(` ${humanSize} `));
				}
			});
	} else {
		l.stop('error: no thing', {ora: 'fail'});
	}

	// Time run time
	const endTime = Date.now();
	const t = endTime - startTime;
	if (t > 1000) {
		console.log(`⏰   < ${z(whatTime(t / 1000) + (t % 1000) + 'ms')}`);
	} else {
		console.log(`⏰   >_< ${z(t + 'ms')}`);
	}

	// Picture save cli options
	const p = cli.flags.P;
	if (p) {
		// Picture save use screencapture
		const execa = require('execa');
		let cwd = process.cwd();
		const name = await getName();

		const filename = `${name}.png`;

		if (typeof p !== 'boolean') {
			cwd = path.resolve(cwd, p);
			!path.extname(cwd) && (cwd = path.resolve(cwd, filename));
		} else {
			cwd = path.resolve(cwd, filename);
		}

		await execa('screencapture', ['-W', '-P', cwd]).then(r => {
			console.log('picture save', z(path.relative(process.cwd(), cwd)));
		});
	}
})();
