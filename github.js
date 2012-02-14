var rest = require('restler');
Github = function (credentials, constants, helper) {
  this.credentials = credentials;
  this.constants = constants;
  this.helper = helper;
  this.creds = credentials.github_username + ':' + credentials.github_password;
};
Github.prototype.getGists = function (callback) {
  var url = 'https://' + this.creds + '@api.github.com/users/' + this.username + '/gists';
  rest.get(url).on('complete', function (response) {
    response.forEach(function (gist) {
      console.log('ID: ' + gist.id); 
      /* aws-bootstrap */
      console.log('Name: ' + gist.description);
    });
    callback(response);
  });
};
Github.prototype.getGistContent = function (id, callback) {
  var url = 'https://' + this.creds + '@api.github.com/gists/' + id;
  rest.get(url).on('complete', function (response) {
    var scripts = {};
    for (var file in response.files) {
      scripts[file] = response.files[file].content;
    }
    callback(scripts);
  });
};
Github.prototype.addGists = function (description, public, files, callback) {
  var url = 'https://' + this.creds + '@api.github.com/gists';
  var gist = {};
  gist['description'] = description;
  gist['public'] = public;
  gist['files'] = {
    
  };
  rest.post(url, {
    data: gist
  }).on('complete', function (response) {
    callback(response);
  });
};
exports.Github = Github;