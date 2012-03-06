var fs = require('fs'),
    flow = require('flow'),
    glob = require('glob'),
    showdown = (new (require('showdown').Showdown.converter)).makeHtml,
    jqtpl = require('jqtpl'),
    path = require('path'),
    rimraf = require('rimraf'),
    util = require('util');

module.exports = function(options, cb) {
	if(cb === undefined && typeof options === 'function') {
		cb = options;
		options = { };
	}
	
	var docdir = 'doc';
	options.input = options.input || docdir + '/input';
	options.data = options.data || docdir + '/data';
	options.output = options.output || docdir + '/output';
	
	flow.exec(
		function() {
			rimraf(options.output, errcheck(this));
		}, function() {
			fs.mkdir(options.output, undefined, errcheck(this));
		}, function() {
			parseInputFiles(this.MULTI());
			copyDataFiles(this.MULTI());
		}, noArgs, cb
	);
	
	// Helpers
	function noArgs() {
		this();
	}
	
	function errcheck(continuation) {
		return function(err) {
			if(err) {
				cb(err);
			} else {
				var args = Array.prototype.slice.call(arguments, 1);
				continuation.call(this, args);
			}
		};
	}
	
	function errcheckMulti(argsArray) {
		var ok = true;
		argsArray.forEach(function(args) {
			if(ok && args[0]) { ok = false; cb(args[0]); }
		});
		if(ok) { this.call(this, argsArray); }
	}
	
	function transform(inpath, outpath, cb, copyfn) {
		fs.stat(inpath, function(err, stat) {
			if(err) return cb(err);
			if(stat.isDirectory()) {
				fs.mkdir(outpath, undefined, errcheck(cb));
			} else {
				copyfn(inpath, outpath, cb);
			}
		});
	}
	
	// Main logic
	function parseInputFiles(cb) {
		flow.exec(
			function() {
				fs.readFile(path.join(options.data, 'template.html'), 'utf8', errcheck(this));
			}, function(html) {
				jqtpl.template('doc', html[0]);
				glob(options.input + '/**/*.{md,markdown}', {}, errcheck(this));
			}, function(matches) {
				for(var i=0; i<matches[0]; i++) {
					var match = matches[0][i];
					parseOneInputFile(match, this.MULTI());
				}
			}, cb
		);
	}
	
	function parseOneInputFile(input, cb) {
		var basename = input.match(/^doc\/input\/(.*)\.(md|markdown)$/)[1].replace(/\//g, '.');
		var outfile = options.output + '/' + basename + '.html';
		transform(input, outfile, cb, function(inpath, outpath, cb) {
			fs.readFile(input, 'utf8', function(err, data) {
				if(err) return cb(err);
				data = showdown(data);
				var title = data.match(/<h1(?:.*?)>(.*?)<\/h1>/)[1];
				data = jqtpl.tmpl('doc', { content: data, title: title });
				fs.writeFile(outpath, data, 'utf8', function(err) {
					if(err) return cb(err);
				});
			});
		});
	}
	
	function copyDataFiles(cb) {
		flow.exec(
			function() {
				glob(options.data + '/**/*', { }, errcheck(this));
			}, function(matches) {
				for(var i=0; i<matches[0].length; i++) {
					var match = matches[0][i];
					copyOneDataFile(match, this.MULTI());
				}
			}, errcheckMulti, cb
		);
	}
	
	function copyOneDataFile(input, callback) {
		if(input === options.data + '/template.html') return callback();
		var outfile = input.replace(/^doc\/data\/(.*)$/, options.output + '/$1');
		transform(input, outfile, callback, function(inpath, outpath, callback) {
			util.pump(fs.createReadStream(inpath), fs.createWriteStream(outpath), errcheck(callback));
		});
	}
};
