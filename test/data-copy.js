var expect = require('expect.js'),
    fs = require('fs'),
    helper = require('./helper')

describe('data copying', function() {
	before(function(done) {
		helper.nanodocHere(done);
	});
	
	it('should copy files from the root directory', function(done) {
		helper.isFile(helper.outfile('data-a.txt'), function(err, success) {
			if(err) return done(err);
			expect(success).to.be.ok();
			done();
		});
	});
	
	it('should copy files from subdirectories', function(done) {
		helper.isFile(helper.outfile('subdir/data-b.txt'), function(err, success) {
			if(err) return done(err);
			expect(success).to.be.ok();
			done();
		});
	});
});
