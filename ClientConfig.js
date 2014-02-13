var igeClientConfig = {
	include: [
		'client.js',
		'load.js',
		'../howler/howler.min.js',
		'index.js',
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }