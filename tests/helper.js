require('./setup');

var helper = require('../helper');
helper = new helper.Helper();
console.log('Contents: ' + helper.readFileContents('../gists/setup_webserver.sh'));