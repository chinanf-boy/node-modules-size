'use strict';
const dirsList = require('dirs-list');
const execa = require('execa');
const prettyBytes = require('pretty-bytes');
const {loggerText} = require('two-log')

const nodeModuleSize = async function(cwd){
	let nodeModulesPath = await dirsList(cwd, ["*node_modules"])
	let rs = []
	let total = 0

	if(nodeModulesPath.length){
		for(let p of nodeModulesPath){
			let pathResult = await execa("du", ['-s', p]).then(r =>r.stdout)
			loggerText("got size "+pathResult)
			rs.push(pathResult)
		}
	}

	let pathSizes = {}

	if(rs.length){
		loggerText("recale size...")
		for(let r of rs){
			let [size, path] = r.split('\t')
			if(size && path){
				let tranNum = 0.973 * 500
				size = (+size*tranNum)
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
