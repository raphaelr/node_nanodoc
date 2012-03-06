var expect = require('expect.js'),
    fs = require('fs'),
    helper = require('./helper')

describe('input transform', function() {
	var navigation = '<ul><li><a href="a.html">a-a-a</a></li><li><a href="no_title.html">no_title</a></li><li>sub<ul><li><a href="sub.b.html">b-b-b</a></li></ul></li></ul>';
	
	before(function(done) {
		helper.nanodocHere(done);
	});
	
	it('should place files from the root directory', function(done) {
		helper.isFile(helper.outfile('a.html'), function(err, success) {
			if(err) return done(err);
			expect(success).to.be.ok();
			done();
		});
	});
	
	it('should transform the files from the root directory ', function(done) {
		fs.readFile(helper.outfile('a.html'), 'utf8', function(err, data) {
			if(err) return done(err);
			expect(data.match(/^a-a-a;/)).to.be.ok();
			expect(data.match(/a-a-a<\/h1>/)).to.be.ok();
			expect(data.match(/text/)).to.be.ok();
			expect(data.split(';')[2]).to.equal(navigation);
			done();
		});
	});
	
	it('should place files from subdirectories', function(done) {
		helper.isFile(helper.outfile('sub.b.html'), function(err, success) {
			if(err) return done(err);
			expect(success).to.be.ok();
			done();
		});
	});
	
	it('should transform the files from subdirectories ', function(done) {
		fs.readFile(helper.outfile('sub.b.html'), 'utf8', function(err, data) {
			if(err) return done(err);
			expect(data.match(/^b-b-b;/)).to.be.ok();
			expect(data.match(/b-b-b<\/h1>/)).to.be.ok();
			expect(data.match(/TEXT/)).to.be.ok();
			expect(data.split(';')[2]).to.equal(navigation);
			done();
		});
	});
	
	it('should use a default value for the title if none is given', function(done) {
		fs.readFile(helper.outfile('no_title.html'), 'utf8', function(err, data) {
			if(err) return done(err);
			expect(data.match(/^no_title;/)).to.be.ok();
			done();
		});
	});
});
