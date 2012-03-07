var _ = require('underscore'),
    fs = require('fs'),
    flow = require('flow'),
    glob = require('glob'),
    showdown = (new (require('showdown').Showdown.converter)).makeHtml,
    jqtpl = require('jqtpl'),
    path = require('path'),
    rimraf = require('rimraf'),
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
	
	var inputs = { };
	
	flow.exec(
		function() {
			rimraf(options.output, errcheck(this));
		}, function() {
			fs.mkdir(options.output, undefined, errcheck(this));
		}, function() {
			copyDataFiles(this.MULTI());
			processInputFiles(this.MULTI());
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
		});
		if(ok) { this.call(this, argsArray); }
	}
	
	function escapeRegex(text) {
		return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	}
	
	// Main logic
	function processInputFiles(cb) {
		flow.exec(
			function() {
				parseInputFiles(this);
			}, function() {
				writeInputFiles(this);
			}, cb
		);
	}
	
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
		var basename = input.match(inputBasename)[1];
		var outputBasename = basename.replace('/', '.');
		flow.exec(
			function() {
				fs.readFile(input, 'utf8', errcheck(this));
			}, function(data) {
				data = showdown(data[0]);
				var titleMatch = data.match(/<h1(?:.*?)>(.*?)<\/h1>/);
				var title = titleMatch ? titleMatch[1] : basename;
				inputs[outputBasename] = {
					title: title,
					content: data,
					outpath: options.output + '/' + outputBasename + '.html'
				};
				this();
			}, cb
		);
	}
	
	function writeInputFiles(cb) {
		var navigationHTML = inputs['_navigation'] ? inputs['_navigation'].content : '';
		flow.exec(
			function() {
				for(var key in inputs) {
					if(key === '_navigation') { continue; }
					var input = inputs[key];
					var html = jqtpl.tmpl('doc', { content: input.content, title: input.title, navigation: navigationHTML });
					fs.writeFile(input.outpath, html, 'utf8', this.MULTI());
				}
				this.MULTI()();
			}, errcheckMulti, cb
		);
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
};
