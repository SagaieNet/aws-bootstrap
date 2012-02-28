var rest = require('restler');
Github = function (credentials) {
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
  var gist = {};
  gist['description'] = description;
  gist['public'] = public;
  gist['files'] = {};
  for (var name in files) {
    console.log('Script: ' + name + ', Content: ' + escape(files[name]));
    gist['files'][name] = {};
    gist['files'][name]['content'] = files[name];
  }
  rest.post('https://' + this.creds + '@api.github.com/gists', {
    data: JSON.stringify(gist)
  }).on('complete', function (response) {
    console.log('Gist ID: ' + response.id);
    callback(response.id);
  });
};
exports.Github = Github;