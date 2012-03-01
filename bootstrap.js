var credentials = require('./credentials'),
  constants = require('./constants'),
    helper = require('./helper');
helper = new helper.Helper(helper);
Bootstrap = function () {

};
Bootstrap.prototype.addGistsToGithub = function (path) {
  var github = require('./github');
  github = new github.Github(credentials);
  if (!path)
    path = 'gists/';
  helper.getGistsToAdd(path, function(files) {
    github.addGists('bootstrap', 'false', files, function(response) {
      // this.launchAdminApiInstance();
    });
  });
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