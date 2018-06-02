'use strict';
const Promise = require("bluebird");
const dirsList = require('dirs-list');
const execa = require('execa');
const chalk = require('chalk');

const os = require('os');
const prettyBytes = require('pretty-bytes');
const {
	loggerText,
	oneOra
} = require('two-log')


const nodeModuleSize = async function (cwd, options = {}) {

	let { match ,ignore } = options
	match = (match && match.split(',')) || "*node_modules"
	ignore = (ignore && ignore.split(',')) || `*.git`

	let nodeModulesPath = await dirsList(cwd, {match,ignore})
	let rs = []
	let total = 0
	let num = 0

	if (nodeModulesPath.length) {
		oneOra(`get -> ${nodeModulesPath.length} <- path`,{color:"red"})
		await Promise.map(
			nodeModulesPath, async (p,i,all) => {
				let pathResult = await execa("du", ['-s', p]).then(r => r.stdout)
				num ++
				loggerText(`got size NO: ${chalk.blue(i)} :> done ${chalk.cyan(num)}/${all}`)
				rs.push(pathResult)
				return pathResult
			}, {
				concurrency: os.cpus().length
			}
		)
	}

	let pathSizes = {}

	if (rs.length) {
		loggerText("recale size...")
		for (let r of rs) {
			let [size, path] = r.split('\t')
			if (size && path) {
				let tranNum = 0.973 * 500
				size = (+size * tranNum)
				total += size
				pathSizes[path] = prettyBytes(size)
				// {path:size}
			}
		}
		pathSizes['total'] = prettyBytes(total)
	}

	return pathSizes
}

module.exports = nodeModuleSize
