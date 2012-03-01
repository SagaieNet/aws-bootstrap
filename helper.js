Helper = function () {

};
Helper.prototype.removeEmptyLinesFromGists = function(file) {
  var str;
  str = file.value;
  while(str.indexOf('\r\n\r\n') >= 0) {
    str = str.replace(/\r\n\r\n/g, "\r\n")      
  }
  file.value = str;
};
Helper.prototype.getGistsToAdd = function(path, callback) {
  var walker = require('walker'), files = {};
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
    callback(files);
  });
};
Helper.prototype.readFileContents = function(file) {
  var fs = require('fs');
  /* Blocking */
  try {
    return fs.readFileSync(file, 'ascii');
  } catch (error) {
    console.error('There was an error reading the file contents: ' + error);
  }
};
Helper.prototype.prependVariablesToGistUserData = function (variables, userData) {
  var prependString = '#!/bin/bash';
  for (var key in variables) {
    prependString = '\n' + key + '=' + variables[key];
  }
  return prependString + '\n' + userData;
};
Helper.prototype.exit = function () {
 
};
exports.Helper = Helper;