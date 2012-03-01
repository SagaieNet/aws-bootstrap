var walker = require('walker'),
  github = require('./github'),
    credentials = require('./credentials'),
      constants = require('./constants'),
        helper = require('./helper');
github = new github.Github(credentials);
helper = new helper.Helper(helper);
Bootstrap = function () {

};
Bootstrap.prototype.addGistsToGithub = function (path) {
  var files = {};
  if (!path)
    path = 'gists/';
  walker(path).filterDir(function (dir, stat) {
    return true;
  }).on('file', function (file, stat) {
    var name;
    name = file.substr(9, file.length);
    console.log('Got gist: ' + name);
    files[name] = helper.readFileContents(file);
  }).on('error', function (er, entry, stat) {
    console.log('Error ' + er + ' on entry ' + entry);
  }).on('end', function () {
    console.log('All Gists traversed.');
    github.addGists('bootstrap', 'false', files, function(response) {
   
    });
  })
};
Bootstrap.prototype.launchAdminApiInstance = function () {

};
Bootstrap.prototype.createAMIInstances = function () {

};
Bootstrap.prototype.launchRedisInstances = function () {

};
Bootstrap.prototype.launchRealtimeInstances = function () {

};
Bootstrap.prototype.launchApiInstances = function () {

};
Bootstrap.prototype.launchWebserverInstances = function () {

};
Bootstrap.prototype.killDashNine = function () {

};
exports.Bootstrap = Bootstrap;