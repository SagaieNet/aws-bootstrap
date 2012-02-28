require('./setup');

var bootstrap = require('../bootstrap');
bootstrap = new bootstrap.Bootstrap();
bootstrap.addGistsToGithub('../gists/');