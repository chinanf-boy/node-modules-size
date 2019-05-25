'use strict';
const os = require('os');
const Promise = require('bluebird');
const path = require('path');
const dirsList = require('dirs-list');
const fd = require('find-files-rust');
const execa = require('execa');
const { b, c} = require('yobrave-util');

const prettyBytes = require('pretty-bytes');
const {loggerText, oneOra} = require('two-log');

const hit = 'node_modules';
const mapNM = p => {
	let obj = path.parse(p);
	if (obj.base == hit && obj.name == hit) {
		return true;
	}
	return false;
};

const nodeModuleSize = async function(cwd, options = {}) {
	let {match, ignore} = options;
	match = (match && match.split(',')) || '*node_modules';
	ignore = (ignore && ignore.split(',')) || `*.git`;

	try {
		// No.1 error throw
		cwd = path.resolve(cwd);
	} catch (e) {
		throw new Error(e);
	}

	const nodeModulesPath = fd.find(cwd).filter(mapNM);
	const rs = [];
	let total = 0;
	let num = 0;

	if (nodeModulesPath.length) {
		oneOra(`get -> ${nodeModulesPath.length} <- path`, {color: 'red'});
		await Promise.map(
			nodeModulesPath,
			async (p, i, all) => {
				const pathResult = await execa('du', ['-s', p]).then(r => r.stdout);
				num++;
				loggerText(
					`got size NO: ${b(i)} :> done ${c(num)}/${all}`
				);
				rs.push(pathResult);
				return pathResult;
			},
			{
				concurrency: os.cpus().length
			}
		);
	}

	const pathSizes = {};

	if (rs.length) {
		loggerText('recale size...');
		for (const r of rs) {
			let [size, path] = r.split('\t');
			if (size && path) {
				const tranNum = 0.973 * 500;
				size = Number(size) * tranNum;
				total += size;
				pathSizes[path] = prettyBytes(size);
				// {path:size}
			}
		}
		pathSizes.total = prettyBytes(total);
	}

	return pathSizes;
};

module.exports = nodeModuleSize;
