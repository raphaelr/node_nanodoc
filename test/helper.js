var fs = require('fs'),
    nanodoc = require('../');

var helper = module.exports;

helper.outfile = function(path) {
	return 'test/test_data/output/' + path;
};

helper.nanodocHere = function(cb) {
	nanodoc({
		input: 'test/test_data/input',
		output: 'test/test_data/output',
		data: 'test/test_data/data'
		}, cb
	);
};

helper.isFile = function(path, cb) {
	fs.stat(path, function(err, stats) {
		if(err && err.code === 'ENOENT') {
			cb(undefined, false);
		} else if(err) {
			cb(err);
		} else {
			cb(undefined, stats.isFile());
		}
	});
};
