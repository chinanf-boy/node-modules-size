import test from 'ava';
import m from '.';

test('node-modules-size this project', async t => {
	let res = await m(__dirname)
	t.is(!!res.total, true)
});

test('node-modules-size this project default', async t => {
	let res = await m()
	t.is(!!res.total, true)
});

test.failing('node-modules-size error path', async t => {
	let res = await m("sdf")
	t.is(!!res.total, true)
});
