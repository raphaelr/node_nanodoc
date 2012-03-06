var fs = require('fs'),
    flow = require('flow'),
    glob = require('glob'),
    showdown = (new (require('showdown').Showdown.converter)).makeHtml,
    jqtpl = require('jqtpl'),
    path = require('path'),
    rimraf = require('rimraf'),
    util = require('util'),
    wrench = require('wrench');

module.exports = function(options, cb) {
	if(cb === undefined && typeof options === 'function') {
		cb = options;
		options = { };
	}
	
	var docdir = 'doc';
	options.input = options.input || docdir + '/input';
	options.data = options.data || docdir + '/data';
	options.output = options.output || docdir + '/output';
	
	var inputBasename = new RegExp('^' + escapeRegex(options.input) + '\/?(.*)\.(md|markdown)$');
	var dataName = new RegExp('^' + escapeRegex(options.data) + '\/?(.*)$');
	
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
			if(ok && args[0] && args[0][0]) { ok = false; cb(args[0][0]); }
			//if(ok && args[0]) { ok = false; cb(args[0]); }
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
	
	function escapeRegex(text) {
		return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
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
				for(var i=0; i<matches[0].length; i++) {
					var match = matches[0][i];
					parseOneInputFile(match, this.MULTI());
				}
				this.MULTI()();
			}, errcheckMulti, cb
		);
	}
	
	function parseOneInputFile(input, cb) {
		var basename = input.match(inputBasename)[1].replace(/\//g, '.');
		var outfile = options.output + '/' + basename + '.html';
		transform(input, outfile, cb, function(inpath, outpath, cb) {
			flow.exec(
				function() {
					fs.readFile(input, 'utf8', errcheck(this));
				}, function(data) {
					data = showdown(data[0]);
					var title = data.match(/<h1(?:.*?)>(.*?)<\/h1>/)[1];
					data = jqtpl.tmpl('doc', { content: data, title: title });
					fs.writeFile(outpath, data, 'utf8', errcheck(this));
				}, cb
			);
		});
	}
	
	function copyDataFiles(cb) {
		flow.exec(
			function() {
				wrench.copyDirRecursive(options.data, options.output, errcheck(this));
			}, function() {
				fs.unlink(options.output + '/template.html', errcheck(this));
			}, cb
		);
	}
	
	function old_copyDataFiles(cb) {
		flow.exec(
			function() {
				glob(options.data + '/**/*', { }, errcheck(this));
			}, function(matches) {
				for(var i=0; i<matches[0].length; i++) {
					var match = matches[0][i];
					copyOneDataFile(match, this.MULTI());
				}
				this.MULTI()();
			}, errcheckMulti, cb
		);
	}
	
	function copyOneDataFile(input, callback) {
		if(input === options.data + '/template.html') return callback();
		var outfile = input.replace(dataName, options.output + '/$1');
		transform(input, outfile, callback, function(inpath, outpath, callback) {
			util.pump(fs.createReadStream(inpath), fs.createWriteStream(outpath), errcheck(callback));
		});
	}
};
