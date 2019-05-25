import test from 'ava';
import m from '.';

test('node-modules-size this project', async t => {
	const res = await m(__dirname);
	t.is(Boolean(res.total), true);
});

test('node-modules-size this project default', async t => {
	const res = await m();
	t.is(Boolean(res.total), true);
});

test.failing('node-modules-size error path', async t => {
	const res = await m('sdf');
	t.is(Boolean(res.total), true);
});
