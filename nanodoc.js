var _ = require('underscore'),
    fs = require('fs'),
    glob = require('glob'),
    showdown = (new (require('showdown').Showdown.converter)).makeHtml,
    jqtpl = require('jqtpl'),
    path = require('path'),
    rimraf = require('rimraf'),
    util = require('util');

module.exports = function(options) {
	options = options || { };
	
	var docdir = 'doc';
	options.input = options.input || docdir + '/input';
	options.data = options.data || docdir + '/data';
	options.output = options.output || docdir + '/output';
	
	rimraf(options.output, function(err) {
		if(err) throw err;
		fs.mkdir(options.output, undefined, function(err) {
			if(err) throw err;
			parseInputFiles();
			copyDataFiles();
		});
	});
	
	function parseInputFiles() {
		var template_html = fs.readFileSync(path.join(options.data, 'template.html'), 'utf8');
		jqtpl.template('doc', template_html);
		
		glob(options.input + '/**/*.{md,markdown}', {}, function(err, matches) {
			if(err) throw err;
			_.each(matches, function(match) {
				var basename = match.match(/^doc\/input\/(.*)\.(md|markdown)$/)[1].replace(/\//g, '.');
				var outfile = options.output + '/' + basename + '.html';
				transform(match, outfile, function(inpath, outpath) {
					fs.readFile(match, 'utf8', function(err, data) {
						if(err) throw err;
						data = showdown(data);
						var title = data.match(/<h1(?:.*?)>(.*?)<\/h1>/)[1];
						data = jqtpl.tmpl('doc', { content: data, title: title });
						fs.writeFile(outpath, data, 'utf8');
					});
				});
			});
		});
	}
	
	function copyDataFiles() {
		glob(options.data + '/**/*', {}, function(err, matches) {
			if(err) throw err;
			_.each(matches, function(match) {
				if(match === options.data + '/template.html') return;
				var outfile = match.replace(/^doc\/data\/(.*)$/, options.output + '/$1');
				transform(match, outfile, function(inpath, outpath) {
					util.pump(fs.createReadStream(inpath), fs.createWriteStream(outpath));
				});
			});
		});
	}
	
	function transform(inpath, outpath, copyfn) {
		fs.stat(inpath, function(err, stat) {
			if(err) throw err;
			if(stat.isDirectory()) {
				fs.mkdir(outpath);
			} else {
				copyfn(inpath, outpath);
			}
		});
	}
};
