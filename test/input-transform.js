var expect = require('expect.js'),
    fs = require('fs'),
    helper = require('./helper')

describe('input transform', function() {
	before(function(done) {
		helper.nanodocHere(done);
	});
	
	function testPlace(filename) {
		return function(done) {
			helper.isFile(helper.outfile(filename), function(err, success) {
				if(err) return done(err);
				expect(success).to.be.ok();
				done();
			});
		};
	}
	
	function testTransform(filename, content) {
		return function(done) {
			fs.readFile(helper.outfile(filename), 'utf8', function(err, data) {
				if(err) return done(err);
				expect(data.match(new RegExp('^' + content + ';'))).to.be.ok();
				expect(data.match(new RegExp(content + '<\/h1>'))).to.be.ok();
				expect(data.match(/TEXT/)).to.be.ok();
				expect(data.match(/NAVIGATION/)).to.be.ok();
				done();
			});
		};
	}
	
	it('should place files from the root directory', testPlace('a.html'));
	it('should place files from subdirectories', testPlace('sub.b.html'));
	it('should place files from nested subdirectories', testPlace('sub.again.c.html'));
	
	it('should transform the files from the root directory', testTransform('a.html', 'a-a-a'));
	it('should transform the files from subdirectories ', testTransform('sub.b.html', 'b-b-b'));
	it('should transform the files from nested subdirectories ', testTransform('sub.again.c.html', 'c-c-c'));
	
	it('should use a default value for the title if none is given', function(done) {
		fs.readFile(helper.outfile('no_title.html'), 'utf8', function(err, data) {
			if(err) return done(err);
			expect(data.match(/^no_title;/)).to.be.ok();
			done();
		});
	});
});
