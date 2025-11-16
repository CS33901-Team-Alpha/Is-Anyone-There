/**
 * Maybe we can use this file as a place to store testing utilities that are common to all tests or we may want to reuse
 */

export function test(name, fn) {
	try {
		fn();
		console.log(`✔ ${name}`);
	} catch (err) {
		console.error(`✖ ${name}`);
		console.error(err);
		process.exitCode = 1;
	}
}