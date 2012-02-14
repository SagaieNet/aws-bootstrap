var walker = require('walker'),
  credentials = require('./credentials'),
    constants = require('./constants'), 
      helper = require('./helper');
Bootstrap = function () {

};
Bootstrap.prototype.addGistsToGithub = function (path) {
  if (!path)
    path = 'gists/';
  walker(path).filterDir(function (dir, stat) {
    return true;
  }).on('file', function (file, stat) {
    console.log('Got gist: ' + file);
  }).on('error', function (er, entry, stat) {
    console.log('Error ' + er + ' on entry ' + entry);
  }).on('end', function () {
    console.log('All files traversed.');
  })
};
Bootstrap.prototype.createAMIInstances = function () {
};
exports.Bootstrap = Bootstrap;