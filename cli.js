#!/usr/bin/env node
var nanodoc = require('./nanodoc');
nanodoc(function(err) {
	if(err) throw err;
});
